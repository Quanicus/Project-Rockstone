import axios from "axios";
import Template from "./template.js";
import puppeteer from "puppeteer";
import database from "./database.js";
import dotenv from "dotenv";
dotenv.config();


class Retailer {

    //abstract
    static parse_sales_response(response) {
        throw new Error("process_raw_products(response) must be overridden in subclass of Retailer.");
    }
    //abstract
    static parse_product_response(response) {
        throw new Error("parse_product_response(response) must be overridden in subclass of Retailer.");
    }
    //abstract
    static parse_max_page_response(response) {
        throw new Error("parse_max_page_response(response) must be overridden in subclass of Retailer.");
    }
    //abstract
    static get_product_req_config(product) {
        throw new Error("get_product_req_config(product) must be overridden in subclass of Retailer.")
    }
    //abstract
    static get_menu_options() {
        throw new Error("get_menu_options() must be overridden in subclass of Retailer.");
    }
    //abstract
    static async scrape_product_page(product) {
        throw new Error("scrape_product_page(product) must be overridden in subclass of Retailer.");
    }
    static get_menu() {
        let html = "";
        const options = this.get_menu_options();
        for (const collection of Object.keys(options)) {
            html += Template.menu_button(collection);
        }
        return html;
    }

    static async extract_products(raw_product_list, add_product) {
        console.log('extracting');
        
        const browser = await puppeteer.launch({
            headless: 'new',
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox", 
            ],
            executablePath: 
                process.env.NODE_ENV ==='production'
                    ? process.env.NODE_ENV
                    : puppeteer.executablePath() 
        });

        const page = await browser.newPage();
        // Listen for outgoing network requests
        /* page.on('request', (request) => {
            console.log(`Request URL: ${request.url()}`);
            console.log(`Request Method: ${request.method()}`);
            console.log(`Request Headers: ${JSON.stringify(request.headers())}`);
        });
        
        // Listen for incoming network responses
        page.on('response', (response) => {
            console.log(`Response URL: ${response.url()}`);
            console.log(`Response Status: ${response.status()}`);
            console.log(`Response Headers: ${JSON.stringify(response.headers())}`);
        }); */

        console.log('booting up');
        let extracted_products = [];

        for (const product of raw_product_list) {
            
            //console.log("extracting " + index + "/" + raw_product_list.length);

            const product_data = await this.scrape_product_page(product, page);

            if (!product_data) {
                console.log('access denied');
                continue;
            };
            const extracted_product = Object.assign({}, product, product_data);
            console.log(extracted_product);
            //skip if no upc found
            if (!extracted_product.upcs || extracted_product.upcs.length === 0) { 
                //ADD TO BLACKLIST
                console.log('no UPCs found')
                //database.add_to_blacklist(product);
                continue; 
            }
            
            //FILTER THROUGH BLACKLIST
            const results = await database.filter_through_blacklist([extracted_product]);
            if (results.length === 0) {
                continue;
            }

            //GET AMAZON ASINS AND PRICE
            const asins = await this.extract_amzn_asins(page, extracted_product.upcs);
            if (asins.length === 0) {
                console.log('no matching asins');
                continue;
            }
            extracted_product.asins = asins;
            extracted_products.push(extracted_product);
            
            //SEND RESULTS TO SERVER
            //this.upload_finished_product(finished_product);
            add_product(extracted_product); 
        }
        page.close();
        browser.close();
        return extracted_products;
    }

    static async extract_amzn_asins(page, upcs) {
        const amzn_urls = [];
        for (const upc of upcs) {
            amzn_urls.push("https://www.amazon.com/s?k=" + upc)
        }
        const amzn_url = amzn_urls[0];
        await page.goto(amzn_url);
        const data = await page.evaluate(() => {

            const not_found = document.querySelector('div[tabindex="0"] .a-row:first-of-type span:first-of-type');
            if (not_found && not_found.textContent === 'No results for ') { return 'no matching items'};
            
            const elements = document.querySelectorAll('.s-result-list div[data-asin]:not(.AdHolder)');

            let data = [];
            elements.forEach((element) => {
                const asin = element.getAttribute('data-asin');
                const price_element = element.querySelector('.a-price .a-offscreen');
                if (asin) {
                    data.push({
                    asin: asin,
                    price: price_element ? price_element.textContent : 'click for price'
                });
                }
            });
            return data;
        });
        return data;
    }

    static async scrape_products_from_sales_pages(get_req_config) {

        let req_config = get_req_config(2);
        const max_page = await this.get_max_page(req_config);
        if (!max_page) {
            console.log('failed to obtain max_page');
            return undefined;
        }
        let product_promises = [];

        //flip through pages and scraping product data
        for (let page_num = 1; page_num <= max_page; page_num++) {

            req_config = get_req_config(page_num);
            const promises = this.scrape_sales_page(req_config);
            product_promises.push(promises);
            console.log(page_num + "/" + max_page);

            if (page_num % 5 === 0) {
                await Promise.all(product_promises);
            }
        }
        const products = await Promise.all(product_promises);
        return products.flat();
    }
    
    static async scrape_sales_page(req_config) {
        const response = await this.make_axios_request(req_config);
        return response ? this.parse_sales_response(response) : undefined;
    }

    static async scrape_product_page_w_axios(req_config) {
        const response = await this.make_axios_request(req_config);
        return response ? this.parse_product_response(response) : undefined;
    }

    /* static async scrape_product_page_w_puppeteer(product, page) {
        const url = product.source.url;
        await page.goto(url);

    } */
    static async get_max_page(req_config) {
        const response = await this.make_axios_request(req_config);
        const max_page = response ? this.parse_max_page_response(response) : undefined;
        return max_page;
    }

    static async make_axios_request(request_config) {
        try {
            const response = await axios.request(request_config);
            return response;
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a non-2xx status code
                console.error('HTTP Error:', error.response.status);
            } else if (error.request) {
                // The request was made, but no response was received
                console.error('Network Error:', error.message);
            } else {
                // Something happened in setting up the request that triggered an error
                console.error('Request Error:', error.message);
            }
            return undefined;
        }
    }

    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static waitForUserInput() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
          });
        return new Promise((resolve) => {

            rl.question('We have been caught beep. Press enter to continue boop:', (input) => {
            rl.close();
            resolve(input);
          });
        });
    }
}

export default Retailer;
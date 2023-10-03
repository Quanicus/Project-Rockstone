import axios from "axios";
import Template from "./template.js";
import puppeteer from "puppeteer";

class Retailer {

    //abstract
    static parse_sales_response(response) {
        throw new Error("process_raw_products() must be overridden in subclass of Retailer.");
    }
    //abstract
    static parse_product_response(response) {
        throw new Error("parse_product_response() must be overridden in subclass of Retailer.");
    }
    //abstract
    static parse_max_page_response(response) {
        throw new Error("parse_max_page_response() must be overridden in subclass of Retailer.");
    }
    static get_product_req_config(product) {
        throw new Error("get_product_req_config() must be overridden in subclass of Retailer.")
    }
    //abstract
    static get_menu_options() {
        throw new Error("get_menu_options() must be overridden in subclass of Retailer.");
    }

    static get_menu() {
        let html = "";
        const options = this.get_menu_options();
        for (const collection of Object.keys(options)) {
            html += Template.menu_button(collection);
        }
        return html;
    }

    static async extract_products(raw_product_list) {
        console.log('extracting');
        const browser = await puppeteer.launch({headless:'new'});
        const page = await browser.newPage();
        console.log('booting up');
        let finished_products = [];
        for (const [index, product] of raw_product_list.entries()) {
            const product_req_config = this.get_product_req_config(product);
            const product_data = await this.scrape_product_page(product_req_config);
            const finished_product = Object.assign({}, product, product_data);
            //console.log(finished_product);
            //skip if no upc found
            if (!finished_product.upc) { continue; }
            console.log('checkin amzn');
            //COMPARE TO AMAZON
            const amzn_url = "https://www.amazon.com/s?k=" + finished_product.upc;
            console.log(amzn_url);
            await page.goto(amzn_url);
            const asins = await this.extract_amzn_asins(page);
            //skip if no matching amzon products
            if (!asins) { continue; }

            finished_product.asins = asins;
            finished_products.push(finished_product);
            
            //SEND RESULTS TO SERVER
            const response = await this.upload_finished_product(finished_product);
            console.log("extracting " + index + "/" + raw_product_list.length);
            
        }
        page.close();
        browser.close();
        return finished_products;
    }

    static async upload_finished_product(product) {
        const serverUrl = `http://localhost:${process.env.PORT || 3000}/add-product`;
        const config = {
            method: 'post',
            url: serverUrl,
            data: product
        }
        this.make_axios_request(config);
    }

    static async extract_amzn_asins(page) {
        //const content = await page.content();
        //console.log(content);
        //return content;
        const data = await page.evaluate(() => {
            const not_found = document.querySelector('div[tabindex="0"] .a-row:first-of-type span:first-of-type');
            if (not_found && not_found.textContent === 'No results for ') { return 'no matching items'};
            const elements = document.querySelectorAll('.s-search-results > div[data-asin]:not([data-asin=""])');
            if (!elements) { return undefined; }

            let data = [];
            elements.forEach((element) => {
                const asin = element.getAttribute('data-asin');
                const price_element = element.querySelector('.a-price .a-offscreen');
                const price = price_element ? price_element.textContent : '';
                if (price_element) {
                    data.push({
                    asin: asin,
                    price: price_element.textContent
                });
                }
                
                /*const attributes = element.attributes;
                let attribute_names = [];
                for (let i = 0; i < attributes.length; i++) {
                    attribute_names.push(attributes[i].name)
                }
                data.push(attribute_names);*/
            });
            return data;
        });
        return data;
    }

    static async scrape_products_from_sales_pages(get_req_config) {
        let req_config = get_req_config();
        const max_page = await this.get_max_page(req_config);
        let product_promises = [];
        //flip through pages and scraping product data
        for (let page_num = 1; page_num <= max_page; page_num++) {
            req_config = get_req_config(page_num);
            const promises = this.scrape_sales_page(req_config);
            product_promises.push(promises);
            console.log(page_num + "/" + max_page);
            if (max_page > 20 && page_num % 5 === 0) {
                await Promise.all(product_promises);
            }
        }
        const products = await Promise.all(product_promises);
        return products.flat();
    }
    
    static async scrape_sales_page(req_config) {
        const response = await this.make_axios_request(req_config);
        return this.parse_sales_response(response);
        
    }

    static async scrape_product_page(req_config) {
        const response = await this.make_axios_request(req_config);
        if (!response) {
            return undefined;
        }
        const product_data = this.parse_product_response(response);
        return product_data;
    }

    static async get_max_page(req_config) {
        const response = await this.make_axios_request(req_config);
        const max_page = this.parse_max_page_response(response);
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
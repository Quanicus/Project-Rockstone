import axios from "axios";
import Template from "./template.js";

class Retailer {

    //abstract
    static parse_sales_response(response) {
        throw new Error("process_raw_products must be overridden in subclasses");
    }
    //abstract
    static parse_product_response(response) {
        throw new Error("parse_product_response must be overridden in subclasses");
    }
    //abstract
    static parse_max_page_response(response) {
        throw new Error("parse_max_page_response must be overridden in subclasses");
    }
    //abstract
    static get_menu_options() {
        throw new Error("get_menu_options must be overridden in subclasses");
    }

    static get_menu() {
        let html = "";
        const options = this.get_menu_options();
        for (const collection of Object.keys(options)) {
            html += Template.menu_button(collection);
        }
        return html;
    }

    //IN PROGRESS. this visits the product page and scrapes additional info (upc)
    static async extract_products(product_list, get_product_req_config) {
        let captcha = false;
        const promises = product_list.map(async (product) => {
          try {
            const req_config = get_product_req_config(product);
            const product_data = this.scrape_product_page(req_config);
            
            product.upc = product_data?.data?.data?.product?.upc;
            return { product, success: true };

          } catch (error) {
            if (error.response) {
              console.log(error.response.status);
              captcha = true;
            }
            return { product, success: false };
          }
        });
      
        const results = await Promise.all(promises);
      
        const pass = results.filter((result) => result.success).map((result) => result.product);
        const fail = results.filter((result) => !result.success).map((result) => result.product);
      
        console.log(`pass:${pass.length}, fail: ${fail.length}`);
      
        if (captcha) {
          // Pause and wait to clear captcha
            await this.waitForUserInput(); // Wait for user input
            return pass.concat(await this.extract_products(fail));
        }
        return pass;
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
            if (page_num % 5 === 0) {
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

    static get_urls_to_fetch() {

    }

    static async scrape_product_page(req_config) {
        const response = await this.make_axios_request(req_config);
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
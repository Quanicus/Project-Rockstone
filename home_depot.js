import puppeteer from "puppeteer";
import axios from "axios";
import Product from "./product_model.js";
import jsdom from 'jsdom';
import Retailer from "./retailer.js";


class Home_Depot extends Retailer{
    domain = "www.homedepot.com"
    static sales_urls = [
        "https://www.homedepot.com/SpecialBuy/SpecialBuyOfTheDay",
        "https://www.homedepot.com/SpecialBuy/ProSpecialBuyOfTheWeek"
    ]
    static a_selector = 'a.product-pod__see-more-options-link'
    static upc_regex = /"upc":"(\d+)"/
    static selectors = {
        name_selector: 'h1',
        model_selector: 'h2.sui-font-regular',
        price_selector: '.price .price-format__main-price span',
    }
    static get_upc(html) {
        const upc = html.match(this.upc_regex)[1];
        return upc; 
    }
    
    static get_name(document, selector) {
        return super.get_textContents(document, selector);
    }
    static get_model(document, selector) {
        const model_array = super.get_textContents(document, selector);
        for (let i = 0; i < model_array.length; i++) {
            if (model_array[i] === 'Model #'){
                return model_array[++i];
            }
        }
        return 'Not found'
    }
    static get_price(document, selector) {
        return super.get_textContents(document, selector);
    }
    static async get_products() {
        try
        {
            const sales_url = this.sales_urls[0];
            const urls = await super.get_product_urls(sales_url, this.a_selector);
            const products_promises = urls.map(async (url) => {
                const product = {};
                const {data: html} = await axios.get(url);
                const options = {
                    virtualConsole: new jsdom.VirtualConsole().on('error', () => {
                    // Ignore CSS errors
                    }),
                };
                
                const dom = new jsdom.JSDOM(html, options);
                const document = dom.window.document;
    
                //BUILD PRODUCT OBJECT Perform DOM manipulation
                product.url = url;
                product.upc = this.get_upc(html);
                product.name = this.get_name(document, this.selectors.name_selector);
                product.model = this.get_model(document, this.selectors.model_selector);
                product.price = this.get_price(document, this.selectors.price_selector);
                
                return product;
            })
            const products = await Promise.all(products_promises);
            
            return products;
        } catch (error){
            console.error(error);
        }
    }
}


export default Home_Depot;
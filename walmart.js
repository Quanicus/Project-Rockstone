import Retailer from "./retailer.js";
import axios from "axios";
import jsdom from 'jsdom';
import puppeteer from "puppeteer";
import readline from 'readline';
import mongoose from "mongoose";

class Walmart extends Retailer{
    static sales_urls = 'https://www.walmart.com/shop/deals/flash-picks';
    domain = "www.walmart.com";
    static a_selector = 'a.absolute.w-100';
    static upc_regex = /"upc":"(\d+)"/
    static selectors = {
        name_selector: '[itemprop="name"]:last-of-type',
        model_selector: '.pb2',
        price_selector: 'span[itemprop="price"]',
    }
    static get_upc(html) {
        const upc = html.match(this.upc_regex);
        return (upc && upc.length > 1) ? upc[1] : 'Not found'; 
    }
    static get_name(document) {
        const name_candidates = super.get_textContents(document, this.selectors.name_selector);
        return (name_candidates.length > 0) ? name_candidates.pop() : null;
        
    }
    static get_model(document, selector) {
        const model_array = super.get_textContents(document, selector);
        return model_array;
    }
    static get_price(document, selector) {
        let price = {}
        let price_element = super.get_textContents(document, selector);
        //const price = price_element.join(" ");
        if (price_element) {
            let price_str = price_element.join('');
            price_str = price_str.match(/\d+.\d+/g);
            if (price_str) {
                price.amount = price_str[0];
                price.date = new Date(now.getFullYear(), now.getMonth(), now.getDate());;
            }
        }
        return price;
    }
    static human_check(){
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
          });
        
        return new Promise(resolve => {
            rl.question("Oh shit dog he's on to us, act like a human.\n Press Enter if you understand.", 
            answer => {
                rl.close();
                (answer === 'beep boop') ? resolve(false) : resolve(true);
            });
        }); 
    }
    static async get_products() {
        try {
            const browser = await puppeteer.launch({headless: 'new', args: ['--incognito']});
            const page = await browser.newPage();
            const selector = this.a_selector;
            await page.setViewport({ width: 1280, height: 4560 });
            let url = this.sales_urls;
            let products = [];
            let page_num = 1;
            let next = '';
            do {
                page_num++;
                next = '';
                let captcha = '';
                do {
                    await page.goto(url);
                    captcha = await page.$('#px-captcha');
                    if (captcha){                
                        const cookies = await page.cookies();
                        for (const cookie of cookies) {
                            await page.deleteCookie(cookie);
                        }
                        if (!await this.human_check()){
                            break;
                        }
                    }
                } while (captcha)

                //NAVEGATE SALE PAGES AND EXTRACT PRODUCT URLS
                const data = await page.evaluate(async (selector) => {
                    // Scroll to the bottom of the page
                    await new Promise((resolve) => {
                        const scrollHeight = document.documentElement.scrollHeight;
                        const viewportHeight = window.innerHeight;
                        let currentPosition = 0;
        
                        const scroll = () => {
                        window.scrollBy(0, viewportHeight);
                        currentPosition += viewportHeight;
                        (currentPosition >= scrollHeight) ? resolve() : setTimeout(scroll, 100); // Adjust the scrolling speed here if needed 
                        };
                        scroll();
                    },);
                    //SELECT ALL PRODUCT A-TAGS ON THE PAGE
                    const links = Array.from(document.querySelectorAll(selector));
                    let next_page = '';
                    const next_element = document.querySelector('a[aria-label="Next Page"]');
                    if (next_element) {
                        next_page = 'https://www.walmart.com' + next_element.getAttribute('href');
                    }
                    const data = {
                        headers: {
                        'User-Agent': window.navigator.userAgent,
                        Referrer: document.referrer ? document.referrer : 'https://www.walmart.com',
                        Accept: '*/*',
                        },
                        product_urls: links.map(link => link.href),
                        next: next_page,
                    };
                    return data;
    
                }, selector);
                url = data.next;
                
                const urls = data.product_urls;
                const headers = data.headers;
                
                //const cookies = await page.cookies()
                //headers.Cookie = cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join('; ');
                
                //VISIT EACH PRODUCT URL AND EXTRACT PRODUCT DATA
                const product_promises = urls.map(async (url) => {
                    const options = {
                        virtualConsole: new jsdom.VirtualConsole().on('error', () => {
                        // Ignore CSS errors
                        }),
                    };
                    const {data: html} = await axios.get(url, {headers});
                    const dom = new jsdom.JSDOM(html, options);
                    const document = dom.window.document;
                    const product = {};

                    product.name = this.get_name(document);
                    product.url = url;
                    product.upc = this.get_upc(html);
                    product.model = this.get_model(document, this.selectors.model_selector);
                    product.current_price = this.get_price(document, this.selectors.price_selector);
                    

                    return product;
                }); 
                products.push(...await Promise.all(product_promises));
                //url = `https://www.walmart.com/shop/deals/flash-picks?page=${page_num}&affinityOverride=default`;
                if (products[products.length-1].name != null){
                    url = data.next;
                }
                //products.push(...urls);
                console.log(url);
            } while (url);

            browser.close();
            return products;

        } catch (error) {
            console.error(error);
        }
    };  
}

export default Walmart;



/**puppeteer page open
 * get cookies
 * do {
 * axios get all links on page -> get html of each link -> extract product data
 * 
 * if (there is a next page button)
 * 
 * } */
import puppeteer from "puppeteer";
import jsdom from "jsdom";
class Retailer {
    static get_textContents(document, selector) {
        const elements = Array.from(document.querySelectorAll(selector));
        const textContents = elements.map(element => {
            if (element){
                return element.textContent;
            }
        })
        return textContents;
    }

    static async get_product_urls(retail_listings_pages, selector, extra_headers = '') {
        try {
            const browser = await puppeteer.launch({headless: 'new', 
                                                    timeout: 999999999,
                                                    args: ['--incognito']});
            const page = await browser.newPage();
            if (extra_headers){
                await page.setExtraHTTPHeaders(extra_headers);
            }
            await page.setViewport({ width: 1280, height: 4560 });
            await page.goto(retail_listings_pages);
    
            // Scroll to the bottom of the page
            const hrefs = await page.evaluate(async (selector) => {
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
                });
                const links = Array.from(document.querySelectorAll(selector));
                const product_urls = links.map(link => link.href);
                return product_urls;
    
            }, selector);
            browser.close();
            return hrefs;
        } catch (error) {
            console.error(error);
        }
    };
}

export default Retailer;
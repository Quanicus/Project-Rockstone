import mongoose from "mongoose";
import Product from "./product_model.js";
import puppeteer from "puppeteer";
import Walmart from "./walmart.js";

mongoose.connect("mongodb+srv://quanicus:Muahahamongo1!@cluster0.tlzyhfc.mongodb.net/Project-RockStone?retryWrites=true&w=majority")
.then(() => {
    console.log('connected to mongo');
}).catch(error => {
    console.log(error);
});

const browser = await puppeteer.launch({headless: 'new', args: ['--incognito']});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 4560 });
try {

    const empty_products = await Product.find({name: null});
    for (const product of empty_products) {

        const url = [product.url];
        const headers = {
            "User-Agent": 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
            Authority: 'www.walmart.com',
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            "Accept-Encoding": 'gzip, deflate, br',
            "Accept-Language": 'en-US,en;q=0.9',


        };
        const [product_promise] = await Walmart.extract_products(url, headers);
        const new_product = await product_promise;
        console.log(new_product);
        product.name = new_product.name;
        product.upc = new_product.upc;
        product.current_price = new_product.current_price;
        if (new_product.name != null){
            product.save();
        }
        
    }


} catch(error) {
    console.log(error);
}
browser.close();

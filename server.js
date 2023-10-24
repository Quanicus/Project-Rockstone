import express from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion } from 'mongodb';
import retailMap from "./src/retailMap.js";
import bodyParser from "body-parser";
import ejs from "ejs";
import database from './src/database.js';
import inject_css from "./scripts/css-injector.js";


const app = express();
app.set('view engine', 'ejs');
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

async function run() {
    console.log('wtfbetch')
    inject_css();
    await database.connect_to_database()
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    }); 
}

let sent_products_index = 0;
let total_products = 0;
const generated_products = [];
//ROUTES
app.get('/api', async (req, res) => {
    const retailers = Object.keys(retailMap);
    retailers.sort();
    const buttons = await ejs.renderFile('views/hit-list.ejs', {retailers});
    res.send(buttons);
});
app.get('/api/get-menu/:retailer', async (req, res) => {
    const key = req.params.retailer;
    const retailer = retailMap[key];
    const options = retailer.get_menu_options();
    const buttons = await ejs.renderFile('views/retail-category.ejs', {options, retailer:key});
    res.send(buttons);
});
//CURRENTLY A SANDBOX
app.get('/api/activate/:retailer/:fn', async (req, res) => { 
    //TODO SERVE INITIAL PRODUCT DISPLAY WITH LOADING BAR WHICH WILL REPLACE OUTERHTML OF APP-DISPLAY
    const load_bar = await ejs.renderFile('views/result-display.ejs', {});
    res.send(load_bar);
    const key = req.params.retailer;
    const fn = req.params.fn;
    const retailer = retailMap[key];
    let raw_products = await retailer[fn]();
    //REMOVE BLACKLISTED FROM RAW PRODUCTS LIST
    //raw_products = await database.filter_through_blacklist(raw_products);
    total_products = raw_products.length;
    retailer.extract_products(raw_products, add_product);
});

const add_product = async (product) => {
    console.log('from add-product');
    if(product.asins && product.asins === 'no matching items') {
        //add to blacklist
        await database.add_to_blacklist(product);
        console.log('no matches');
        //console.log(product);
    } else {
        console.log(product);
        generated_products.push(product);
    }
}
app.post('/api/add-product', async (req, res) => {
    //filter out products
    const product = req.body;
    
    
    
    res.status(200).json({ message: 'Data received successfully' });
});

app.get('/api/generated-products', async (req, res) => {
    const products_to_send = generated_products.slice(sent_products_index);
    sent_products_index += products_to_send.length;
    let response = {products: products_to_send}
    response.message = "extracting all the jazz";
    const progress = (sent_products_index / total_products) * 100;
    response.progress = `${progress}`;
    const load_bar = await ejs.renderFile('views/load-bar.ejs', response);
    //const load_bar = await ejs.renderFile('views/test-bar.ejs', response);
    res.send(load_bar);
});

app.get('/nav-toggle', async (req, res) => {
    const html = `<input id="nav-toggle" type="checkbox" class="mobile-nav-toggle hidden"></input>`;
    res.send(html);
});


run();

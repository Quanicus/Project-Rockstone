import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { MongoClient, ServerApiVersion } from 'mongodb';
import retailMap from "./src/retailMap.js";
import Template from "./src/template.js";
import bodyParser from "body-parser";
import ejs from "ejs";

mongoose.connect("mongodb+srv://quanicus:Muahahamongo1!@cluster0.tlzyhfc.mongodb.net/Project-RockStone?retryWrites=true&w=majority")
.then(() => {
    console.log('we mongoated up in this bitch');
    app.listen(process.env.PORT || 3000, () => {
        console.log('waddup bitches node API app runnin the 3000s foo');
    });
}).catch(error => {
    console.log(error);
});

const app = express();
app.set('view engine', 'ejs');
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let sent_products_index = 0;
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
    const key = req.params.retailer;
    const fn = req.params.fn;
    const retailer = retailMap[key];
    const raw_products = await retailer[fn]();
    //console.log(raw_products.slice(0,10));
    const finished_products = await retailer.extract_products(raw_products.slice(0, 10));
    //const prod = finished_products[0];
    console.log(finished_products);
    //const doc = prod.asins;
    
    const promises = raw_products.map(product => Template.render_product_card(product));
    const product_cards = await Promise.all(promises);
    res.send(product_cards.join(''));
    
    //res.send(finished_products.join(''));
});

app.post('/api/add-product', (req, res) => {
    //TODO filter out products
    const product = req.body;
    
    console.log('from add-product');
    if(product.asins === 'no matching items') {
        console.log('no matches');
    } else {
        console.log(product);
        generated_products.push(product);
    }
    
    res.status(200).json({ message: 'Data received successfully' });
});

app.get('/generated-products', (req, res) => {
    const products_to_send = generated_products.slice(sent_products_index);
    sent_products_index += products_to_send.length;
    res.send(products_to_send);
});

app.get('/nav-toggle', async (req, res) => {
    const html = `<input id="nav-toggle" type="checkbox" class="mobile-nav-toggle"></input>`;
    res.send(html);
});



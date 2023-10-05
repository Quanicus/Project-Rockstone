import express from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion } from 'mongodb';
import retailMap from "./src/retailMap.js";
import Template from "./src/template.js";
import bodyParser from "body-parser";
import ejs from "ejs";

const app = express();
app.set('view engine', 'ejs');
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


const uri = "mongodb+srv://quanicus:Muahahamongo1!@cluster0.tlzyhfc.mongodb.net/?retryWrites=true&w=majority";
const db_name = 'Project-Rockstone';
const port = process.env.PORT || 3000;
let db;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {

    client.connect().then(async (client) => {
        await client.db("admin").command({ ping: 1 });
        db = client.db(db_name);
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }).catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
}
run();




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
    let raw_products = await retailer[fn]();
    //TODO: REMOVE BLACKLISTED FROM RAW PRODUCTS LIST
    raw_products = await remove_blacklisted(raw_products);

    const finished_products = await retailer.extract_products(raw_products.slice(0, 10));

    console.log(finished_products);

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

async function remove_blacklisted(products) {
    const promises = products.map(async (product) => {
        const query = {
            source: {
                $elemMatch: {
                    retailer: product.source.retailer,
                    pid: product.source.pid,
                },
            },
        };
  
        try {
            const blacklist = db.collection('blacklist');
            const blacklisted = await blacklist.findOne(query);
            return !blacklisted;
        
        } catch (error) {
            console.error('Error querying the database:', error);
            return true; // Assume it's not blacklisted in case of an error
        }
    });
  
    const results = await Promise.all(promises);
    return products.filter((_, index) => results[index]);
  }
  

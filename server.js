import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { MongoClient, ServerApiVersion } from 'mongodb';
import retailMap from "./src/retailMap.js";
import Template from "./template.js";
import bodyParser from "body-parser";


const app = express();
app.set('view engine', 'ejs');
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let retailer;
//ROUTES
app.get('/', (req, res) => {
    res.send("this the back end server yo");
});

app.get('/retailer_dropdown', (req, res) => {
    const retailers = Object.keys(retailMap);
    const drop_down = Template.retailer_dropdown(retailers.sort());
    res.send(drop_down);
});

app.post("/retailer_menu", (req, res) => {
    const retailer_name = req.body.retailer;
    retailer = retailMap[retailer_name];
    //res.send('wtf');
    res.send(retailer.get_menu());
});

app.post("/menu_selection", async (req, res) => {
    const selection = req.body.selection;
    const options = retailer.get_menu_options();
    const products = await retailer[options[selection]]();

    const promises = products.map(product => Template.render_product_card(product));
    const product_cards = await Promise.all(promises);
    res.send(product_cards.join(''));
});

app.post('/add-product', (req, res) => {
    try {
        const new_product = new Product.create(req.body);
        console.log(new_product);
    } catch(error){
        console.log(error.message);
    }
});

const uri = "mongodb+srv://quanicus:<password>@cluster0.tlzyhfc.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

mongoose.connect("mongodb+srv://quanicus:Muahahamongo1!@cluster0.tlzyhfc.mongodb.net/Project-RockStone?retryWrites=true&w=majority")
.then(() => {
    console.log('we mongoated up in this bitch');
    app.listen(3000, () => {
        console.log('waddup bitches node API app runnin the 3000s foo');
    });
}).catch(error => {
    console.log(error);
});
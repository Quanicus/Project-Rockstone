import express from "express";
import mongoose from "mongoose";
import { MongoClient, ServerApiVersion } from 'mongodb';
import Product from "./product_model";
const app = express();
app.use(express.json());

//ROUTES
app.get('/', (req, res) => {
    res.send('node gang');
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
import Home_Depot from "./home_depot.js";
import Product from "./product_model.js";
import Walmart from "./walmart.js";
import Retailer from "./retailer.js";
import axios from "axios";
import mongoose from "mongoose";

mongoose.connect("mongodb+srv://quanicus:Muahahamongo1!@cluster0.tlzyhfc.mongodb.net/Project-RockStone?retryWrites=true&w=majority")
.then(() => {
    console.log('connected to mongo');
}).catch(error => {
    console.log(error);
});
const products = await Walmart.get_products();
try {
   Product.create(products); 
} catch (error) {
    console.log(error);
}
console.log(products);
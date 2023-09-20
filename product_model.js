import mongoose from "mongoose";

const product_schema = mongoose.Schema({
    name: String,
    current_price: {
        amount: Number,
        date: Date
    },
    current_amzn_price: {
        amount: Number,
        date: Date
    },
    price_history: [{
        type: [{
            amount: Number,
            date: Date
        }]
    }],
    amzn_price_history: [{
        type: [{
            amount: Number,
            date: Date
        }]
    }],
    upc: {
        type: String,
        unique: true
    },
    url: String,
    amzn_url: String,
    amzn_alts: [String],

}, {strict: 'throw'});

const Product = mongoose.model('Product', product_schema);
export default Product;
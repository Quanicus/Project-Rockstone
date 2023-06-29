import mongoose from "mongoose";

const price_schema  = mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

const product_schema = mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    upc: Number,
    current_price: {
        type: price_schema,
        required: true
    },
    price_history: [{
        type: [price_schema],
        required: true
    }],

});

const Product = mongoose.model('Product', product_schema);
export default Product;
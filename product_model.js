import mongoose from "mongoose";

const price_schema  = mongoose.Schema({
    amount: {
        type: Number,
        required: false
    },
    date: {
        type: Date,
        required: false
    }
});

const product_schema = mongoose.Schema({
    url: {
        type: String,
        required: false,
        unique: true
    },
    name: {
        type: String,
        required: false
    },
    upc: {
        type: String,
        unique: true
    },
    current_price: {
        type: price_schema,
        required: false
    },
    price_history: [{
        type: [price_schema],
        required: false
    }],

});

const Product = mongoose.model('Product', product_schema);
export default Product;
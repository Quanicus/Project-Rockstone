import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = "mongodb+srv://quanicus:Muahahamongo1!@cluster0.tlzyhfc.mongodb.net/?retryWrites=true&w=majority";
const db_name = 'Project-RockStone';
let db;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connect_to_database() {

    client.connect().then(async (client) => {
        await client.db("admin").command({ ping: 1 });
        db = client.db(db_name);
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }).catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
}

async function filter_through_blacklist(products) {

    console.log('removing black listed');
    const promises = products.map(async (product) => {
        let query;
        if (product.upc) {
            query = { upc: product.upc};
        } else {
            query = {
            source: {
                $elemMatch: {
                    retailer: product.source.retailer,
                    pid: product.source.pid,
                },
            },
        };
        }
        
  
        try {
            const blacklist = db.collection('blacklist');
            const blacklisted = await blacklist.findOne(query);
            if (blacklisted && product.upc) {
                const update = {
                    $addToSet: {
                        source: {
                            retailer: product.retailer,
                            pid: product.pid
                        },
                    },
                };
                await blacklist.updateOne(query, update);
            }
            return !blacklisted;
        
        } catch (error) {
            console.error('Error querying the database:', error);
            return true; // Assume it's not blacklisted in case of an error
        }
    });
  
    const results = await Promise.all(promises);
    return products.filter((_, index) => results[index]);
}

async function add_to_blacklist(product) {
    let new_entry = {
        retailer: product.source ? product.source.retailer: 'not found',
        pid: product.source ? product.source.pid : 'not found'
    };
    console.log(product.source.retailer);
    console.log(product.source.pid);
    new_entry.upc = product.upc ? product.upc : 'not found';

    try {
        const blacklist = db.collection('blacklist');
        await blacklist.insertOne(new_entry);
    } catch(error) {
        console.error('Error writing to the database:', error);
    }

}

export default {connect_to_database,
                filter_through_blacklist,
                add_to_blacklist}
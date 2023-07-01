import Product from "./product_model.js";
import mongoose from "mongoose";

mongoose.connect("mongodb+srv://quanicus:Muahahamongo1!@cluster0.tlzyhfc.mongodb.net/Project-RockStone?retryWrites=true&w=majority")
.then(() => {
    console.log('connected to mongo');
}).catch(error => {
    console.log(error);
});

// Find duplicate documents based on specific fields
const duplicates = await Product.aggregate([
  {
    $group: {
      _id: { field1: '$upc'}, // Specify the fields to check for duplicates
      duplicates: { $addToSet: '$_id' },
      count: { $sum: 1 }
    }
  },
  {
    $match: {
      count: { $gt: 1 } // Filter for groups that have more than one duplicate
    }
  }
]);

// Delete duplicate documents
const deletionPromises = duplicates.map(async (duplicate) => {
  const { duplicates: duplicateIds } = duplicate;
  // Keep only one document and delete the rest
  const [toKeep, ...toDelete] = duplicateIds;

  // Delete duplicate documents except the one to keep
  await Product.deleteMany({ _id: { $in: toDelete } });

  return toKeep; // Return the ID of the document kept (optional)
});

const deletedDocuments = await Promise.all(deletionPromises);
console.log('Deleted duplicate documents:', deletedDocuments);

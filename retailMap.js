import fs from 'fs';
import path from 'path';


const currentModuleUrl = new URL(import.meta.url);
const currentDirectory = path.dirname(currentModuleUrl.pathname);
const retailers_directory = path.join(currentDirectory, 'retailers');

const retailMap = {}
const retailer_files = fs.readdirSync(retailers_directory);


const promises = retailer_files.map(async (retailer) => {
  const retailer_file_path = path.join(retailers_directory, retailer);
  const retailer_name = path.basename(retailer, '.js');
  const retail_class = await import(retailer_file_path);
  retailMap[retailer_name] = retail_class[retailer_name];
});
await Promise.all(promises);

export default retailMap;
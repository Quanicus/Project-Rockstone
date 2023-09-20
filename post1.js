import axios from "axios";
import {Kohls} from "./src/retailers/Kohls.js";
import Retailer from "./src/retailer.js";

let products = await Kohls.scrape_sales();
console.log(products);
//const response = await Retailer.make_axios_request(Kohls.get_sales_page_req_config());

//console.log(response);

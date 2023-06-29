import Home_Depot from "./home_depot.js";
import Product from "./product_model.js";
import Walmart from "./walmart.js";
import Retailer from "./retailer.js";
import axios from "axios";


//const products = await Home_Depot.get_products();
//const products = await Walmart.get_products();
//const urls = await Retailer.get_product_urls(Walmart.sales_urls, 'a.absolute.w-100');
//console.log(products);
console.log(await Walmart.get_products());
/*const header = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        Accept: 'text/html',
        Referrer: 'www.walmart.com',
        Cookie: 'AID=wmlspartner%3D0%3Areflectorid%3D0000000000000000000000%3Alastupd%3D1687541564887; ACID=4b2c0acb-8698-4507-9f58-07fa4ef635bc; hasACID=true; userAppVersion=main-1.81.0-f787e7-0622T1507; abqme=true; vtc=a3YaFX8ZfrzKC14pIk5b4s; _pxhd=7bf5818491961c73a9576e432dcdc3ee747f279ab7e0dc1b700055a1801d4231:f6a89994-11eb-11ee-b90e-03c538a2e281; TBV=7; locGuestData=eyJpbnRlbnQiOiJTSElQUElORyIsImlzRXhwbGljaXQiOmZhbHNlLCJzdG9yZUludGVudCI6IlBJQ0tVUCIsIm1lcmdlRmxhZyI6ZmFsc2UsImlzRGVmYXVsdGVkIjpmYWxzZSwicGlja3VwIjp7Im5vZGVJZCI6IjIwOSIsInRpbWVzdGFtcCI6MTY4NzU0MTU2NDkzMn0sInBvc3RhbENvZGUiOnsidGltZXN0YW1wIjoxNjg3NTQxNTY0OTMyLCJiYXNlIjoiNzI5NDkifSwidmFsaWRhdGVLZXkiOiJwcm9kOnYyOjRiMmMwYWNiLTg2OTgtNDUwNy05ZjU4LTA3ZmE0ZWY2MzViYyJ9; _astc=b750d2e3e78502e9b48cd3a2253ff68f; pxcts=02afd287-1240-11ee-b2c4-6344454f4242; _pxvid=f6a89994-11eb-11ee-b90e-03c538a2e281; assortmentStoreId=209; hasLocData=1; bstc=fifo-MrSxm_8iO9CkA6bmc; mobileweb=0; xpth=x-o-mart%2BB2C~x-o-mverified%2Bfalse; xpa=0Iadf|0uTG6|0yLUb|1JRNS|33xqR|3caIW|437ih|5e9Fg|5yW_r|7Zo3P|8xsUp|AcqN8|AkcZg|BUFSx|BcxPu|COgfJ|DcdL-|GeS9c|GycPV|IRAHO|JHbjS|KvYZX|SoVwe|U3NAT|UO2cT|Uqh-a|Uwlt9|W04B6|X78hm|YnYws|ZllwQ|_4HRC|_WAjU|_uNDy|c-Etr|dfrMM|eM5JI|fFWC6|j1UKn|nJFOV|pLKtx|pPaFS|pcXyb|qi56T|rldce|v4Ppy|vK1I8|wXvq0|z0fM4; exp-ck=0Iadf10uTG610yLUb233xqR23caIW2437ih17Zo3P1AcqN82AkcZg1BcxPu2COgfJ1GeS9c2GycPV1IRAHO1JHbjS3KvYZX1UO2cT1Uqh-a1Uwlt91YnYws4_uNDy1dfrMM1eM5JI1j1UKn1pcXyb1qi56T1rldce1v4Ppy2vK1I81z0fM41; xptc=assortmentStoreId%2B209; xpm=1%2B1687581704%2Ba3YaFX8ZfrzKC14pIk5b4s~%2B0; auth=MTAyOTYyMDE4wo%2FHLRNq36tufGLUDY%2BOWGl%2BRCQrH5v4uA6KJ2JaY6ZntXpNRysJ8UL0c%2BnM5mpDZa0kV196lP1jSG7fZx4jWe%2BgFzDZ%2FXTBBtfc6ieG%2BHAmVSCgJaVisbb3N9aBaZkW767wuZloTfhm7Wk2Kcjygiq0nmGVz3wI1IrcfVbuZ159%2FIJcZi3VfV1ukgCfrAXVBrg1A4EUV0FIcy8SilT4aRizYNFM8UtHvoVYAlub1dEUMk70P8glgOEpLOprhDfMDCcb9mgycy9jtT1uIyOBHfKn3G6fologXlZ5jdYeIOWK0%2B%2FykDPO7cAzriQ1e3aFHzO6jBf4FWH4mG4tV%2F0mLCKmK51Oa5TItzLijpQV3SGB%2FWf77hzYQJrY9m6Gx1HsHGdLc%2BKcz3RmtmnzCiQ6YkjyrOXbKKhH072NS%2FW0j%2FU%3D; adblocked=true;' 
    }
};
await axios.get('https://www.walmart.com',header);
const url = 'https://www.walmart.com/ip/Coach-For-Men-Eau-De-Toilette-Spray-Cologne-for-Men-3-3-Oz/468541722?athbdg=L1600';
const {data: html} = await axios.get(url,header);
console.log(html);*/
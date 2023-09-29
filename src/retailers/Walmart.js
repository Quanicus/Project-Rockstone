import Retailer from "../retailer.js";

class Walmart extends Retailer {
   
    static domain = "https://www.walmart.com"
    
    //overridding abstract method
    static parse_sales_response(response) {
        const raw_products = response.data.data.search.searchResult.itemStacks[0].itemsV2
        const products = raw_products
        .filter(product => product.canonicalUrl && product.priceInfo.currentPrice)
        .map(product => {
            let data = {};
            data.price = product.priceInfo.currentPrice.price;
            data.url = this.domain + product.canonicalUrl;
            data.name = product.name;
            data.pid = product.usItemId;
            return data;
        });
        return products;
    }
    //overriding abstract method
    static parse_product_response(response) {
        
    }
    //overriding abstract method
    static parse_max_page_response(response) {
        return response.data.data.search.searchResult.paginationV2.maxPage;
    }
    //overriding abstract method
    static get_menu_options() {
        return [{text_content:"Sales", fn:"scrape_sales"},
                {text_content:"Flash Deals", fn:"scrape_flash"}];
    }
    //MENU OPTIONS
    static async scrape_sales() {
        return await this.scrape_products_from_sales_pages(this.get_sales_page_req_config);
    }

    static async scrape_flash() {
        return await this.scrape_products_from_sales_pages(this.get_flash_page_req_config);
    }
    //

    static get_sales_page_req_config(page_num = 1) {
        return {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://www.walmart.com/orchestra/snb/graphql/Deals/1066ef0c835827e60a409b7bad347c101ed99ab08abff1c36cdaf8569767a5fe/deals?variables=%7B%22id%22%3A%22%22%2C%22dealsId%22%3A%22deals%22%2C%22page%22%3A${page_num}%2C%22mosaicPage%22%3A1%2C%22affinityOverride%22%3A%22default%22%2C%22prg%22%3A%22desktop%22%2C%22facet%22%3A%22%22%2C%22catId%22%3A%22%22%2C%22seoPath%22%3A%22%2Fshop%2Fdeals%3FaffinityOverride%3Ddefault%26page%3D${page_num}%22%2C%22ps%22%3A40%2C%22ptss%22%3A%22%22%2C%22trsp%22%3A%22%22%2C%22min_price%22%3A%22%22%2C%22max_price%22%3A%22%22%2C%22sort%22%3A%22best_match%22%2C%22beShelfId%22%3A%22%22%2C%22recall_set%22%3A%22%22%2C%22module_search%22%3A%22%22%2C%22storeSlotBooked%22%3A%22%22%2C%22additionalQueryParams%22%3A%7B%22isMoreOptionsTileEnabled%22%3Atrue%7D%2C%22searchParams%22%3A%7B%22id%22%3A%22%22%2C%22dealsId%22%3A%22deals%22%2C%22query%22%3A%22%22%2C%22page%22%3A${page_num}%2C%22mosaicPage%22%3A1%2C%22affinityOverride%22%3A%22default%22%2C%22prg%22%3A%22desktop%22%2C%22facet%22%3A%22%22%2C%22catId%22%3A%22%22%2C%22seoPath%22%3A%22%2Fshop%2Fdeals%3FaffinityOverride%3Ddefault%26page%3D${page_num}%22%2C%22ps%22%3A40%2C%22ptss%22%3A%22%22%2C%22trsp%22%3A%22%22%2C%22min_price%22%3A%22%22%2C%22max_price%22%3A%22%22%2C%22sort%22%3A%22best_match%22%2C%22beShelfId%22%3A%22%22%2C%22recall_set%22%3A%22%22%2C%22module_search%22%3A%22%22%2C%22storeSlotBooked%22%3A%22%22%2C%22additionalQueryParams%22%3A%7B%22isMoreOptionsTileEnabled%22%3Atrue%7D%2C%22cat_id%22%3A%22%22%2C%22_be_shelf_id%22%3A%22%22%2C%22pageType%22%3A%22DealsPage%22%7D%2C%22query%22%3Anull%2C%22pageType%22%3A%22DealsPage%22%2C%22fetchSkyline%22%3Atrue%2C%22enablePortableFacets%22%3Atrue%2C%22enableFacetCount%22%3Atrue%2C%22tenant%22%3A%22WM_GLASS%22%7D`,
            headers: { 
              'authority': 'www.walmart.com', 
              'accept': 'application/json', 
              'accept-language': 'en-US', 
              'content-type': 'application/json', 
              'cookie': 'ACID=4b2c0acb-8698-4507-9f58-07fa4ef635bc; hasACID=true; abqme=true; vtc=a3YaFX8ZfrzKC14pIk5b4s; _pxhd=7bf5818491961c73a9576e432dcdc3ee747f279ab7e0dc1b700055a1801d4231:f6a89994-11eb-11ee-b90e-03c538a2e281; TBV=7; _astc=b750d2e3e78502e9b48cd3a2253ff68f; pxcts=02afd287-1240-11ee-b2c4-6344454f4242; _pxvid=f6a89994-11eb-11ee-b90e-03c538a2e281; AMCVS_B5281C8B53309CEF0A490D4D%40AdobeOrg=1; AMCV_B5281C8B53309CEF0A490D4D%40AdobeOrg=1176715910%7CMCIDTS%7C19533%7CMCMID%7C01466945093744813668611726350846013182%7CMCOPTOUT-1687592166s%7CNONE%7CvVersion%7C5.4.0; akavpau_p1=1688225693~id=b7cc1b6b0b56492ec47062960d5d6191; brwsr=8ae6c21c-19f3-11ee-9ba4-6f5a11c47a20; locGuestData=eyJpbnRlbnQiOiJTSElQUElORyIsImlzRXhwbGljaXQiOmZhbHNlLCJzdG9yZUludGVudCI6IlBJQ0tVUCIsIm1lcmdlRmxhZyI6ZmFsc2UsImlzRGVmYXVsdGVkIjpmYWxzZSwicGlja3VwIjp7Im5vZGVJZCI6IjIwOSIsInRpbWVzdGFtcCI6MTY4NzU0MTU2NDkzMiwic2VsZWN0aW9uVHlwZSI6IkxTX1NFTEVDVEVEIn0sInBvc3RhbENvZGUiOnsidGltZXN0YW1wIjoxNjg3NTQxNTY0OTMyLCJiYXNlIjoiNzI5NDkifSwidmFsaWRhdGVLZXkiOiJwcm9kOnYyOjRiMmMwYWNiLTg2OTgtNDUwNy05ZjU4LTA3ZmE0ZWY2MzViYyJ9; x-ak-eh=true; wmlh=d6587b60fa8983602ccb3e32ae93a2051a6813d26c335a6d4ca8b440941e0837; AID=wmlspartner%3D0%3Areflectorid%3D0000000000000000000000%3Alastupd%3D1689454616202; _sp_id.ad94=db07fd6b-1746-4320-89f1-d80fd194463f.1687714208.10.1689529542.1689526892.aeb52a26-1f45-40d8-b022-007a2b78f077; assortmentStoreId=209; hasLocData=1; userAppVersion=main-1.86.0-eef3a1-0718T1815; xpa=2oc5H|4ah_O|6cfXU|8mXhS|ALBAK|BukPC|DBakN|GuGwr|H3OH4|IYZgB|JTAml|KvYZX|M6b6Z|PLRdE|SJnbK|TpUh1|W_EMd|X78hm|XW82V|YnYws|_4HRC|_NzN8|_uNDy|k2HTF|kKjwb|mFohB|pLKtx|r3ujb|u0P4x; exp-ck=6cfXU18mXhS1BukPC1DBakN1H3OH41KvYZX1M6b6Z1SJnbK1TpUh12W_EMd1XW82V1YnYws4_NzN81_uNDy2k2HTF1mFohB1r3ujb1u0P4x1; auth=MTAyOTYyMDE4wo%2FHLRNq36tufGLUDY%2BOWGl%2BRCQrH5v4uA6KJ2JaY6ZntXpNRysJ8UL0c%2BnM5mpDZa0kV196lP1jSG7fZx4jWe%2BgFzDZ%2FXTBBtfc6ieG%2BHAmVSCgJaVisbb3N9aBaZkW767wuZloTfhm7Wk2KcjyglM949MaUzwsNnQKx2EXSLmd1ToeWab4Rbs%2F30NGjpgZ%2BoJlnGyvjpnXVIf5hpORv0%2Bhvr78%2BhC1Qqo39Ykf8DQUMk70P8glgOEpLOprhDfMDCcb9mgycy9jtT1uIyOBHX8tkEwZeGmaoiqWK7jdSiNQK7Z%2BYfIqwPyaZUgQsKJsBAdrEUgYIUqXThUNq3WpYmt3WlUG3hGvoF0FWcksfSGmIp4dK22IaQqzeUHIru%2B8XwjhnQfaLKbqzns8A48%2FXkjyrOXbKKhH072NS%2FW0j%2FU%3D; bstc=RaFZsxoxmr9mreys1FtGlg; mobileweb=0; xptc=assortmentStoreId%2B209; xpth=x-o-mart%2BB2C~x-o-mverified%2Bfalse; exp-ce=1; locDataV3=eyJpc0RlZmF1bHRlZCI6ZmFsc2UsImlzRXhwbGljaXQiOmZhbHNlLCJpbnRlbnQiOiJTSElQUElORyIsInBpY2t1cCI6W3siYnVJZCI6IjAiLCJub2RlSWQiOiIyMDkiLCJkaXNwbGF5TmFtZSI6Ik96YXJrIFN0b3JlIiwibm9kZVR5cGUiOiJTVE9SRSIsImFkZHJlc3MiOnsicG9zdGFsQ29kZSI6IjcyOTQ5IiwiYWRkcmVzc0xpbmUxIjoiMTUxNiBOIDE4dGggU3QiLCJjaXR5IjoiT3phcmsiLCJzdGF0ZSI6IkFSIiwiY291bnRyeSI6IlVTIiwicG9zdGFsQ29kZTkiOiI3Mjk0OS0zNjExIn0sImdlb1BvaW50Ijp7ImxhdGl0dWRlIjozNS41MDM3MDksImxvbmdpdHVkZSI6LTkzLjg0MzgwMX0sImlzR2xhc3NFbmFibGVkIjp0cnVlLCJzY2hlZHVsZWRFbmFibGVkIjpmYWxzZSwidW5TY2hlZHVsZWRFbmFibGVkIjp0cnVlLCJodWJOb2RlSWQiOiIyMDkiLCJzdG9yZUhycyI6IjA2OjAwLTIyOjAwIiwic3VwcG9ydGVkQWNjZXNzVHlwZXMiOlsiUElDS1VQX0NVUkJTSURFIiwiUElDS1VQX0lOU1RPUkUiXSwic2VsZWN0aW9uVHlwZSI6IkxTX1NFTEVDVEVEIn1dLCJzaGlwcGluZ0FkZHJlc3MiOnsibGF0aXR1ZGUiOjM1LjUzMjgsImxvbmdpdHVkZSI6LTkzLjgyOTcsInBvc3RhbENvZGUiOiI3Mjk0OSIsImNpdHkiOiJPemFyayIsInN0YXRlIjoiQVIiLCJjb3VudHJ5Q29kZSI6IlVTQSIsImdpZnRBZGRyZXNzIjpmYWxzZX0sImFzc29ydG1lbnQiOnsibm9kZUlkIjoiMjA5IiwiZGlzcGxheU5hbWUiOiJPemFyayBTdG9yZSIsImludGVudCI6IlBJQ0tVUCJ9LCJpbnN0b3JlIjpmYWxzZSwicmVmcmVzaEF0IjoxNjg5ODcxNTA0MDQ4LCJ2YWxpZGF0ZUtleSI6InByb2Q6djI6NGIyYzBhY2ItODY5OC00NTA3LTlmNTgtMDdmYTRlZjYzNWJjIn0%3D; xpm=1%2B1689867902%2Ba3YaFX8ZfrzKC14pIk5b4s~%2B0; bm_mi=D90749EEB529B8AD7DF05CE9889C0C1A~YAAQmfjNFwT1JC+JAQAAa0D6cxT1M6Go9bhNKHuVyGFsd+rvhiOuMImPpqxmMTAKOexwep6AMrCYGIa6NUY1/KTF2Jx7vwSA0MeQERMr6zPkDqQBsw2SdT0+AXE1apfvsJVBP3l5o7Jdyf2hZL9WoiMFR5dYU4TBej4OUKzSlT8o/bjg6rS4ERzcoJyKVr3z6eihc5KqbSezJ+VdN4oXtvU3q+aDf+ggQEs5/K9kD9iDj2dG/MM5D5HCM12YylJPst5inRqH7HLwZULlCHAT9z9UbHobC2MC7X9+R4c/gfKs0ABUnaZjmXDXmYAwuOEwAPaPCuQ5b/1h~1;', 
              'device_profile_ref_id': 'nnofqdC2lOeBNHk1Hzx3qtgcYz7V7vi_HQSR', 
              'referer': `https://www.walmart.com/shop/deals?affinityOverride=default&page=${page_num}`, 
              'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"', 
              'sec-ch-ua-mobile': '?0', 
              'sec-ch-ua-platform': '"macOS"', 
              'sec-fetch-dest': 'empty', 
              'sec-fetch-mode': 'cors', 
              'sec-fetch-site': 'same-origin', 
              'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36', 
              'wm_mp': 'true', 
              'wm_page_url': `https://www.walmart.com/shop/deals?affinityOverride=default&page=${page_num}`,  
              'x-apollo-operation-name': 'Deals', 
              'x-enable-server-timing': '1', 
              'x-latency-trace': '1', 
              'x-o-bu': 'WALMART-US', 
              'x-o-ccm': 'server', 
              'x-o-gql-query': 'query Deals', 
              'x-o-mart': 'B2C', 
              'x-o-platform': 'rweb', 
              'x-o-platform-version': 'main-1.86.0-eef3a1-0718T1815', 
              'x-o-segment': 'oaoh'
            }
          };
    }

    static get_flash_page_req_config(page_num = 1) { 
        return {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://www.walmart.com/orchestra/snb/graphql/Deals/b69a8344058a0778b8be605a3be5df85c236da708b2c27f2abed5d05d1579bc0/deals?variables=%7B%22id%22%3A%22%22%2C%22dealsId%22%3A%22deals%2Fflash-picks%22%2C%22page%22%3A${page_num}%2C%22mosaicPage%22%3A1%2C%22affinityOverride%22%3A%22default%22%2C%22prg%22%3A%22desktop%22%2C%22facet%22%3A%22%22%2C%22catId%22%3A%22%22%2C%22seoPath%22%3A%22%2Fshop%2Fdeals%2Fflash-picks%3Fathcpid%3Deeb79392-2a4b-463f-9b5a-f0da85fa4b7f%26athpgid%3DAthenaGlassHomePageDesktopV1%26athznid%3DathenaModuleZone%26athmtid%3DAthenaItemCarousel%26athtvid%3D3%26athena%3Dtrue%26affinityOverride%3Ddefault%26page%3D${page_num}%22%2C%22ps%22%3A40%2C%22ptss%22%3A%22%22%2C%22trsp%22%3A%22%22%2C%22min_price%22%3A%22%22%2C%22max_price%22%3A%22%22%2C%22sort%22%3A%22best_match%22%2C%22beShelfId%22%3A%22%22%2C%22recall_set%22%3A%22%22%2C%22module_search%22%3A%22%22%2C%22storeSlotBooked%22%3A%22%22%2C%22additionalQueryParams%22%3A%7B%22isMoreOptionsTileEnabled%22%3Atrue%7D%2C%22athcpid%22%3A%22eeb79392-2a4b-463f-9b5a-f0da85fa4b7f%22%2C%22athpgid%22%3A%22AthenaGlassHomePageDesktopV1%22%2C%22athznid%22%3A%22athenaModuleZone%22%2C%22athmtid%22%3A%22AthenaItemCarousel%22%2C%22athtvid%22%3A%223%22%2C%22athena%22%3A%22true%22%2C%22searchParams%22%3A%7B%22id%22%3A%22%22%2C%22dealsId%22%3A%22deals%2Fflash-picks%22%2C%22query%22%3A%22%22%2C%22page%22%3A${page_num}%2C%22mosaicPage%22%3A1%2C%22affinityOverride%22%3A%22default%22%2C%22prg%22%3A%22desktop%22%2C%22facet%22%3A%22%22%2C%22catId%22%3A%22%22%2C%22seoPath%22%3A%22%2Fshop%2Fdeals%2Fflash-picks%3Fathcpid%3Deeb79392-2a4b-463f-9b5a-f0da85fa4b7f%26athpgid%3DAthenaGlassHomePageDesktopV1%26athznid%3DathenaModuleZone%26athmtid%3DAthenaItemCarousel%26athtvid%3D3%26athena%3Dtrue%26affinityOverride%3Ddefault%26page%3D${page_num}%22%2C%22ps%22%3A40%2C%22ptss%22%3A%22%22%2C%22trsp%22%3A%22%22%2C%22min_price%22%3A%22%22%2C%22max_price%22%3A%22%22%2C%22sort%22%3A%22best_match%22%2C%22beShelfId%22%3A%22%22%2C%22recall_set%22%3A%22%22%2C%22module_search%22%3A%22%22%2C%22storeSlotBooked%22%3A%22%22%2C%22additionalQueryParams%22%3A%7B%22isMoreOptionsTileEnabled%22%3Atrue%7D%2C%22athcpid%22%3A%22eeb79392-2a4b-463f-9b5a-f0da85fa4b7f%22%2C%22athpgid%22%3A%22AthenaGlassHomePageDesktopV1%22%2C%22athznid%22%3A%22athenaModuleZone%22%2C%22athmtid%22%3A%22AthenaItemCarousel%22%2C%22athtvid%22%3A%223%22%2C%22athena%22%3A%22true%22%2C%22cat_id%22%3A%22%22%2C%22_be_shelf_id%22%3A%22%22%2C%22pageType%22%3A%22DealsPage%22%7D%2C%22query%22%3Anull%2C%22pageType%22%3A%22DealsPage%22%2C%22fetchSkyline%22%3Atrue%2C%22enablePortableFacets%22%3Atrue%2C%22enableFacetCount%22%3Atrue%2C%22tenant%22%3A%22WM_GLASS%22%7D`,
            headers: {
                'authority': 'www.walmart.com', 
                'accept': 'application/json', 
                'accept-language': 'en-US', 
                'content-type': 'application/json', 
                'cookie': 'ACID=4b2c0acb-8698-4507-9f58-07fa4ef635bc; hasACID=true; abqme=true; vtc=a3YaFX8ZfrzKC14pIk5b4s; _pxhd=7bf5818491961c73a9576e432dcdc3ee747f279ab7e0dc1b700055a1801d4231:f6a89994-11eb-11ee-b90e-03c538a2e281; TBV=7; _astc=b750d2e3e78502e9b48cd3a2253ff68f; pxcts=02afd287-1240-11ee-b2c4-6344454f4242; _pxvid=f6a89994-11eb-11ee-b90e-03c538a2e281; AMCVS_B5281C8B53309CEF0A490D4D%40AdobeOrg=1; AMCV_B5281C8B53309CEF0A490D4D%40AdobeOrg=1176715910%7CMCIDTS%7C19533%7CMCMID%7C01466945093744813668611726350846013182%7CMCOPTOUT-1687592166s%7CNONE%7CvVersion%7C5.4.0; akavpau_p1=1688225693~id=b7cc1b6b0b56492ec47062960d5d6191; _sp_id.ad94=db07fd6b-1746-4320-89f1-d80fd194463f.1687714208.7.1688229876.1688060869.3ddb5265-da19-45cb-8b95-2b4fc23ac5e7; brwsr=8ae6c21c-19f3-11ee-9ba4-6f5a11c47a20; assortmentStoreId=209; hasLocData=1; locGuestData=eyJpbnRlbnQiOiJTSElQUElORyIsImlzRXhwbGljaXQiOmZhbHNlLCJzdG9yZUludGVudCI6IlBJQ0tVUCIsIm1lcmdlRmxhZyI6ZmFsc2UsImlzRGVmYXVsdGVkIjpmYWxzZSwicGlja3VwIjp7Im5vZGVJZCI6IjIwOSIsInRpbWVzdGFtcCI6MTY4NzU0MTU2NDkzMiwic2VsZWN0aW9uVHlwZSI6IkxTX1NFTEVDVEVEIn0sInBvc3RhbENvZGUiOnsidGltZXN0YW1wIjoxNjg3NTQxNTY0OTMyLCJiYXNlIjoiNzI5NDkifSwidmFsaWRhdGVLZXkiOiJwcm9kOnYyOjRiMmMwYWNiLTg2OTgtNDUwNy05ZjU4LTA3ZmE0ZWY2MzViYyJ9; userAppVersion=main-1.85.0-5bc8f3-0713T0626; bstc=XQfgQaB_uZEAl9lcDXcvLI; mobileweb=0; xpth=x-o-mart%2BB2C~x-o-mverified%2Bfalse; xpa=6cfXU|ALBAK|BukPC|DBakN|JTAml|KvYZX|M6b6Z|PLRdE|SJnbK|X78hm|XW82V|YnYws|_4HRC|_NzN8|_uNDy|c1KYM|k2HTF|kKjwb|mFohB|pLKtx|qUXqn|r3ujb|wXvq0|z0fM4; exp-ce=1; exp-ck=6cfXU1BukPC1DBakN1KvYZX1M6b6Z1SJnbK1XW82V1YnYws4_NzN81_uNDy1k2HTF1mFohB1r3ujb1z0fM42; x-ak-eh=true; xptc=assortmentStoreId%2B209; bm_mi=2D911C9A6AA82148CC64A0D097215DA6~YAAQq2TNF4PBbiiJAQAAjmo5WhRCSafzcnO6WcewsgdYpaD10uKDFAiKj8O2Y9nd8xBy0ndA0QdRUm1W93L2UxdIbr5J3YrzRF9eMWO746FCIAn6Imw/+rkURcgfJorvggZrALYXmlldZcKzoGZyHQTWszpcbtVZOf+lIVD12JX2gNdCeIhcSzYrqgQtZhLU5wpbgIKHk1ZqlVAbd3Brp3jgVgl3AcF5ylF7eSCXtMIsMeig8AHzyV4QHAhyIaVq+8zMBMROjTgxr5bS2CNYO1VKrWmuKSYQDNtuWiVlvK1CSRKOeeLGCXSuVsPx3iCLdw7Xa8CFaE/DTwRnYLDvxbzIiaXK~1; bm_sv=F2424FC07A48B12661196F654526A0E4~YAAQq2TNF0vEbiiJAQAA9Zs5WhQ+WJ0fyWc/2hsp/Kbpz0SpfGlWPen9rDHbdcQ9092ar1V864xrVFqtKRm91uf8m80SviKeGqnTFBKfmZrqQnuHKRV4W0oXiHELZa6r20lw4GT8xrwvzEZmppgdIuWuhbdQdOopljbDlhw/dy7iXWghBKP/G9URg3WUL9qnsqVmp5vQ5E31WfeHLeR5XBCtoCsVRSM6WqIlaVnhtcCCkhG2abqR2WgopbfjKiW5tg==~1; ak_bmsc=CF4E57EFA79345734602CCE63D8EE556~000000000000000000000000000000~YAAQq2TNF6fFbiiJAQAAn7Y5WhTbJx9YLlZholjIlF4bHlyj+fquBhG0eCSsSVecmy81La43cV/rUmDAHY70wV8n73kgxKC5Y5Yyi2sfNEkAns/DPakRa3ORRmuN/GwTh4S21wiIYfpeHkzwwOdKwqkFGEK0qdQUsxFsZ4W6aleG98kt6Gg8/5szg5MKKBr9mgeVxLpZGGqOvIfSQMN8AdZVbBYT9rt35ZtWVBaLLySGPuRouG3uVsitD+RM1QF7npX2jeZYB4BKu4Azc77tfaDGACJsQFYPkdX/5vUCogSLS+UqOrQwOS/rt+qPo1Nv20exlj9nuqAPIIKjNn5ZS2uCe6ROtfRRtj91RKbCDs7ZkJ1ECZbeWlyNDgKcHLUnbVhujTkKo/dfPB5wM9dbYhN7/V5Cd+kDnGkoXUJ14qT20/uU8p0aS/yZJPoMqpdsyCixgehX; AID=wmlspartner%3D0%3Areflectorid%3D0000000000000000000000%3Alastupd%3D1689438905701; xpm=1%2B1689439499%2Ba3YaFX8ZfrzKC14pIk5b4s~%2B0; wmlh=d6587b60fa8983602ccb3e32ae93a2051a6813d26c335a6d4ca8b440941e0837; auth=MTAyOTYyMDE4wo%2FHLRNq36tufGLUDY%2BOWGl%2BRCQrH5v4uA6KJ2JaY6ZntXpNRysJ8UL0c%2BnM5mpDZa0kV196lP1jSG7fZx4jWe%2BgFzDZ%2FXTBBtfc6ieG%2BHAmVSCgJaVisbb3N9aBaZkW767wuZloTfhm7Wk2KcjygobRHThsmZk%2BGcqTfIab85RscjyxPYLzImAffF7rasshAijDc%2BdO83v5jPD%2FilBQcpXLzI4jC4vugLB6SlykfzEUMk70P8glgOEpLOprhDfMDCcb9mgycy9jtT1uIyOBHa7bgRzh%2FYMDPomg8cRpEyughYU2U0E8YS%2FZY9kjtxcX%2BU7h9geizyj72h97rVbUYq0tB8cj9sLI1VidvQ20PrYDwOI3d49Nai7GOGN6TnvzP2xjDmjEXULrue9cVHiq7JE5WBBdZBCyKnCQAR7o6eg%3D; locDataV3=eyJpc0RlZmF1bHRlZCI6ZmFsc2UsImlzRXhwbGljaXQiOmZhbHNlLCJpbnRlbnQiOiJTSElQUElORyIsInBpY2t1cCI6W3siYnVJZCI6IjAiLCJub2RlSWQiOiIyMDkiLCJkaXNwbGF5TmFtZSI6Ik96YXJrIFN0b3JlIiwibm9kZVR5cGUiOiJTVE9SRSIsImFkZHJlc3MiOnsicG9zdGFsQ29kZSI6IjcyOTQ5IiwiYWRkcmVzc0xpbmUxIjoiMTUxNiBOIDE4dGggU3QiLCJjaXR5IjoiT3phcmsiLCJzdGF0ZSI6IkFSIiwiY291bnRyeSI6IlVTIiwicG9zdGFsQ29kZTkiOiI3Mjk0OS0zNjExIn0sImdlb1BvaW50Ijp7ImxhdGl0dWRlIjozNS41MDM3MDksImxvbmdpdHVkZSI6LTkzLjg0MzgwMX0sImlzR2xhc3NFbmFibGVkIjp0cnVlLCJzY2hlZHVsZWRFbmFibGVkIjpmYWxzZSwidW5TY2hlZHVsZWRFbmFibGVkIjp0cnVlLCJodWJOb2RlSWQiOiIyMDkiLCJzdG9yZUhycyI6IjA2OjAwLTIyOjAwIiwic3VwcG9ydGVkQWNjZXNzVHlwZXMiOlsiUElDS1VQX0lOU1RPUkUiLCJQSUNLVVBfQ1VSQlNJREUiXSwic2VsZWN0aW9uVHlwZSI6IkxTX1NFTEVDVEVEIn1dLCJzaGlwcGluZ0FkZHJlc3MiOnsibGF0aXR1ZGUiOjM1LjUzMjgsImxvbmdpdHVkZSI6LTkzLjgyOTcsInBvc3RhbENvZGUiOiI3Mjk0OSIsImNpdHkiOiJPemFyayIsInN0YXRlIjoiQVIiLCJjb3VudHJ5Q29kZSI6IlVTQSIsImdpZnRBZGRyZXNzIjpmYWxzZX0sImFzc29ydG1lbnQiOnsibm9kZUlkIjoiMjA5IiwiZGlzcGxheU5hbWUiOiJPemFyayBTdG9yZSIsImludGVudCI6IlBJQ0tVUCJ9LCJpbnN0b3JlIjpmYWxzZSwicmVmcmVzaEF0IjoxNjg5NDQ2MDQwMzEzLCJ2YWxpZGF0ZUtleSI6InByb2Q6djI6NGIyYzBhY2ItODY5OC00NTA3LTlmNTgtMDdmYTRlZjYzNWJjIn0%3D; xptwj=qq:7f31f3be575bfb284d83:N4qW//I+OxHuCEJdxQFg05Qhrp6gx8Q9/c29x56XqYO/MKD+i0llzsUjW43CsiKxdr/K8UfaIyPP7555oNvS+2ThRH/Ifya48vhc8NsLdDuKGDBcTkoGEzJ4He+O826Sby3/4HGcC/LS+OibJgEEQIIufTNCmvJhTaKE57pmBudjtmeVOeegdyDg/MYc61dEWn+6a64=; adblocked=true; com.wm.reflector="reflectorid:imp_ULvQUAxqbxyPRPo39GxywyMsUkF2tFxtu32yTw0@lastupd:1689442479000@firstcreate:1688424473380"; xptwg=2151940342:DF9E5DA5575B08:2387DF8:89B7F73D:C49A3F50:6780184C:; TS01a90220=01e51bebd520efcdfd8bfe5b49348414bf9dc31895bab1123ac7ec5bd1e7ac55ad169c90b6f987e8e815fcef7854d0b4c476436a17; TS012768cf=01cb1199b1ebaba05378cd9e2e6b7f1529c5f99125198b9dc146379b1500220dd893e9353ae1bbe53187e232e390988ed07d102e61; TS2a5e0c5c027=0851107c88ab20002150aa63e3da92829359829de2d8296f4b18e196a23e479caeebfe02718ee71d08fa6571b8113000728864f16f1af9d1b3962fc0e90614fb4990048af1a9f766d5435b5a093b01dfddb194ea59b1d80b92fb37d63742af89; akavpau_p2=1689443096~id=f19fab44b53591a3e9724462a198b59f; TS01a90220=019986c19a9ebec17f018461babe32f1f8ec8a4b684373fb80c9c6878ece82efc6d6526901103608929d36c58376af9596d2e97379; bstc=XQfgQaB_uZEAl9lcDXcvLI; com.wm.reflector="reflectorid:imp_ULvQUAxqbxyPRPo39GxywyMsUkF2tFxtu32yTw0@lastupd:1689442632000@firstcreate:1688424473380"; exp-ce=1; exp-ck=6cfXU1BukPC1DBakN1KvYZX1M6b6Z1SJnbK1XW82V1YnYws4_NzN81_uNDy1k2HTF1mFohB1r3ujb1z0fM42; mobileweb=0; vtc=a3YaFX8ZfrzKC14pIk5b4s; xpa=6cfXU|ALBAK|BukPC|DBakN|JTAml|KvYZX|M6b6Z|PLRdE|SJnbK|X78hm|XW82V|YnYws|_4HRC|_NzN8|_uNDy|c1KYM|k2HTF|kKjwb|mFohB|pLKtx|qUXqn|r3ujb|wXvq0|z0fM4; xpm=1%2B1689439499%2Ba3YaFX8ZfrzKC14pIk5b4s~%2B0; xptc=assortmentStoreId%2B209; xpth=x-o-mart%2BB2C~x-o-mverified%2Bfalse; xptwg=1055684919:1D460E530216820:4A6BAED:4EA1769:26BD934D:6BA202A6:; TS012768cf=019986c19a9ebec17f018461babe32f1f8ec8a4b684373fb80c9c6878ece82efc6d6526901103608929d36c58376af9596d2e97379; TS2a5e0c5c027=08d8253fd0ab2000803e5b62d4238bf765e5854ca981d37f2ac21e38ca76bfc0d2545e5c67471c3b0813be367d11300035b37ef437689e827dbb448b3e9a8ab644cbc083d49022394335e4548f71425008ff075ac2d74676b9973d12fca78458; abqme=true; akavpau_p2=1689443232~id=14969d4a4bfa96e25148f59c2b3c0764', 
                'device_profile_ref_id': '78AOD2CzRzN2UG-EnzlW2K3OK8ADvJp5oD45', 
                'referer': 'https://www.walmart.com/shop/deals/flash-picks?athcpid=eeb79392-2a4b-463f-9b5a-f0da85fa4b7f&athpgid=AthenaGlassHomePageDesktopV1&athznid=athenaModuleZone&athmtid=AthenaItemCarousel&athtvid=3&athena=true&affinityOverride=default&page=2', 
                'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"', 
                'sec-ch-ua-mobile': '?0', 
                'sec-ch-ua-platform': '"macOS"', 
                'sec-fetch-dest': 'empty', 
                'sec-fetch-mode': 'cors', 
                'sec-fetch-site': 'same-origin', 
                'traceparent': '00-38328861f06618777c8e3ba5d3a6ff5c-851ccc167d2785ce-00', 
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36', 
                'wm_mp': 'true', 
                'wm_page_url': 'https://www.walmart.com/shop/deals/flash-picks?athcpid=eeb79392-2a4b-463f-9b5a-f0da85fa4b7f&athpgid=AthenaGlassHomePageDesktopV1&athznid=athenaModuleZone&athmtid=AthenaItemCarousel&athtvid=3&athena=true&affinityOverride=default&page=2', 
                'wm_qos.correlation_id': '5UBIeUWXgXfarPCSH53EfGt6eGZPYwLLjqCt', 
                'x-apollo-operation-name': 'Deals', 
                'x-enable-server-timing': '1', 
                'x-latency-trace': '1', 
                'x-o-bu': 'WALMART-US', 
                'x-o-ccm': 'server', 
                'x-o-correlation-id': '5UBIeUWXgXfarPCSH53EfGt6eGZPYwLLjqCt', 
                'x-o-gql-query': 'query Deals', 
                'x-o-mart': 'B2C', 
                'x-o-platform': 'rweb', 
                'x-o-platform-version': 'main-1.85.0-5bc8f3-0713T0626', 
                'x-o-segment': 'oaoh'
            }
        } 
    }

    static get_product_req_config(product) { 

        const pid = product.pid;
        const pname = product.url.split('/')[4];
        return {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://www.walmart.com/orchestra/pdp/graphql/ItemById/70f5312334bd8619e29b5f29aef0d9b68b1cb659e1177e8c9a66a580026354cf/ip/${pid}?variables=%7B%22channel%22%3A%22WWW%22%2C%22pageType%22%3A%22ItemPageGlobal%22%2C%22tenant%22%3A%22WM_GLASS%22%2C%22version%22%3A%22v1%22%2C%22iId%22%3A%22${pid}%22%2C%22layout%22%3A%5B%22itemDesktop%22%5D%2C%22tempo%22%3A%7B%22targeting%22%3A%22%257B%2522userState%2522%253A%2522loggedIn%2522%257D%22%2C%22params%22%3A%5B%7B%22key%22%3A%22expoVars%22%2C%22value%22%3A%22expoVariationValue%22%7D%2C%7B%22key%22%3A%22expoVars%22%2C%22value%22%3A%22expoVariationValue2%22%7D%5D%7D%2C%22p13N%22%3A%7B%22userClientInfo%22%3A%7B%22isZipLocated%22%3Atrue%2C%22deviceType%22%3A%22desktop%22%2C%22callType%22%3A%22CLIENT%22%7D%2C%22userReqInfo%22%3A%7B%22refererContext%22%3A%7B%22source%22%3A%22itempage%22%7D%2C%22pageUrl%22%3A%22%2Fip%2F${pname}%2F${pid}%22%7D%7D%2C%22p13nCls%22%3A%7B%22pageId%22%3A%22${pid}%22%2C%22userClientInfo%22%3A%7B%22isZipLocated%22%3Atrue%2C%22callType%22%3A%22CLIENT%22%7D%2C%22userReqInfo%22%3A%7B%22refererContext%22%3A%7B%22source%22%3A%22itempage%22%2C%22query%22%3A%22%22%7D%2C%22isMoreOptionsTileEnabled%22%3Atrue%7D%2C%22p13NCallType%22%3A%22ATF%22%7D%2C%22fBBAd%22%3Atrue%2C%22fSL%22%3Atrue%2C%22fIdml%22%3Atrue%2C%22fMrkDscrp%22%3Afalse%2C%22fRev%22%3Atrue%2C%22fFit%22%3Atrue%2C%22fSeo%22%3Atrue%2C%22fP13%22%3Atrue%2C%22fAff%22%3Atrue%2C%22fMq%22%3Atrue%2C%22fGalAd%22%3Afalse%2C%22fSCar%22%3Atrue%2C%22fBB%22%3Atrue%2C%22eItIb%22%3Atrue%2C%22fIlc%22%3Atrue%2C%22bbe%22%3Atrue%2C%22ilc%22%3Afalse%2C%22epsv%22%3Atrue%2C%22fSId%22%3Atrue%2C%22sVSC%22%3Afalse%2C%22eSb%22%3Atrue%2C%22eCc%22%3Afalse%2C%22enableDetailedBeacon%22%3Afalse%2C%22enableMultiSave%22%3Afalse%2C%22includeLabelV1%22%3Atrue%2C%22sV%22%3Afalse%2C%22sVC%22%3Afalse%2C%22enableRelatedSearch%22%3Afalse%7D`,
            headers: {
                'authority': 'www.walmart.com', 
                'accept': 'application/json', 
                'accept-language': 'en-US', 
                'calltype': 'CLIENT', 
                'content-type': 'application/json', 
                'cookie': 'ACID=4b2c0acb-8698-4507-9f58-07fa4ef635bc; hasACID=true; abqme=true; vtc=a3YaFX8ZfrzKC14pIk5b4s; _pxhd=7bf5818491961c73a9576e432dcdc3ee747f279ab7e0dc1b700055a1801d4231:f6a89994-11eb-11ee-b90e-03c538a2e281; TBV=7; _astc=b750d2e3e78502e9b48cd3a2253ff68f; pxcts=02afd287-1240-11ee-b2c4-6344454f4242; _pxvid=f6a89994-11eb-11ee-b90e-03c538a2e281; AMCVS_B5281C8B53309CEF0A490D4D%40AdobeOrg=1; AMCV_B5281C8B53309CEF0A490D4D%40AdobeOrg=1176715910%7CMCIDTS%7C19533%7CMCMID%7C01466945093744813668611726350846013182%7CMCOPTOUT-1687592166s%7CNONE%7CvVersion%7C5.4.0; akavpau_p1=1688225693~id=b7cc1b6b0b56492ec47062960d5d6191; brwsr=8ae6c21c-19f3-11ee-9ba4-6f5a11c47a20; locGuestData=eyJpbnRlbnQiOiJTSElQUElORyIsImlzRXhwbGljaXQiOmZhbHNlLCJzdG9yZUludGVudCI6IlBJQ0tVUCIsIm1lcmdlRmxhZyI6ZmFsc2UsImlzRGVmYXVsdGVkIjpmYWxzZSwicGlja3VwIjp7Im5vZGVJZCI6IjIwOSIsInRpbWVzdGFtcCI6MTY4NzU0MTU2NDkzMiwic2VsZWN0aW9uVHlwZSI6IkxTX1NFTEVDVEVEIn0sInBvc3RhbENvZGUiOnsidGltZXN0YW1wIjoxNjg3NTQxNTY0OTMyLCJiYXNlIjoiNzI5NDkifSwidmFsaWRhdGVLZXkiOiJwcm9kOnYyOjRiMmMwYWNiLTg2OTgtNDUwNy05ZjU4LTA3ZmE0ZWY2MzViYyJ9; userAppVersion=main-1.85.0-5bc8f3-0713T0626; x-ak-eh=true; wmlh=d6587b60fa8983602ccb3e32ae93a2051a6813d26c335a6d4ca8b440941e0837; AID=wmlspartner%3D0%3Areflectorid%3D0000000000000000000000%3Alastupd%3D1689454616202; assortmentStoreId=209; hasLocData=1; bm_mi=43215673CC5C40590D0946D91F6971A8~YAAQUg3GFyf73U+JAQAAx1V2XxR1FSWx8xY05qI4s25cHqWppGhby5y1tuswIGPkw0zaf3BcKPUQ2VsD9+ybJEf0Iny+ZRwsgqGiIiVjihaqz+2eU2GcqAFFK1TzX3K84mUygEpGwgvl5RXObbyWaqlGRz2pS/tKrP2oO1COM6Nyr8LAV4DxyMhp2KuPPLR6BiSZyukh7DCH7CF5FtMdWRNquxQc1OoSnIxanILatipbnMGsnWqjq0ecw35wJDNFwUTVhAA+L/R4SEW9JpCNCbXCLEttFbIZAVTZzh8poUn2md0DklgDyiOJj3zw4rbdoHclLNSlOMYXfLJFKw6kJRtbigt18FIl9HwlUjQ5XlP2NmIxIjNs/m/6xxt1wP4IsO6la3JsaupCjOxPv7uCMSyAu//qNpMHP2rsJIlXrJrz5OkRShgxVBuwJmdKeKQwvl5c0ZfqpBpQTwAO5LrBf4XSh7bWUPlNBIk6JV6MzdDGn8yI6CCzmeCA/5WwU4ClQU1uncl4wSPGRuEk9Z4Ryyos~1; bm_sv=0BCAD3DEBD23C361B7BAF3C17227B780~YAAQUg3GFz773U+JAQAA15R2XxSYjyHatDA0YLmcrb2PDM6kPjs/QuXtUHvwXnQTtlG7+pwyJ7Sn6/ZrveDRgIwzhU7/qzLnfDh7U9hSDsdfAuCbuwT3nC++kuGTOA63Dr738NjyX7XpLM/ud+20A98fsyETIpH+z8OfHga1gDAZTyaSyHpAw8IfvwrcNyMtXIyOZKYSvsFvVgHA9hiUGe3FSr6EnysXm9pHhs/MVHjQMpeY0O+BcgpHi6Pk+xLC8GI=~1; ak_bmsc=578D553BAAFD9E4868D2D5E2D379A321~000000000000000000000000000000~YAAQUg3GF0L73U+JAQAAVJd2XxQ2hNlVehgr6ZF+vONW2Q73YemZqrUqHpwddOD/MQaJVHPxd3cb+FldB4YjzszN727xWYlYpcdfXGL6T65bUSkEnqCai71cqJ6WffPgEAuqpDimG5ULGqKjhPb3HdQTWvuH+rL9YQ5J+jfHOHmLghI7glE5hLjEFtemKDtPCFbKu6cNLIsKhNX2D8AT6YXWAkVb7Bbc8Pf0rM067+QMxoIiZHbGnePECW+6BAex3v9ceclljeB4ITJqrWDweUZM807G5Ri5icGw5bMRtLVoBmb522GMkH6ZfD+kocmjVBhbatbsNdoCLNqHu0iIUD+SN1enbwPeM90mkbCNe4kBofiOIbvqjQlorMFKhwpyh9n1b6vyVIlnRIUUWBGcnAv9S7/1oQSrXjREhgktC2W7SzE+E5Drp5bo1kIUEjNIEw3VVxb6NsBWpElalosuV0EzNFfBBUd2RiaeC52iZYaPESltn4KHDPZ2BdqnosHEIfrPrtseeVKkvgktTWVkNNQq4F7/8yntaPxuPxLUSseOpJxqli9rkmoSf+DWM6Y1m6+ugs9eJ1ad/IDZS0zIebV5zmkY9rOQ3NM/uJXHphpTF75eHpkMomwFoO//g70EJ0lM; mobileweb=0; xptc=assortmentStoreId%2B209; xpth=x-o-mart%2BB2C~x-o-mverified%2Bfalse; xpa=6cfXU|ALBAK|BukPC|DBakN|JTAml|KvYZX|M6b6Z|PLRdE|SJnbK|X78hm|XW82V|YnYws|_4HRC|_NzN8|_uNDy|c1KYM|k2HTF|kKjwb|mFohB|pLKtx|qUXqn|r3ujb|wXvq0|z0fM4; exp-ce=1; exp-ck=6cfXU1BukPC1DBakN1KvYZX1M6b6Z1SJnbK1XW82V1YnYws4_NzN81_uNDy1k2HTF1mFohB1r3ujb1z0fM42; bstc=fwRPZPPcIVVNyFKC3k0O9c; _pxff_ccc=1; auth=MTAyOTYyMDE4wo%2FHLRNq36tufGLUDY%2BOWGl%2BRCQrH5v4uA6KJ2JaY6ZntXpNRysJ8UL0c%2BnM5mpDZa0kV196lP1jSG7fZx4jWe%2BgFzDZ%2FXTBBtfc6ieG%2BHAmVSCgJaVisbb3N9aBaZkW767wuZloTfhm7Wk2Kcjygi5k0VvBM%2FJjwcKWWhCnBS8T6JqQ%2Ft6MPYWdYxxHYQ%2FQKBfVu7VTdiqtV2xqicmj20qQCub%2BGIv8gL6rzQ6fMroUMk70P8glgOEpLOprhDfMDCcb9mgycy9jtT1uIyOBHa7lVckPGr%2BJqpdscrMgzgepExjb8EaEcFmGBqc3NvfulUwivxCM%2F%2BpoN%2BaroSBh8jB9eLbWFCNZPecPqAvi8rF%2Bd%2BcCggGRN7SSoMYGfKC7XD22Lp9zXKKaRFanPYl54UjyrOXbKKhH072NS%2FW0j%2FU%3D; xpm=1%2B1689529522%2Ba3YaFX8ZfrzKC14pIk5b4s~%2B0; _sp_ses.ad94=*; locDataV3=eyJpc0RlZmF1bHRlZCI6ZmFsc2UsImlzRXhwbGljaXQiOmZhbHNlLCJpbnRlbnQiOiJTSElQUElORyIsInBpY2t1cCI6W3siYnVJZCI6IjAiLCJub2RlSWQiOiIyMDkiLCJkaXNwbGF5TmFtZSI6Ik96YXJrIFN0b3JlIiwibm9kZVR5cGUiOiJTVE9SRSIsImFkZHJlc3MiOnsicG9zdGFsQ29kZSI6IjcyOTQ5IiwiYWRkcmVzc0xpbmUxIjoiMTUxNiBOIDE4dGggU3QiLCJjaXR5IjoiT3phcmsiLCJzdGF0ZSI6IkFSIiwiY291bnRyeSI6IlVTIiwicG9zdGFsQ29kZTkiOiI3Mjk0OS0zNjExIn0sImdlb1BvaW50Ijp7ImxhdGl0dWRlIjozNS41MDM3MDksImxvbmdpdHVkZSI6LTkzLjg0MzgwMX0sImlzR2xhc3NFbmFibGVkIjp0cnVlLCJzY2hlZHVsZWRFbmFibGVkIjpmYWxzZSwidW5TY2hlZHVsZWRFbmFibGVkIjp0cnVlLCJodWJOb2RlSWQiOiIyMDkiLCJzdG9yZUhycyI6IjA2OjAwLTIyOjAwIiwic3VwcG9ydGVkQWNjZXNzVHlwZXMiOlsiUElDS1VQX0NVUkJTSURFIiwiUElDS1VQX0lOU1RPUkUiXSwic2VsZWN0aW9uVHlwZSI6IkxTX1NFTEVDVEVEIn1dLCJzaGlwcGluZ0FkZHJlc3MiOnsibGF0aXR1ZGUiOjM1LjUzMjgsImxvbmdpdHVkZSI6LTkzLjgyOTcsInBvc3RhbENvZGUiOiI3Mjk0OSIsImNpdHkiOiJPemFyayIsInN0YXRlIjoiQVIiLCJjb3VudHJ5Q29kZSI6IlVTQSIsImdpZnRBZGRyZXNzIjpmYWxzZX0sImFzc29ydG1lbnQiOnsibm9kZUlkIjoiMjA5IiwiZGlzcGxheU5hbWUiOiJPemFyayBTdG9yZSIsImludGVudCI6IlBJQ0tVUCJ9LCJpbnN0b3JlIjpmYWxzZSwicmVmcmVzaEF0IjoxNjg5NTMzMTQxNTIzLCJ2YWxpZGF0ZUtleSI6InByb2Q6djI6NGIyYzBhY2ItODY5OC00NTA3LTlmNTgtMDdmYTRlZjYzNWJjIn0%3D; _sp_id.ad94=db07fd6b-1746-4320-89f1-d80fd194463f.1687714208.10.1689529542.1689526892.aeb52a26-1f45-40d8-b022-007a2b78f077; _px3=adbfd8d1b440e12d3113fefb78d706b8ea9821d69bcd6983eeea63c68903016b:yjedL3ktsauCyc7XnHxuxqatNvDq1T9AVsZOnfmjFSFchvxWofQBFDP7KZ5tFozbCho2okHdHptej29lk5gUiw==:1000:gin/I0AomlYf851fhjeNuWB/PeYk1bugiCX6nQYJhH+Cm66//AFS56DUnQREzzXV8sEJydUyzHlBXpX1fWDFCqXjTf3HdkPVN9KE4BTdDt64/UsejKFhiP8DoKL9JmmqPFj3zG5wk6/DU6e8sWTJ28cAg5DGKXsQHXELCPFXqDPtZmjFUXGAAzHrsSyRtiE+1wvN8hAwzLoOy7sId74OQg==; _pxde=495a4b039c97d4d631b780b8d269a51dbe45141bc6395f4ee44c733079159bbe:eyJ0aW1lc3RhbXAiOjE2ODk1Mjk2NzU4ODV9; xptwj=qq:9d2d3878afaa0abcbdbf:aQriCM3xNFzc+zfCKLRSd1IxlSvtP8wticGlEnh2GrPD0VzuhKbIu4paeqqfNFPbUn6CkQcmhXRbBrc4HgWNheFMzHolheacHhi252KNEiYaSJ76UBvxMAFmT7YnYcrQwF8+9+Og34z3oilqf2CYs+zV8tIbLbbFR7LL6r/uJ6hJxOqxKcabctLLpD28+yQD+TXURqw=; akavpau_p2=1689530493~id=b2b850c8c725118a4b0a3f0b845371d3; adblocked=true; undefined=OMNI_PROMISE; com.wm.reflector="reflectorid:imp_ULvQUAxqbxyPRPo39GxywyMsUkF2tFxtu32yTw0@lastupd:1689529894000@firstcreate:1688424473380"; xptwg=523687686:CF91EFA1082E68:20FAA5E:85E63253:C7853C01:D6B53801:; TS012768cf=0115ecc82e26398bda773c05c829da0882a67741ce1b51d27a52bb79109dba0a5e8489ecc4af28720aaa0a56e0ebda3e7e15b74865; TS01a90220=0115ecc82e26398bda773c05c829da0882a67741ce1b51d27a52bb79109dba0a5e8489ecc4af28720aaa0a56e0ebda3e7e15b74865; TS2a5e0c5c027=08484dc991ab2000e3625887c81762f5041155cf2bb27e4dba5d21b02b56338e40e5cf44aa94272f08b30b0fcd113000da910516ce17959a3ff6d8e0c4e30b9ebbda068be8fcc4eaa4875ea471a057014721513a8699df3582d710c30d681a0b; TS01a90220=01634c85da3164a1fe0e3cdf1c037b0b3e7afd495b1ac3baae7abcc1a0807d0753df55b75f22ebe4a733a919f34124ac66873a6e67; bstc=fwRPZPPcIVVNyFKC3k0O9c; com.wm.reflector="reflectorid:imp_ULvQUAxqbxyPRPo39GxywyMsUkF2tFxtu32yTw0@lastupd:1689529919000@firstcreate:1688424473380"; exp-ce=1; exp-ck=6cfXU1BukPC1DBakN1KvYZX1M6b6Z1SJnbK1XW82V1YnYws4_NzN81_uNDy1k2HTF1mFohB1r3ujb1z0fM42; mobileweb=0; vtc=a3YaFX8ZfrzKC14pIk5b4s; xpa=6cfXU|ALBAK|BukPC|DBakN|JTAml|KvYZX|M6b6Z|PLRdE|SJnbK|X78hm|XW82V|YnYws|_4HRC|_NzN8|_uNDy|c1KYM|k2HTF|kKjwb|mFohB|pLKtx|qUXqn|r3ujb|wXvq0|z0fM4; xpm=1%2B1689529522%2Ba3YaFX8ZfrzKC14pIk5b4s~%2B0; xptc=assortmentStoreId%2B209; xpth=x-o-mart%2BB2C~x-o-mverified%2Bfalse; xptwg=1727878317:19BE3780F9BF7A0:41710AC:BC5F5D66:E0B2E124:954DA4AC:; xptwj=qq:dd83acceac8b67f5c186:xV4luIp6DyjyCbq/p1hOf42supv2eTKjL5Vfl93H1y9oKwH92Ulj+LDSSC7lXVx7s2u5r/SXEFEVfVIoUvO9pKKTxXf2ZdrrdJHqMm8pQGfbjeTIszRE2aXddXOjlbHymJvKsZDKhp/I0gr3+LIW68grydXTRWaUd+U5Oph7ZjThNbFa9bS7UnzIYQX6p0v7Z52Hf+k=; TS012768cf=01634c85da3164a1fe0e3cdf1c037b0b3e7afd495b1ac3baae7abcc1a0807d0753df55b75f22ebe4a733a919f34124ac66873a6e67; TS2a5e0c5c027=08999a9a47ab20006600287f5c82af9291b14036ae67978bcb86c91eef389b1b01c086b32cb4ff000828180e68113000beed25a0124da08fa682ccb46a26b5ab25478fe0ff3b029dd0f5fb5c0742aa30b509b63ade843d27b499b7b1d56eb4de; abqme=true; akavpau_p2=1689530519~id=abbb38afd21da5c5fd4b7c9ed1ec2f3f', 
                'device_profile_ref_id': '_FNcA8dAI7sS_0K_R67OPaaAhuD84BUVwfqh', 
                'ip-referer': 'https://www.walmart.com/shop/deals/flash-picks?athcpid=eeb79392-2a4b-463f-9b5a-f0da85fa4b7f&athpgid=AthenaGlassHomePageDesktopV1&athznid=athenaModuleZone&athmtid=AthenaItemCarousel&athtvid=3&athena=true', 
                'is-variant-fetch': 'false', 
                'referer': product_url,
                'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"', 
                'sec-ch-ua-mobile': '?0', 
                'sec-ch-ua-platform': '"macOS"', 
                'sec-fetch-dest': 'empty', 
                'sec-fetch-mode': 'cors', 
                'sec-fetch-site': 'same-origin', 
                'traceparent': '00-544629bc318cf2fdeab2c7f886bd2317-efc1c259958de621-00', 
                'traffic-type': 'Internal', 
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36', 
                'wm_mp': 'true', 
                'wm_page_url': product_url,
                'wm_qos.correlation_id': 'IljgfBEhKZ1MPUXLDqJiCxXjZFeI-rEpXD67', 
                'x-apollo-operation-name': 'ItemById', 
                'x-enable-server-timing': '1', 
                'x-latency-trace': '1', 
                'x-o-bu': 'WALMART-US', 
                'x-o-ccm': 'server', 
                'x-o-correlation-id': 'IljgfBEhKZ1MPUXLDqJiCxXjZFeI-rEpXD67', 
                'x-o-gql-query': 'query ItemById', 
                'x-o-item-id': pid, 
                'x-o-mart': 'B2C', 
                'x-o-platform': 'rweb', 
                'x-o-platform-version': 'main-1.85.0-5bc8f3-0713T0626', 
                'x-o-segment': 'oaoh'
            },
        }
        
    }
    

    

}

export {Walmart};









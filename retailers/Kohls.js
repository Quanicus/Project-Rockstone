import Retailer from "../src/retailer.js";

class Kohls extends Retailer {

    static domain = "https://www.kohls.com";
    static get_sales_page_req_config(page_num = 1) {
        const item_num = (page_num - 1) * 48;
        return {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://www.kohls.com/catalog/sale.jsp?CN=Promotions:Sale&BL=y&cc=sale-TN1.0-S-Sale&sks=true&spa=5&kls_sbp=09104379306908147910053417474872212740&PPP=48&WS=${item_num}&S=1&ajax=true&gNav=false`,
            headers: { 
            'authority': 'www.kohls.com', 
            'accept': 'application/json, text/javascript, */*; q=0.01', 
            'accept-language': 'en-US,en;q=0.9', 
            'cookie': 'store_location=72949; akaalb_aem_homepage=~op=aem_production:aem_production|~rv=22~m=aem_production:0|~os=554fb49c1bda6073578f281b62264a0e~id=cce016efd8273a01216a19bc94d407da; AKA_HP2Redesign=True; AKA_PIQ=True; AKA_ACM=True; AKA_CDP2=True; AKA_STP=false; AKA_PDP2=True; AKA_HP2=True; AKA_CNC2=True; AKA_RV6=19; AKA_RV8=67; AKA_RV4=20; AKA_RV5=24; AKA_RV3=29; AKA_RV=93; AKA_RV2=27; _dyid_server=Dynamic Yield; akacd_www-kohls-com-mosaic-p2=2177452799~rv=52~id=04c4bf0d5bd682ff80e45162fef35430; PIM-SESSION-ID=upTqSh7YTVv0Foys; at_check=true; AMCVS_F0EF5E09512D2CD20A490D4D%40AdobeOrg=1; K_favstore=72903|456|FORT SMITH|geo|; _dy_csc_ses=t; _dy_c_exps=; s_cc=true; kls_p=true; _dy_c_att_exps=; s_stv=non-search; pdpUrl=; 362fd180cb7a77f64919ee892a4d9d35=7c9f20381977d411537a1c823dcd84b5; spa=5; mboxEdgeCluster=34; X-SESSIONID=b67839bd-19ce-45ce-ba8e-d962121152c4; VisitorId=b67839bd-19ce-45ce-ba8e-d962121152c4; bm_mi=98BD4E72C54B893A1D14150B1B8FD336~YAAQTWTNF0ZSUIeKAQAA4BHFrRVvBxsEcHzBnFT8YIcsrtRUEV1Z0HNBKZoMTLK6VgbpwAkzq6zdVGsZ+WxtpNJndOpcN235kO+qNGpCI0NrcM39cVOUicKenE+Ma1OBuTa6M19Ud6/TAIciuns0OvH0+P/RzGCz8qreXQO76yVnvLUZZoJVn7q7/Phr3SfkDURfkXTlpaym/TRqNXi6cwExBrz369oTfsnlt5W+70TyZIJMVSkpG3nHe5OpavmjEcQbfzTNWFK+LAkzEvu3qFqom/neanyDflVowD7E18ClCUIc/rC2rSQz2ObTkYWDirTmq+NYOjjc+Aa638SKwbVR~1; dtCookie=v_4_srv_14_sn_A1EFEB827F7B5F4EDF89D90D9EDCDA71_perc_100000_ol_0_mul_1_rcs-3Acss_0; visualnavCheck=false; bm_sv=28E458CDC0D53196CC4F16AC133E148E~YAAQTWTNF2RSUIeKAQAAUCDFrRWoXHKS4rD39yBpNSb11cGd4a/cG5db6p6jNHtWauwSnZb7Yfhwv2q0uyWjxa99OpJ373OJLdxdPaJzj/f6wHfOweheubsVQcshrJzdeab9KHixvwjs5mb1ZmygK0d0R3E+le9sIegXSIqA/OwXHb691tRnxF5hEuM4SwfF3/Vgnzgyq6zFexoPBxaYqEsq1cEEenZ5guV2Qd+00itlPJjCjzXTXnF8qYAn6smO~1; gpv_v9=Sale; pmplocationhref=https%3A%2F%2Fwww.kohls.com%2Fcatalog%2Fsale.jsp%3FCN%3DPromotions%3ASale%26BL%3Dy%26cc%3Dsale-TN1.0-S-Sale%26PPP%3D48%26WS%3D48%26S%3D1%26sks%3Dtrue%26spa%3D5%26kls_sbp%3D09104379306908147910053417474872212740; s_sq=%5B%5BB%5D%5D; akavpau_www=1695133064~id=76321a5d10310b69d58bcce5b03a0914; ak_bmsc=74E45F17A3E77D29C91BE446DB26BF35~000000000000000000000000000000~YAAQTWTNF1lTUIeKAQAAmErJrRU51d7RL6Fm8DyZlpFRt957FhHi9FsRv7r5IU5tF8QLChDqEbBzeTAdbIgI6MrUme9LEw0c3yMWji4BHWpO0RQECDhbcvoyLBCDG34O4F5zL+ISiWujtX3VQzdlMAWJkbsWh0KfM7Xaeojl8nT88Hz5TcZOwWAduS/v+SExLBjR1zkVY04xdT7sz5OuKWjkDlx+1cZzDtUht5WsCPnROcH8zHRIt0iNkreTVjrFNfE6ztIJNLbDU1UJ44rYRN7UpImM5GX9AgQBjtmlZN0dpor6rfR32CpEPjVO2NWuahBWbCpBx8F8nBmiyeJvAlTJoHkJ9yI9Yop1ihY2n9So+ceMO1bLiO5eV5zfPqUKLQD5aYn28EfZrfZw3pRrGZmjif8+8cZl5haXWT0ihp3wtHtoqbo1LbCZpT6N/EGrWzp6enZ6G0cp8gU1LdwZV+A4ffMuLcNpU2Esv7ltPxWm5dcz4Dsj6+ypXvzLKoznJcJaDfpHIcsO/3lGPoI+XUuJvG6Af/n5WgXFdwpAGa1CpeORD2z1+V7sfPbNtVPLOAGvsIfKaQECQCBAxQKfo6OLQdk=; bm_sz=9D37590DA3617DF3AD536804A54FD350~YAAQTWTNF1pTUIeKAQAAmErJrRVk0D5ukSKI5lwcCpQxFM1NU892phTBHYet5X1WAXS4u4ygRA99EwVIL6X5Ga7mPfgdHFQnhmjIoeIwfe7SZHn1fkpMiIOIdQ5B/e0ekTlhLDD/4a73ET/RlEJSwS7W0UNwwSDUlA16zoFtYvIw0U7daOtWh+fObcU58OK4MfHJpcgi9HeL0nmLQ2LTkslM/Z5QwvQf6aDWb7u6zMxYIJ166pdYneYUJmDUnW2+hheRhRwCeDhIi06/ASD/YPVj8z41R95aQ44qjf7dSM2AEI5t9CF8hSjhisL2qIfYEBcmOc1G7hA9AqqDVQvJwPgudQ56XY1G/DHDBO/S5pT5pTbajC6XlQ8YV/8+qzKFnsiAPUIlPF4HpVhCmYxSFh2QmbBjD3YFdX38OnwQQeLxyCvo5t3XL0laiX7gOYK7GmqW5pHpR2r+vxJoTsONM1Pc31HtwhxvlHAuaeLTIW1EJCRLHA==~3748144~3683636; _dy_ses_load_seq=84663%3A1695132765959; _dy_soct=561158.1083346.1695132441*577704.1114257.1695132441*785673.1487461.1695132441*824118.1600217.1695132444*604242.1165732.1695132765*664718.1276830.1695132765*675999.1296928.1695132765*695696.1330231.1695132765*707338.1351316.1695132765*546795.1053981.1695132765; OptanonConsent=isGpcEnabled=0&datestamp=Tue+Sep+19+2023+09%3A12%3A46+GMT-0500+(Central+Daylight+Time)&version=202306.1.0&browserGpcFlag=0&isIABGlobal=false&hosts=&consentId=ee570027-8c7c-4c84-bcd0-97f4f7261fad&interactionCount=0&landingPath=https%3A%2F%2Fwww.kohls.com%2Fcatalog%2Fsale.jsp%3FCN%3DPromotions%3ASale%26BL%3Dy%26cc%3Dsale-TN1.0-S-Sale%26PPP%3D48%26WS%3D48%26S%3D1%26sks%3Dtrue%26spa%3D5%26kls_sbp%3D09104379306908147910053417474872212740&groups=C005%3A1%2CC0001%3A1%2CC0003%3A1%2CC006%3A1%2CC0004%3A1%2CC0002%3A1; evarRefinementValues=; productnum=12; _abck=8AB794BA3E81A7056992B21442F47D0F~-1~YAAQTWTNF2hTUIeKAQAAgVLJrQqOeVhysUiD9JQ3N73WXE/dObxBYPrnqFBr+LBggMWwzqFocCfOIcTs3e8uxFG6zTpQG/If6NM34RjuzFH3ztd0tlfZxsLM0p0lwtUy1uGRvhIbg+iYTnVtt/JnJ5/Z2QnzznBhnljb7nvQSpPq1cFTF0m6/XME5QttjQO8MVk00An1J+z/59z8+Ke9MIRw9kjgd1pfpgLQ7h3y5TxPEOubaurT5nT1vzwC38HU0my60cQ15D6fWEWbp0kZYpz4a8h+pkaWA8z9Uxd9h87bUcGDo/7ExZv4sQAa2DurB7PeVc9YFaj/q6HNULGtfaOo+1zcWzmwzbruf7hdPG2GsUOZu0w3YFX+D8drmG+LHIin/dngiWFVXkgwFA13JXvaGwSaXqx16Y+lop7UDTCVY+cdk4fT32Bib4k3xnilbHJ1CY3XxDND3uGHw/DoTF1yy2gC10F7fuFDRIVxnOfFHHd/3S44NNYX5GsBT55x6VCWFi5eNU9NHmfgCTjMFNCyF+ei~-1~-1~1695136361; AMCV_F0EF5E09512D2CD20A490D4D%40AdobeOrg=1585540135%7CMCIDTS%7C19620%7CMCMID%7C09104379306908147910053417474872212740%7CMCAID%7CNONE%7CMCOPTOUT-1695139968s%7CNONE%7CvVersion%7C4.4.0; mbox=PC#8d32bdb0b46c43d18e87f57d224e721e.34_0#1758377569|session#7cc6e65ae3514b1ca4bdd74114687f42#1695134629; _abck=8AB794BA3E81A7056992B21442F47D0F~-1~YAAQjRVdaAWKAI+KAQAALajNrQosgzRyOatuPtiD/ncGd8a/5pyZZC5ZBckTWyrcRjQ0iBXzIyDDkMpcpWUmoib/nAXUXg5XpAG/NvnLO/pym7w1WCN5HMayXUPP5C/S5u4Ynu2XtJUDl+iUjqT6xoAFUtntlBfupoqhuynWbsIicC+9pln06pytuuEutty3XmAlTgyOxTanzvB2kRwp03SoSJytMpaP68/6fmRONEBScDxnkNLAGCECJLEq/TCeKGyTYiqtZxETLNrQEAerE3f0f8ulz4TuAydhw67oO7iwpNcbyxnwStrAhH+qyq2EU3PTODtpdTtsrHcZ2MIxnhMrY7qFpic5gWuZ9HXeOKzBZu1vFRITUMgCEXGict5cItYncYacqfVWvdr2xdCxjLpsoIg8yQg2ypIaZYLCXCWL9oFJjFRhVpMmgonJcxl553lhOgtVkhOF1QauE/x6w97RUO40vhF+o9VxftecTV/7iXSHg7bunwDAqvAMKSWYMNjWqx7gujL9gW2CHwKwfsMcQSWe~0~-1~1695136361; _dyid_server=Dynamic Yield; AKA_STP=false; akavpau_www=1695133350~id=fb6ecf33eaa30d7ca32a2203acfd1793', 
            'referer': 'https://www.kohls.com/catalog/sale.jsp?CN=Promotions:Sale&BL=y&cc=sale-TN1.0-S-Sale&PPP=48&WS=48&S=1&sks=true&spa=5&kls_sbp=09104379306908147910053417474872212740', 
            'sec-ch-ua': '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"', 
            'sec-ch-ua-mobile': '?0', 
            'sec-ch-ua-platform': '"macOS"', 
            'sec-fetch-dest': 'empty', 
            'sec-fetch-mode': 'cors', 
            'sec-fetch-site': 'same-origin', 
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36', 
            'x-requested-with': 'XMLHttpRequest'
            }
        }
    }

    static parse_sales_response(response) {
        const raw_products = response.data.products;
        const products = raw_products.map(product => {
            let data = {};
            data.name = product.productTitle;
            data.price = product.yourPriceInfo.yourPrice;
            data.url = this.domain + product.seoURL;
            data.pid = product.webID;
            return data;
        });
        return products;
    }

    static parse_max_page_response(response) {
        //return response.data.totalPages;
        return 60;
    }

    static async scrape_sales() {
        return await this.scrape_products_from_sales_pages(this.get_sales_page_req_config);
    }

    static get_menu_options(){
        return {Sales: "scrape_sales"};
    }
}

export {Kohls};
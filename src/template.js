import ejs from "ejs";
class Template {

    static render_product_card (product) {
        // Use ejs.renderFile to render your EJS template
        return ejs.renderFile('./views/product_card.ejs', { product });
    };
    static retailer_dropdown(retailer_list) {
        let html = 
            `<select name="retailer" 
                hx-post="/retailer_menu" 
                hx-swap="innerHTML" 
                hx-trigger="change" 
                hx-target="#menu">
                    <option disabled selected>Choose a retailer</option>`;
        retailer_list.forEach(retailer => {
            html += `<option value="${retailer}">${retailer}</option>`
        });
        html += `</select>`

        return html;
    }

    static menu_button(value, text_content) {
        text_content = text_content || value;
        let html = 
            `<button name="selection" 
            type="button" 
            value="${value}"
            hx-post="/menu_selection"
            hx-swap="innerHTML"
            hx-target="#menu">
                ${text_content}
            </button>`
        return html;
    }
}

export default Template;
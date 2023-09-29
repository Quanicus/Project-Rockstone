import ejs from "ejs";
class Template {

    static render_product_card (product) {
        // Use ejs.renderFile to render your EJS template
        return ejs.renderFile('./views/product_card.ejs', { product });
    };
    

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
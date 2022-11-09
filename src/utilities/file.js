const path = require('path');

const DIR = path.join(__dirname,"");

const fs = require('fs');

module.exports = {

    loadTemplate : (template)=>{

        let TEMPLATE_DIR = (DIR.split('src')[0] + "src")+"/templates/";

        let filePath = TEMPLATE_DIR + template.replace('.','/') + ".html";

        const content = fs.readFileSync(filePath).toString();

        return content;
    }
};
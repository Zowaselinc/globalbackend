const path = require('path');

const DIR = path.join(__dirname,"");

const fs = require('fs');


class TemplateHelper{

    constructor(){

    }

    static parseDataToTemplate(templateString,data){
        var keys = Object.keys(data);
        keys.forEach((variable)=>{
            templateString.replace(`{{${variable}}}`,data[variable]);
        });
        return templateString;
    }
}

module.exports = {

    loadTemplate : (template, data = {})=>{

        let TEMPLATE_DIR = (DIR.split('src')[0] + "src")+"/templates/";

        let filePath = TEMPLATE_DIR + template.replace('.','/') + ".html";

        const content = fs.readFileSync(filePath).toString();

        return TemplateHelper.parseDataToTemplate(content,data);
    }
};
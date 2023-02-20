const path = require('path');

const DIR = path.join(__dirname,"");

const fs = require('fs');


class TemplateHelper{

    constructor(){

    }

    static parseDataToTemplate(templateString,data,parent = ""){
        var keys = Object.keys(data);
        keys.forEach((variable)=>{
            if(typeof data[variable] == "object"){
                templateString = TemplateHelper.parseDataToTemplate(templateString,data[variable],`${parent}${variable}.`);
            }else{
                templateString = templateString.replace(`{{${parent}${variable}}}`,data[variable]);
            }
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
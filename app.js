function extractClassName(input) {
    let re = /class\s+([a-zA-Z_]+)\s*.*/;
    let m = re.exec(input);
    return capitalizeFirstLetter(m[1]);
}

function extractRawFields(input) {
    let re = /.*\s*{(.*)}\s*.*/;
    let m = re.exec(input);
    return m[1];
}

function extractFields(rawFields) {
    let fields = [];
    rawFields = rawFields.split(";");
    if (rawFields[rawFields.length - 1].trim().length == 0) {
        rawFields.pop();
    }
    for (const fieldItem of rawFields) {

        fields.push(extractSingleField(fieldItem));
    }
    return fields;
}

function extractSingleField(rawField) {
    rawField = rawField.split(":");
    return rawField[0]
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

//   project.name = projectJSON.name;
function generateParsingFields(fields, className) {
    let res = "";
    className = className.toLowerCase();
    for (const fieldItem of fields) {
        res += `${className}.${fieldItem} = ${className}JSON.${fieldItem};`;
    }
    return res;
}

function generateParsingFieldsToJSON(fields, className) {
    let res = "";
    className = className.toLowerCase();
    for (const fieldItem of fields) {
        res += `${fieldItem} : ${className}.${fieldItem},\n`;
    }
    res = res.trim().substring(0, res.length - 2);
    return res;
}

function generateFromJSON(fields, className) {
    let lowerClassName = className.toLowerCase();
    let parsingFields = generateParsingFields(fields, className);
    let res = `static fromJSON(${lowerClassName}JSON:any) {
        let ${lowerClassName}:${className} = new ${className}();
        ${parsingFields}
        return ${lowerClassName};
    }`;

    return res;
}

function generateFromJSONarray(className) {
    let lower = className.toLowerCase();
    let res = `
        static fromJSONArray(${lower}JSONArray: any) {
            let ${lower}s: ${className}[] = [];
            for (const ${lower}Item of ${lower}JSONArray) {
                ${lower}s.push(this.fromJSON(${lower}Item));
            }
            return ${lower}s;
        }
    `
    return res;
}

function generateToJSON(fields, className) {
    let lowerClassName = className.toLowerCase();
    let parsingFields = generateParsingFieldsToJSON(fields, className);
    let res = `
    static toJSON(${lowerClassName}:${className}) {
        return {
             ${parsingFields}
        };
    }`;

    return res;
}


function generatetoJSONarray(className) {
    let lower = className.toLowerCase();
    let res = `
    static toJSONArray(${lower}s: ${className}[]) {
        let ${lower}sJSON:any = [];
        for (const ${lower}Item of ${lower}s) {
            ${lower}sJSON.push(this.toJSON(${lower}Item));
        }
        return ${lower}sJSON;
    }`

    return res;
}

let input = `class Fesse{taille:string="";age:number=45;email:string="";size:number=47;}`;
let rawFields = extractRawFields(input);
let fields = extractFields(rawFields);
let className = extractClassName(input);
console.log(generateToJSON(fields, className));

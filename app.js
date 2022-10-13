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
    rawFields.pop();
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


let rawFields = extractRawFields(`class seins{taille:string="";age:int=45;}`);
let fields = extractFields(rawFields);
console.log(fields);
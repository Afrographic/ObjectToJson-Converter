function extractClassName(input) {
    let re = /class\s+([a-zA-Z_]+)\s*.*/;
    let m = re.exec(input);
    return m[1];
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
        res += `${className}.${fieldItem} = ${className}_json.${fieldItem};\n`;
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
    let res =
        `static from_json(${lowerClassName}_json:any) {
        let ${lowerClassName}:${className} = new ${className}();
        ${parsingFields}
        return ${lowerClassName};
    }`;

    return res;
}

function generateFromJSONarray(className) {
    let lower = className.toLowerCase();
    let res = `
        static from_json_array(${lower}_json_array: any) {
            let ${lower}Array: ${className}[] = [];
            for (const ${lower}Item of ${lower}_json_array) {
                ${lower}Array.push(this.from_json(${lower}Item));
            }
            return ${lower}Array;
        }
    `
    return res;
}

function generateToJSON(fields, className) {
    let lowerClassName = className.toLowerCase();
    let parsingFields = generateParsingFieldsToJSON(fields, className);
    let res = `
    static to_json(${lowerClassName}:${className}) {
        return {
             ${parsingFields}
        };
    }`;

    return res;
}

function generate_clone(fields, className) {
    let lowerClassName = className.toLowerCase();
    let clone_fields = generate_fields_to_clone(fields, className);
    let res = `
    clone():${className} {
        let ${lowerClassName}:${className} = new ${className}();
        ${clone_fields}
        return  ${lowerClassName};
    }`;

    return res;
}

function generate_fields_to_clone(fields, className) {
    let res = "";
    className = className.toLowerCase();
    for (const fieldItem of fields) {
        res += `${className}.${fieldItem} = this.${fieldItem};\n`;
    }
    res = res.trim().substring(0, res.length - 2);
    return res;
}


function generateToJSONarray(className) {
    let lower = className.toLowerCase();
    let res = `
    static to_json_array(${lower}s: ${className}[]) {
        let ${lower}_json_array:any = [];
        for (const ${lower}Item of ${lower}s) {
            ${lower}_json_array.push(this.to_json(${lower}Item));
        }
        return ${lower}_json_array;
    }`

    return res;
}

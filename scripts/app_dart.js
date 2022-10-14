class Field {
    constructor(type, label) {
        this.type = type;
        this.label = label;
    }
}

function validDartClassSchema(dartClassSchema) {
    dartClassSchema = dartClassSchema.trim();
    return /^(class|Class)\s+[a-zA-Z_]+\s*{\s+((int|double|bool|String)\??\s+[a-zA-Z_0-9]+;\s*)+\s*}\s*/.test(dartClassSchema);
}


function extractClassName_dart(dartClassSchema) {
    let re = /(class|Class)\s+([a-zA-Z_]+).*/;
    let m = re.exec(dartClassSchema);
    return capitalizeFirstLetter(m[2]);
}

function extractFields_dart(dartClassSchema) {
    dartClassSchema = addCloseAccoladeifWasNotGiven(dartClassSchema);
    dartClassSchema = dartClassSchema.replaceAll(/\s+/g, " ");
    let re = /^(class|Class)\s+[a-zA-Z_]+\s*{(.*)}\s*/;
    let m = re.exec(dartClassSchema.trim());
    return m[2];
}


function addCloseAccoladeifWasNotGiven(schema) {
    if (schema.includes("}")) {
        return schema;
    }
    schema += '}';
    return schema;
}


function parseFieldsStringToFieldObject(fieldString) {
    let fieldsObjectsArray = [];
    fieldString = fieldString.replaceAll(/\s+/g, " ");
    fieldString = fieldString.split(";");
    fieldString.pop();

    fieldString.forEach(element => {
        fieldsObjectsArray.push(convertToFieldObject(element))
    });

    return fieldsObjectsArray;
}

function convertToFieldObject(fieldStringItem) {
    fieldStringItem = fieldStringItem.trim().split(" ");
    return new Field(fieldStringItem[0], fieldStringItem[1]);
}


// Code generator functions

function generateFromJSON_dart(fields, className) {
    let lowerClassName = className.toLowerCase();
    let parsingFields = generateParsingFields_dart(fields, lowerClassName);
    let res = `
    static ${className} fromJSON(${lowerClassName}JSON) {
        return ${className}(
            ${parsingFields}
        );
    }`;

    return res;
}

function generateParsingFields_dart(fields, lowerClassName) {
    let res = "";
    for (const fieldItem of fields) {
        res += `${fieldItem.label} : ${lowerClassName}JSON["${fieldItem.label}"],\n`;
    }
    return res;
}

function generateFromJSONarray_dart(className) {
    let lower = className.toLowerCase();
    let res = `
        static List<${className}> fromJSONArray(${lower}JSONArray) {
            List<${className}> ${lower}Array = [];
            for (var ${lower}Item in ${lower}JSONArray) {
                ${lower}Array.add(fromJSON(${lower}Item));
            }
            return ${lower}Array;
        }
    `
    return res;
}

function generateToJSON_dart(fields, className) {
    let lowerClassName = className.toLowerCase();
    let parsingFields = generateParsingFieldsToJSON_dart(fields, lowerClassName);
    let res = `
    static dynamic toJSON(${className} ${lowerClassName}) {
        Map<String,dynamic> data = HashMap();
        data.addAll({
            ${parsingFields}
        });
        return data;
    }`;

    return res;
}

function generateParsingFieldsToJSON_dart(fields, lowerClassName) {
    let res = "";
    for (const fieldItem of fields) {
        res += `"${fieldItem.label}" : ${lowerClassName}.${fieldItem.label},\n`;
    }
    return res;
}


function generateToJSONarray_dart(className) {
    let lower = className.toLowerCase();
    let res = `
    static dynamic toJSONArray(List<${className}> ${lower}Array) {
        List<Map<String, dynamic>> ${lower}JSONArray = [];
        for (${className} ${lower} in ${lower}Array) {
            ${lower}JSONArray.add(toJSON(${lower}));
        }
        return ${lower}Array;
    }`

    return res;
}

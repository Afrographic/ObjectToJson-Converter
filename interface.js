let res = "";

/*
class Process{
    title: string;
    type: ProcessTypes;
    path: string;
    created_date: string;
}
*/

function generate() { 
    let input = document.querySelector("#input").value;
    // remove long spaces
    input = input.replaceAll(/\s+/g, " ");
    console.log(input);
    let rawFields = extractRawFields(input);
    let fields = extractFields(rawFields);
    let className = extractClassName(input);
    // Launch generator
    let toJSON = generateToJSON(fields, className);
    let toJSONarray = generateFromJSONarray(className);
    let fromJSON = generateToJSON(fields, className);
    let fromJSONarray = generatetoJSONarray(className);

    res = `
    ${toJSON}
    ${toJSONarray}
    ${fromJSON}
    ${fromJSONarray}
    `
    document.querySelector("#result").value = res;
}

async function copy() {
    await navigator.clipboard.writeText(res);
    alert("Note copier avec succes");
}
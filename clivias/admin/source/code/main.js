const serverURL = "https://xcliviabackend-production.up.railway.app"
const apiURL = serverURL + "/api"

var API_KEY = "" // received later

const form = document.getElementById("myForm");

const plantName = document.getElementById("name");
const description = document.getElementById("description");

const mainImage = document.getElementById("mainImage");
const extraImg1 = document.getElementById("extraImage1");
const extraImg2 = document.getElementById("extraImage2");

const className = document.getElementById("class");
const fatherName = document.getElementById("fatherName");
const motherName = document.getElementById("motherName");
const showsWon = document.getElementById("showsWon")

const purchaseable = document.getElementById("purchaseable");
const featured = document.getElementById("featured");

const deleteForm = document.getElementById("deleteForm");
const deletePlantName = document.getElementById("deletePlantName");

async function postAPI(command, payload) {
    console.log(API_KEY)
    const data = {
        command: command,
        apikey: API_KEY,
        payload: payload
    }

    return await axios.post(apiURL, data)
}

async function getAPI(command) {
    return await axios.get(apiURL, { headers: { apikey: API_KEY, command: command } })
}

const results = await getAPI("get_clivia")
console.log(results)

const readCsvButton = document.getElementById('read-csv-button');
readCsvButton.addEventListener('click', readCSV);

function parseCSV(csvText) {
    const rows = csvText.split('\n');
    const headers = rows[0].split(',');
    const data = [];

    for (let i = 1; i < rows.length; i++) {
        const values = rows[i].split(',');
        const row = {};

        for (let j = 0; j < headers.length; j++) {
            const key = headers[j].trim();
            let value = values[j] ? values[j].trim() : null;
            if (value) { if (value.toLowerCase() == "no") { value = false } else if (value.toLowerCase() == "yes") { value = true } }
            row[key] = value;
        }

        if (Object.values(row).some(value => value !== null)) {
            data.push(row);
        }
    }

    return data;
}

function readCSV() {
    const input = document.getElementById('csv-file');
    const file = input.files[0];

    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = async function () {
        const csvText = reader.result;
        console.log(csvText); // Raw CSV text
        console.log(parseCSV(csvText))

        const parsedData = parseCSV(csvText)
        await postAPI("set_clivias", parsedData)
    };
}

function displayTable(data) {
    const container = document.getElementById('table-container');
    container.innerHTML = '';

    if (data.length === 0) {
        container.innerText = 'No data to display';
        return;
    }

    const table = document.createElement('table');

    // Create table header row
    const headerRow = document.createElement('tr');
    for (const key in data[0]) {
        const th = document.createElement('th');
        th.innerText = key;
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);

    // Create table data rows
    for (const row of data) {
        const dataRow = document.createElement('tr');
        for (const key in row) {
            const td = document.createElement('td');
            td.innerText = row[key];
            dataRow.appendChild(td);
        }
        table.appendChild(dataRow);
    }

    container.appendChild(table);
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function (event) {
        const csvText = event.target.result;
        const data = parseCSV(csvText);
        displayTable(data);
    };
}

const fileInput = document.getElementById('csv-file');
fileInput.addEventListener('change', handleFileSelect);

async function button(id) {
    if (id == "password_submit") {
        const password = document.getElementById("admin_password").value;
        const result = await axios.get(apiURL, { headers: { password: password, command: "get_auth" } })

        console.log(result)

        if (result.status == 200 && result.data.status == 200 && result.data.payload.apikey != null) {
            API_KEY = result.data.payload.apikey
            document.getElementById("overlay").remove()
        }

    } else if (id == "form_submit") {
        const nameValue = plantName.value
        const descriptionValue = description.value

        const mainImageValue = mainImage.value
        const extraImg1Value = extraImg1.value
        const extraImg2Value = extraImg2.value

        const classNameValue = className.value
        const fatherNameValue = fatherName.value
        const motherNameValue = motherName.value
        const showsWonValue = showsWon.value

        const purchaseableValue = purchaseable.checked
        const featuredValue = featured.checked

        console.log({
            Name: nameValue,
            Description: descriptionValue,

            Image0: mainImageValue,
            Image1: extraImg1Value,
            Image2: extraImg2Value,

            Class: classNameValue,
            FatherName: fatherNameValue,
            MotherName: motherNameValue,
            ShowsWon: showsWonValue,

            Purchaseable: purchaseableValue,
            Featured: featuredValue,
        })

        await postAPI("push_clivia", {
            Name: nameValue,
            Description: descriptionValue,

            Image0: mainImageValue,
            Image1: extraImg1Value,
            Image2: extraImg2Value,

            Class: classNameValue,
            FatherName: fatherNameValue,
            MotherName: motherNameValue,
            ShowsWon: showsWonValue,

            Purchaseable: purchaseableValue,
            Featured: featuredValue,
        })

        console.log("sent")

        const results = await getAPI("get_clivia")
        console.log(results)
    } else if (id == "form_delete") {
        const nameValue = deletePlantName.value

        console.log({
            Name: nameValue,
        })

        await postAPI("delete_clivia", {
            Name: nameValue,
        })

        console.log("sent")

        const results = await getAPI("get_clivia")
        console.log(results)
    }
}

// form.addEventListener("submit", (e) => {
//     e.preventDefault();
//     if (plantName.value === "" || description.value === "" || mainImage.value === "" || className.value === "" || fatherName.value === "" || motherName.value === "") {
//         alert("Please fill in all required fields and select purchaseable checkbox");
//     } else {
//         //form is valid, you can submit it here
//         button("form_submit")
//     }
// });

// deleteForm.addEventListener("submit", (e) => {
//     e.preventDefault();
//     if (deletePlantName.value === "") {
//         alert("Please fill in all required fields and select purchaseable checkbox");
//     } else {
//         //form is valid, you can submit it here
//         button("form_delete")
//     }
// });

document.getElementById("password_submit").onclick = function () { button("password_submit") };
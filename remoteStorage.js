function onloadFunc() {
    console.log("test");
    loadData("results");
    console.log(loadData());
}

const BESE_URL = "https://pokeapi.co/api/v2/pokemon?limit=5&offset=0";

async function loadData(path = "") {
    let response = await fetch(BESE_URL + path + ".json");
    return responseToJson = await response.json();
 } 
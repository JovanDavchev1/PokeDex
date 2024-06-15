const BASE_URL = "https://pokeapi.co/api/v2/pokemon";
let LIMIT = 30;
const offset = 0;

async function onloadFunc() {
    console.log("Page loaded");
    let data = await loadData(); 
    console.log("Initial data:", data);
    displayPokemonList(data.results);
}

async function loadData(limit = LIMIT, offset = 0) {
    let url = `${BASE_URL}?limit=${limit}&offset=${offset}`;
    let response = await fetch(url);
    if (response.ok) {
        return await response.json();
    } else {
        console.error('Network response was not ok ' + response.statusText);
        throw new Error('Failed to load data');
    }
}

async function showMore() {
    LIMIT = LIMIT + 30;
    let url = `${BASE_URL}?limit=${LIMIT}&offset=${offset}`;
    console.log(url);
    let data = await loadData(LIMIT, offset);
    console.log("More data:", data);
    displayPokemonList(data.results);
}

async function displayPokemonList(pokemonList) {
    const pokedex = document.getElementById('pokedex');
    pokedex.innerHTML = '';
    for (let i = 0; i < pokemonList.length; i++) {
        let pokemon = pokemonList[i];
        let pokemonDetails = await loadPokemonDetails(pokemon.url);
        const pokemonElement = document.createElement('div');
        pokemonElement.className = 'pokemon';
        pokemonElement.innerHTML = `
            <div class="number">#${i + 1}</div>
            <div class="elementPokemon">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i + 1}.png" alt="${pokemon.name}">
            </div>
            <div class="name">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</div>
            <div class="type">${pokemonDetails.types.map(typeInfo => typeInfo.type.name).join(', ')}</div>
        `;
        elementType(pokemonDetails, pokemonElement);
        pokemonElement.onclick = () => displayPokemonDetails(pokemonDetails);
        pokedex.appendChild(pokemonElement);
    }
}

async function loadPokemonDetails(url) {
    let response = await fetch(url);
    if (response.ok) {
        return await response.json();
    } else {
        console.error('Network response was not ok ' + response.statusText);
        throw new Error('Failed to load Pokémon details');
    }
}

function displayPokemonDetails(pokemon) {
    const details = document.getElementById('details');
    detailsInHtml(details, pokemon);
    $('#pokemonModal').modal('show');
}

function searchPokemon() {
    let searchInput = document.getElementById('searchInput').value.trim().toLowerCase();
    let pokemonElements = document.querySelectorAll('.pokemon');
    pokemonElements.forEach(pokemonElement => {
        let pokemonName = pokemonElement.querySelector('.name').textContent.toLowerCase();
        if (pokemonName.includes(searchInput)) {
            pokemonElement.style.display = 'block';
        } else {
            pokemonElement.style.display = 'none';
        }
    });
}

function detailsInHtml(details, pokemon) {
    let types = '';
    pokemon.types.forEach(typeInfo => {
        types += `${typeInfo.type.name}, `;
    });
    types = types.slice(0, -2);

    details.innerHTML = `
        <div class="text-center">
            <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
            <img src="${pokemon.sprites.front_default}" class="img-fluid" alt="${pokemon.name}">
            <p class="mt-3">Height: ${pokemon.height}</p>
            <p>Weight: ${pokemon.weight}</p>
            <p>Type: ${types}</p>
        </div>
    `;
}

function elementType(pokemon, pokemonElement) {
    const types = pokemon.types.map(typeInfo => typeInfo.type.name);
    if (types.includes("fire")) {
        pokemonElement.querySelector('.elementPokemon').classList.add('background-red');
    }
    if (types.includes("water")) {
        pokemonElement.querySelector('.elementPokemon').classList.add('background-water');
    }
    if (types.includes("poison")) {
        pokemonElement.querySelector('.elementPokemon').classList.add('background-pison');
    }
    if (types.includes("ground")) {
        pokemonElement.querySelector('.elementPokemon').classList.add('background-brown');
    }
    if (types.includes("grass")) {
        pokemonElement.querySelector('.elementPokemon').classList.add('background-green');
    }
}




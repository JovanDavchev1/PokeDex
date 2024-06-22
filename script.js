const BASE_URL = "https://pokeapi.co/api/v2/pokemon";
let LIMIT = 30;
const offset = 0;

async function onloadFunc() {
    console.log("Page loaded");
    showLoadingScreen();
    try {
        let data = await loadData();
        console.log("Initial data:", data);
        await displayPokemonList(data.results);
    } catch (error) {
        console.error(error);
    } finally {
        hideLoadingScreen();
        scrollToBottom()
    }
     
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
    showLoadingScreen();
    LIMIT += 30;
    try {
        let url = `${BASE_URL}?limit=${LIMIT}&offset=${offset}`;
        console.log(url);
        let data = await loadData(LIMIT, offset);
        console.log("More data:", data);
        await displayPokemonList(data.results);
    } catch (error) {
        console.error(error);
    } finally {
        hideLoadingScreen();
        scrollToBottom()
    }
}

async function displayPokemonList(pokemonList) {
    const pokedex = document.getElementById('pokedex');
    pokedex.innerHTML = '';
    for (let i = 0; i < pokemonList.length; i++) {
        let pokemon = pokemonList[i];
        let pokemonDetails = await loadPokemonDetails(pokemon.url);
        let pokemoonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1) 
        let type = pokemonDetails.types.map(typeInfo => typeInfo.type.name).join(', ')
        let typeBackground = pokemonDetails.types[0].type.name;
        const pokemonElement = document.createElement('div');
        pokemonElement.className = 'pokemon';
        pokemonElement.innerHTML = `
            <div class="number">#${i + 1}</div>
            <div class="elementPokemon bg_${typeBackground}">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i + 1}.png" alt="${pokemoonName}">
            </div>
            <div class="name">${pokemoonName}</div>
            <div class="type">${type}</div>
        `;
        
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

function showLoadingScreen() {
    document.getElementById('loadingScreen').classList.remove('d-none');
    document.getElementById('pokedex').classList.add('d-none');
}

function hideLoadingScreen() {
    document.getElementById('loadingScreen').classList.add('d-none');
    document.getElementById('pokedex').classList.remove('d-none');
}

function scrollToBottom() {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
    }
    
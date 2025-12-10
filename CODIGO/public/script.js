document.addEventListener("DOMContentLoaded", function () {

    // ==============================
    // VARIABLES Y ELEMENTOS COMUNES
    // ==============================
    const SLOTS_PER_BOX = 20;
    const MAX_BOXES = 10;
    const MAX_TEAM_SIZE = 6;

    const homeSection = document.getElementById("homeSection");
    const pokedexSection = document.getElementById("pokedexSection");
    const pcSection = document.getElementById("pcSection");
    const gachamonSection = document.getElementById("gachamonSection");
    const miEquipoSection = document.getElementById("miEquipoSection");

    const searchForm = document.getElementById("searchForm");
    const pokemonInput = document.getElementById("pokemonInput");
    const pokemonImage = document.getElementById("pokemonImage");
    const pokemonDescriptionDisplay = document.getElementById("pokemonDescription");
    const shinyButton = document.getElementById("shinyButton");
    const pokemonNameDisplay = document.getElementById("pokemonName");
    const pokemonGrid = document.getElementById("pokemonGrid");

    const pokedexSearchForm = document.getElementById("searchFormPokedex");
    const pokedexSearchInput = document.getElementById("pokemonInputPokedex");

    const customFilterTypes = document.getElementById("customFilterTypes");
    const customFilterGenerations = document.getElementById("customFilterGenerations");

    const boxGrid = document.getElementById("boxGrid");
    const boxName = document.getElementById("boxName");
    const prevBoxBtn = document.getElementById("prevBox");
    const nextBoxBtn = document.getElementById("nextBox");

    const coinCountDisplay = document.getElementById("coinCount");
    const gachamonButton = document.getElementById("gachamonButton");
    const gachamonResult = document.getElementById("gachamonResult");

    let shinySpriteUrl = "";
    let allPokemonData = [];

    let coins = parseInt(localStorage.getItem("coins")) || 10;

    let currentTypeFilter = null;
    let currentGenFilter = null;

    // ✅ PC ahora se carga desde BD, inicialmente vacío
    let pcBoxes = [];
    for (let i = 0; i < MAX_BOXES; i++) {
        pcBoxes.push(createNewBox());
    }
    let currentBoxIndex = 0;

    // ✅ Mi Equipo ahora se carga desde BD, inicialmente vacío
    let miEquipo = new Array(MAX_TEAM_SIZE).fill(null);

    // ==============================
    // NAVEGACIÓN DE SECCIONES
    // ==============================
    function hideSections() {
        homeSection.classList.add("d-none");
        pokedexSection.classList.add("d-none");
        pcSection.classList.add("d-none");
        gachamonSection.classList.add("d-none");
        miEquipoSection.classList.add("d-none");
    }

    function showSection(section) {
        hideSections();
        section.classList.remove("d-none");

        if (section === pcSection) {
            showCurrentBox();
            showPokemonInfoInPanel(null);
            const panel = document.getElementById("pcInfoPanel");
            if (panel) panel.classList.remove("d-none");
        }

        if (section === gachamonSection) {
            clearGachamonResult();
        }

        if (section === miEquipoSection) {
            renderTeam();
            showTeamPokemonInfo(null);
        }
    }

    function clearGachamonResult() {
        gachamonResult.innerHTML = '<p>Tira una moneda para obtener un Pokémon!</p>';
    }

    document.getElementById("logoHome").addEventListener("click", () => showSection(homeSection));
    document.getElementById("homeLink").addEventListener("click", () => showSection(homeSection));
    document.getElementById("pokedexLink").addEventListener("click", () => showSection(pokedexSection));
    document.getElementById("pcLink").addEventListener("click", () => {
        showSection(pcSection);
        showCurrentBox();
    });
    document.getElementById("gachamonLink").addEventListener("click", () => showSection(gachamonSection));
    document.getElementById("miEquipoLink").addEventListener("click", () => {
        showSection(miEquipoSection);
        renderTeam();
    });

    showSection(homeSection);

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // ==============================
    // POKEDEX SEARCH
    // ==============================
    pokedexSearchForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const query = pokedexSearchInput.value.trim().toLowerCase();

        if (!query) {
            applyFilters();
            return;
        }

        let filtered = allPokemonData

        if (currentTypeFilter && currentTypeFilter !== "ver-todos") {
            filtered = filtered.filter(pokemon =>
                pokemon.types.includes(currentTypeFilter)
            );
        }

        if (currentGenFilter && currentGenFilter !== "ver-todos") {
            const genRange = getGenerationRange(currentGenFilter);
            filtered = filtered.filter(pokemon =>
                pokemon.id >= genRange.start && pokemon.id <= genRange.end
            );
        }

        filtered = filtered.filter(pokemon =>
            pokemon.name.toLowerCase().includes(query) ||
            pokemon.id.toString() === query
        );

        if (filtered.length === 0) {
            pokemonGrid.innerHTML = "<p>No se encontró ningún Pokémon.</p>";
        } else {
            renderPokemonGrid(filtered);
        }
    });



    // ==============================
    // FUNCIÓN PARA OBTENER RANGOS DE GENERACIONES
    // ==============================
    function getGenerationRange(gen) {
        const ranges = {
            "ver-todos": { start: 1, end: 1025 },
            "1": { start: 1, end: 151 },
            "2": { start: 152, end: 251 },
            "3": { start: 252, end: 386 },
            "4": { start: 387, end: 493 },
            "5": { start: 494, end: 649 },
            "6": { start: 650, end: 721 },
            "7": { start: 722, end: 809 },
            "8": { start: 810, end: 905 },
            "9": { start: 906, end: 1025 }
        };
        return ranges[gen] || { start: 1, end: 1025 };
    }

    // ==============================
    // FILTRO POR TIPOS (MODIFICADO)
    // ==============================
    customFilterTypes.addEventListener('click', function (e) {
        const option = e.target.closest('.filter-option');
        if (!option) return;

        // Actualizar visualización de botones activos (solo tipos)
        document.querySelectorAll('#customFilterTypes .filter-option').forEach(opt =>
            opt.classList.remove('active')
        );
        option.classList.add('active');

        // Guardar el tipo seleccionado
        currentTypeFilter = option.getAttribute('data-type');

        // Aplicar ambos filtros
        applyFilters();
    });


    // ==============================
    // FILTRO POR GENERACIÓN (MODIFICADO)
    // ==============================
    customFilterGenerations.addEventListener("click", function (e) {
        const option = e.target.closest('.filter-option');
        if (!option) return;

        // Actualizar visualización de botones activos (solo generaciones)
        document.querySelectorAll('#customFilterGenerations .filter-option').forEach(opt =>
            opt.classList.remove('active')
        );
        option.classList.add('active');

        // Guardar la generación seleccionada
        currentGenFilter = option.getAttribute('data-gen');

        // Aplicar ambos filtros
        applyFilters();
    });



    // ==============================
    // FUNCIÓN PARA APLICAR TODOS LOS FILTROS
    // ==============================
    function applyFilters() {
        let filtered = allPokemonData;

        // Aplicar filtro de tipo
        if (currentTypeFilter && currentTypeFilter !== "ver-todos") {
            filtered = filtered.filter(pokemon =>
                pokemon.types.includes(currentTypeFilter)
            );
        }

        // Aplicar filtro de generación
        if (currentGenFilter && currentGenFilter !== "ver-todos") {
            const genRange = getGenerationRange(currentGenFilter);
            filtered = filtered.filter(pokemon =>
                pokemon.id >= genRange.start && pokemon.id <= genRange.end
            );
        }

        renderPokemonGrid(filtered);
    }

    // ==============================
    // HOME SEARCH + SHINY BUTTON
    // ==============================
    searchForm.addEventListener("submit", handleSearch);

    function handleSearch(event) {
        event.preventDefault();
        const pokemonNameOrId = pokemonInput.value.trim().toLowerCase();
        pokemonDescriptionDisplay.textContent = "";
        pokemonImage.style.display = "none";
        shinyButton.style.display = "none";
        pokemonNameDisplay.textContent = "";
        const pokemonTypesContainer = document.getElementById("pokemonTypes");
        pokemonTypesContainer.innerHTML = "";

        if (!pokemonNameOrId) {
            alert("Por favor ingresa el nombre o número del Pokémon.");
            return;
        }

        const isNumeric = !isNaN(pokemonNameOrId);
        fetch(`https://pokeapi.co/api/v2/pokemon/${isNumeric ? pokemonNameOrId : pokemonNameOrId}`)
            .then(response => {
                if (!response.ok) throw new Error("Pokémon no encontrado");
                return response.json();
            })
            .then(data => {
                const spriteUrl = data.sprites.front_default;
                shinySpriteUrl = data.sprites.front_shiny || spriteUrl;

                pokemonImage.src = spriteUrl;
                pokemonImage.style.display = "block";
                shinyButton.style.display = data.sprites.front_shiny ? "block" : "none";

                pokemonNameDisplay.textContent = capitalizeFirstLetter(data.name);

                const types = data.types.map(typeInfo => typeInfo.type.name);
                types.forEach(type => {
                    const typeIcon = document.createElement("img");
                    typeIcon.src = `tipos/${type}.svg`;
                    typeIcon.alt = type;
                    typeIcon.style.width = "42px";
                    typeIcon.style.marginRight = "8px";
                    pokemonTypesContainer.appendChild(typeIcon);
                });

                fetch(data.species.url)
                    .then(response => response.json())
                    .then(speciesData => {
                        const flavorText = speciesData.flavor_text_entries.find(entry => entry.language.name === "es");
                        pokemonDescriptionDisplay.textContent = flavorText ? flavorText.flavor_text : "Descripción no disponible.";
                    });

                let isShiny = false;
                shinyButton.onclick = function () {
                    isShiny = !isShiny;
                    pokemonImage.src = isShiny ? shinySpriteUrl : spriteUrl;
                    shinyButton.textContent = isShiny ? "Ver versión normal" : "Ver versión variocolor";
                };
            })
            .catch(error => {
                alert(error.message);
                pokemonImage.style.display = "none";
                shinyButton.style.display = "none";
            });
    }

    // ==============================
    // CARGA Y RENDER DE LA POKEDEX
    // ==============================
    function fetchAllPokemon() {
        const totalPokemon = 1025;
        const promises = [];

        for (let i = 1; i <= totalPokemon; i++) {
            promises.push(fetchPokemon(i));
        }

        Promise.all(promises)
            .then(data => {
                allPokemonData = data;
                renderPokemonGrid(allPokemonData);
            });
    }

    function fetchPokemon(id) {
        return fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then(response => response.json())
            .then(data => {
                const types = data.types.map(t => t.type.name);
                return {
                    id: data.id,
                    name: data.name,
                    sprite: data.sprites.front_default,
                    shiny_sprite: data.sprites.front_shiny,
                    types
                };
            });
    }

    async function showPokemonPopup(pokemon) {
        document.getElementById("modalPokemonSprite").src = pokemon.sprite;
        document.getElementById("modalPokemonName").textContent = capitalizeFirstLetter(pokemon.name);
        document.getElementById("modalPokemonID").textContent = `#${pokemon.id}`;

        const typesContainer = document.getElementById("modalPokemonTypes");
        typesContainer.innerHTML = "";
        pokemon.types.forEach(type => {
            const typeElement = document.createElement("div");
            typeElement.classList.add("type-badge");

            const typeIcon = document.createElement("img");
            typeIcon.src = `tipos/${type}.svg`;
            typeIcon.alt = type;
            typeIcon.classList.add("type-icon");

            const typeText = document.createElement("span");
            typeText.textContent = capitalizeFirstLetter(type);

            typeElement.appendChild(typeIcon);
            typeElement.appendChild(typeText);
            typesContainer.appendChild(typeElement);
        });

        try {
            const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}/`);
            if (!speciesResponse.ok) throw new Error("Error al obtener datos del Pokémon.");
            const speciesData = await speciesResponse.json();

            document.getElementById("modalPokemonGeneration").textContent = speciesData.generation.name.toUpperCase();

            const flavorTextEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === "es");
            document.getElementById("modalPokemonBio").textContent = flavorTextEntry ? flavorTextEntry.flavor_text : "Información no disponible.";

            const genResponse = await fetch(speciesData.generation.url);
            if (!genResponse.ok) throw new Error("Error al obtener datos de la generación.");
            const genData = await genResponse.json();
            document.getElementById("modalPokemonRegion").textContent = genData.main_region.name.toUpperCase();

        } catch (error) {
            console.error(error);
            document.getElementById("modalPokemonRegion").textContent = "Desconocido";
            document.getElementById("modalPokemonGeneration").textContent = "Desconocida";
            document.getElementById("modalPokemonBio").textContent = "Información no disponible.";
        }

        const modal = new bootstrap.Modal(document.getElementById("pokemonModal"));
        modal.show();
    }

    function renderPokemonGrid(list) {
        pokemonGrid.innerHTML = "";
        list.forEach(pokemon => {
            const card = document.createElement("div");
            card.classList.add("pokemon-card");
            card.innerHTML = `
                <img src="${pokemon.sprite}" alt="${pokemon.name}">
                <p>${capitalizeFirstLetter(pokemon.name)}</p>`;

            card.addEventListener("click", () => showPokemonPopup(pokemon));
            pokemonGrid.appendChild(card);
        });
    }

    fetchAllPokemon();

    // ==============================
    // GACHAMON
    // ==============================
    updateCoinsDisplay();

    gachamonButton.addEventListener("click", () => {
        if (coins <= 0) {
            alert("¡No tienes monedas suficientes!");
            return;
        }

        coins--;
        updateCoinsDisplay();

        gachamonResult.innerHTML = "";

        const randomIndex = Math.floor(Math.random() * allPokemonData.length);
        const pokemon = allPokemonData[randomIndex];
        const isShiny = Math.random() < 0.05;

        const pokeContainer = document.createElement("div");
        pokeContainer.classList.add("gachamon-pokemon");

        const sprite = document.createElement("img");
        sprite.src = isShiny && pokemon.shiny_sprite ? pokemon.shiny_sprite : pokemon.sprite;
        sprite.alt = pokemon.name;
        sprite.classList.add("gachamon-sprite");

        const name = document.createElement("h3");
        name.textContent = isShiny ? `⭐ ${capitalizeFirstLetter(pokemon.name)} ⭐` : capitalizeFirstLetter(pokemon.name);

        const typesContainer = document.createElement("div");
        typesContainer.classList.add("pokemon-types");
        pokemon.types.forEach(type => {
            const typeIcon = document.createElement("img");
            typeIcon.src = `tipos/${type}.svg`;
            typeIcon.alt = type;
            typeIcon.classList.add("type-icon");
            typesContainer.appendChild(typeIcon);
        });

        pokeContainer.append(sprite, name, typesContainer);
        gachamonResult.appendChild(pokeContainer);

        pokeContainer.classList.add("appear-animation");
        createParticles(gachamonResult);

        addPokemonToPC({ ...pokemon, isShiny });
    });

    gachamonAddCoins.addEventListener("click", () => {
        coins = 10;
        updateCoinsDisplay();
    });
    function updateCoinsDisplay() {
        coinCountDisplay.textContent = coins;
        localStorage.setItem("coins", coins);
    }

    function createParticles(container) {
        const colors = ['#f1c40f', '#e67e22', '#1abc9c', '#3498db', '#9b59b6'];
        for (let i = 0; i < 20; i++) {
            const p = document.createElement('div');
            p.classList.add('particle');
            p.style.width = p.style.height = `${Math.random() * 8 + 4}px`;
            p.style.background = colors[Math.floor(Math.random() * colors.length)];
            p.style.left = `${Math.random() * 100}%`;
            p.style.top = `${Math.random() * 100}%`;
            container.appendChild(p);

            setTimeout(() => {
                p.style.transform = `translate(${(Math.random() - 0.5) * 200}px, ${(Math.random() - 0.5) * 200}px)`;
                p.style.opacity = 0;
            }, 10);

            setTimeout(() => container.removeChild(p), 1000);
        }
    }

    // ==============================
    // PC - CARGAR DESDE BASE DE DATOS
    // ==============================
    window.addEventListener('pcLoaded', function (e) {
        const pokemonList = e.detail;
        console.log("📦 Procesando PC desde BD:", pokemonList);

        // Resetear las cajas
        pcBoxes = [];
        for (let i = 0; i < MAX_BOXES; i++) {
            pcBoxes.push(createNewBox());
        }

        // Colocar cada Pokémon en su caja y posición
        pokemonList.forEach(poke => {
            const boxIndex = poke.box_number - 1;
            const position = poke.position_in_box;

            if (boxIndex >= 0 && boxIndex < MAX_BOXES && position >= 0 && position < SLOTS_PER_BOX) {
                pcBoxes[boxIndex][position] = {
                    dbId: poke.id,
                    id: poke.pokemon_id,
                    name: poke.pokemon_name,
                    sprite: poke.sprite_url,
                    shiny_sprite: poke.sprite_url,
                    isShiny: poke.is_shiny,
                    types: []
                };
            }
        });

        currentBoxIndex = 0;
        showCurrentBox();
    });

    // ==============================
    // EQUIPO - CARGAR DESDE BASE DE DATOS
    // ==============================
    window.addEventListener('teamLoaded', function (e) {
        const teamList = e.detail;
        console.log("👥 Procesando equipo desde BD:", teamList);

        // Resetear el equipo
        miEquipo = new Array(MAX_TEAM_SIZE).fill(null);

        // Colocar cada Pokémon en su posición
        teamList.forEach(poke => {
            const position = poke.position;

            if (position >= 0 && position < MAX_TEAM_SIZE) {
                miEquipo[position] = {
                    dbId: poke.id,
                    id: poke.pokemon_id,
                    name: poke.pokemon_name,
                    sprite: poke.sprite_url,
                    shiny_sprite: poke.sprite_url,
                    isShiny: poke.is_shiny,
                    types: []
                };
            }
        });

        renderTeam();
    });

    // ==============================
    // PC - FUNCIONES DE CAJAS
    // ==============================
    function createNewBox() {
        return new Array(SLOTS_PER_BOX).fill(null);
    }

    prevBoxBtn.addEventListener("click", () => {
        if (currentBoxIndex > 0) {
            currentBoxIndex--;
            showCurrentBox();
        }
    });

    nextBoxBtn.addEventListener("click", () => {
        if (currentBoxIndex < pcBoxes.length - 1) {
            currentBoxIndex++;
            showCurrentBox();
        } else {
            alert("No hay más cajas disponibles.");
        }
    });

    // ✅ GUARDAR POKÉMON EN LA BASE DE DATOS
    async function savePokemonToDB(pokemon, boxNumber, position) {
        console.log("🔵 Intentando guardar en BD:", pokemon);
        try {
            const payload = {
                pokemon_id: pokemon.id,
                pokemon_name: pokemon.name,
                sprite_url: pokemon.isShiny && pokemon.shiny_sprite ? pokemon.shiny_sprite : pokemon.sprite,
                box_number: boxNumber + 1,
                is_shiny: pokemon.isShiny || false
            };

            console.log("📦 Payload:", payload);

            const res = await fetch("http://localhost:5000/api/pc", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            console.log("📡 Respuesta del servidor:", res.status, data);

            if (!res.ok) {
                console.error("❌ Error al guardar en BD:", data.message);
                return null;
            } else {
                console.log("✅ Pokémon guardado en BD exitosamente");
                return data.pokemon.id;
            }
        } catch (error) {
            console.error("❌ Error al guardar pokémon en BD:", error);
            return null;
        }
    }

    // ✅ AÑADIR POKÉMON AL PC (CON BASE DE DATOS)
    async function addPokemonToPC(pokemon) {
        for (let boxIndex = 0; boxIndex < pcBoxes.length; boxIndex++) {
            const box = pcBoxes[boxIndex];
            const position = box.findIndex(slot => slot === null);

            if (position !== -1) {
                const dbId = await savePokemonToDB(pokemon, boxIndex, position);

                if (dbId) {
                    box[position] = { ...pokemon, dbId };
                    showCurrentBox();
                    return true;
                } else {
                    alert("Error al guardar el Pokémon en la base de datos");
                    return false;
                }
            }
        }

        alert("PC lleno (10 cajas)");
        return false;
    }

    // ✅ MOSTRAR CAJA ACTUAL
    function showCurrentBox() {
        boxGrid.innerHTML = "";
        boxName.textContent = `Caja ${currentBoxIndex + 1}`;

        const box = pcBoxes[currentBoxIndex];

        box.forEach((pokemon, i) => {
            const slot = document.createElement("div");
            slot.classList.add("box-slot");

            if (pokemon) {
                const img = document.createElement("img");
                img.src = pokemon.isShiny ? pokemon.shiny_sprite : pokemon.sprite;
                slot.classList.toggle("shiny", pokemon.isShiny);
                img.alt = pokemon.name;
                slot.appendChild(img);

                slot.addEventListener("click", () => showPokemonInfoInPanel(i));
            } else {
                const empty = document.createElement("div");
                empty.classList.add("empty-slot");
                slot.appendChild(empty);

                slot.addEventListener("click", () => showPokemonInfoInPanel(null));
            }

            boxGrid.appendChild(slot);
        });

        const boxHasPokemon = box.some(p => p !== null);
        if (!boxHasPokemon) {
            showPokemonInfoInPanel(null);
        }
    }

    // ✅ MOSTRAR INFO EN PANEL
    function showPokemonInfoInPanel(index) {
        const pokemon = pcBoxes[currentBoxIndex][index];
        const panel = document.getElementById("pcInfoPanel");

        const sprite = document.getElementById("infoSprite");
        const name = document.getElementById("infoName");
        const typesContainer = document.getElementById("infoTypes");
        const releaseButton = document.getElementById("releaseButton");
        const addToTeamButton = document.getElementById("addToTeamButton");

        if (!pokemon) {
            sprite.classList.add("d-none");
            name.classList.add("d-none");
            typesContainer.classList.add("d-none");
            releaseButton.classList.add("d-none");
            addToTeamButton.classList.add("d-none");
            panel.querySelector("p").classList.remove("d-none");
            return;
        }

        panel.querySelector("p").classList.add("d-none");
        sprite.classList.remove("d-none");
        name.classList.remove("d-none");
        typesContainer.classList.remove("d-none");
        releaseButton.classList.remove("d-none");
        addToTeamButton.classList.remove("d-none");

        sprite.src = pokemon.isShiny ? pokemon.shiny_sprite : pokemon.sprite;
        name.textContent = capitalizeFirstLetter(pokemon.name);

        typesContainer.innerHTML = "";
        pokemon.types.forEach(type => {
            const icon = document.createElement("img");
            icon.src = `tipos/${type}.svg`;
            icon.alt = type;
            typesContainer.appendChild(icon);
        });

        releaseButton.onclick = () => releasePokemon(index);

        addToTeamButton.onclick = async () => {
            const equipoLleno = miEquipo.filter(p => p !== null).length >= MAX_TEAM_SIZE;

            if (equipoLleno) {
                alert("Tu equipo está lleno.");
                return;
            }

            const emptySlotIndex = miEquipo.findIndex(p => p === null);

            if (emptySlotIndex !== -1) {
                // Guardar en BD primero
                const dbId = await savePokemonToTeam(pokemon, emptySlotIndex);

                if (dbId) {
                    // Actualizar el array local
                    miEquipo[emptySlotIndex] = { ...pokemon, dbId };

                    // Eliminar del PC (tanto local como BD)
                    const res = await fetch(`http://localhost:5000/api/pc/${pokemon.dbId}`, {
                        method: "DELETE",
                        credentials: "include"
                    });

                    if (res.ok) {
                        pcBoxes[currentBoxIndex][index] = null;
                        renderTeam();
                        showCurrentBox();
                        showPokemonInfoInPanel(null);

                        const panel = document.getElementById("pcInfoPanel");
                        if (panel) panel.classList.remove("d-none");
                    } else {
                        alert("Error al eliminar del PC");
                    }
                } else {
                    alert("Error al agregar al equipo");
                }
            }
        };
    }

    // ✅ LIBERAR POKÉMON (CON BASE DE DATOS)
    async function releasePokemon(index) {
        const pokemon = pcBoxes[currentBoxIndex][index];
        if (!pokemon) return;

        const confirmRelease = confirm(`¿Estás segur@ de querer liberar a ${capitalizeFirstLetter(pokemon.name)}?`);

        if (confirmRelease) {
            try {
                const res = await fetch(`http://localhost:5000/api/pc/${pokemon.dbId}`, {
                    method: "DELETE",
                    credentials: "include"
                });

                if (res.ok) {
                    pcBoxes[currentBoxIndex][index] = null;
                    showCurrentBox();
                    alert(`${capitalizeFirstLetter(pokemon.name)} ha sido liberado correctamente.`);
                    showPokemonInfoInPanel(null);

                    const panel = document.getElementById("pcInfoPanel");
                    if (panel) panel.classList.remove("d-none");
                } else {
                    const error = await res.json();
                    alert("Error al liberar el Pokémon: " + error.message);
                }
            } catch (error) {
                console.error("❌ Error al liberar pokémon:", error);
                alert("Error de conexión al liberar el Pokémon");
            }
        }
    }

    // ==============================
    // MI EQUIPO
    // ==============================

    // ✅ GUARDAR POKÉMON EN EL EQUIPO (BD)
    async function savePokemonToTeam(pokemon, position) {
        console.log("🔵 Intentando guardar en equipo BD:", pokemon, "posición:", position);
        try {
            const payload = {
                pokemon_id: pokemon.id,
                pokemon_name: pokemon.name,
                sprite_url: pokemon.isShiny && pokemon.shiny_sprite ? pokemon.shiny_sprite : pokemon.sprite,
                position: position,
                is_shiny: pokemon.isShiny || false
            };

            console.log("📦 Payload equipo:", payload);

            const res = await fetch("http://localhost:5000/api/team", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            console.log("📡 Respuesta del servidor:", res.status, data);

            if (!res.ok) {
                console.error("❌ Error al guardar en equipo BD:", data.message);
                return null;
            } else {
                console.log("✅ Pokémon guardado en equipo BD exitosamente");
                return data.pokemon.id;
            }
        } catch (error) {
            console.error("❌ Error al guardar pokémon en equipo BD:", error);
            return null;
        }
    }

    // ✅ ELIMINAR POKÉMON DEL EQUIPO (BD)
    async function removePokemonFromTeam(dbId) {
        try {
            const res = await fetch(`http://localhost:5000/api/team/${dbId}`, {
                method: "DELETE",
                credentials: "include"
            });

            if (res.ok) {
                console.log("✅ Pokémon eliminado del equipo BD");
                return true;
            } else {
                const error = await res.json();
                console.error("❌ Error al eliminar del equipo:", error.message);
                return false;
            }
        } catch (error) {
            console.error("❌ Error al eliminar pokémon del equipo:", error);
            return false;
        }
    }

    // ✅ ACTUALIZAR NOMBRE EN BD
    async function updatePokemonNameInTeam(dbId, newName) {
        try {
            const res = await fetch(`http://localhost:5000/api/team/${dbId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ pokemon_name: newName })
            });

            if (res.ok) {
                console.log("✅ Nombre actualizado en BD");
                return true;
            } else {
                console.error("❌ Error al actualizar nombre");
                return false;
            }
        } catch (error) {
            console.error("❌ Error:", error);
            return false;
        }
    }

    // ✅ YA NO SE USA localStorage
    // function saveEquipo() {
    //     localStorage.setItem("miEquipo", JSON.stringify(miEquipo));
    // }

    function renderTeam() {
        const gridContainer = document.getElementById("equipoGrid");

        gridContainer.innerHTML = "";

        for (let i = 0; i < MAX_TEAM_SIZE; i++) {
            const slot = document.createElement("div");
            slot.classList.add("equipo-slot");

            const pokemon = miEquipo[i];

            if (pokemon) {
                const img = document.createElement("img");
                img.src = pokemon.isShiny ? pokemon.shiny_sprite : pokemon.sprite;
                img.alt = pokemon.name;

                slot.appendChild(img);
                slot.addEventListener("click", () => showTeamPokemonInfo(i));

            } else {
                slot.classList.add("empty-equipo-slot");

                const emptyImg = document.createElement("div");
                emptyImg.style.backgroundImage = "url('img/pokeball-vacia.png')";
                emptyImg.style.backgroundSize = "cover";
                emptyImg.style.width = "40px";
                emptyImg.style.height = "40px";
                emptyImg.style.opacity = "0.2";

                slot.appendChild(emptyImg);
                slot.addEventListener("click", () => showTeamPokemonInfo(null));
            }

            gridContainer.appendChild(slot);
        }
    }

    function showTeamPokemonInfo(index) {
        const inputName = document.getElementById("equipoPokemonName");
        const returnToPcButton = document.getElementById("returnToPcButton");
        const artwork = document.getElementById("equipoPokemonArtwork");
        const description = document.getElementById("equipoPokemonDescription");

        if (index === null || !miEquipo[index]) {
            inputName.value = "";
            inputName.disabled = true;
            returnToPcButton.disabled = true;

            artwork.classList.add("d-none");
            description.textContent = "Selecciona un Pokémon para ver su descripción.";
            return;
        }

        const pokemon = miEquipo[index];

        inputName.value = capitalizeFirstLetter(pokemon.name);
        inputName.disabled = false;
        returnToPcButton.disabled = false;

        artwork.src = pokemon.isShiny ? pokemon.shiny_sprite : pokemon.sprite;
        artwork.classList.remove("d-none");

        description.textContent = pokemon.description || "Descripción no disponible.";

        inputName.onblur = async function () {
            const newName = inputName.value.trim();

            if (newName === "") {
                alert("El nombre no puede estar vacío.");
                inputName.value = capitalizeFirstLetter(pokemon.name);
                return;
            }

            // Actualizar en BD
            const updated = await updatePokemonNameInTeam(pokemon.dbId, newName);

            if (updated) {
                pokemon.name = newName;
                renderTeam();
            } else {
                alert("Error al actualizar el nombre");
                inputName.value = capitalizeFirstLetter(pokemon.name);
            }
        };

        returnToPcButton.onclick = async () => {
            if (confirm(`¿Enviar a ${capitalizeFirstLetter(pokemon.name)} al PC?`)) {
                // Agregar al PC primero
                const added = await addPokemonToPC(pokemon);

                if (added) {
                    // Eliminar del equipo en BD
                    const removed = await removePokemonFromTeam(pokemon.dbId);

                    if (removed) {
                        miEquipo[index] = null;
                        renderTeam();
                        showTeamPokemonInfo(null);
                        alert(`${capitalizeFirstLetter(pokemon.name)} ha sido enviado al PC.`);
                    } else {
                        alert("Error al remover del equipo");
                    }
                }
            }
        };
    }


    // ==============================
    // EVENTOS DE NAVEGACIÓN PROTEGIDA
    // ==============================

    // Evento para mostrar el PC
    window.addEventListener('showPC', function () {
        showCurrentBox();
        showPokemonInfoInPanel(null);
        const panel = document.getElementById("pcInfoPanel");
        if (panel) panel.classList.remove("d-none");
    });

    // Evento para mostrar el equipo
    window.addEventListener('showTeam', function () {
        renderTeam();
        showTeamPokemonInfo(null);
    });

    // Inicialización
    showCurrentBox();
    renderTeam();
});
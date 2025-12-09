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
    let pcBoxes = JSON.parse(localStorage.getItem("pc")) || [createNewBox()];
    let currentBoxIndex = 0;
    let miEquipo = JSON.parse(localStorage.getItem("miEquipo")) || [];

    let pc = JSON.parse(localStorage.getItem("pc")) || [[]];
    let currentBox = 0;

    function savePC() {
        localStorage.setItem("pc", JSON.stringify(pc));
    }
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
            renderPokemonGrid(allPokemonData);
            return;
        }

        const filtered = allPokemonData.filter(pokemon =>
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
    // FILTRO PERSONALIZADO POKEDEX
    // ==============================
    customFilterTypes.addEventListener('click', function (e) {
        const option = e.target.closest('.filter-option');
        if (!option) return;

        document.querySelectorAll('.filter-option').forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');

        const selectedType = option.getAttribute('data-type');

        if (selectedType === "ver-todos") {
            renderPokemonGrid(allPokemonData);
        } else {
            const filteredPokemon = allPokemonData.filter(pokemon =>
                pokemon.types.includes(selectedType)
            );
            renderPokemonGrid(filteredPokemon);
        }
    });

    customFilterGenerations.addEventListener("click", async function (e) {
        const option = e.target.closest('.filter-option');
        if (!option) return;

        // Quitar clase 'active' de los otros filtros y marcar el actual
        document.querySelectorAll('.filter-option').forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');

        const selectedGen = option.getAttribute('data-gen');

        if (selectedGen === "ver-todos") {
            renderPokemonGrid(allPokemonData);
        } else {
            const generationPokemon = await fetchGeneration(selectedGen);
            renderPokemonGrid(generationPokemon);
        }
    });
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

    async function fetchGeneration(genId) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/generation/${genId}`);
            if (!response.ok) throw new Error("Error al obtener la generación");

            const data = await response.json();
            const pokemonList = data.pokemon_species.map(poke => {
                const pokeId = poke.url.split("/")[6]; // Extrae el ID del Pokémon desde la URL
                return allPokemonData.find(p => p.id == pokeId); // Busca el Pokémon en la lista general
            }).filter(p => p !== undefined); // Filtra valores undefined

            // Ordena por ID para que las cadenas evolutivas aparezcan juntas
            return pokemonList.sort((a, b) => a.id - b.id);
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async function showPokemonPopup(pokemon) {
        document.getElementById("modalPokemonSprite").src = pokemon.sprite;
        document.getElementById("modalPokemonName").textContent = capitalizeFirstLetter(pokemon.name);
        document.getElementById("modalPokemonID").textContent = `#${pokemon.id}`;

        // Mostrar tipos con iconos
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

        // Obtener generación y biografía desde la API
        try {
            const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}/`);
            if (!speciesResponse.ok) throw new Error("Error al obtener datos del Pokémon.");
            const speciesData = await speciesResponse.json();

            document.getElementById("modalPokemonGeneration").textContent = speciesData.generation.name.toUpperCase();

            // Biografía en español
            const flavorTextEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === "es");
            document.getElementById("modalPokemonBio").textContent = flavorTextEntry ? flavorTextEntry.flavor_text : "Información no disponible.";

            // Obtener la región desde la URL de generación
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

        // Mostrar el modal
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
        const isShiny = Math.random() < 0.05; //PROBABILIDAD DE SHINY (5%)

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
    // PC CAJAS
    // ==============================
    // Botones para navegar entre cajas
    prevBoxBtn.addEventListener("click", () => {
        if (currentBoxIndex > 0) {
            currentBoxIndex--;
            showCurrentBox();
        }
    });
    nextBoxBtn.addEventListener("click", () => {
        if (currentBoxIndex < pcBoxes.length - 1) {
            currentBoxIndex++;
        } else if (pcBoxes.length < MAX_BOXES) {
            pcBoxes.push(createNewBox());
            currentBoxIndex++;
            savePC();
        } else {
            alert("Máximo número de cajas alcanzado.");
        }
        showCurrentBox();
    });
    // Crear una caja vacía
    function createNewBox() {
        return new Array(SLOTS_PER_BOX).fill(null);
    }
    // Guardar el estado del PC en localStorage
    function savePC() {
        localStorage.setItem("pc", JSON.stringify(pcBoxes));
    }
    // Añadir un Pokémon a la primera caja con hueco
    async function addPokemonToPC(pokemon) {
        for (let box of pcBoxes) {
            const index = box.findIndex(slot => slot === null);
            if (index !== -1) {
                box[index] = pokemon;
                savePC();
                showCurrentBox();

                // Guardar también en la base de datos
                await savePokemonToDB(pokemon, pcBoxes.indexOf(box), index);

                return true;
            }
        }
        if (pcBoxes.length < MAX_BOXES) {
            const newBox = createNewBox();
            newBox[0] = pokemon;
            pcBoxes.push(newBox);
            currentBoxIndex = pcBoxes.length - 1;
            savePC();
            showCurrentBox();

            // Guardar también en la base de datos
            await savePokemonToDB(pokemon, currentBoxIndex, 0);

            return true;
        } else {
            alert("PC lleno");
            return false;
        }
    }

    // Función para guardar pokémon en la base de datos
    async function savePokemonToDB(pokemon, boxNumber, position) {
        console.log("🔵 Intentando guardar en BD:", pokemon);
        try {
            const payload = {
                pokemon_id: pokemon.id,
                pokemon_name: pokemon.name,
                sprite_url: pokemon.isShiny ? pokemon.shiny_sprite : pokemon.sprite,
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
            } else {
                console.log("✅ Pokémon guardado en BD exitosamente");
            }
        } catch (error) {
            console.error("❌ Error al guardar pokémon en BD:", error);
        }
    }
    // Muestra la caja actual
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

                // Click para mostrar la info en el panel
                slot.addEventListener("click", () => showPokemonInfoInPanel(i));
            } else {
                const empty = document.createElement("div");
                empty.classList.add("empty-slot");
                slot.appendChild(empty);

                // Si haces click en vacío, se limpia el panel
                slot.addEventListener("click", () => showPokemonInfoInPanel(null));
            }

            boxGrid.appendChild(slot);
        });
        // Si no hay ningún Pokémon, limpia el panel
        const boxHasPokemon = box.some(p => p !== null);
        if (!boxHasPokemon) {
            showPokemonInfoInPanel(null);
        }
    }
    // Muestra la info en el panel lateral izquierdo
    function showPokemonInfoInPanel(index) {
        const pokemon = pcBoxes[currentBoxIndex][index];
        const panel = document.getElementById("pcInfoPanel");

        const sprite = document.getElementById("infoSprite");
        const name = document.getElementById("infoName");
        const typesContainer = document.getElementById("infoTypes");
        const releaseButton = document.getElementById("releaseButton");
        const addToTeamButton = document.getElementById("addToTeamButton");

        if (!pokemon) {
            // Limpia el panel si no hay Pokémon
            sprite.classList.add("d-none");
            name.classList.add("d-none");
            typesContainer.classList.add("d-none");
            releaseButton.classList.add("d-none");
            addToTeamButton.classList.add("d-none");
            panel.querySelector("p").classList.remove("d-none");
            return;
        }
        // Muestra los elementos y oculta el mensaje vacío
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

        // Botón de liberar Pokémon
        releaseButton.onclick = () => releasePokemon(index);

        // Botón de añadir al equipo
        addToTeamButton.onclick = () => {
            const equipoLleno = miEquipo.filter(p => p !== null).length >= MAX_TEAM_SIZE;

            if (equipoLleno) {
                alert("Tu equipo está lleno.");
                return;
            }

            const emptySlotIndex = miEquipo.findIndex(p => p === null);

            if (emptySlotIndex !== -1) {
                miEquipo[emptySlotIndex] = pokemon;
            } else {
                miEquipo.push(pokemon);
            }

            pcBoxes[currentBoxIndex][index] = null;

            saveEquipo();
            savePC();
            renderTeam();
            showCurrentBox();

            showPokemonInfoInPanel(null);

            const panel = document.getElementById("pcInfoPanel");
            if (panel) panel.classList.remove("d-none");
        };


    }
    // Confirmar y liberar Pokémon
    function releasePokemon(index) {
        const pokemon = pcBoxes[currentBoxIndex][index];
        if (!pokemon) return;

        const confirmRelease = confirm(`¿Estás segur@ de querer liberar a ${capitalizeFirstLetter(pokemon.name)}?`);

        if (confirmRelease) {
            pcBoxes[currentBoxIndex][index] = null;
            savePC();
            showCurrentBox();
            alert(`${capitalizeFirstLetter(pokemon.name)} ha sido liberado correctamente.`);

            showPokemonInfoInPanel(null);

            const panel = document.getElementById("pcInfoPanel");
            if (panel) panel.classList.remove("d-none");
        }
    }

    // Guardar el equipo en localStorage
    function saveEquipo() {
        localStorage.setItem("miEquipo", JSON.stringify(miEquipo));
    }
    // Renderizar el equipo actual
    function renderTeam() {
        const container = document.getElementById("miEquipoSection");
        container.innerHTML = "<h2>Mi Equipo</h2>";
        const grid = document.createElement("div");
        grid.classList.add("pokemon-grid");

        miEquipo.forEach((pokemon, index) => {
            const card = document.createElement("div");
            card.classList.add("pokemon-card");

            card.innerHTML = `
                <img src="${pokemon.isShiny ? pokemon.shiny_sprite : pokemon.sprite}" alt="${pokemon.name}">
                <p>${capitalizeFirstLetter(pokemon.name)}</p>
                <button class="btn btn-danger btn-sm mt-2">Devolver al PC</button>
            `;

            card.querySelector("button").onclick = () => {
                const added = addPokemonToPC(pokemon);
                if (added) {
                    miEquipo.splice(index, 1);
                    saveEquipo();
                    renderTeam();
                }
            };

            grid.appendChild(card);
        });

        container.appendChild(grid);
    }

    // Mostrar la primera caja y el equipo al cargar
    showCurrentBox();
    renderTeam();
    // ==============================
    // MI EQUIPO 
    // ==============================
    function renderTeam() {
        const gridContainer = document.getElementById("equipoGrid");
        const infoPanel = document.getElementById("equipoInfoPanel");

        // Limpia el grid antes de renderizar
        gridContainer.innerHTML = "";

        for (let i = 0; i < MAX_TEAM_SIZE; i++) {
            const slot = document.createElement("div");
            slot.classList.add("equipo-slot");

            const pokemon = miEquipo[i];

            if (pokemon) {
                // Si hay un Pokémon en el slot
                const img = document.createElement("img");
                img.src = pokemon.isShiny ? pokemon.shiny_sprite : pokemon.sprite;
                img.alt = pokemon.name;

                slot.appendChild(img);

                // CLICK en el Pokémon → Muestra su información en el panel
                slot.addEventListener("click", () => {
                    showTeamPokemonInfo(i);
                });

            } else {
                // Si el slot está vacío, Pokéball vacía
                slot.classList.add("empty-equipo-slot");

                const emptyImg = document.createElement("div");
                emptyImg.style.backgroundImage = "url('img/pokeball-vacia.png')";
                emptyImg.style.backgroundSize = "cover";
                emptyImg.style.width = "40px";
                emptyImg.style.height = "40px";
                emptyImg.style.opacity = "0.2";

                slot.appendChild(emptyImg);

                // CLICK en el espacio vacío → Limpia el panel de info
                slot.addEventListener("click", () => {
                    showTeamPokemonInfo(null);
                });
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

        inputName.onblur = function () {
            const newName = inputName.value.trim();

            if (newName === "") {
                alert("El nombre no puede estar vacío.");
                inputName.value = capitalizeFirstLetter(pokemon.name);
                return;
            }

            pokemon.name = newName;
            saveEquipo();
            renderTeam();
        };

        returnToPcButton.onclick = () => {
            if (confirm(`¿Enviar a ${capitalizeFirstLetter(pokemon.name)} al PC?`)) {
                const added = addPokemonToPC(pokemon);
                if (added) {
                    miEquipo[index] = null;
                    saveEquipo();
                    renderTeam();
                    showTeamPokemonInfo(null);
                    alert(`${capitalizeFirstLetter(pokemon.name)} ha sido enviado al PC.`);
                }
            }
        };
    }
});

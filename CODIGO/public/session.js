// Gestión de sesión al cargar la página
document.addEventListener("DOMContentLoaded", function () {
    const homeSection = document.getElementById("homeSection");
    const introScreen = document.getElementById("introScreen");

    //Variable global para saber si el usuario está logueado
    window.isUserLoggedIn = false;

    function showUserSection(username) {
        const userSection = document.getElementById("userSection");
        const usernameDisplay = document.getElementById("usernameDisplay");
        userSection.classList.remove("d-none");
        usernameDisplay.textContent = username;

        //Marcar como logueado
        window.isUserLoggedIn = true;
    }

    function hideUserSection() {
        document.getElementById("userSection").classList.add("d-none");

        //Marcar como no logueado
        window.isUserLoggedIn = false;
    }

    function showAuthButtons() {
        document.getElementById("authButtons").style.display = "block";
    }

    function hideAuthButtons() {
        document.getElementById("authButtons").style.display = "none";
    }

    function showSection(section) {
        document.querySelectorAll(".section, #homeSection").forEach(s => s.classList.add("d-none"));
        section.classList.remove("d-none");
    }

    //NUEVA FUNCIÓN: Verificar si el usuario está logueado
    function requireAuth(callback, sectionName = "esta sección") {
        if (!window.isUserLoggedIn) {
            alert(`Debes iniciar sesión para acceder a ${sectionName}`);

            // Abrir modal de login
            const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
            loginModal.show();

            return false;
        }

        // Si está logueado, ejecutar el callback
        callback();
        return true;
    }

    //NUEVA FUNCIÓN: Cargar PC desde la base de datos
    async function loadPCFromDB() {
        try {
            const res = await fetch("http://localhost:5000/api/pc", {
                method: "GET",
                credentials: "include"
            });

            if (!res.ok) {
                console.error("Error al cargar PC desde BD");
                return;
            }

            const pokemonList = await res.json();
            console.log("✅ PC cargado desde BD:", pokemonList);

            // Disparar evento personalizado para que script.js lo procese
            window.dispatchEvent(new CustomEvent('pcLoaded', { detail: pokemonList }));

        } catch (error) {
            console.error("❌ Error al cargar PC:", error);
        }
    }

    //Cargar equipo desde la base de datos
    async function loadTeamFromDB() {
        try {
            const res = await fetch("http://localhost:5000/api/team", {
                method: "GET",
                credentials: "include"
            });

            if (!res.ok) {
                console.error("Error al cargar equipo desde BD");
                return;
            }

            const teamList = await res.json();
            console.log("✅ Equipo cargado desde BD:", teamList);

            // Disparar evento personalizado para que script.js lo procese
            window.dispatchEvent(new CustomEvent('teamLoaded', { detail: teamList }));

        } catch (error) {
            console.error("❌ Error al cargar equipo:", error);
        }
    }

    // Comprobar sesión al cargar
    fetch("http://localhost:5000/api/users/me", { method: "GET", credentials: "include" })
        .then(res => res.ok ? res.json() : Promise.reject("No autorizado"))
        .then(data => {
            if (data.username) {
                // Usuario con sesión: ir directo a home
                showUserSection(data.username);
                hideAuthButtons();
                showSection(homeSection);

                //CARGAR PC DESDE BD
                loadPCFromDB();

                //CARGAR EQUIPO DESDE BD
                loadTeamFromDB();
            }
        })
        .catch(() => {
            // Sin sesión: mostrar intro
            introScreen.style.display = "flex";
            hideUserSection();
            showAuthButtons();
        });

    // LOGIN
    document.getElementById("loginForm")?.addEventListener("submit", function (e) {
        e.preventDefault();
        const username = document.getElementById("loginUser").value.trim();
        const password = document.getElementById("loginPassword").value.trim();
        if (!username || !password) return alert("Todos los campos son obligatorios");

        //ADMIN SECRET VIEW - Primero hacer login real, luego redirigir
        if (username === "admin") {
            fetch("http://localhost:5000/api/users/login", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            })
                .then(async res => {
                    const data = await res.json();
                    if (res.ok) {
                        // Login exitoso, redirigir al panel de admin
                        window.location.href = "admin-panel.html";
                    } else {
                        alert(data.message);
                    }
                })
                .catch(console.error);
            return;
        }

        fetch("http://localhost:5000/api/users/login", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        })
            .then(async res => {
                const data = await res.json();
                if (res.ok) {
                    alert(data.message);
                    bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
                    showUserSection(data.username);
                    hideAuthButtons();
                    showSection(homeSection);
                    document.getElementById("loginForm").reset();

                    //CARGAR PC DESDE BD DESPUÉS DEL LOGIN
                    loadPCFromDB();

                    //CARGAR EQUIPO DESDE BD DESPUÉS DEL LOGIN
                    loadTeamFromDB();
                } else {
                    alert(data.message);
                }
            })
            .catch(console.error);
    });

    // REGISTER
    document.getElementById("registerForm")?.addEventListener("submit", function (e) {
        e.preventDefault();
        const username = document.getElementById("registerUsername").value.trim();
        const email = document.getElementById("registerEmail").value.trim();
        const password = document.getElementById("registerPassword").value.trim();
        if (!username || !email || !password) return alert("Todos los campos son obligatorios");

        fetch("http://localhost:5000/api/users/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
            credentials: "include"
        })
            .then(res => res.json())
            .then(data => {
                alert(data.message);
                bootstrap.Modal.getInstance(document.getElementById("registerModal")).hide();
                showUserSection(data.username);
                hideAuthButtons();
                showSection(homeSection);
                document.getElementById("registerForm").reset();

                //CARGAR PC DESDE BD DESPUÉS DEL REGISTRO (estará vacío)
                loadPCFromDB();

                //CARGAR EQUIPO DESDE BD DESPUÉS DEL REGISTRO (estará vacío)
                loadTeamFromDB();
            })
            .catch(console.error);
    });

    // LOGOUT
    document.getElementById("logoutButton")?.addEventListener("click", function () {
        if (!confirm("¿Estás seguro de que deseas cerrar sesión?")) return;
        fetch("http://localhost:5000/api/users/logout", { method: "POST", credentials: "include" })
            .then(res => res.json())
            .then(data => {
                alert(data.message);

                // Limpiar localStorage
                localStorage.removeItem("pc");
                localStorage.removeItem("miEquipo");
                localStorage.removeItem("coins");

                hideUserSection();
                showAuthButtons();

                // Recargar la página para resetear todo
                window.location.reload();
            })
            .catch(console.error);
    });

    // Botón "Entrar" de la pantalla de intro
    document.getElementById("enterButton")?.addEventListener("click", function () {
        introScreen.style.display = "none";
        showSection(homeSection);
    });

    // ==============================
    // PROTECCIÓN DE NAVEGACIÓN
    // ==============================

    // Home siempre es accesible
    document.getElementById("logoHome")?.addEventListener("click", () => showSection(homeSection));
    document.getElementById("homeLink")?.addEventListener("click", () => showSection(homeSection));

    // Pokédex siempre es accesible (lectura)
    document.getElementById("pokedexLink")?.addEventListener("click", () => {
        const pokedexSection = document.getElementById("pokedexSection");
        showSection(pokedexSection);
    });

    // PC requiere autenticación
    document.getElementById("pcLink")?.addEventListener("click", (e) => {
        e.preventDefault();
        requireAuth(() => {
            const pcSection = document.getElementById("pcSection");
            showSection(pcSection);
            // Disparar evento para actualizar la vista del PC
            window.dispatchEvent(new Event('showPC'));
        }, "el PC");
    });

    // Gachamón requiere autenticación
    document.getElementById("gachamonLink")?.addEventListener("click", (e) => {
        e.preventDefault();
        requireAuth(() => {
            const gachamonSection = document.getElementById("gachamonSection");
            showSection(gachamonSection);
        }, "el Gachamón");
    });

    // Mi Equipo requiere autenticación
    document.getElementById("miEquipoLink")?.addEventListener("click", (e) => {
        e.preventDefault();
        requireAuth(() => {
            const miEquipoSection = document.getElementById("miEquipoSection");
            showSection(miEquipoSection);
            // Disparar evento para renderizar el equipo
            window.dispatchEvent(new Event('showTeam'));
        }, "Mi Equipo");
    });
});
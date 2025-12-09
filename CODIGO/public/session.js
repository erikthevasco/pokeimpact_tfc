// Gestión de sesión al cargar la página
document.addEventListener("DOMContentLoaded", function () {
    const homeSection = document.getElementById("homeSection");
    const introScreen = document.getElementById("introScreen");

    function showUserSection(username) {
        const userSection = document.getElementById("userSection");
        const usernameDisplay = document.getElementById("usernameDisplay");
        userSection.classList.remove("d-none");
        usernameDisplay.textContent = username;
    }

    function hideUserSection() {
        document.getElementById("userSection").classList.add("d-none");
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

    // Comprobar sesión al cargar
    fetch("http://localhost:5000/api/users/me", { method: "GET", credentials: "include" })
        .then(res => res.ok ? res.json() : Promise.reject("No autorizado"))
        .then(data => {
            if (data.username) {
                // Usuario con sesión: ir directo a home
                showUserSection(data.username);
                hideAuthButtons();
                showSection(homeSection);
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
});

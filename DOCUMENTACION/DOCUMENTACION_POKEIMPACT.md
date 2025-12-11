# DOCUMENTACIÓN PROYECTO POKÉIMPACT

## Trabajo de Fin de Ciclo

**Autor:** Erik Pérez Fernández
**Fecha:** 11 de diciembre de 2025  
**Versión:** 1.0

---

## ÍNDICE

1. [Introducción y Nombre del Proyecto](#1-introducción-y-nombre-del-proyecto)
2. [Motivación y Justificación](#2-motivación-y-justificación)
3. [Objetivos del Proyecto](#3-objetivos-del-proyecto)
4. [Estudio de Mercado](#4-estudio-de-mercado)
5. [Guía de Estilos](#5-guía-de-estilos)
6. [Tecnologías, Librerías y Herramientas](#6-tecnologías-librerías-y-herramientas)
7. [Arquitectura del Proyecto](#7-arquitectura-del-proyecto)
8. [Funcionalidades Implementadas](#8-funcionalidades-implementadas)
9. [Pruebas y Validaciones](#9-pruebas-y-validaciones)
10. [Problemas Encontrados y Soluciones](#10-problemas-encontrados-y-soluciones)
11. [Resultados](#11-resultados)
12. [Conclusiones](#12-conclusiones)
13. [Propuestas de Mejora](#13-propuestas-de-mejora)
14. [Bibliografía y Referencias](#14-bibliografía-y-referencias)
15. [Manual Técnico / Instalación](#15-manual-técnico--instalación)
16. [Manual de Usuario](#16-manual-de-usuario)

---

## 1. Introducción y Nombre del Proyecto

### Nombre: **PokéImpact**

PokéImpact es una aplicación web interactiva inspirada en el universo Pokémon que permite a los usuarios explorar una Pokédex completa, coleccionar Pokémon mediante un sistema de gacha (Gachamón), gestionar su almacenamiento personal (PC) y formar equipos de combate.

El proyecto combina elementos de entretenimiento con mecánicas de colección, ofreciendo una experiencia completa de gestión de Pokémon en un entorno web moderno y responsivo.

---

## 2. Motivación y Justificación

### Motivación Personal

La franquicia Pokémon ha sido una parte importante de mi infancia y continúa siendo una fuente de inspiración. Este proyecto nace del deseo de combinar mi pasión por Pokémon con las habilidades técnicas adquiridas durante el ciclo formativo.

### Justificación Técnica

- **Aplicación Full-Stack**: Permite demostrar conocimientos tanto de frontend como de backend.
- **Integración con API externa**: Uso de PokéAPI para obtener datos reales de Pokémon.
- **Gestión de usuarios y sesiones**: Implementación de autenticación y persistencia de datos.
- **Base de datos relacional**: Diseño y gestión de MySQL para almacenamiento de usuarios y Pokémon.
- **Experiencia de usuario**: Diseño responsivo y atractivo con animaciones e interactividad.

### Justificación de Mercado

Existe una comunidad muy amplia de fans de Pokémon que disfrutan de aplicaciones relacionadas con la franquicia. La mecánica de gacha es extremadamente popular en la industria del gaming, generando alto engagement y retención de usuarios.

---

## 3. Objetivos del Proyecto

### Objetivos Generales

1. Desarrollar una aplicación web completa de temática Pokémon.
2. Implementar un sistema de autenticación de usuarios.
3. Integrar datos externos desde PokéAPI.
4. Crear una experiencia de usuario atractiva y fluida.

### Objetivos Específicos

1. **Pokédex completa**: Visualización de los 1025 Pokémon con filtros por tipo y generación.
2. **Sistema Gachamón**: Mecánica de gacha con posibilidad de obtener Pokémon shiny (10% de probabilidad).
3. **PC de almacenamiento**: Sistema de 10 cajas con 20 slots cada una para guardar Pokémon obtenidos.
4. **Gestión de equipos**: Permitir crear equipos de hasta 6 Pokémon.
5. **Panel de administración**: Dashboard para gestionar usuarios, PCs y equipos.
6. **Persistencia de datos**: Almacenar toda la información en MySQL.
7. **Diseño responsivo**: Adaptación a diferentes dispositivos y tamaños de pantalla.

---

## 4. Estudio de Mercado

### Análisis de Competencia

| Aplicación | Características | Diferenciación de PokéImpact |
|------------|-----------------|------------------------------|
| Pokémon Showdown | Batallas competitivas | PokéImpact se centra en colección, no batallas |
| Pokémon HOME | Almacenamiento oficial | PokéImpact es gratuito y web sin necesidad de app |
| PokeGO | Realidad aumentada | PokéImpact es accesible desde navegador |
| Fan wikis | Solo información | PokéImpact añade interactividad y colección |

### Público Objetivo

- **Edad**: 12-35 años
- **Intereses**: Fans de Pokémon, coleccionistas, jugadores casuales
- **Perfil técnico**: Usuarios con acceso a navegador web (móvil o escritorio)

### Valor Añadido de PokéImpact

1. **Gratuito y accesible**: No requiere descarga de aplicaciones.
2. **Sistema de gacha atractivo**: Posibilidad de obtener Pokémon shiny.
3. **Gestión personal**: Cada usuario tiene su propio PC y equipo.
4. **Información completa**: Pokédex con todos los datos de cada Pokémon.

---

## 5. Guía de Estilos

### Paleta de Colores

| Color | Código Hexadecimal | Uso |
|-------|-------------------|-----|
| Rojo Pokémon | `#CC0000` / `#dc3545` | Botones principales, acentos |
| Negro | `#212529` | Fondos navbar, textos |
| Blanco | `#FFFFFF` | Fondos, textos sobre oscuro |
| Gris oscuro | `#343a40` | Cards, fondos secundarios |
| Amarillo | `#FFC107` | Indicador de Pokémon shiny |

### Tipografía

- **Fuente principal**: System fonts (Sans-serif)
- **Títulos**: `display-3` de Bootstrap
- **Textos**: Tamaño base de 16px

### Componentes UI

- **Botones**: Estilo Bootstrap con variantes `btn-danger`, `btn-outline-dark`, `btn-secondary`
- **Cards**: Esquinas redondeadas, sombras sutiles
- **Modales**: Bootstrap modals con backdrop
- **Navbar**: Fija en la parte superior, colapsable en móviles

### Iconografía

- **Bootstrap Icons**: Para iconos generales (búsqueda, usuario, logout)
- **Sprites oficiales**: De PokéAPI para representar Pokémon
- **Iconos de tipos**: SVG personalizados en `/tipos/`

### Animaciones

- Transiciones suaves en hover (0.3s ease)
- Animación de aparición en Gachamón
- Efectos de partículas al obtener Pokémon

---

## 6. Tecnologías, Librerías y Herramientas

### Frontend

| Tecnología | Versión | Uso |
|------------|---------|-----|
| HTML5 | - | Estructura de la aplicación |
| CSS3 | - | Estilos personalizados |
| JavaScript (ES6+) | - | Lógica del cliente |
| Bootstrap | 5.3.3 | Framework CSS, componentes UI |
| Bootstrap Icons | Latest | Iconografía |

### Backend

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Node.js | 18+ | Entorno de ejecución |
| Express.js | 5.1.0 | Framework servidor HTTP |
| MySQL2 | 3.15.3 | Driver de base de datos |
| express-session | 1.18.2 | Gestión de sesiones |
| express-mysql-session | 3.0.3 | Almacenamiento de sesiones en MySQL |
| bcryptjs | 3.0.2 | Hash de contraseñas |
| cookie-parser | 1.4.7 | Manejo de cookies |
| cors | 2.8.5 | Cross-Origin Resource Sharing |
| dotenv | 17.2.3 | Variables de entorno |

### Base de Datos

| Tecnología | Uso |
|------------|-----|
| MySQL | Base de datos relacional principal |
| XAMPP/MySQL Workbench | Gestión local de la base de datos |

### APIs Externas

| API | Uso |
|-----|-----|
| PokéAPI | Datos completos de Pokémon (sprites, tipos, stats, descripciones) |

### Herramientas de Desarrollo

| Herramienta | Uso |
|-------------|-----|
| Visual Studio Code | Editor de código |
| Git | Control de versiones |
| Postman / Navegador DevTools | Testing de APIs |
| XAMPP | Servidor MySQL local |

---

## 7. Arquitectura del Proyecto

### Estructura de Directorios

```
CODIGO/
├── backend/
│   ├── routes/
│   │   ├── adminRoutes.js    # Rutas del panel admin
│   │   ├── pcRoutes.js       # Rutas del PC
│   │   ├── teamRoutes.js     # Rutas del equipo
│   │   └── userRoutes.js     # Rutas de usuarios (login/register)
│   ├── db.js                 # Configuración MySQL
│   ├── server.js             # Servidor Express principal
│   └── package.json          # Dependencias backend
├── public/
│   ├── bootstrap-5.3.3-dist/ # Framework CSS
│   ├── img/                  # Imágenes del proyecto
│   ├── tipos/                # Iconos SVG de tipos Pokémon
│   ├── video/                # Video de intro
│   ├── index.html            # Página principal
│   ├── admin-panel.html      # Panel de administración
│   ├── script.js             # Lógica principal
│   ├── session.js            # Gestión de sesiones
│   ├── style.css             # Estilos principales
│   └── admin-style.css       # Estilos del panel admin
└── package.json              # Dependencias raíz
```

### Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                    NAVEGADOR                        │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │    │
│  │  │ HTML/CSS │  │   JS     │  │  Bootstrap 5.3   │   │    │
│  │  └──────────┘  └──────────┘  └──────────────────┘   │    │
│  └─────────────────────────────────────────────────────┘    │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP/AJAX
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       SERVIDOR                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │               EXPRESS.JS (Puerto 5000)              │    │
│  │  ┌────────────┐  ┌────────────┐  ┌──────────────┐   │    │
│  │  │ /api/users │  │ /api/pc    │  │ /api/admin   │   │    │
│  │  │ /api/team  │  │            │  │              │   │    │
│  │  └────────────┘  └────────────┘  └──────────────┘   │    │
│  └─────────────────────────────────────────────────────┘    │
└───────────────────────────┬─────────────────────────────────┘
                            │ MySQL Protocol
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    BASE DE DATOS                            │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   MySQL                             │    │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────────┐    │    │
│  │  │   users   │  │ pokemon_pc│  │ pokemon_team  │    │    │
│  │  └───────────┘  └───────────┘  └───────────────┘    │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     API EXTERNA                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                    PokéAPI                          │    │
│  │           https://pokeapi.co/api/v2/                │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Esquema de Base de Datos

```sql
-- Tabla de usuarios
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Pokémon en PC
CREATE TABLE pokemon_pc (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    pokemon_id INT NOT NULL,
    pokemon_name VARCHAR(50) NOT NULL,
    sprite_url VARCHAR(255),
    box_number INT DEFAULT 1,
    position_in_box INT,
    is_shiny BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de Pokémon en equipo
CREATE TABLE pokemon_team (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    pokemon_id INT NOT NULL,
    pokemon_name VARCHAR(50) NOT NULL,
    sprite_url VARCHAR(255),
    position INT NOT NULL,
    is_shiny BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de sesiones (generada automáticamente por express-mysql-session)
CREATE TABLE sessions (
    session_id VARCHAR(128) PRIMARY KEY,
    expires INT UNSIGNED NOT NULL,
    data TEXT
);
```

---

## 8. Funcionalidades Implementadas

### 8.1 Sistema de Autenticación

- **Registro de usuarios**: Con validación de campos y encriptación de contraseñas (bcrypt)
- **Inicio de sesión**: Verificación de credenciales y creación de sesión
- **Cierre de sesión**: Destrucción de sesión y limpieza de cookies
- **Persistencia de sesión**: Almacenamiento en MySQL con duración de 2 horas
- **Protección de rutas**: Middleware que verifica autenticación en rutas protegidas

### 8.2 Pokédex

- **Listado completo**: 1025 Pokémon de todas las generaciones
- **Búsqueda**: Por nombre o número de Pokédex
- **Filtro por tipo**: 18 tipos disponibles (Normal, Fuego, Agua, etc.)
- **Filtro por generación**: 9 generaciones
- **Modal de información**: Sprite, tipos, región, generación y biografía
- **Sprites oficiales**: Cargados desde PokéAPI

### 8.3 Gachamón (Sistema Gacha)

- **Sistema de monedas**: 10 monedas iniciales
- **Tirada de gacha**: Consume 1 moneda por tirada
- **Pokémon aleatorio**: De los 1025 disponibles
- **Probabilidad shiny**: 10% de obtener versión variocolor
- **Animación de aparición**: Efectos visuales y partículas
- **Añadido automático al PC**: El Pokémon obtenido se guarda en la primera caja disponible

### 8.4 PC (Almacenamiento)

- **10 cajas disponibles**: Navegación entre cajas con botones
- **20 slots por caja**: Capacidad total de 200 Pokémon
- **Visualización de sprites**: Diferenciación de Pokémon normales y shiny
- **Panel de información**: Al seleccionar un Pokémon muestra sus datos
- **Liberar Pokémon**: Elimina el Pokémon del PC
- **Añadir al equipo**: Transfiere el Pokémon al equipo activo
- **Sincronización con BD**: Los datos se guardan en MySQL

### 8.5 Mi Equipo

- **6 slots disponibles**: Límite de 6 Pokémon por equipo
- **Visualización detallada**: Artwork, nombre y descripción
- **Devolver al PC**: Transfiere el Pokémon de vuelta al PC
- **Sincronización automática**: Cambios reflejados en la base de datos

### 8.6 Panel de Administración

- **Acceso restringido**: Solo usuario "admin"
- **Dashboard**: Estadísticas generales (total usuarios, Pokémon en PCs, Pokémon en equipos)
- **Gestión de usuarios**: Listado con búsqueda y eliminación
- **Gestión de PCs**: Visualización con filtros por usuario y shiny
- **Gestión de equipos**: Visualización con filtro por usuario
- **Eliminación de registros**: Usuarios, Pokémon de PC y equipos

---

## 9. Pruebas y Validaciones

### 9.1 Pruebas de Funcionalidad

| Funcionalidad | Estado | Observaciones |
|---------------|--------|---------------|
| Registro de usuario | ✅ Funcional | Validación de campos y hash de contraseña |
| Login de usuario | ✅ Funcional | Sesión persistente en MySQL |
| Logout | ✅ Funcional | Destrucción de sesión y cookies |
| Búsqueda en Pokédex | ✅ Funcional | Por nombre y número |
| Filtros Pokédex | ✅ Funcional | Tipos y generaciones combinables |
| Gachamón tirada | ✅ Funcional | Pokémon aleatorio con probabilidad shiny |
| PC navegación | ✅ Funcional | 10 cajas con 20 slots |
| PC guardar Pokémon | ✅ Funcional | Persistencia en MySQL |
| PC liberar Pokémon | ✅ Funcional | Eliminación de BD |
| Añadir al equipo | ✅ Funcional | Transferencia PC → Equipo |
| Devolver al PC | ✅ Funcional | Transferencia Equipo → PC |
| Panel admin acceso | ✅ Funcional | Solo usuario "admin" |
| Panel admin estadísticas | ✅ Funcional | Datos reales de BD |
| Panel admin eliminar | ✅ Funcional | Con confirmación |

### 9.2 Pruebas de Compatibilidad

| Navegador | Versión | Estado |
|-----------|---------|--------|
| Chrome | 120+ | ✅ Compatible |
| Firefox | 120+ | ✅ Compatible |
| Edge | 120+ | ✅ Compatible |
| Safari | 17+ | ✅ Compatible |

### 9.3 Pruebas de Responsividad

| Dispositivo | Resolución | Estado |
|-------------|------------|--------|
| Móvil pequeño | 320px | ✅ Adaptado |
| Móvil medio | 375px | ✅ Adaptado |
| Tablet | 768px | ✅ Adaptado |
| Escritorio | 1024px+ | ✅ Adaptado |

### 9.4 Validación de Código

- **HTML**: Válido según W3C Validator
- **CSS**: Sin errores de sintaxis
- **JavaScript**: ESLint sin errores críticos

---

## 10. Problemas Encontrados y Soluciones

### Problema 1: Sesiones no persistentes

**Descripción**: Las sesiones se perdían al reiniciar el servidor.

**Causa**: Se usaba almacenamiento de sesiones en memoria (por defecto).

**Solución**: Implementar `express-mysql-session` para guardar sesiones en MySQL:
```javascript
const MySQLStore = MySQLStoreModule.default(session);
const sessionStore = new MySQLStore({
    expiration: 1000 * 60 * 60 * 2,
    createDatabaseTable: true,
}, db.promise());
```

### Problema 2: Rutas admin sin sesión

**Descripción**: Las rutas de administración devolvían error 401/403.

**Causa**: Las rutas `/api/admin` estaban montadas antes del middleware de sesión.

**Solución**: Mover `app.use("/api/admin", adminRoutes)` después del middleware de sesión.

### Problema 3: Login admin sin crear sesión

**Descripción**: Al hacer login como admin, la página de administración no cargaba datos.

**Causa**: El código del frontend redirigía directamente sin hacer la llamada al endpoint de login.

**Solución**: Modificar `session.js` para hacer fetch al endpoint de login antes de redirigir:
```javascript
if (username === "admin") {
    fetch("/api/users/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    }).then(res => {
        if (res.ok) window.location.href = "admin-panel.html";
    });
}
```

### Problema 4: Error en consulta de usuarios admin

**Descripción**: La tabla de usuarios en el panel admin mostraba error.

**Causa**: La consulta SQL con GROUP BY y la columna `created_at` fallaba.

**Solución**: Simplificar la consulta eliminando JOINs complejos y haciendo consultas individuales por usuario.

### Problema 5: CORS y cookies

**Descripción**: Las cookies de sesión no se enviaban entre cliente y servidor.

**Causa**: Faltaba configuración de CORS y credenciales.

**Solución**: Añadir `credentials: "include"` en todas las peticiones fetch y configurar cookies correctamente.

---

## 11. Resultados

### Métricas del Proyecto

| Métrica | Valor |
|---------|-------|
| Archivos totales | 15+ |
| Líneas de código JavaScript | ~3000 |
| Líneas de código CSS | ~800 |
| Endpoints API | 12 |
| Tablas de base de datos | 4 |
| Pokémon disponibles | 1025 |
| Generaciones cubiertas | 9 |
| Tipos de Pokémon | 18 |

### Objetivos Cumplidos

| Objetivo | Estado |
|----------|--------|
| Pokédex completa | ✅ 100% |
| Sistema Gachamón | ✅ 100% |
| PC de almacenamiento | ✅ 100% |
| Gestión de equipos | ✅ 100% |
| Autenticación de usuarios | ✅ 100% |
| Panel de administración | ✅ 100% |
| Diseño responsivo | ✅ 100% |
| Persistencia en MySQL | ✅ 100% |

---

## 12. Conclusiones

### Logros Técnicos

El desarrollo de PokéImpact ha permitido demostrar competencias en:

1. **Desarrollo Full-Stack**: Implementación completa de frontend y backend.
2. **Diseño de APIs REST**: Endpoints bien estructurados y documentados.
3. **Gestión de bases de datos**: Diseño de esquemas relacionales en MySQL.
4. **Autenticación y seguridad**: Sesiones seguras con hash de contraseñas.
5. **Integración de APIs externas**: Consumo de PokéAPI para datos de Pokémon.
6. **Diseño UI/UX**: Interfaz atractiva y responsiva con Bootstrap.

### Aprendizajes

- La importancia de la planificación antes de codificar.
- Debugging de problemas de autenticación y sesiones.
- Manejo de asincronía en JavaScript (async/await, Promises).
- Buenas prácticas en desarrollo de APIs.
- Importancia de la validación tanto en cliente como en servidor.

### Valoración Personal

El proyecto ha sido una experiencia enriquecedora que ha permitido aplicar conocimientos teóricos en un proyecto práctico y funcional. La temática Pokémon ha añadido motivación extra durante el desarrollo.

---

## 13. Propuestas de Mejora

### Mejoras a Corto Plazo

1. **Sistema de batallas**: Implementar combates entre Pokémon con cálculo de daño basado en stats.
2. **Intercambio de Pokémon**: Permitir intercambio entre usuarios.
3. **Notificaciones**: Sistema de notificaciones en tiempo real.
4. **Perfil de usuario**: Página con estadísticas personales.

### Mejoras a Medio Plazo

1. **PWA (Progressive Web App)**: Permitir instalación en dispositivos móviles.
2. **Modo offline**: Caché de datos para uso sin conexión.
3. **Sistema de logros**: Badges por completar objetivos.
4. **Marketplace**: Tienda de artículos y objetos.

### Mejoras a Largo Plazo

1. **Multijugador en tiempo real**: WebSockets para interacciones en vivo.
2. **Torneos**: Sistema de competición entre usuarios.
3. **App móvil nativa**: Versión para Android/iOS.
4. **Localización**: Soporte para múltiples idiomas.

---

## 14. Bibliografía y Referencias

### Documentación Oficial

- [Express.js Documentation](https://expressjs.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.3/)
- [Node.js Documentation](https://nodejs.org/docs/)

### APIs y Recursos

- [PokéAPI](https://pokeapi.co/) - API oficial de datos Pokémon
- [Bootstrap Icons](https://icons.getbootstrap.com/)

### Tutoriales y Guías

- MDN Web Docs - JavaScript, HTML, CSS
- Stack Overflow - Resolución de problemas específicos

### Recursos Gráficos

- Sprites oficiales de Pokémon (vía PokéAPI)
- Iconos de tipos creados para el proyecto

---

## 15. Manual Técnico / Instalación

### Requisitos Previos

- **Node.js** versión 18 o superior
- **MySQL** versión 8 o superior (o XAMPP con MySQL)
- **Git** (opcional, para clonar el repositorio)
- **Navegador web** moderno (Chrome, Firefox, Edge)

### Paso 1: Clonar o Descargar el Proyecto

```bash
# Opción A: Clonar con Git
git clone https://github.com/erikthevasco/pokeimpact_tfc
cd PROYECTO-WEB/CODIGO

# Opción B: Descargar ZIP y extraer
```

### Paso 2: Configurar la Base de Datos

1. Iniciar MySQL (XAMPP o servicio MySQL)
2. Crear la base de datos:

```sql
CREATE DATABASE pokeimpact_db;
USE pokeimpact_db;

-- Crear tabla de usuarios
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de PC
CREATE TABLE pokemon_pc (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    pokemon_id INT NOT NULL,
    pokemon_name VARCHAR(50) NOT NULL,
    sprite_url VARCHAR(255),
    box_number INT DEFAULT 1,
    position_in_box INT,
    is_shiny BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Crear tabla de equipo
CREATE TABLE pokemon_team (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    pokemon_id INT NOT NULL,
    pokemon_name VARCHAR(50) NOT NULL,
    sprite_url VARCHAR(255),
    position INT NOT NULL,
    is_shiny BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Crear usuario admin 
INSERT INTO users (username, email, password) 
VALUES ('admin', 'admin@pokeimpact.com', '$2a$10$...[HASH_BCRYPT]');
```

### Paso 3: Configurar el Backend

1. Navegar al directorio backend:
```bash
cd backend
```

2. Instalar dependencias:
```bash
npm install
```

3. Verificar configuración de base de datos en `db.js`:
```javascript
const db = mysql.createPool({
    host: "localhost",
    user: "root",           // Tu usuario MySQL
    password: "",           // Tu contraseña MySQL
    database: "pokeimpact_db",
});
```

### Paso 4: Iniciar el Servidor

```bash
npm start
# o
node server.js
```

El servidor estará disponible en: `http://localhost:5000`

### Paso 5: Acceder a la Aplicación

Abrir en el navegador: `http://localhost:5000`

### Estructura de Endpoints API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/users/register` | Registrar usuario |
| POST | `/api/users/login` | Iniciar sesión |
| POST | `/api/users/logout` | Cerrar sesión |
| GET | `/api/users/me` | Obtener usuario actual |
| GET | `/api/pc` | Obtener PC del usuario |
| POST | `/api/pc` | Añadir Pokémon al PC |
| DELETE | `/api/pc/:id` | Eliminar Pokémon del PC |
| GET | `/api/team` | Obtener equipo del usuario |
| POST | `/api/team` | Añadir Pokémon al equipo |
| DELETE | `/api/team/:id` | Eliminar Pokémon del equipo |
| GET | `/api/admin/stats` | Estadísticas admin |
| GET | `/api/admin/users` | Listar usuarios |
| GET | `/api/admin/pcs` | Listar todos los PCs |
| GET | `/api/admin/teams` | Listar todos los equipos |

---

## 16. Manual de Usuario

### 16.1 Registro e Inicio de Sesión

1. **Acceder a la página principal**: `http://localhost:5000`
2. **Pantalla de bienvenida**: Hacer clic en "Entrar"
3. **Registrarse**:
   - Clic en "Registrarse"
   - Completar: nombre de usuario, email y contraseña
   - Clic en "Registrarse"
4. **Iniciar sesión**:
   - Clic en "Iniciar sesión"
   - Introducir usuario y contraseña
   - Clic en "Entrar"

### 16.2 Navegación

El menú de navegación contiene:
- **Home**: Página principal con buscador de Pokémon
- **Pokédex**: Catálogo completo de Pokémon
- **PC**: Almacenamiento personal de Pokémon
- **Gachamón**: Obtener Pokémon aleatorios
- **Mi Equipo**: Gestionar equipo activo

### 16.3 Usar la Pokédex

1. Acceder a "Pokédex" desde el menú
2. **Buscar**: Escribir nombre o número en el buscador
3. **Filtrar por tipo**: Hacer clic en los iconos de tipos
4. **Filtrar por generación**: Hacer clic en Gen 1-9
5. **Ver detalles**: Hacer clic en cualquier Pokémon para ver su información

### 16.4 Usar el Gachamón

1. Acceder a "Gachamón" desde el menú (requiere iniciar sesión)
2. Verificar monedas disponibles (10 iniciales)
3. Hacer clic en "Tirar 1 Moneda"
4. El Pokémon obtenido se añade automáticamente al PC
5. Si no tienes monedas, haz clic en "Rellenar Monedas"

### 16.5 Gestionar el PC

1. Acceder a "PC" desde el menú
2. Navegar entre cajas con las flechas ⬅️ ➡️
3. Hacer clic en un Pokémon para seleccionarlo
4. En el panel izquierdo aparece:
   - Información del Pokémon
   - Botón "Liberar Pokémon" para eliminarlo
   - Botón "Añadir al equipo" para transferirlo

### 16.6 Gestionar Mi Equipo

1. Acceder a "Mi Equipo" desde el menú
2. Ver los 6 slots de equipo
3. Hacer clic en un Pokémon para ver sus detalles
4. Usar "Devolver al PC" para transferirlo de vuelta

### 16.7 Panel de Administración

**Solo para usuario "admin"**

1. Iniciar sesión como "admin"
2. Se redirige automáticamente al panel de administración
3. **Dashboard**: Ver estadísticas generales
4. **Usuarios**: Buscar y eliminar usuarios
5. **PCs**: Filtrar por usuario y estado shiny
6. **Equipos**: Filtrar por usuario

### 16.8 Cerrar Sesión

1. Hacer clic en "Cerrar sesión" en la esquina superior derecha
2. Confirmar la acción
3. Se limpia la sesión y los datos locales

---

**© 2025 PokéImpact - Trabajo de Fin de Ciclo**

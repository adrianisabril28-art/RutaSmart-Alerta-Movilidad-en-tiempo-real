// CONFIGURACIÓN (Necesitarás tu token de Mapbox)
const MAPBOX_TOKEN = 'TU_TOKEN_DE_MAPBOX_AQUI'; // Reemplaza esto

// Referencia al contenedor de vistas
const viewContainer = document.getElementById('view-container');

// 1. GESTIÓN DE LA NAVEGACIÓN (SPA)
const navLinks = document.querySelectorAll('.nav-links li');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Remover clase activa de todos y añadir al clickeado
        document.querySelector('.nav-links li.active').classList.remove('active');
        link.classList.add('active');

        const view = link.getAttribute('data-view');
        loadView(view); // Cargar la vista correspondiente
    });
});

// Función para cargar contenido dinámicamente
function loadView(viewName) {
    switch (viewName) {
        case 'inicio':
            renderInicio();
            break;
        case 'mapa':
            renderMapa();
            break;
        case 'reportar':
            renderReportar();
            break;
        // ... añadir casos para rutas, estadísticas, alertas
        default:
            renderInicio();
    }
}

// 2. RENDERIZADO DE VISTAS (Mocking del HTML para cada pantalla)

// 01. INICIO
function renderInicio() {
    viewContainer.innerHTML = `
        <div class="view-container-padding">
            <h1 class="view-title">Muévete mejor.<br> Llega más lejos.</h1>
            <h2 class="view-subtitle">Consulta el estado de la movilidad y encuentra<br> alternativas antes de salir.</h2>
            
            <div style="display: flex; gap: 15px; margin-bottom: 40px;">
                <button class="btn-primary">Explorar movilidad</button>
                <button class="btn-primary" style="background-color: rgba(59,130,246,0.1); color: var(--primary);">Reportar incidente</button>
            </div>

            <div class="card">
                <h3>Estado general de la movilidad</h3>
                <div style="display: flex; justify-content: space-around; padding-top: 20px;">
                    <div style="text-align: center; color: #4caf50;"><i class="fas fa-traffic-light fa-2x"></i><br>Fluida<br>72%</div>
                    <div style="text-align: center; color: #ff9800;"><i class="fas fa-car-crash fa-2x"></i><br>Moderada<br>18%</div>
                    <div style="text-align: center; color: #f44336;"><i class="fas fa-exclamation-triangle fa-2x"></i><br>Crítica<br>7%</div>
                </div>
            </div>
        </div>
    `;
}

// 02. MAPA
function renderMapa() {
    viewContainer.innerHTML = `
        <div id="map-full" style="height: calc(100vh - 71px); width: 100%;"></div>
        <!-- Superposición de paneles (leyenda, filtros) -->
    `;
    
    // Inicializar Mapbox (requiere token válido)
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
        container: 'map-full',
        style: 'mapbox://styles/mapbox/dark-v11', // Tema oscuro
        center: [-74.07, 4.60], // Bogotá
        zoom: 12
    });

    // Mock de puntos (esto vendría de tu backend GET /api/incidents)
    const geojson = {
        'type': 'FeatureCollection',
        'features': [
            {'type': 'Feature', 'geometry': {'type': 'Point', 'coordinates': [-74.06, 4.61]}, 'properties': {'title': 'Accidente', 'type': 'accident'}},
            {'type': 'Feature', 'geometry': {'type': 'Point', 'coordinates': [-74.08, 4.63]}, 'properties': {'title': 'Cerrada', 'type': 'closed'}}
        ]
    };

    // Añadir marcadores
    geojson.features.forEach(marker => {
        const el = document.createElement('div');
        el.className = `marker ${marker.properties.type}`; // Estilar en CSS
        new mapboxgl.Marker(el).setLngLat(marker.coordinates).addTo(map);
    });
}

// 04. REPORTAR INCIDENTE
function renderReportar() {
    viewContainer.innerHTML = `
        <div class="view-container-padding">
            <h1 class="view-title">¿Qué está ocurriendo?</h1>
            <h2 class="view-subtitle">Selecciona el tipo de incidente y reporta.</h2>

            <form id="incident-form">
                <div class="card" style="display: flex; gap: 15px; justify-content: space-around; flex-wrap: wrap; text-align: center;">
                    <label style="cursor:pointer;"><input type="radio" name="incidentType" value="accident"> <i class="fas fa-car-crash fa-2x"></i> Accidente</label>
                    <label style="cursor:pointer;"><input type="radio" name="incidentType" value="works"> <i class="fas fa-road fa-2x"></i> Obras</label>
                    <label style="cursor:pointer;"><input type="radio" name="incidentType" value="traffic"> <i class="fas fa-traffic-light fa-2x"></i> Tráfico</label>
                </div>

                <div class="card">
                    <h3>Ubicación</h3>
                    <div id="map-report" style="height: 150px; border-radius: 8px; margin: 10px 0;"></div>
                    <p style="color:var(--text-muted);">Ubica en el mapa o busca la dirección</p>
                </div>

                <div class="card">
                    <h3>Descripción</h3>
                    <textarea id="description" placeholder="Cuéntanos más detalles..." style="width:100%; padding:10px; background:var(--bg-dark); color:white; border:1px solid var(--border); border-radius:8px; height:100px;"></textarea>
                </div>

                <div style="text-align: right; margin-top: 30px;">
                    <button type="submit" class="btn-primary">Enviar reporte</button>
                </div>
            </form>
        </div>
    `;

    // Inicializar mapa pequeño de reporte
    mapboxgl.accessToken = MAPBOX_TOKEN;
    new mapboxgl.Map({
        container: 'map-report',
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [-74.07, 4.60],
        zoom: 13
    });

    // Manejar envío del formulario (POST a backend /api/incidents)
    document.getElementById('incident-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const type = document.querySelector('input[name="incidentType"]:checked')?.value;
        const description = document.getElementById('description').value;

        // Aquí harías el fetch a tu backend
        console.log('Reporte enviado:', { type, description });
        alert('Reporte enviado exitosamente');
        // Reset form...
    });
}

// CARGAR INICIO POR DEFECTO
loadView('inicio');
function loadView(viewName) {
    switch (viewName) {
        case 'inicio':
            renderInicio();
            break;
        case 'mapa':
            renderMapa();
            break;
        case 'rutas':
            renderPlanificarRuta();
            break;
        case 'reportar':
            renderReportar();
            break;
        case 'estadisticas':
            renderEstadisticas();
            break;
        case 'alertas':
            renderAlertas();
            break;
        default:
            renderInicio();
    }
}
function renderPlanificarRuta() {
    viewContainer.innerHTML = `
        <div class="view-container-padding">
            <h1 class="view-title">Planifica tu ruta</h1>
            <div class="card">
                <input type="text" placeholder="Punto de partida" style="width:100%; margin-bottom:10px; padding:10px; background:var(--bg-dark); color:white; border:1px solid var(--border); border-radius:8px;">
                <input type="text" placeholder="Destino" style="width:100%; margin-bottom:15px; padding:10px; background:var(--bg-dark); color:white; border:1px solid var(--border); border-radius:8px;">
                <button class="btn-primary" style="width:100%;">Buscar rutas</button>
            </div>
            <h3 style="margin-bottom:15px;">Rutas disponibles</h3>
            <div class="card" style="border-left: 4px solid #4caf50;">
                <p style="color:#4caf50; font-weight:bold;">Ruta recomendada</p>
                <h2>32 min <span style="font-size:0.9rem; color:var(--text-muted);">(12.4 km)</span></h2>
                <p style="color:var(--text-muted); font-size:0.85rem;">Vías fluidas sin reportes importantes</p>
            </div>
            <div class="card" style="border-left: 4px solid #ff9800;">
                <p style="color:#ff9800; font-weight:bold;">Ruta alternativa</p>
                <h2>38 min <span style="font-size:0.9rem; color:var(--text-muted);">(14.1 km)</span></h2>
                <p style="color:var(--text-muted); font-size:0.85rem;">Congestión moderada en Av. Caracas</p>
            </div>
        </div>
    `;
}
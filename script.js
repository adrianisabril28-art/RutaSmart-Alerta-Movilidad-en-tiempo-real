document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicialización del Mapa con Leaflet (Centrado en Bogotá)
    const bogotaCoords = [4.6097, -74.0817];
    const map = L.map('map').setView(bogotaCoords, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Botón para centrar el mapa en Bogotá
    const btnCentrar = document.getElementById('centrarMapa');
    if (btnCentrar) {
        btnCentrar.addEventListener('click', () => {
            map.setView(bogotaCoords, 13);
        });
    }

    // 2. Recuperar reportes guardados en localStorage (si existen)
    let reportes = JSON.parse(localStorage.getItem('rutasmart_reportes')) || [];

    // Capa para agrupar los marcadores en el mapa
    let marcadoresLayer = L.layerGroup().addTo(map);

    // Referencias a elementos del DOM
    const formularioIncidente = document.getElementById('formularioIncidente');
    const formularioRuta = document.getElementById('formularioRuta');
    
    const totalReportesEl = document.getElementById('totalReportes');
    const totalIncidentesEl = document.getElementById('totalIncidentes');
    const totalCongestionesEl = document.getElementById('totalCongestiones');
    const contadorReportesEl = document.getElementById('contadorReportes');
    
    const estadisticaReportesEl = document.getElementById('estadisticaReportes');
    const estadisticaIncidentesEl = document.getElementById('estadisticaIncidentes');
    const estadisticaCongestionesEl = document.getElementById('estadisticaCongestiones');
    
    const listaReportesEl = document.getElementById('listaReportes');
    const listaAlertasEl = document.getElementById('listaAlertas');
    const resultadoReporteEl = document.getElementById('resultadoReporte');
    const resultadoRutaEl = document.getElementById('resultadoRuta');

    // Función auxiliar para generar coordenadas simuladas basadas en texto dentro de Bogotá
    function obtenerCoordenadasSimuladas(texto) {
        let hash = 0;
        for (let i = 0; i < texto.length; i++) {
            hash = texto.charCodeAt(i) + ((hash << 5) - hash);
        }
        const latOffset = (hash % 100) / 2000;
        const lngOffset = ((hash >> 3) % 100) / 2000;
        return [bogotaCoords[0] + latOffset, bogotaCoords[1] + lngOffset];
    }

    // Función para renderizar los marcadores guardados en el mapa
    function renderizarMarcadoresMapa() {
        marcadoresLayer.clearLayers();
        reportes.forEach(r => {
            if (r.coords) {
                const marker = L.marker(r.coords).addTo(marcadoresLayer);
                marker.bindPopup(`<b>${r.tipo}</b><br>${r.ubicacion}<br><small>${r.descripcion}</small>`);
            }
        });
    }

    // 3. Manejo del Formulario de Incidentes
    if (formularioIncidente) {
        formularioIncidente.addEventListener('submit', (e) => {
            e.preventDefault();

            const tipo = document.getElementById('tipoIncidente').value;
            const ubicacion = document.getElementById('ubicacion').value;
            const descripcion = document.getElementById('descripcion').value;

            if (!tipo || !ubicacion || !descripcion) return;

            const coords = obtenerCoordenadasSimuladas(ubicacion);
            
            const nuevoReporte = {
                id: Date.now(),
                tipo,
                ubicacion,
                descripcion,
                coords,
                fecha: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            reportes.unshift(nuevoReporte);
            
            // Guardar en localStorage
            localStorage.setItem('rutasmart_reportes', JSON.stringify(reportes));

            renderizarMarcadoresMapa();
            actualizarInterfaz();

            formularioIncidente.reset();
            if (resultadoReporteEl) {
                resultadoReporteEl.textContent = '¡Reporte registrado exitosamente!';
                resultadoReporteEl.style.color = '#34d399';
                setTimeout(() => { resultadoReporteEl.textContent = ''; }, 4000);
            }
        });
    }

    // 4. Manejo del Formulario de Planificación de Rutas
    if (formularioRuta) {
        formularioRuta.addEventListener('submit', (e) => {
            e.preventDefault();
            const origen = document.getElementById('origen').value;
            const destino = document.getElementById('destino').value;

            if (!origen || !destino) return;

            const coordsOrigen = obtenerCoordenadasSimuladas(origen);
            const coordsDestino = obtenerCoordenadasSimuladas(destino + 'dest');

            // Crear marcadores temporales de ruta en el mapa
            const tempLayer = L.layerGroup().addTo(map);
            L.marker(coordsOrigen).addTo(tempLayer).bindPopup(`<b>Origen:</b> ${origen}`).openPopup();
            L.marker(coordsDestino).addTo(tempLayer).bindPopup(`<b>Destino:</b> ${destino}`);

            // Ajustar el zoom del mapa para abarcar ambos puntos
            const bounds = L.latLngBounds([coordsOrigen, coordsDestino]);
            map.fitBounds(bounds, { padding: [50, 50] });

            if (resultadoRutaEl) {
                resultadoRutaEl.textContent = `Mostrando la ruta entre "${origen}" y "${destino}" en el mapa.`;
                resultadoRutaEl.style.color = '#38bdf8';
            }
        });
    }

    // 5. Actualización Dinámica de Contadores, Listas y Alertas
    function actualizarInterfaz() {
        const total = reportes.length;
        const incidentesCount = reportes.filter(r => r.tipo === 'Accidente' || r.tipo === 'Cierre vial' || r.tipo === 'Obras' || r.tipo === 'Inundación' || r.tipo === 'Zona insegura' || r.tipo === 'Otro').length;
        const congestionesCount = reportes.filter(r => r.tipo === 'Congestión' || r.tipo === 'Manifestación').length;

        // Actualizar contadores globales y estadísticas
        if (totalReportesEl) totalReportesEl.textContent = total;
        if (totalIncidentesEl) totalIncidentesEl.textContent = incidentesCount;
        if (totalCongestionesEl) totalCongestionesEl.textContent = congestionesCount;
        if (contadorReportesEl) contadorReportesEl.textContent = total;
        
        if (estadisticaReportesEl) estadisticaReportesEl.textContent = total;
        if (estadisticaIncidentesEl) estadisticaIncidentesEl.textContent = incidentesCount;
        if (estadisticaCongestionesEl) estadisticaCongestionesEl.textContent = congestionesCount;

        // Renderizar la lista lateral de reportes
        if (listaReportesEl) {
            if (total === 0) {
                listaReportesEl.innerHTML = `
                    <div class="empty-state">
                        <span class="empty-icon">◎</span>
                        <p>Aún no hay reportes.</p>
                        <small>Los reportes aparecerán aquí.</small>
                    </div>
                `;
            } else {
                listaReportesEl.innerHTML = reportes.map(r => `
                    <div class="report-item">
                        <div class="report-item-top">
                            <h4>${r.tipo}</h4>
                            <small>${r.fecha}</small>
                        </div>
                        <p>${r.ubicacion}</p>
                        <span class="report-tag">${r.descripcion}</span>
                    </div>
                `).join('');
            }
        }

        // Renderizar el centro de alertas
        if (listaAlertasEl) {
            if (total === 0) {
                listaAlertasEl.innerHTML = `
                    <div class="content-card empty-alerts">
                        <span class="empty-icon">♧</span>
                        <div>
                            <h3>No hay alertas por ahora</h3>
                            <p>Cuando registres un incidente, aparecerá aquí.</p>
                        </div>
                    </div>
                `;
            } else {
                listaAlertasEl.innerHTML = reportes.map(r => `
                    <div class="alert-card">
                        <span class="alert-symbol">⚠️</span>
                        <div>
                            <div style="display: flex; gap: 10px; align-items: center;">
                                <h3>${r.tipo}</h3>
                                <small>${r.fecha}</small>
                            </div>
                            <p><strong>Ubicación:</strong> ${r.ubicacion}</p>
                            <p>${r.descripcion}</p>
                        </div>
                    </div>
                `).join('');
            }
        }
    }

    // Inicializar datos al cargar la página
    renderizarMarcadoresMapa();
    actualizarInterfaz();

    // 6. Navegación activa en la barra lateral
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

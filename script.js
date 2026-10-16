"use strict";
/* Módulo de IA generativa - RutaSmart Alerta (independiente de script.js) */
(function () {
const $ = (id) => document.getElementById(id);

/* ---------- Utilidades IA ---------- */
function mostrar(el, html) { el.hidden = false; el.innerHTML = html; }

async function copiar(texto, estado) {
  try {
    await navigator.clipboard.writeText(texto);
    estado.textContent = "Copiado al portapapeles.";
  } catch {
    estado.textContent = "No se pudo copiar automáticamente: selecciona el texto y cópialo.";
  }
}

/* 2. Diagnóstico: da pistas, no respuestas */
$("iaDiagnostico").addEventListener("submit", (e) => {
  e.preventDefault();
  const preguntas = [
    ["iaD1", "Ejemplifica: ¿qué tipo de contenido genera y con qué lo entrenan?"],
    ["iaD2", "¿Qué fuentes oficiales comprobarías y qué harías si dos fuentes no coinciden?"],
    ["iaD3", "¿Qué pasaría si defiendes oralmente algo que no escribiste tú?"]
  ];
  const pistas = preguntas
    .filter(([id]) => $(id).value.trim().length < 60)
    .map(([, pista]) => `<li>${pista}</li>`);
  mostrar($("iaDiagnosticoResultado"), pistas.length
    ? `<strong>Amplía estas respuestas:</strong><ul>${pistas.join("")}</ul>`
    : "Buen punto de partida. Ahora contrasta tus respuestas con las fuentes y llévalas a tu tutor de IA.");
});

/* 3. Prompt de tutoría (basado en el prompt del taller) */
$("iaPreguntaForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = $("iaNombre").value.trim();
  const asig = $("iaAsignatura").value.trim();
  const tema = $("iaTema").value.trim();
  const enlaces = $("iaEnlaces").value.trim();
  const prompt = `Hola. Mi nombre es ${nombre} y quiero que actúes como mi tutor personal durante un taller sobre ${tema}, de la asignatura ${asig}.
Usaremos la IA generativa como acompañamiento para aprender, investigar, desarrollar pensamiento crítico y construir mi propio contenido.

1. Principios: sé objetivo; diferencia hechos verificables, interpretaciones y recomendaciones; indica incertidumbre; no inventes autores, investigaciones, enlaces, normas ni referencias; reconoce cuando no sepas; ayúdame a detectar errores, sesgos e información desactualizada.

2. Fuentes principales (proporcionadas por mí):
${enlaces}
Puedes complementar con fuentes confiables, indicando de dónde proviene cada dato y priorizando documentación oficial y académica. Enséñame a citar en APA 7.

3. Evaluación inicial: antes de explicar, hazme al menos tres preguntas diagnósticas sobre ${tema} (conceptual, comprensión, aplicación o experiencia previa). No des las respuestas; espera las mías.

4. Tutoría progresiva: según mis respuestas, identifica lo que comprendo y mis vacíos, explica solo lo necesario, aumenta la dificultad y relaciona los conceptos con ${asig}.

5. Pensamiento crítico: pídeme periódicamente analizar afirmaciones, detectar errores, comparar alternativas, cuestionar respuestas de IA y contrastar con las fuentes. Si me equivoco, primero dame una pista o pregunta; no me des la respuesta de inmediato.

6. Contenido propio: pídeme que explique con mis palabras, analiza mi texto, dime qué mejorar y déjame escribir una nueva versión antes de proponer una corregida.

7. Redacción: revisa ortografía, puntuación, coherencia, claridad y vocabulario, explicando brevemente cada error.

8. APA 7: enséñame a citar y verifica que las fuentes existan antes de dar una referencia.

9. Uso responsable: pregúntame por confiabilidad, privacidad, propiedad intelectual y transparencia en el uso de IA.

10. Regla principal: eres tutor, orientador y evaluador. No desarrolles el taller por mí.

Mi contexto: ${$("iaContexto").value.trim()}
Mi primera necesidad: ${$("iaPregunta").value.trim()}

Preséntate brevemente y haz las tres primeras preguntas diagnósticas sobre ${tema}.`;
  $("iaPromptGenerado").value = prompt;
  $("iaPromptResultado").hidden = false;
  $("iaPromptEstado").textContent = "";
});
$("iaCopiarPrompt").addEventListener("click", () =>
  copiar($("iaPromptGenerado").value, $("iaPromptEstado")));

/* 4. Verificación */
$("iaRevisarFuentes").addEventListener("click", () => {
  const marcas = document.querySelectorAll(".iaVerificacion");
  const hechas = [...marcas].filter((c) => c.checked).length;
  mostrar($("iaFuentesResultado"), hechas === marcas.length
    ? "Completaste la verificación. Puedes usar la información con confianza razonable."
    : `Llevas ${hechas} de ${marcas.length} pasos. Completa los restantes antes de usar la información.`);
});

/* 6. Retroalimentación */
$("iaCrearRetro").addEventListener("click", () => {
  const texto = $("iaTextoPropio").value.trim();
  if (!texto) { $("iaRetroEstado").textContent = "Escribe primero tu explicación."; $("iaRetroResultado").hidden = false; return; }
  $("iaRetroPrompt").value =
`Actúa como mi tutor. Revisa mi explicación y enfócate en: ${$("iaRetroPregunta").value}.
No reescribas el texto: dime qué está bien, qué debo precisar, qué errores hay y hazme preguntas para que yo escriba una nueva versión.

Mi explicación:
${texto}`;
  $("iaRetroResultado").hidden = false;
  $("iaRetroEstado").textContent = "";
});
$("iaCopiarRetro").addEventListener("click", () =>
  copiar($("iaRetroPrompt").value, $("iaRetroEstado")));

/* 7. APA 7 (borrador) */
$("iaCrearAPA").addEventListener("click", () => {
  const autor = $("iaAutor").value.trim();
  const anio = $("iaAnio").value.trim() || "s. f.";
  const titulo = $("iaTituloFuente").value.trim();
  const url = $("iaUrlFuente").value.trim();
  const caja = $("iaAPAResultado");
  if (!autor || !titulo || !url) {
    mostrar(caja, "Completa autor, título y URL con datos reales.");
    return;
  }
  caja.hidden = false;
  caja.textContent = "";
  const ref = document.createElement("p");
  ref.append(`${autor}. (${anio}). `);
  const i = document.createElement("em");
  i.textContent = titulo;
  ref.append(i, `. ${url}`);
  caja.append(ref);
});

/* 8. Defensa oral */
$("iaLimpiarDefensa").addEventListener("click", () => { $("iaDefensa").value = ""; });

/* 9. Registro del proceso */
$("iaCrearRegistro").addEventListener("click", () => {
  $("iaRegistroResumen").value =
`REGISTRO DEL USO DE IA
Pregunta formulada: ${$("iaRegistroPregunta").value.trim()}
Aporte de la IA: ${$("iaRegistroAporte").value.trim()}
Cómo verifiqué la respuesta: ${$("iaRegistroVerificacion").value.trim()}
Lo que aprendí o cambié por mi cuenta: ${$("iaRegistroCambio").value.trim()}`;
  $("iaRegistroResultado").hidden = false;
  $("iaRegistroEstado").textContent = "";
});
$("iaCopiarRegistro").addEventListener("click", () =>
  copiar($("iaRegistroResumen").value, $("iaRegistroEstado")));
})();
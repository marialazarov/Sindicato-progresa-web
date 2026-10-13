/* =========================================================
   CALENDARIO LABORAL · COMUNIDAD DE MADRID
   ---------------------------------------------------------
   Para añadir un año nuevo, copia uno de los bloques de
   FESTIVOS y cambia las fechas (formato "AAAA-MM-DD").
   Tipos: "nacional", "autonomico" o "local".
   ========================================================= */
const FESTIVOS = {
    2026: {
        fuente: { texto: 'Decreto 75/2025 (BOCM nº 229, 25/09/2025)', url: 'https://www.bocm.es/boletin/CM_Orden_BOCM/2025/09/25/BOCM-20250925-16.PDF' },
        nota: '',
        dias: [
            { fecha: '2026-01-01', nombre: 'Año Nuevo',                                 tipo: 'nacional' },
            { fecha: '2026-01-06', nombre: 'Epifanía del Señor',                        tipo: 'nacional' },
            { fecha: '2026-04-02', nombre: 'Jueves Santo',                              tipo: 'autonomico' },
            { fecha: '2026-04-03', nombre: 'Viernes Santo',                             tipo: 'nacional' },
            { fecha: '2026-05-01', nombre: 'Fiesta del Trabajo',                        tipo: 'nacional' },
            { fecha: '2026-05-02', nombre: 'Fiesta de la Comunidad de Madrid',          tipo: 'autonomico' },
            { fecha: '2026-05-15', nombre: 'San Isidro Labrador',                       tipo: 'local' },
            { fecha: '2026-08-15', nombre: 'Asunción de la Virgen',                     tipo: 'nacional' },
            { fecha: '2026-10-12', nombre: 'Fiesta Nacional de España',                 tipo: 'nacional' },
            { fecha: '2026-11-02', nombre: 'Traslado de Todos los Santos',              tipo: 'autonomico' },
            { fecha: '2026-11-09', nombre: 'Nuestra Señora de la Almudena',             tipo: 'local' },
            { fecha: '2026-12-07', nombre: 'Traslado del Día de la Constitución',       tipo: 'autonomico' },
            { fecha: '2026-12-08', nombre: 'Inmaculada Concepción',                     tipo: 'nacional' },
            { fecha: '2026-12-25', nombre: 'Natividad del Señor',                       tipo: 'nacional' },
        ]
    },
    2027: {
        fuente: { texto: 'Comunidad de Madrid, calendario laboral 2027 (aprobado el 30/09/2026)', url: 'https://www.comunidad.madrid/noticias/2026/09/30/comunidad-madrid-aprueba-calendario-laboral-2027-12-festivos-dos-fijaran-ayuntamientos' },
        nota: 'Los dos festivos locales de Madrid capital para 2027 están pendientes de publicación. El 2 de mayo (Fiesta de la Comunidad) cae en domingo y no aparece en el calendario laboral.',
        dias: [
            { fecha: '2027-01-01', nombre: 'Año Nuevo',                                 tipo: 'nacional' },
            { fecha: '2027-01-06', nombre: 'Epifanía del Señor',                        tipo: 'nacional' },
            { fecha: '2027-03-19', nombre: 'San José',                                  tipo: 'autonomico' },
            { fecha: '2027-03-25', nombre: 'Jueves Santo',                              tipo: 'autonomico' },
            { fecha: '2027-03-26', nombre: 'Viernes Santo',                             tipo: 'nacional' },
            { fecha: '2027-05-01', nombre: 'Fiesta del Trabajo',                        tipo: 'nacional' },
            { fecha: '2027-08-16', nombre: 'Traslado de la Asunción de la Virgen',      tipo: 'autonomico' },
            { fecha: '2027-10-12', nombre: 'Fiesta Nacional de España',                 tipo: 'nacional' },
            { fecha: '2027-11-01', nombre: 'Todos los Santos',                          tipo: 'nacional' },
            { fecha: '2027-12-06', nombre: 'Día de la Constitución Española',           tipo: 'nacional' },
            { fecha: '2027-12-08', nombre: 'Inmaculada Concepción',                     tipo: 'nacional' },
            { fecha: '2027-12-25', nombre: 'Natividad del Señor',                       tipo: 'nacional' },
        ]
    }
};

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DIAS_SEMANA = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
const ETIQUETA = { nacional: 'Nacional', autonomico: 'Comunidad de Madrid', local: 'Local (Madrid capital)' };

// Crea una fecha local a partir de "AAAA-MM-DD" (evita desfases por zona horaria)
const aFecha = s => { const [a, m, d] = s.split('-').map(Number); return new Date(a, m - 1, d); };
const hoy = () => { const h = new Date(); return new Date(h.getFullYear(), h.getMonth(), h.getDate()); };

function pintarAnio(anio) {
    const datos = FESTIVOS[anio];
    const porFecha = Object.fromEntries(datos.dias.map(d => [d.fecha, d]));
    const fechaHoy = hoy();

    document.querySelectorAll('.anio-actual').forEach(el => el.textContent = anio);

    // --- Lista ---
    document.getElementById('lista-festivos').innerHTML = datos.dias.map(d => {
        const f = aFecha(d.fecha);
        const pasado = f < fechaHoy ? ' is-past' : '';
        return `
        <li class="holiday holiday--${d.tipo}${pasado}">
            <div class="holiday-date">
                <strong>${f.getDate()}</strong>
                <span>${MESES[f.getMonth()].slice(0, 3)}</span>
            </div>
            <div>
                <div class="holiday-name">${d.nombre}</div>
                <div class="holiday-meta">${DIAS_SEMANA[f.getDay()]} · ${ETIQUETA[d.tipo]}</div>
            </div>
        </li>`;
    }).join('');

    document.getElementById('nota-anio').textContent = datos.nota;

    // --- Vista anual ---
    let html = '';
    for (let m = 0; m < 12; m++) {
        const primero = new Date(anio, m, 1);
        const diasMes = new Date(anio, m + 1, 0).getDate();
        const hueco = (primero.getDay() + 6) % 7; // semana empieza en lunes
        let celdas = '<span class="wd">L</span><span class="wd">M</span><span class="wd">X</span><span class="wd">J</span><span class="wd">V</span><span class="wd">S</span><span class="wd">D</span>';
        celdas += '<span></span>'.repeat(hueco);
        for (let d = 1; d <= diasMes; d++) {
            const clave = `${anio}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const fest = porFecha[clave];
            const finde = [0, 6].includes(new Date(anio, m, d).getDay()) ? ' is-weekend' : '';
            const esHoy = new Date(anio, m, d).getTime() === fechaHoy.getTime() ? ' is-today' : '';
            celdas += fest
                ? `<span class="day day--${fest.tipo}${esHoy}" title="${fest.nombre}">${d}</span>`
                : `<span class="day${finde}${esHoy}">${d}</span>`;
        }
        html += `<div class="month"><h3>${MESES[m]}</h3><div class="month-grid">${celdas}</div></div>`;
    }
    document.getElementById('calendario-anual').innerHTML = html;

    // --- Próximo festivo (solo si queda alguno este año) ---
    const caja = document.getElementById('proximo-festivo');
    const proximo = datos.dias.find(d => aFecha(d.fecha) >= fechaHoy);
    if (proximo) {
        const f = aFecha(proximo.fecha);
        const faltan = Math.round((f - fechaHoy) / 86400000);
        const cuando = faltan === 0 ? '¡Hoy!' : faltan === 1 ? 'Mañana' : `Dentro de ${faltan} días`;
        caja.innerHTML = `<i class="bi bi-calendar-event"></i>
            <div><span>Próximo festivo · ${cuando}</span>
            <strong>${proximo.nombre} — ${DIAS_SEMANA[f.getDay()]} ${f.getDate()} de ${MESES[f.getMonth()].toLowerCase()}</strong></div>`;
        caja.hidden = false;
    } else {
        caja.hidden = true;
    }

    // --- Fuente oficial ---
    document.getElementById('fuentes').innerHTML =
        `Fuente oficial ${anio}: <a href="${datos.fuente.url}" target="_blank" rel="noopener">${datos.fuente.texto}</a>.
         Festivos locales de Madrid capital: Ayuntamiento de Madrid. Si trabajas en otro municipio, consulta sus dos festivos locales en el BOCM.`;

    // Botones del selector
    document.querySelectorAll('#selector-anio button').forEach(b =>
        b.classList.toggle('active', Number(b.dataset.anio) === anio));
}

document.addEventListener('DOMContentLoaded', () => {
    const anios = Object.keys(FESTIVOS).map(Number).sort();
    const actual = new Date().getFullYear();
    const inicial = anios.includes(actual) ? actual : anios[anios.length - 1];

    document.getElementById('selector-anio').innerHTML = anios
        .map(a => `<button type="button" class="btn btn-outline-primary" data-anio="${a}">${a}</button>`).join('');
    document.querySelectorAll('#selector-anio button').forEach(b =>
        b.addEventListener('click', () => pintarAnio(Number(b.dataset.anio))));

    pintarAnio(inicial);
});

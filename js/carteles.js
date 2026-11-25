/* =========================================================
   CARTELES DE DÍAS IMPORTANTES
   ---------------------------------------------------------
   Lo usan:
     - carteles/cartel-dia.html  (diseño del cartel, para generar el PDF)
     - carteles.html             (página con todos los carteles)
     - index.html                (el "cartel del mes" de la portada)
   Para añadir una fecha: copia un bloque, cambia los textos y
   vuelve a generar los PDF con   sh carteles/generar.sh
   ========================================================= */
const DIAS_IMPORTANTES = [
    {
        id: '22f', mes: 2, dia: 22,
        siglas: '22F', nombre: 'Día de la Igualdad Salarial',
        lema: 'Mismo trabajo,<br>mismo salario',
        color: '#0E7C7B', color2: '#08504F', acento: '#FFC914', icono: 'bi-cash-coin',
        derechos: [
            ['bi-scale',        'Por un trabajo de igual valor, la empresa tiene que pagarte <b>lo mismo</b>, seas mujer u hombre.'],
            ['bi-table',        'Toda empresa debe tener un <b>registro salarial</b> con lo que cobra su plantilla, separado por sexos.'],
            ['bi-search',       '¿Sospechas que cobras menos? Puedes pedir esa información a través de <b>tus representantes</b>.']
        ],
        llamada: '¿Cobras menos que tu compañero?'
    },
    {
        id: '8m', mes: 3, dia: 8,
        siglas: '8M', nombre: 'Día Internacional de la Mujer',
        lema: 'Iguales en derechos,<br>iguales en el trabajo',
        color: '#6B2C91', color2: '#45185E', acento: '#FFC914', icono: 'bi-gender-female',
        derechos: [
            ['bi-clipboard-check', 'Las empresas de <b>50 o más personas</b> deben tener un <b>plan de igualdad</b>.'],
            ['bi-shield-exclamation', 'Toda empresa debe tener un <b>protocolo contra el acoso</b> sexual y por razón de sexo.'],
            ['bi-people',       'Los permisos por <b>nacimiento</b> son iguales para ambos progenitores y no se pueden ceder.']
        ],
        llamada: '¿Te discriminan por ser mujer?'
    },
    {
        id: '28a', mes: 4, dia: 28,
        siglas: '28A', nombre: 'Día Mundial de la Seguridad y la Salud en el Trabajo',
        lema: 'Ningún trabajo<br>vale una vida',
        color: '#1F2937', color2: '#0B0F17', acento: '#FFC914', icono: 'bi-cone-striped',
        derechos: [
            ['bi-mortarboard',  'Tienes derecho a <b>formación en prevención</b>, en horario de trabajo y gratis.'],
            ['bi-person-arms-up', 'Los <b>equipos de protección</b> los paga siempre la empresa.'],
            ['bi-sign-stop',    'Ante un <b>riesgo grave e inminente</b> puedes parar y abandonar tu puesto.']
        ],
        llamada: '¿Trabajas en condiciones inseguras?'
    },
    {
        id: '1m', mes: 5, dia: 1,
        siglas: '1 MAYO', nombre: 'Día Internacional de las Personas Trabajadoras',
        lema: 'Juntos somos<br>más fuertes',
        color: '#E3262E', color2: '#A3161C', acento: '#FFC914', icono: 'bi-people-fill',
        derechos: [
            ['bi-file-earmark-text', 'Tu <b>contrato</b> y tu <b>nómina</b> tienen que estar por escrito y ser claros.'],
            ['bi-journal-check', 'Tu <b>convenio colectivo</b> puede mejorar la ley: salario, permisos, vacaciones.'],
            ['bi-hand-thumbs-up', 'Afiliarte es un <b>derecho</b>: nadie puede castigarte por ello.']
        ],
        llamada: 'Defiende tus derechos con nosotros'
    },
    {
        id: '28j', mes: 6, dia: 28,
        siglas: '28J', nombre: 'Día del Orgullo LGTBI',
        lema: 'Diversidad sin miedo<br>en el trabajo',
        color: '#1E56D9', color2: '#0B1F4D', acento: '#FFC914', icono: 'bi-heart-fill', arcoiris: true,
        derechos: [
            ['bi-x-octagon',    'Nadie puede discriminarte por tu <b>orientación sexual</b> o tu <b>identidad de género</b>.'],
            ['bi-clipboard-check', 'Las empresas de <b>más de 50 personas</b> deben tener medidas y un <b>protocolo frente al acoso LGTBI</b>.'],
            ['bi-megaphone',    'Si sufres acoso o discriminación, <b>denúncialo</b>: no estás sola ni solo.']
        ],
        llamada: '¿Sufres acoso o discriminación?'
    },
    {
        id: '7o', mes: 10, dia: 7,
        siglas: '7 OCT', nombre: 'Jornada Mundial por el Trabajo Decente',
        lema: 'Trabajo decente,<br>vida digna',
        color: '#1E56D9', color2: '#123A99', acento: '#FFC914', icono: 'bi-house-heart',
        derechos: [
            ['bi-wallet2',      'Nadie puede cobrar por debajo del <b>Salario Mínimo Interprofesional</b>.'],
            ['bi-clock-history', 'Tu jornada se <b>registra cada día</b> y las horas extra se pagan o se compensan.'],
            ['bi-briefcase',    'El contrato <b>indefinido es la regla</b>: el temporal solo con causa justificada.']
        ],
        llamada: '¿Tu trabajo no es digno?'
    },
    {
        id: '25n', mes: 11, dia: 25,
        siglas: '25N', nombre: 'Día contra la Violencia hacia las Mujeres',
        lema: 'Ni una más.<br>Tampoco en el trabajo.',
        color: '#4A1D6B', color2: '#2B0F40', acento: '#C9A2F0', icono: 'bi-hand-index-thumb',
        derechos: [
            ['bi-clock',        'Si eres víctima de violencia de género puedes <b>reducir o cambiar tu jornada</b>.'],
            ['bi-geo-alt',      'Tienes derecho a <b>cambiar de centro de trabajo</b> o a suspender tu contrato con reserva de puesto.'],
            ['bi-calendar-x',   'Las <b>faltas</b> por esta situación están justificadas si lo acreditan los servicios sociales o de salud.']
        ],
        llamada: 'Llama al 016: gratis, 24 horas y no deja rastro en la factura',
        llamadaFuerte: true
    }
];

const MESES_CARTEL = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

/* Devuelve los días ordenados empezando por el próximo (o el de hoy) */
function diasDesdeHoy(hoy = new Date()) {
    const h = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    return DIAS_IMPORTANTES
        .map(d => {
            let f = new Date(h.getFullYear(), d.mes - 1, d.dia);
            if (f < h) f = new Date(h.getFullYear() + 1, d.mes - 1, d.dia);
            return { ...d, proxima: f, faltan: Math.round((f - h) / 86400000) };
        })
        .sort((a, b) => a.proxima - b.proxima);
}

/* ---------------------------------------------------------
   Próximas fechas: días importantes + festivos del calendario
   (si un festivo cae el mismo día que un día importante,
   p. ej. el 1 de mayo, se queda el cartel del día importante)
   --------------------------------------------------------- */
function proximasFechas(hoy = new Date()) {
    const h = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const clave = f => `${f.getFullYear()}-${String(f.getMonth() + 1).padStart(2, '0')}-${String(f.getDate()).padStart(2, '0')}`;

    const lista = diasDesdeHoy(hoy).map(d => ({
        clave: clave(d.proxima), fecha: d.proxima, faltan: d.faltan,
        siglas: d.siglas, nombre: d.nombre, lema: d.lema.replace(/<br>/g, ' '),
        color: d.color, color2: d.color2, acento: d.acento, esFestivo: false,
        archivo: `dias/cartel-${d.id}`, html: `cartel-dia.html?id=${d.id}`
    }));
    const ocupadas = new Set(lista.map(x => x.clave));

    if (typeof FESTIVOS !== 'undefined') {
        const COLOR = { nacional: ['#E3262E', '#A3161C'], autonomico: ['#1E56D9', '#0B1F4D'], local: ['#3F8A12', '#25560A'] };
        Object.values(FESTIVOS).forEach(anio => anio.dias.forEach(f => {
            const [a, m, d] = f.fecha.split('-').map(Number);
            const fecha = new Date(a, m - 1, d);
            if (fecha < h || ocupadas.has(f.fecha)) return;
            lista.push({
                clave: f.fecha, fecha, faltan: Math.round((fecha - h) / 86400000),
                siglas: `${d} ${MESES_CARTEL[m - 1].slice(0, 3).toUpperCase()}`, nombre: f.nombre,
                lema: 'Día festivo, pagado y no recuperable',
                color: COLOR[f.tipo][0], color2: COLOR[f.tipo][1], acento: '#FFC914', esFestivo: true,
                archivo: `dias/cartel-festivo-${f.fecha}`, html: `cartel-dia.html?festivo=${f.fecha}`
            });
        }));
    }
    return lista.sort((a, b) => a.fecha - b.fecha);
}

function textoFaltan(n) {
    return n === 0 ? '¡Es hoy!' : n === 1 ? 'Es mañana' : `Faltan ${n} días`;
}

/* Si el PDF aún no se ha generado (año nuevo sin pasar generar.sh),
   los enlaces abren el cartel en el navegador para imprimirlo desde ahí */
function enlacesCartel(ev) {
    return { pdf: `docs/${ev.archivo}.pdf`, img: `img/${ev.archivo}.jpg`, html: `carteles/${ev.html}` };
}
function comprobarPdf(ev, raiz) {
    const e = enlacesCartel(ev);
    fetch(e.pdf, { method: 'HEAD' }).then(r => {
        if (r.ok) return;
        raiz.querySelectorAll('a[href="' + e.pdf + '"]').forEach(a => { a.href = e.html; a.removeAttribute('download'); a.target = '_blank'; });
        raiz.querySelectorAll('img').forEach(img => img.closest('.poster-dl-thumb')?.remove());
    }).catch(() => {});
}

/* ---------- Portada: cartel del mes ---------- */
function pintarCartelDelMes() {
    const caja = document.getElementById('cartel-del-mes');
    if (!caja) return;
    const ev = proximasFechas()[0];
    if (!ev) return;
    const e = enlacesCartel(ev);
    const fechaTxt = `${DIAS_SEMANA_CARTEL[ev.fecha.getDay()]} ${ev.fecha.getDate()} de ${MESES_CARTEL[ev.fecha.getMonth()]}`;
    caja.style.setProperty('--ev', ev.color);
    caja.innerHTML = `
        <a class="poster-dl-thumb" href="${e.pdf}" target="_blank" rel="noopener" title="Ver el cartel en grande">
            <img src="${e.img}" alt="Cartel: ${ev.nombre}" width="640" height="905">
        </a>
        <div class="cdm-txt">
            <p class="cdm-tag">${ev.esFestivo ? 'Festivo' : 'Fecha señalada'} · ${textoFaltan(ev.faltan)}</p>
            <p class="cdm-fecha">${fechaTxt}</p>
            <h2><span class="cdm-siglas">${ev.siglas}</span> ${ev.nombre}</h2>
            <a class="btn btn-sm btn-primary" href="${e.pdf}" download="Cartel-${ev.clave}-Sindicato-Progresa.pdf"><i class="bi bi-download"></i> Descargar cartel</a>
            <a class="cdm-link" href="carteles.html">Ver todos</a>
        </div>`;
    caja.hidden = false;
    comprobarPdf(ev, caja);
}

/* ---------- Página de carteles ---------- */
function pintarPaginaCarteles() {
    const rejilla = document.getElementById('rejilla-fechas');
    if (!rejilla) return;
    const h = new Date();
    const limite = new Date(h.getFullYear() + 1, h.getMonth(), h.getDate());
    const eventos = proximasFechas(h).filter(ev => ev.fecha < limite);
    rejilla.innerHTML = eventos.map((ev, i) => {
        const e = enlacesCartel(ev);
        return `
        <div class="col-6 col-md-4 col-xl-3">
            <article class="cartel-card${i === 0 ? ' is-next' : ''}" style="--ev:${ev.color}">
                <a class="cartel-card-img" href="${e.pdf}" target="_blank" rel="noopener">
                    ${i === 0 ? '<span class="cartel-card-badge">Próximo</span>' : ''}
                    <img src="${e.img}" alt="Cartel: ${ev.nombre}" width="640" height="905" loading="lazy">
                </a>
                <p class="cartel-card-date">${ev.fecha.getDate()} de ${MESES_CARTEL[ev.fecha.getMonth()]}${ev.esFestivo ? ' · festivo' : ''}</p>
                <h3>${ev.nombre}</h3>
                <a class="btn btn-sm btn-primary" href="${e.pdf}" download="Cartel-${ev.clave}-Sindicato-Progresa.pdf"><i class="bi bi-download"></i> Descargar</a>
            </article>
        </div>`;
    }).join('');
    eventos.forEach((ev, i) => comprobarPdf(ev, rejilla.children[i]));

    // Calendario del año en curso (o el último disponible)
    const cal = document.querySelector('[data-cartel-calendario]');
    if (cal && typeof FESTIVOS !== 'undefined') {
        const anios = Object.keys(FESTIVOS).map(Number);
        const anio = anios.includes(h.getFullYear()) ? h.getFullYear() : Math.max(...anios);
        cal.querySelectorAll('a').forEach(a => a.href = `docs/cartel-calendario-${anio}.pdf?v=20261125`);
        cal.querySelector('img').src = `img/cartel-calendario-${anio}.jpg?v=20261125`;
        cal.querySelector('h3').textContent = `Calendario laboral ${anio}`;
    }
}

const DIAS_SEMANA_CARTEL = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];

document.addEventListener('DOMContentLoaded', () => {
    pintarCartelDelMes();
    pintarPaginaCarteles();
});

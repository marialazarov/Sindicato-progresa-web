/* =========================================================
   HERRAMIENTA PARA CREAR CARTELES (crear-cartel.html)
   ---------------------------------------------------------
   CONTRASEÑA: aquí solo se guarda su "huella" (SHA-256), no la
   contraseña en sí. Para cambiarla, en el Terminal:
       printf '%s' 'NuevaClave' | shasum -a 256
   y pega el resultado en CLAVE_HUELLA.
   Ojo: en una web sin servidor esto es un candado sencillo para
   que no entre cualquiera, no una seguridad fuerte. La herramienta
   solo crea y descarga carteles; no publica ni cambia nada.
   ========================================================= */
const CLAVE_HUELLA = 'f3ba93a8218c40a9d9aca6ffe83e4cf59b59e1c9e568fb97980a418e5d8eafd5';

const COLORES_CARTEL = [
    { nombre: 'Azul sindicato', c: '#1E56D9' },
    { nombre: 'Azul marino',    c: '#0B1F4D' },
    { nombre: 'Rojo',           c: '#E3262E' },
    { nombre: 'Verde',          c: '#3F8A12' },
    { nombre: 'Turquesa',       c: '#0E7C7B' },
    { nombre: 'Morado',         c: '#6B2C91' },
    { nombre: 'Granate',        c: '#8E3B46' },
    { nombre: 'Negro',          c: '#1F2937' }
];

const ICONOS_CARTEL = [
    ['bi-megaphone',          'Megáfono'],
    ['bi-people-fill',        'Personas'],
    ['bi-calendar-event',     'Calendario'],
    ['bi-exclamation-triangle', 'Aviso'],
    ['bi-check-circle',       'Visto bueno'],
    ['bi-info-circle',        'Información'],
    ['bi-clock',              'Reloj'],
    ['bi-geo-alt',            'Lugar'],
    ['bi-cash-coin',          'Dinero'],
    ['bi-shield-check',       'Escudo'],
    ['bi-heart-fill',         'Corazón'],
    ['bi-gender-female',      'Mujer'],
    ['bi-briefcase',          'Trabajo'],
    ['bi-hand-thumbs-up',     'Pulgar arriba'],
    ['bi-cone-striped',       'Seguridad'],
    ['bi-file-earmark-text',  'Documento'],
    ['bi-telephone',          'Teléfono'],
    ['bi-star-fill',          'Estrella'],
    ['', 'Sin dibujo']
];

/* Plantillas para empezar (además de los días importantes de js/carteles.js) */
const PLANTILLAS = {
    vacio: { nombre: 'Cartel en blanco', grande: '', subtitulo: '', lema: '', fecha: '', tituloCaja: '', puntos: [], color: '#1E56D9', icono: 'bi-megaphone', llamada: '¿Tienes dudas? Te asesoramos.' },
    asamblea: {
        nombre: 'Asamblea', grande: 'ASAMBLEA', subtitulo: 'Personas trabajadoras de [empresa o centro]',
        lema: 'Tu voz cuenta:\nven y participa', fecha: 'Jueves 12 de diciembre · 18:00',
        tituloCaja: 'Dónde y cuándo',
        puntos: [['bi-calendar-event', '*Día:* jueves 12 de diciembre'], ['bi-clock', '*Hora:* 18:00'], ['bi-geo-alt', '*Lugar:* sala de reuniones'], ['bi-list-check', '*Orden del día:* convenio, turnos y vacaciones']],
        color: '#1E56D9', icono: 'bi-people-fill', llamada: 'Te esperamos. ¡Trae tus preguntas!'
    },
    aviso: {
        nombre: 'Aviso importante', grande: 'AVISO', subtitulo: 'Información para la plantilla',
        lema: 'Esto te interesa', fecha: '',
        tituloCaja: 'Lo que tienes que saber',
        puntos: [['bi-info-circle', 'Escribe aquí el *primer punto*.'], ['bi-check-circle', 'Escribe aquí el segundo punto.'], ['bi-telephone', 'Para cualquier duda, *escríbenos*.']],
        color: '#E3262E', icono: 'bi-exclamation-triangle', llamada: '¿Tienes dudas? Te asesoramos.'
    },
    movilizacion: {
        nombre: 'Concentración o movilización', grande: 'TODOS', subtitulo: 'Concentración',
        lema: 'Defendemos\nlo que es nuestro', fecha: 'Viernes 20 de diciembre · 12:00',
        tituloCaja: 'Por qué nos movilizamos',
        puntos: [['bi-cash-coin', 'Por unos *salarios dignos*.'], ['bi-clock', 'Por unos *horarios justos*.'], ['bi-geo-alt', '*Lugar:* puerta del centro de trabajo']],
        color: '#0B1F4D', icono: 'bi-megaphone', llamada: '¡Te necesitamos! Ven y difúndelo.'
    }
};

const ICONOS_PUNTO_NOMBRES = {
    'bi-check-circle': 'Visto bueno', 'bi-info-circle': 'Información', 'bi-calendar-event': 'Fecha', 'bi-clock': 'Hora',
    'bi-geo-alt': 'Lugar', 'bi-cash-coin': 'Dinero', 'bi-people': 'Personas', 'bi-telephone': 'Teléfono',
    'bi-list-check': 'Lista', 'bi-exclamation-triangle': 'Aviso', 'bi-heart': 'Corazón', 'bi-shield-check': 'Escudo',
    'bi-briefcase': 'Trabajo', 'bi-star': 'Estrella'
};
const ICONOS_PUNTO = Object.keys(ICONOS_PUNTO_NOMBRES);

(function () {
    const $ = id => document.getElementById(id);
    const vista = $('vista');
    const marco = $('marco');
    let imagen = '';            // imagen subida (en el propio navegador, no se envía a ningún sitio)
    let colorActual = COLORES_CARTEL[0].c;

    // ---------- Acceso ----------
    async function huella(texto) {
        const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto));
        return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
    }
    function abrirEditor() {
        $('acceso').hidden = true;
        $('editor').hidden = false;
        ajustarMarco();
    }
    // La contraseña se pide SIEMPRE que se entra: no se recuerda en ningún sitio
    try { sessionStorage.removeItem('admin-carteles'); } catch (e) {}
    // Si vuelven con el botón "atrás", el navegador puede enseñar la página tal cual: se recarga para pedirla otra vez
    window.addEventListener('pageshow', ev => { if (ev.persisted) location.reload(); });
    $('form-acceso').addEventListener('submit', async ev => {
        ev.preventDefault();
        if (await huella($('clave').value) === CLAVE_HUELLA) {
            $('clave').value = '';
            abrirEditor();
        } else {
            $('clave-error').hidden = false;
            $('clave').select();
        }
    });

    // ---------- Montar el formulario ----------
    const sel = $('plantilla');
    sel.innerHTML =
        '<optgroup label="Plantillas">' +
        Object.entries(PLANTILLAS).map(([k, p]) => `<option value="p:${k}">${p.nombre}</option>`).join('') +
        '</optgroup><optgroup label="Días importantes">' +
        DIAS_IMPORTANTES.map(d => `<option value="d:${d.id}">${d.siglas} · ${d.nombre}</option>`).join('') +
        '</optgroup>';

    $('puntos').innerHTML = [0, 1, 2, 3, 4].map(i => `
        <div class="punto-fila">
            <select class="form-select form-select-sm" id="p-ico-${i}" aria-label="Icono del punto ${i + 1}">
                ${ICONOS_PUNTO.map(ic => `<option value="${ic}">${ICONOS_PUNTO_NOMBRES[ic]}</option>`).join('')}
            </select>
            <i class="bi" id="p-ver-${i}" aria-hidden="true"></i>
            <input class="form-control form-control-sm" id="p-txt-${i}" maxlength="120" placeholder="Punto ${i + 1}">
        </div>`).join('');

    $('colores').innerHTML = COLORES_CARTEL.map((c, i) => `
        <button type="button" class="swatch" data-color="${c.c}" style="--sw:${c.c}" title="${c.nombre}" aria-label="${c.nombre}"></button>`).join('') +
        `<label class="swatch swatch--custom" title="Otro color"><input type="color" id="color-libre" value="#1E56D9" aria-label="Otro color"><i class="bi bi-palette"></i></label>`;

    $('f-icono').innerHTML = ICONOS_CARTEL.map(([v, n]) => `<option value="${v}">${n}</option>`).join('');

    // ---------- Utilidades ----------
    const esc = t => (t || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const conNegritas = t => esc(t).replace(/\*([^*]+)\*/g, '<b>$1</b>');
    function oscurecer(hex, f = .62) {
        const n = parseInt(hex.slice(1), 16);
        const c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round(v * f));
        return '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');
    }

    function elegirColor(c) {
        colorActual = c;
        document.querySelectorAll('.swatch[data-color]').forEach(b => b.classList.toggle('is-active', b.dataset.color.toLowerCase() === c.toLowerCase()));
        $('color-libre').parentElement.classList.toggle('is-active', !COLORES_CARTEL.some(x => x.c.toLowerCase() === c.toLowerCase()));
    }

    function cargar(valor) {
        const [tipo, id] = valor.split(':');
        let p;
        if (tipo === 'd') {
            const d = DIAS_IMPORTANTES.find(x => x.id === id);
            p = {
                grande: d.siglas, subtitulo: d.nombre, lema: d.lema.replace(/<br>/g, '\n'),
                fecha: `${d.dia} de ${MESES_CARTEL[d.mes - 1]}`, tituloCaja: 'Tus derechos',
                puntos: d.derechos.map(([ic, t]) => [ICONOS_PUNTO.includes(ic) ? ic : 'bi-check-circle', t.replace(/<\/?b>/g, '*')]),
                color: d.color, icono: d.icono, llamada: d.llamada, resaltar: !!d.llamadaFuerte, arcoiris: !!d.arcoiris
            };
        } else {
            p = PLANTILLAS[id];
        }
        $('f-grande').value = p.grande;
        $('f-subtitulo').value = p.subtitulo;
        $('f-lema').value = p.lema;
        $('f-fecha').value = p.fecha;
        $('f-titulo-caja').value = p.tituloCaja;
        for (let i = 0; i < 5; i++) {
            const [ic, t] = p.puntos[i] || ['bi-check-circle', ''];
            $('p-ico-' + i).value = ic;
            $('p-txt-' + i).value = t;
        }
        $('f-icono').value = ICONOS_CARTEL.some(([v]) => v === p.icono) ? p.icono : 'bi-megaphone';
        $('f-llamada').value = p.llamada || '';
        $('f-resaltar').checked = !!p.resaltar;
        $('f-arcoiris').checked = !!p.arcoiris;
        $('f-contacto').checked = true;
        elegirColor(p.color);
        actualizar();
    }

    // ---------- Pintar la vista previa ----------
    function datos() {
        const grande = $('f-grande').value.trim();
        return {
            siglas: grande, siglasHtml: esc(grande),
            nombre: $('f-subtitulo').value.trim(),
            lema: esc($('f-lema').value.trim()).replace(/\n/g, '<br>'),
            fechaTexto: $('f-fecha').value.trim(),
            tituloDerechos: $('f-titulo-caja').value.trim(),
            derechos: [0, 1, 2, 3, 4].map(i => [$('p-ico-' + i).value, conNegritas($('p-txt-' + i).value.trim())]),
            imagen,
            color: colorActual, color2: oscurecer(colorActual), acento: '#FFC914',
            icono: $('f-icono').value,
            llamada: $('f-llamada').value.trim(),
            llamadaFuerte: $('f-resaltar').checked,
            contacto: $('f-contacto').checked,
            arcoiris: $('f-arcoiris').checked,
            legal: ''
        };
    }
    let listo = false;
    function actualizar() {
        for (let i = 0; i < 5; i++) $('p-ver-' + i).className = 'bi ' + $('p-ico-' + i).value;
        if (!listo) return;
        const w = vista.contentWindow;
        w.pintarCartel(datos());
        $('aviso-largo').hidden = w.document.body.dataset.cabe !== 'no';
        guardarBorrador();
    }
    vista.addEventListener('load', () => {
        vista.contentWindow.document.fonts.ready.then(() => { listo = true; actualizar(); });
    });

    // La vista previa es el cartel a tamaño real (1123 × 1587 px) reducido para que quepa
    function ajustarMarco() {
        const k = marco.clientWidth / 1123;
        vista.style.transform = `scale(${k})`;
        marco.style.height = (1587 * k) + 'px';
    }
    window.addEventListener('resize', ajustarMarco);

    // ---------- Eventos del formulario ----------
    sel.addEventListener('change', () => {
        if (confirm('¿Cargar esta plantilla? Se sustituye lo que has escrito.')) cargar(sel.value);
    });
    $('form-cartel').addEventListener('input', actualizar);
    $('form-cartel').addEventListener('change', actualizar);
    $('colores').addEventListener('click', e => {
        const b = e.target.closest('.swatch[data-color]');
        if (b) { elegirColor(b.dataset.color); actualizar(); }
    });
    $('color-libre').addEventListener('input', e => { elegirColor(e.target.value); actualizar(); });

    $('f-imagen').addEventListener('change', e => {
        const f = e.target.files[0];
        if (!f) return;
        const img = new Image();
        img.onload = () => {   // se reduce para que el cartel no pese demasiado
            const max = 1600, k = Math.min(1, max / Math.max(img.width, img.height));
            const c = document.createElement('canvas');
            c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
            c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
            imagen = c.toDataURL('image/jpeg', .85);
            URL.revokeObjectURL(img.src);
            $('quitar-imagen').hidden = false;
            actualizar();
        };
        img.src = URL.createObjectURL(f);
    });
    $('quitar-imagen').addEventListener('click', () => {
        imagen = ''; $('f-imagen').value = ''; $('quitar-imagen').hidden = true; actualizar();
    });

    $('reiniciar').addEventListener('click', () => {
        if (!confirm('¿Borrar todo y empezar de nuevo?')) return;
        imagen = ''; $('f-imagen').value = ''; $('quitar-imagen').hidden = true;
        sel.value = 'p:vacio'; cargar('p:vacio');
    });

    // ---------- Borrador en este navegador (para no perderlo al recargar) ----------
    function guardarBorrador() {
        try {
            const d = { color: colorActual, campos: {} };
            document.querySelectorAll('#form-cartel input:not([type=file]), #form-cartel select, #form-cartel textarea')
                .forEach(el => d.campos[el.id] = el.type === 'checkbox' ? el.checked : el.value);
            localStorage.setItem('borrador-cartel', JSON.stringify(d));
        } catch (e) {}
    }
    function recuperarBorrador() {
        try {
            const d = JSON.parse(localStorage.getItem('borrador-cartel'));
            if (!d) return false;
            Object.entries(d.campos).forEach(([id, v]) => {
                const el = $(id); if (!el) return;
                if (el.type === 'checkbox') el.checked = v; else el.value = v;
            });
            elegirColor(d.color);
            return true;
        } catch (e) { return false; }
    }
    if (!recuperarBorrador()) { sel.value = 'p:asamblea'; cargar('p:asamblea'); }
    else actualizar();

    // ---------- Descargas (todo se hace en el navegador) ----------
    const LIBS = [
        'https://cdnjs.cloudflare.com/ajax/libs/html-to-image/1.11.11/html-to-image.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
    ];
    function cargarLibs() {
        const w = vista.contentWindow, doc = w.document;
        return Promise.all(LIBS.map(src => new Promise((ok, mal) => {
            if (doc.querySelector(`script[src="${src}"]`)) return ok();
            const s = doc.createElement('script');
            s.src = src; s.onload = ok; s.onerror = mal;
            doc.head.appendChild(s);
        })));
    }
    function nombreArchivo() {
        const base = ($('f-grande').value || $('f-subtitulo').value || 'cartel').trim()
            .normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase();
        return `cartel-${base || 'sindicato'}-progresa`;
    }
    async function capturar() {
        await cargarLibs();
        const w = vista.contentWindow;
        await w.document.fonts.ready;
        // Las imágenes vacías (la foto cuando no hay) se saltan: si no, falla la captura
        const filter = n => !(n.tagName === 'IMG' && !n.getAttribute('src'));
        return w.htmlToImage.toCanvas(w.document.getElementById('cartel'), { pixelRatio: 2, filter });
    }
    function descargar(url, nombre) {
        const a = document.createElement('a');
        a.href = url; a.download = nombre;
        document.body.appendChild(a); a.click(); a.remove();
    }
    async function conEspera(boton, tarea) {
        const txt = boton.innerHTML;
        boton.disabled = true;
        boton.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Preparando…';
        $('aviso-descarga').hidden = true;
        try {
            await tarea();
            $('aviso-descarga').innerHTML = '<i class="bi bi-check-circle-fill"></i> Descargado. Lo tienes en la carpeta de descargas.';
            $('aviso-descarga').hidden = false;
        } catch (e) {
            console.error(e);
            alert('No se ha podido crear el archivo. Comprueba la conexión a internet y vuelve a intentarlo.');
        } finally {
            boton.disabled = false; boton.innerHTML = txt;
        }
    }
    $('descargar-img').addEventListener('click', e => conEspera(e.currentTarget, async () => {
        const canvas = await capturar();
        descargar(canvas.toDataURL('image/png'), nombreArchivo() + '.png');
    }));
    $('descargar-pdf').addEventListener('click', e => conEspera(e.currentTarget, async () => {
        const canvas = await capturar();
        const { jsPDF } = vista.contentWindow.jspdf;
        const pdf = new jsPDF({ unit: 'mm', format: 'a3', orientation: 'portrait' });
        pdf.addImage(canvas.toDataURL('image/jpeg', .92), 'JPEG', 0, 0, 297, 420);
        pdf.save(nombreArchivo() + '.pdf');
    }));
})();

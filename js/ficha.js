/* =========================================================
   FICHA DE AFILIACIÓN ONLINE
   Formulario por pasos que rellena la ficha oficial en PDF
   (docs/ficha-nomina.pdf o docs/ficha-banco.pdf) dentro del
   navegador, con la librería pdf-lib. La persona firma en
   pantalla y la ficha firmada se envía a enviar-ficha.php,
   que la manda por correo al sindicato (o se descarga).

   Las posiciones están en puntos PDF (A4 = 595 x 842),
   contando desde la esquina INFERIOR izquierda.
   Si el sindicato cambia el diseño de la ficha, hay que
   ajustar estas coordenadas.
   ========================================================= */
const FICHAS = {
    nomina: {
        pdf: 'docs/ficha-nomina.pdf',
        archivo: 'ficha-afiliacion-nomina',
        fechaAlta: { y: 717.5, dia: 38, mes: 64, anio: 90 },
        nacimiento:{ y: 661.5, dia: 437, mes: 466, anio: 494 },
        textos: {
            apellidos:         [120, 676,   295],
            nombre:            [120, 661.5, 130],
            dni:               [292, 661.5, 125],
            domicilio:         [120, 647,   440],
            numero:            [64,  632.5, 50],
            piso:              [155, 632.5, 44],
            letra:             [247, 632.5, 38],
            localidad:         [367, 632.5, 195],
            cp:                [120, 618.5, 118],
            provincia:         [368, 618.5, 195],
            telefono:          [120, 605,   118],
            movil:             [368, 605,   195],
            email:             [120, 591,   440],
            organismo:         [231, 535.5, 330],
            empresa:           [231, 521.5, 330],
            centro:            [231, 507.5, 330],
            departamento:      [231, 493.5, 330],
            direccion_trabajo: [231, 479.5, 330],
            localidad_trabajo: [120, 465.5, 105],
            cp_trabajo:        [291, 465.5, 63],
            provincia_trabajo: [429, 465.5, 132],
            telefono_trabajo:  [231, 452,   330],
            profesion:         [120, 438,   105],
            categoria:         [296, 438,   98],
            grupo:             [477, 438,   85],
            turno_otro:        [364, 373,   152],
            rrhh_empresa:      [200, 190,   350],
            nombre_completo:   [74,  176.5, 245],
            num_nomina:        [397, 176.5, 132],
            mes_texto:         [280, 147,   185],
            anio_inicio:       [480, 147,   58]
        },
        casillas: {
            y: 404,
            funcionario: 122.5, laboral: 195.5, estatutario: 289.5,
            interino: 368.5, eventual: 446, titular: 513
        },
        turnos: { y: 375.7, manana: 98.8, tarde: 168, noche: 245 },
        fechasFirma: [[372, 318], [150, 50]],
        firmas: [[380, 262, 175, 48], [300, 31, 250, 36]]   // recuadros "Fecha y firma": [x, y, ancho, alto]
    },
    banco: {
        pdf: 'docs/ficha-banco.pdf',
        archivo: 'ficha-afiliacion-banco',
        fechaAlta: { y: 721, dia: 37, mes: 62, anio: 88 },
        nacimiento:{ y: 665.5, dia: 434, mes: 463, anio: 491 },
        textos: {
            apellidos:       [117, 679.5, 300],
            nombre:          [117, 665.5, 130],
            dni:             [289, 665.5, 125],
            domicilio:       [117, 651.5, 445],
            numero:          [61,  636,   50],
            piso:            [150, 636, 45],
            letra:           [243, 636, 40],
            localidad:       [366, 636, 200],
            cp:              [117, 620, 118],
            provincia:       [366, 620, 200],
            telefono:        [117, 606, 118],
            movil:           [366, 606, 200],
            email:           [117, 592, 445],
            organismo:       [229, 538.5, 335],
            empresa:         [229, 524.5, 335],
            banco:           [192, 286,   370],
            banco_direccion: [122, 260,   440],
            banco_poblacion: [88,  234.5, 255],
            banco_cp:        [420, 234.5, 140],
            titular:         [225, 138,   340]
        },
        // Casillas del IBAN: [x de inicio, nº de casillas, ancho de casilla]
        iban: { y: 164, grupos: [[123, 2, 16.5], [170.5, 4, 14.35], [242.5, 4, 14.35], [314, 4, 14.35], [385, 4, 14.35], [456.5, 4, 14.35]] },
        fechasFirma: [[150, 50]],
        firmas: [[300, 33, 250, 35]]
    }
};

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

/* ---------- Validaciones ---------- */
function dniValido(valor) {
    const v = valor.toUpperCase().replace(/[\s-]/g, '');
    if (!/^[0-9XYZ][0-9]{7}[A-Z]$/.test(v)) return false;
    const numero = v.replace(/^X/, '0').replace(/^Y/, '1').replace(/^Z/, '2').slice(0, 8);
    return 'TRWAGMYFPDXBNJZSQVHLCKE'[parseInt(numero, 10) % 23] === v[8];
}

function ibanValido(valor) {
    const v = valor.toUpperCase().replace(/\s/g, '');
    if (!/^ES[0-9]{22}$/.test(v)) return false;
    const reordenado = (v.slice(4) + v.slice(0, 4)).replace(/[A-Z]/g, l => l.charCodeAt(0) - 55);
    let resto = 0;
    for (const c of reordenado) resto = (resto * 10 + Number(c)) % 97;
    return resto === 1;
}

/* ---------- Rellenar el PDF ---------- */
async function crearPdf(datos, firma = null) {
    const { PDFDocument, StandardFonts, rgb } = PDFLib;
    const ficha = FICHAS[datos.pago];
    const bytes = await fetch(ficha.pdf).then(r => {
        if (!r.ok) throw new Error('No se ha podido cargar la ficha');
        return r.arrayBuffer();
    });
    const doc = await PDFDocument.load(bytes);
    const pagina = doc.getPages()[0];
    const fuente = await doc.embedFont(StandardFonts.Helvetica);
    const negrita = await doc.embedFont(StandardFonts.HelveticaBold);
    const azul = rgb(0.05, 0.15, 0.45);

    // La fuente estándar solo admite caracteres latinos: quitamos los demás
    const limpio = t => String(t ?? '').replace(/[^\x20-\x7E -ÿ]/g, '').trim();

    // Escribe un texto; si no cabe en el ancho, reduce la letra
    function escribir(texto, x, y, ancho = 200, tam = 9) {
        texto = limpio(texto);
        if (!texto) return;
        while (tam > 5.5 && fuente.widthOfTextAtSize(texto, tam) > ancho) tam -= 0.5;
        pagina.drawText(texto, { x, y, size: tam, font: fuente, color: azul });
    }
    const marcarX = (x, y) => pagina.drawText('X', { x: x - 3.3, y: y - 3.5, size: 10, font: negrita, color: azul });

    const hoy = new Date();
    const dd = String(hoy.getDate()).padStart(2, '0');
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const aaaa = String(hoy.getFullYear());

    // Fecha de alta (hoy)
    escribir(dd, ficha.fechaAlta.dia, ficha.fechaAlta.y);
    escribir(mm, ficha.fechaAlta.mes, ficha.fechaAlta.y);
    escribir(aaaa, ficha.fechaAlta.anio, ficha.fechaAlta.y);

    // Fecha de nacimiento
    if (datos.nacimiento) {
        const [a, m, d] = datos.nacimiento.split('-');
        escribir(d, ficha.nacimiento.dia, ficha.nacimiento.y);
        escribir(m, ficha.nacimiento.mes, ficha.nacimiento.y);
        escribir(a, ficha.nacimiento.anio, ficha.nacimiento.y);
    }

    // Campos de texto
    const extra = {
        nombre_completo: `${datos.nombre} ${datos.apellidos}`,
        mes_texto: datos.mes_inicio ? MESES[Number(datos.mes_inicio) - 1] : '',
        dni: (datos.dni || '').toUpperCase()
    };
    for (const [campo, [x, y, ancho]] of Object.entries(ficha.textos)) {
        escribir(extra[campo] ?? datos[campo], x, y, ancho);
    }

    // Casillas (solo ficha de nómina)
    if (ficha.casillas) {
        for (const tipo of datos.tipo) if (ficha.casillas[tipo]) marcarX(ficha.casillas[tipo], ficha.casillas.y);
        if (ficha.turnos[datos.turno]) marcarX(ficha.turnos[datos.turno], ficha.turnos.y);
    }

    // IBAN en sus casillas (la ficha ya trae impreso "ES")
    if (ficha.iban && datos.iban) {
        const cifras = datos.iban.toUpperCase().replace(/\s/g, '').slice(2).split('');
        for (const [inicio, n, ancho] of ficha.iban.grupos) {
            for (let i = 0; i < n; i++) {
                const c = cifras.shift();
                if (!c) break;
                const x = inicio + ancho * i + ancho / 2 - fuente.widthOfTextAtSize(c, 10) / 2;
                pagina.drawText(c, { x, y: ficha.iban.y, size: 10, font: fuente, color: azul });
            }
        }
    }

    // Fecha junto a las firmas
    for (const [x, y] of ficha.fechasFirma) escribir(`Fecha: ${dd}/${mm}/${aaaa}`, x, y, 150);

    // Firma hecha en pantalla: se encaja en cada recuadro sin deformarla
    if (firma) {
        const imagen = await doc.embedPng(firma);
        for (const [x, y, ancho, alto] of ficha.firmas) {
            const escala = Math.min(ancho / imagen.width, alto / imagen.height);
            const w = imagen.width * escala, h = imagen.height * escala;
            pagina.drawImage(imagen, { x: x + (ancho - w) / 2, y: y + (alto - h) / 2, width: w, height: h });
        }
    }

    return doc.save();
}

/* ---------- Recuadro de firma ----------
   Guarda los trazos para poder redibujarlos si cambia el
   tamaño de la pantalla y para recortar la firma al exportarla. */
function iniciarFirma(canvas) {
    const caja = canvas.parentElement;
    const ctx = canvas.getContext('2d');
    let trazos = [];
    let actual = null;

    function dibujar(c, lista, dx = 0, dy = 0, escala = 1) {
        c.lineWidth = 2.2 * escala;
        c.lineCap = c.lineJoin = 'round';
        c.strokeStyle = '#0B1F4D';
        for (const t of lista) {
            c.beginPath();
            t.forEach(([x, y], i) => i ? c.lineTo((x - dx) * escala, (y - dy) * escala) : c.moveTo((x - dx) * escala, (y - dy) * escala));
            if (t.length === 1) c.lineTo((t[0][0] - dx) * escala + 0.1, (t[0][1] - dy) * escala);
            c.stroke();
        }
    }

    function ajustar() {
        const r = canvas.getBoundingClientRect();
        if (!r.width) return;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = r.width * dpr;
        canvas.height = r.height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        dibujar(ctx, trazos);
    }

    const punto = e => {
        const r = canvas.getBoundingClientRect();
        return [e.clientX - r.left, e.clientY - r.top];
    };
    canvas.addEventListener('pointerdown', e => {
        canvas.setPointerCapture(e.pointerId);
        actual = [punto(e)];
        trazos.push(actual);
        caja.classList.add('has-firma');
        caja.classList.remove('is-invalid');
        dibujar(ctx, [actual]);
    });
    canvas.addEventListener('pointermove', e => {
        if (!actual) return;
        actual.push(punto(e));
        dibujar(ctx, [actual.slice(-2)]);
    });
    const soltar = () => { actual = null; };
    canvas.addEventListener('pointerup', soltar);
    canvas.addEventListener('pointercancel', soltar);
    window.addEventListener('resize', ajustar);

    return {
        ajustar,
        vacia: () => trazos.length === 0,
        borrar() {
            trazos = [];
            caja.classList.remove('has-firma');
            ajustar();
        },
        // PNG de la firma recortada a su tamaño, a buena resolución para el PDF
        async png() {
            if (!trazos.length) return null;
            const xs = trazos.flat().map(p => p[0]), ys = trazos.flat().map(p => p[1]);
            const margen = 4, escala = 3;
            const x0 = Math.min(...xs) - margen, y0 = Math.min(...ys) - margen;
            const c = document.createElement('canvas');
            c.width = (Math.max(...xs) + margen - x0) * escala;
            c.height = (Math.max(...ys) + margen - y0) * escala;
            dibujar(c.getContext('2d'), trazos, x0, y0, escala);
            const blob = await new Promise(ok => c.toBlob(ok, 'image/png'));
            return new Uint8Array(await blob.arrayBuffer());
        }
    };
}

/* ---------- Formulario por pasos ---------- */
function iniciarFicha() {
    const form = document.getElementById('ficha-form');
    if (!form) return;

    const paneles   = [...form.querySelectorAll('.wizard-pane')];
    const marcas    = [...document.querySelectorAll('.wizard-steps li')];
    const atras     = document.getElementById('ficha-atras');
    const siguiente = document.getElementById('ficha-siguiente');
    const descargar = document.getElementById('ficha-descargar');
    const enviar    = document.getElementById('ficha-enviar');
    const estado    = document.getElementById('ficha-estado');
    const hecha     = document.getElementById('ficha-hecha');
    const dni       = form.elements.dni;
    const iban      = form.elements.iban;
    const firma     = iniciarFirma(document.getElementById('firma-pad'));
    let paso = 1;
    let ultimoPdf = null;

    // Versión de prueba en GitHub Pages: no hay PHP, así que no se puede enviar
    const esPrueba = location.hostname.endsWith('github.io');
    if (esPrueba) {
        paneles[paneles.length - 1].insertAdjacentHTML('afterbegin',
            '<div class="alert alert-warning"><strong>Versión de prueba:</strong> aquí la ficha todavía no se envía. ' +
            'Puedes firmar y pulsar «Solo descargar» para ver cómo queda. El envío funcionará en el dominio oficial.</div>');
    }

    // Meses y años para el descuento en nómina
    const hoy = new Date();
    MESES.forEach((m, i) => form.elements.mes_inicio.add(new Option(m[0].toUpperCase() + m.slice(1), i + 1)));
    form.elements.mes_inicio.value = hoy.getMonth() + 1;
    for (const a of [hoy.getFullYear(), hoy.getFullYear() + 1]) form.elements.anio_inicio.add(new Option(a, a));

    const mostrar = (texto, tipo) => {
        estado.innerHTML = texto ? `<div class="alert alert-${tipo} mb-0">${texto}</div>` : '';
    };

    // Muestra solo los campos de la forma de pago elegida
    function aplicarPago() {
        const pago = form.elements.pago.value;
        form.querySelectorAll('[data-solo]').forEach(bloque => {
            const activo = bloque.dataset.solo === pago;
            bloque.hidden = !activo;
            bloque.querySelectorAll('input, select').forEach(c => c.disabled = !activo);
        });
    }
    form.querySelectorAll('input[name="pago"]').forEach(r => r.addEventListener('change', aplicarPago));
    aplicarPago();

    // Validaciones propias de DNI e IBAN
    dni.addEventListener('input', () => dni.setCustomValidity(dniValido(dni.value) ? '' : 'DNI no válido'));
    iban.addEventListener('input', () => {
        iban.setCustomValidity(ibanValido(iban.value) ? '' : 'IBAN no válido');
    });
    iban.addEventListener('blur', () => {
        const v = iban.value.toUpperCase().replace(/\s/g, '');
        iban.value = v.replace(/(.{4})/g, '$1 ').trim();
    });

    function irA(n) {
        paso = n;
        const ultimo = n === paneles.length;
        paneles.forEach(p => p.hidden = Number(p.dataset.paso) !== n);
        marcas.forEach((m, i) => {
            m.classList.toggle('is-active', i + 1 === n);
            m.classList.toggle('is-done', i + 1 < n);
        });
        atras.hidden = n === 1;
        siguiente.hidden = ultimo;
        descargar.hidden = enviar.hidden = !ultimo;
        if (ultimo) firma.ajustar();   // el recuadro estaba oculto y no tenía tamaño
        form.classList.remove('was-validated');
        mostrar('');
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function pasoValido() {
        const panel = paneles[paso - 1];
        const campos = [...panel.querySelectorAll('input, select')].filter(c => !c.disabled && c.name !== 'web');
        const malo = campos.find(c => !c.checkValidity());
        if (!malo) return true;
        form.classList.add('was-validated');
        mostrar(paso === 1 ? 'Elige cómo quieres pagar la cuota.' : 'Revisa los campos marcados en rojo.', 'danger');
        malo.focus();
        return false;
    }

    siguiente.addEventListener('click', () => {
        if (!pasoValido()) return;
        // Rellenamos por adelantado lo que ya sabemos
        if (paso === 3) {
            const f = form.elements;
            if (!f.rrhh_empresa.value) f.rrhh_empresa.value = f.organismo.value || f.empresa.value;
            if (!f.titular.value) f.titular.value = `${f.nombre.value} ${f.apellidos.value}`.trim();
        }
        irA(paso + 1);
    });
    atras.addEventListener('click', () => irA(paso - 1));
    document.getElementById('firma-borrar').addEventListener('click', () => firma.borrar());

    function leerDatos() {
        const fd = new FormData(form);
        const datos = Object.fromEntries(fd.entries());
        datos.tipo = fd.getAll('tipo');
        return datos;
    }

    function bajar(bytes, nombre) {
        const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
        const a = document.createElement('a');
        a.href = url;
        a.download = nombre;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 10000);
    }

    async function prepararPdf() {
        const datos = leerDatos();
        const bytes = await crearPdf(datos, await firma.png());
        const apellido = (datos.apellidos.split(' ')[0] || 'ficha').normalize('NFD').replace(/[^A-Za-z]/g, '').toLowerCase();
        ultimoPdf = { bytes, nombre: `${FICHAS[datos.pago].archivo}-${apellido}.pdf` };
        return datos;
    }

    function terminar(modo, datos) {
        hecha.querySelectorAll('[data-final]').forEach(d => d.hidden = d.dataset.final !== modo);
        hecha.querySelector('[data-correo]').textContent = datos.email;
        document.getElementById('ficha-nombre-archivo').textContent = ultimoPdf.nombre;
        form.hidden = true;
        document.querySelector('.wizard-steps').hidden = true;
        hecha.hidden = false;
        hecha.focus();
    }

    const ocupado = si => { descargar.disabled = enviar.disabled = si; };

    // Solo descargar (con o sin firma)
    descargar.addEventListener('click', async () => {
        ocupado(true);
        mostrar('Preparando tu ficha…', 'info');
        try {
            const datos = await prepararPdf();
            bajar(ultimoPdf.bytes, ultimoPdf.nombre);
            terminar('descargada', datos);
        } catch {
            mostrar('No se ha podido crear la ficha. Comprueba tu conexión e inténtalo de nuevo, o descarga la ficha en blanco.', 'danger');
        } finally {
            ocupado(false);
        }
    });

    // Firmar y enviar
    form.addEventListener('submit', async e => {
        e.preventDefault();
        if (firma.vacia()) {
            document.querySelector('.firma-caja').classList.add('is-invalid');
            mostrar('Firma en el recuadro antes de enviar tu ficha.', 'danger');
            return;
        }
        if (!pasoValido()) return;
        if (esPrueba) {
            mostrar('Versión de prueba: la ficha no se ha enviado. Pulsa «Solo descargar» para ver cómo queda firmada.', 'info');
            return;
        }
        ocupado(true);
        enviar.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Enviando…';
        mostrar('');
        try {
            const datos = await prepararPdf();
            const envio = new FormData();
            for (const campo of ['pago', 'nombre', 'apellidos', 'dni', 'email', 'movil', 'empresa', 'web']) envio.append(campo, datos[campo] || '');
            envio.append('privacidad', datos.privacidad ? '1' : '');
            envio.append('ficha', new Blob([ultimoPdf.bytes], { type: 'application/pdf' }), ultimoPdf.nombre);
            const resp = await fetch('enviar-ficha.php', { method: 'POST', body: envio, headers: { 'Accept': 'application/json' } });
            const res = await resp.json().catch(() => ({}));
            if (!resp.ok || !res.ok) throw new Error(res.error || '');
            terminar('enviada', datos);
        } catch (err) {
            mostrar((err.message || 'No se ha podido enviar la ficha.') +
                ' Puedes pulsar «Solo descargar» y enviarla a <a href="mailto:s.gral@sindicato-progresa.com">s.gral@sindicato-progresa.com</a>.', 'danger');
        } finally {
            ocupado(false);
            enviar.innerHTML = '<i class="bi bi-send"></i> Firmar y enviar';
        }
    });

    document.getElementById('ficha-otra-vez').addEventListener('click', () => ultimoPdf && bajar(ultimoPdf.bytes, ultimoPdf.nombre));
    document.getElementById('ficha-corregir').addEventListener('click', () => {
        hecha.hidden = true;
        form.hidden = false;
        document.querySelector('.wizard-steps').hidden = false;
        irA(1);
    });
}

document.addEventListener('DOMContentLoaded', iniciarFicha);

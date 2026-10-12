/* =========================================================
   1. COOKIES
   Guardamos la elección del usuario en una cookie propia
   ("progresa_consent") durante 12 meses.
   ========================================================= */
const COOKIE_NAME = 'progresa_consent';

function leerConsentimiento() {
    const fila = document.cookie.split('; ').find(c => c.startsWith(COOKIE_NAME + '='));
    if (!fila) return null;
    try { return JSON.parse(decodeURIComponent(fila.split('=')[1])); }
    catch { return null; }
}

function guardarConsentimiento(analiticas) {
    const valor = encodeURIComponent(JSON.stringify({ analiticas, fecha: new Date().toISOString() }));
    const unAnio = 60 * 60 * 24 * 365;
    document.cookie = `${COOKIE_NAME}=${valor}; max-age=${unAnio}; path=/; SameSite=Lax`;
    aplicarConsentimiento({ analiticas });
}

function aplicarConsentimiento(consent) {
    if (consent && consent.analiticas) {
        cargarAnaliticas();
    }
}

// Aquí iría Google Analytics, Matomo, etc. SOLO se carga si el usuario acepta.
function cargarAnaliticas() {
    // Ejemplo con Google Analytics 4 (cambia G-XXXXXXX por tu ID):
    // const s = document.createElement('script');
    // s.async = true;
    // s.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX';
    // document.head.appendChild(s);
    // window.dataLayer = window.dataLayer || [];
    // function gtag(){ dataLayer.push(arguments); }
    // gtag('js', new Date()); gtag('config', 'G-XXXXXXX');
}

function iniciarCookies() {
    const banner     = document.getElementById('cookie-banner');
    if (!banner) return;
    const opciones   = document.getElementById('cookie-options');
    const chkAnalit  = document.getElementById('ck-analiticas');
    const btnAceptar = document.getElementById('ck-aceptar');
    const btnRechaz  = document.getElementById('ck-rechazar');
    const btnConfig  = document.getElementById('ck-configurar');
    const btnGuardar = document.getElementById('ck-guardar');

    const cerrar = () => { banner.hidden = true; };
    const abrir  = () => {
        const c = leerConsentimiento();
        chkAnalit.checked = !!(c && c.analiticas);
        banner.hidden = false;
    };

    const actual = leerConsentimiento();
    if (actual) aplicarConsentimiento(actual);
    else abrir();

    btnAceptar.addEventListener('click', () => { guardarConsentimiento(true);  cerrar(); });
    btnRechaz .addEventListener('click', () => { guardarConsentimiento(false); cerrar(); });
    btnConfig .addEventListener('click', () => {
        opciones.hidden = false;
        btnConfig.hidden = true;
        btnGuardar.hidden = false;
    });
    btnGuardar.addEventListener('click', () => { guardarConsentimiento(chkAnalit.checked); cerrar(); });

    // Enlace "Configurar cookies" del pie: vuelve a abrir el aviso
    document.querySelectorAll('[data-cookie-settings]').forEach(a =>
        a.addEventListener('click', e => { e.preventDefault(); abrir(); })
    );
}

/* =========================================================
   2. FORMULARIO DE AFILIACIÓN
   Valida en el navegador y lo envía a enviar.php sin
   recargar la página.
   ========================================================= */
function iniciarFormulario() {
    const form   = document.getElementById('form-afiliacion');
    if (!form) return;
    const estado = document.getElementById('form-estado');
    const boton  = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        form.classList.add('was-validated');
        if (!form.checkValidity()) {
            mostrar('Revisa los campos marcados en rojo.', 'danger');
            form.querySelector(':invalid')?.focus();
            return;
        }

        boton.disabled = true;
        boton.textContent = 'Enviando…';

        try {
            const resp  = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });
            const datos = await resp.json();
            if (resp.ok && datos.ok) {
                form.reset();
                form.classList.remove('was-validated');
                mostrar('¡Gracias! Hemos recibido tu solicitud. Te contactaremos muy pronto.', 'success');
            } else {
                mostrar(datos.error || 'No se ha podido enviar. Inténtalo de nuevo.', 'danger');
            }
        } catch {
            mostrar('Error de conexión. Escríbenos a info@sindicato-progresa.com.', 'danger');
        } finally {
            boton.disabled = false;
            boton.textContent = 'Enviar solicitud';
        }
    });

    function mostrar(texto, tipo) {
        estado.innerHTML = `<div class="alert alert-${tipo} mb-0">${texto}</div>`;
    }
}

/* =========================================================
   3. VARIOS
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
    iniciarCookies();
    iniciarFormulario();

    const anio = document.getElementById('anio');
    if (anio) anio.textContent = new Date().getFullYear();

    // Cierra el menú móvil al pulsar un enlace
    document.querySelectorAll('#menu .nav-link, #menu .btn').forEach(link =>
        link.addEventListener('click', () => {
            const menu = document.getElementById('menu');
            if (menu.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(menu).hide();
        })
    );
});

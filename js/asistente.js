/* =========================================================
   ASISTENTE DE DUDAS
   Chat sencillo con respuestas preparadas (no usa IA ni
   envía datos a ningún sitio). Para añadir o cambiar una
   pregunta, edita la lista PREGUNTAS de abajo:
     - pregunta: el texto del botón
     - claves:   palabras que, si aparecen en lo que escribe
                 la persona, llevan a esta respuesta
     - respuesta: el texto (admite enlaces HTML)
   ========================================================= */
const PREGUNTAS = [
    {
        pregunta: '¿Qué es un sindicato?',
        claves: ['que es un sindicato', 'sindicato', 'sindical', 'para que sirve'],
        respuesta: 'Un sindicato es una organización de personas trabajadoras que se unen para defender sus derechos: salarios justos, horarios dignos, seguridad en el trabajo y trato igualitario. Juntos se negocia mejor que solo.'
    },
    {
        pregunta: '¿Qué es PROGRESA?',
        claves: ['progresa', 'quienes sois', 'quienes son', 'vosotros'],
        respuesta: 'PROGRESA es una organización sindical estatal, plural, democrática y autónoma, creada y dirigida por trabajadores. Somos independientes: sin mochilas políticas ni intereses ajenos. <a href="index.html#quienes-somos">Conócenos</a>.'
    },
    {
        pregunta: '¿Qué gano si me afilio?',
        claves: ['ventaja', 'beneficio', 'gano', 'por que afiliarme', 'servicios', 'ayuda'],
        respuesta: 'Al afiliarte tienes asesoramiento jurídico y sindical, información periódica sobre tus derechos y puedes participar en las decisiones del sindicato. Y, sobre todo, no estás solo si tienes un problema en el trabajo. <a href="index.html#servicios">Ver servicios</a>.'
    },
    {
        pregunta: '¿Cómo me afilio?',
        claves: ['afiliar', 'afilio', 'afiliacion', 'apuntar', 'apunto', 'unirme', 'alta', 'hacerme socio'],
        respuesta: 'Rellena el <a href="index.html#afiliate">formulario de afiliación</a> y te llamaremos para completar el alta. También puedes escribirnos o llamarnos (pregúntame por el contacto).'
    },
    {
        pregunta: '¿Cuánto cuesta afiliarse?',
        claves: ['cuanto cuesta', 'cuesta', 'precio', 'cuota', 'pagar', 'dinero', 'gratis'],
        respuesta: 'Te informamos de la cuota cuando te pongas en contacto con nosotros, sin ningún compromiso. Escríbenos a <a href="mailto:info@sindicato-progresa.com">info@sindicato-progresa.com</a> o rellena el <a href="index.html#afiliate">formulario</a>.'
    },
    {
        pregunta: '¿Se entera mi empresa si me afilio?',
        claves: ['empresa se entera', 'entera mi empresa', 'entera','sabe mi empresa', 'secreto', 'confidencial', 'anonimo', 'privacidad'],
        respuesta: 'No tiene por qué. La afiliación sindical es un dato especialmente protegido y nadie está obligado a decirla. Tu empresa solo lo sabría si tú pides que te descuenten la cuota en la nómina.'
    },
    {
        pregunta: '¿Me pueden despedir por afiliarme?',
        claves: ['represalia', 'castigar', 'despedir por afiliarme', 'miedo', 'problemas por afiliarme', 'discriminar'],
        respuesta: 'No. Afiliarte es un derecho fundamental protegido por la Constitución y la Ley de Libertad Sindical. Un despido o un castigo por ese motivo es nulo. Si te pasa, <a href="index.html#contacto">contacta con nosotros</a>.'
    },
    {
        pregunta: '¿Quién puede afiliarse?',
        claves: ['quien puede', 'puedo afiliarme', 'puedo apuntarme', 'en paro', 'paro','desempleado', 'temporal', 'funcionario', 'autonomo', 'jubilado', 'estudiante', 'practicas', 'extranjero'],
        respuesta: 'Cualquier persona trabajadora: con contrato fijo o temporal, a jornada completa o parcial, del sector privado o público. También pueden afiliarse las personas en paro, jubiladas y autónomas sin trabajadores a su cargo.'
    },
    {
        pregunta: 'Me han despedido, ¿qué hago?',
        claves: ['despido', 'despedido', 'despiden', 'echado', 'echan', 'finiquito', 'carta de despido'],
        respuesta: '<strong>Date prisa:</strong> solo tienes 20 días hábiles para reclamar. No firmes el finiquito como "conforme" sin asesorarte (puedes poner "no conforme" junto a tu firma) y <a href="index.html#contacto">llámanos cuanto antes</a>. Más información en <a href="legislacion.html">Legislación</a>.'
    },
    {
        pregunta: '¿Qué es un convenio colectivo?',
        claves: ['convenio', 'colectivo', 'tablas salariales'],
        respuesta: 'Es el acuerdo entre sindicatos y empresas que fija las condiciones de un sector o empresa: salario, jornada, vacaciones, pluses, permisos… Suele mejorar lo que dice la ley. Si no sabes cuál te toca, te ayudamos a encontrarlo.'
    },
    {
        pregunta: '¿Qué es un delegado sindical?',
        claves: ['delegado', 'comite', 'representante', 'elecciones sindicales'],
        respuesta: 'Es la persona elegida por la plantilla para representarla ante la empresa. En empresas de más de 10 trabajadores (o desde 6 si así lo deciden) se eligen delegados de personal, y a partir de 50, un comité de empresa. Tienen garantías para que no sufran represalias.'
    },
    {
        pregunta: 'Vacaciones, jornada y permisos',
        claves: ['vacaciones', 'jornada', 'horas', 'horario', 'permiso', 'descanso', 'horas extra', 'registro'],
        respuesta: 'Por ley tienes al menos 30 días naturales de vacaciones, un máximo de 40 horas semanales de media y permisos pagados por motivos familiares, mudanza y otros. Tu convenio puede mejorarlo. Lo explicamos en <a href="legislacion.html">Legislación</a>.'
    },
    {
        pregunta: 'Festivos y calendario laboral',
        claves: ['festivo', 'fiesta', 'calendario', 'puente'],
        respuesta: 'Puedes consultar todos los festivos de Madrid en nuestro <a href="calendario.html">calendario laboral</a>.'
    },
    {
        pregunta: '¿Qué es una huelga?',
        claves: ['huelga', 'paro laboral', 'manifestacion'],
        respuesta: 'Es dejar de trabajar de forma colectiva para defender los intereses de los trabajadores. Es un derecho fundamental reconocido en la Constitución: durante la huelga no cobras ese tiempo, pero no te pueden despedir ni sancionar por secundarla.'
    },
    {
        pregunta: '¿Cómo os contacto?',
        claves: ['contacto', 'contactar', 'telefono', 'llamar', 'email', 'correo', 'hablar con alguien', 'persona', 'direccion'],
        respuesta: 'Escríbenos a <a href="mailto:info@sindicato-progresa.com">info@sindicato-progresa.com</a> o llámanos al <a href="tel:+34910735435">910 735 435</a> o al <a href="tel:+34685049357">685 049 357</a>.'
    }
];

const NO_ENTIENDO = 'No tengo una respuesta preparada para eso. Prueba con otras palabras, elige una de las preguntas de abajo o <a href="index.html#contacto">escríbenos</a> y te responde una persona del sindicato.';

// Quita acentos y mayúsculas para comparar ("Afiliación" = "afiliacion")
function normalizar(texto) {
    return texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[¿?¡!.,;:]/g, ' ');
}

// Busca la pregunta cuyas claves aparecen más (las claves largas cuentan más)
function buscarRespuesta(texto) {
    const t = ' ' + normalizar(texto) + ' ';
    let mejor = null, mejorPuntos = 0;
    for (const p of PREGUNTAS) {
        let puntos = 0;
        for (const clave of p.claves) {
            if (t.includes(normalizar(clave))) puntos += clave.split(' ').length;
        }
        if (puntos > mejorPuntos) { mejor = p; mejorPuntos = puntos; }
    }
    return mejor ? mejor.respuesta : NO_ENTIENDO;
}

function iniciarAsistente() {
    document.body.insertAdjacentHTML('beforeend', `
        <button type="button" class="chat-boton" id="chat-boton" aria-controls="chat-panel" aria-expanded="false">
            <i class="bi bi-chat-dots-fill"></i> <span>¿Dudas?</span>
        </button>
        <section class="chat-panel" id="chat-panel" role="dialog" aria-label="Asistente de dudas" hidden>
            <header class="chat-cabecera">
                <div>
                    <strong>Asistente PROGRESA</strong>
                    <span>Respuestas rápidas a dudas generales</span>
                </div>
                <button type="button" class="chat-cerrar" aria-label="Cerrar asistente"><i class="bi bi-x-lg"></i></button>
            </header>
            <div class="chat-mensajes" id="chat-mensajes" aria-live="polite"></div>
            <div class="chat-sugerencias" id="chat-sugerencias"></div>
            <form class="chat-form" id="chat-form">
                <input type="text" id="chat-texto" placeholder="Escribe tu pregunta…" aria-label="Escribe tu pregunta" autocomplete="off" maxlength="200">
                <button type="submit" aria-label="Enviar pregunta"><i class="bi bi-send-fill"></i></button>
            </form>
        </section>
    `);

    const boton       = document.getElementById('chat-boton');
    const panel       = document.getElementById('chat-panel');
    const mensajes    = document.getElementById('chat-mensajes');
    const sugerencias = document.getElementById('chat-sugerencias');
    const form        = document.getElementById('chat-form');
    const entrada     = document.getElementById('chat-texto');

    function anadir(quien, contenido) {
        const div = document.createElement('div');
        div.className = 'chat-msg chat-msg--' + quien;
        // Lo que escribe la persona se muestra como texto; las respuestas son nuestras y llevan enlaces
        if (quien === 'yo') div.textContent = contenido;
        else div.innerHTML = contenido;
        mensajes.appendChild(div);
        mensajes.scrollTop = mensajes.scrollHeight;
    }

    function preguntar(texto, respuesta = buscarRespuesta(texto)) {
        anadir('yo', texto);
        setTimeout(() => anadir('bot', respuesta), 300);
    }

    PREGUNTAS.forEach(p => {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = p.pregunta;
        b.addEventListener('click', () => preguntar(p.pregunta, p.respuesta));
        sugerencias.appendChild(b);
    });

    anadir('bot', '¡Hola! Soy el asistente de PROGRESA. Puedo resolver dudas generales sobre sindicatos y derechos laborales. Elige una pregunta o escríbela.');
    anadir('bot', '<small>Soy un asistente automático con respuestas preparadas: no guardo lo que escribes. Para tu caso concreto, habla con nuestro equipo.</small>');

    function abrir(si) {
        panel.hidden = !si;
        boton.setAttribute('aria-expanded', si);
        boton.classList.toggle('is-open', si);
        if (si) entrada.focus();
        else boton.focus();
    }

    boton.addEventListener('click', () => abrir(panel.hidden));
    panel.querySelector('.chat-cerrar').addEventListener('click', () => abrir(false));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) abrir(false); });

    form.addEventListener('submit', e => {
        e.preventDefault();
        const texto = entrada.value.trim();
        if (!texto) return;
        entrada.value = '';
        preguntar(texto);
    });
}

document.addEventListener('DOMContentLoaded', iniciarAsistente);

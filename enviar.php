<?php
/* =========================================================
   Recibe el formulario "Te llamamos" de la portada y lo envía
   por correo al administrador. Necesita un hosting con PHP.
   (La afiliación se hace con la ficha online de afiliacion.html,
   que no pasa por aquí.)
   ========================================================= */

// ---- CONFIGURACIÓN ----
$CORREO_ADMIN = 'info@sindicato-progresa.com';     // a quién llegan las peticiones de llamada
$CORREO_WEB   = 'no-responder@sindicato-progresa.com'; // remitente (debe ser de tu dominio)
// -----------------------

header('Content-Type: application/json; charset=utf-8');

function responder($ok, $error = '') {
    http_response_code($ok ? 200 : 400);
    echo json_encode(['ok' => $ok, 'error' => $error]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responder(false, 'Método no permitido.');
}

// Campo trampa: si viene relleno, es un robot. Fingimos éxito.
if (!empty($_POST['web'])) {
    responder(true);
}

// Limpia texto y elimina saltos de línea (evita inyección de cabeceras)
function campo($nombre, $multilinea = false) {
    $v = trim($_POST[$nombre] ?? '');
    if (!$multilinea) $v = str_replace(["\r", "\n"], ' ', $v);
    return mb_substr(strip_tags($v), 0, $multilinea ? 2000 : 200);
}

$d = [
    'Nombre'          => campo('nombre'),
    'Teléfono'        => campo('telefono'),
    'Email'           => campo('email'),
    'Mejor momento'   => campo('horario'),
    'Consulta'        => campo('mensaje', true),
];

// ---- Validación en servidor (nunca fiarse solo del navegador) ----
foreach (['Nombre', 'Teléfono'] as $obligatorio) {
    if ($d[$obligatorio] === '') responder(false, "Falta el campo: $obligatorio.");
}
if (!preg_match('/^[0-9 +]{9,15}$/', $d['Teléfono'])) {
    responder(false, 'El teléfono no es válido.');
}
if ($d['Email'] !== '' && !filter_var($d['Email'], FILTER_VALIDATE_EMAIL)) {
    responder(false, 'El correo electrónico no es válido.');
}
if (empty($_POST['privacidad'])) {
    responder(false, 'Debes aceptar la política de privacidad.');
}

// ---- Correo al administrador ----
$cuerpo  = "Nueva petición de llamada desde la web\n";
$cuerpo .= "=======================================\n\n";
foreach ($d as $etiqueta => $valor) {
    $cuerpo .= str_pad($etiqueta . ':', 22) . ($valor !== '' ? $valor : '-') . "\n";
}
$cuerpo .= "\nAcepta política de privacidad: Sí\n";
$cuerpo .= 'Fecha: ' . date('d/m/Y H:i') . "\n";
$cuerpo .= 'IP: ' . ($_SERVER['REMOTE_ADDR'] ?? '-') . "\n";

$asunto = '=?UTF-8?B?' . base64_encode('Llamar a: ' . $d['Nombre'] . ' (' . $d['Teléfono'] . ')') . '?=';
$cabeceras  = "From: Web Sindicato Progresa <$CORREO_WEB>\r\n";
if ($d['Email'] !== '') $cabeceras .= "Reply-To: {$d['Email']}\r\n";
$cabeceras .= "MIME-Version: 1.0\r\n";
$cabeceras .= "Content-Type: text/plain; charset=UTF-8\r\n";

if (!mail($CORREO_ADMIN, $asunto, $cuerpo, $cabeceras)) {
    responder(false, 'No se ha podido enviar el correo. Inténtalo más tarde o escríbenos a ' . $CORREO_ADMIN . '.');
}

// ---- Acuse de recibo al usuario (solo si ha dejado email) ----
if ($d['Email'] !== '') {
    $asuntoUsuario = '=?UTF-8?B?' . base64_encode('Te llamaremos pronto – Sindicato Progresa') . '?=';
    $cuerpoUsuario = "Hola {$d['Nombre']}:\n\n"
        . "Hemos recibido tus datos. Una persona del sindicato te llamará muy pronto.\n\n"
        . "Si quieres afiliarte ya, puedes rellenar tu ficha online en la sección Afíliate de nuestra web.\n\n"
        . "Un saludo,\nSindicato Progresa\n$CORREO_ADMIN · 910 735 435 · 685 049 357\n";
    $cabUsuario  = "From: Sindicato Progresa <$CORREO_WEB>\r\n";
    $cabUsuario .= "Reply-To: $CORREO_ADMIN\r\n";
    $cabUsuario .= "MIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\n";
    @mail($d['Email'], $asuntoUsuario, $cuerpoUsuario, $cabUsuario);
}

responder(true);

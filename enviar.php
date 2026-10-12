<?php
/* =========================================================
   Recibe el formulario de afiliación y lo envía por correo
   al administrador. Necesita un hosting con PHP.
   ========================================================= */

// ---- CONFIGURACIÓN ----
$CORREO_ADMIN = 'info@sindicato-progresa.com';     // a quién llegan las solicitudes
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
    'Nombre'              => campo('nombre'),
    'Apellidos'           => campo('apellidos'),
    'DNI / NIE'           => strtoupper(campo('dni')),
    'Fecha de nacimiento' => campo('nacimiento'),
    'Email'               => campo('email'),
    'Teléfono'            => campo('telefono'),
    'Dirección'           => campo('direccion'),
    'Código postal'       => campo('cp'),
    'Localidad'           => campo('localidad'),
    'Provincia'           => campo('provincia'),
    'Empresa'             => campo('empresa'),
    'Sector'              => campo('sector'),
    'Comentarios'         => campo('mensaje', true),
];

// ---- Validación en servidor (nunca fiarse solo del navegador) ----
foreach (['Nombre', 'Apellidos', 'DNI / NIE', 'Email', 'Teléfono', 'Empresa', 'Sector'] as $obligatorio) {
    if ($d[$obligatorio] === '') responder(false, "Falta el campo: $obligatorio.");
}
if (!filter_var($d['Email'], FILTER_VALIDATE_EMAIL)) {
    responder(false, 'El correo electrónico no es válido.');
}
if (!preg_match('/^[0-9XYZ][0-9]{7}[A-Z]$/', $d['DNI / NIE'])) {
    responder(false, 'El DNI / NIE no es válido.');
}
if (empty($_POST['privacidad'])) {
    responder(false, 'Debes aceptar la política de privacidad.');
}

// ---- Correo al administrador ----
$cuerpo  = "Nueva solicitud de afiliación desde la web\n";
$cuerpo .= "==========================================\n\n";
foreach ($d as $etiqueta => $valor) {
    $cuerpo .= str_pad($etiqueta . ':', 22) . ($valor !== '' ? $valor : '-') . "\n";
}
$cuerpo .= "\nAcepta política de privacidad: Sí\n";
$cuerpo .= 'Fecha: ' . date('d/m/Y H:i') . "\n";
$cuerpo .= 'IP: ' . ($_SERVER['REMOTE_ADDR'] ?? '-') . "\n";

$asunto = '=?UTF-8?B?' . base64_encode('Nueva afiliación: ' . $d['Nombre'] . ' ' . $d['Apellidos']) . '?=';
$cabeceras  = "From: Web Sindicato Progresa <$CORREO_WEB>\r\n";
$cabeceras .= "Reply-To: {$d['Email']}\r\n";
$cabeceras .= "MIME-Version: 1.0\r\n";
$cabeceras .= "Content-Type: text/plain; charset=UTF-8\r\n";

if (!mail($CORREO_ADMIN, $asunto, $cuerpo, $cabeceras)) {
    responder(false, 'No se ha podido enviar el correo. Inténtalo más tarde o escríbenos a ' . $CORREO_ADMIN . '.');
}

// ---- Acuse de recibo al usuario ----
$asuntoUsuario = '=?UTF-8?B?' . base64_encode('Hemos recibido tu solicitud – Sindicato Progresa') . '?=';
$cuerpoUsuario = "Hola {$d['Nombre']}:\n\n"
    . "Gracias por querer formar parte de PROGRESA. Hemos recibido tu solicitud de afiliación "
    . "y nos pondremos en contacto contigo muy pronto para completar el alta.\n\n"
    . "Un saludo,\nSindicato Progresa\n$CORREO_ADMIN · 910 735 435 · 685 049 357\n";
$cabUsuario  = "From: Sindicato Progresa <$CORREO_WEB>\r\n";
$cabUsuario .= "Reply-To: $CORREO_ADMIN\r\n";
$cabUsuario .= "MIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\n";
@mail($d['Email'], $asuntoUsuario, $cuerpoUsuario, $cabUsuario);

responder(true);

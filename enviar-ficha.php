<?php
/* =========================================================
   Recibe la ficha de afiliación firmada en afiliacion.html
   (un PDF creado en el navegador) y la envía por correo al
   sindicato como archivo adjunto, con una copia a la persona.
   Necesita un hosting con PHP.
   ========================================================= */

// ---- CONFIGURACIÓN ----
$CORREO_ADMIN = 's.gral@sindicato-progresa.com';   // a quién llegan las fichas
$CORREO_WEB   = 's.gral@sindicato-progresa.com';   // remitente (debe ser de tu dominio)
$MAX_BYTES    = 3 * 1024 * 1024;                     // tamaño máximo del PDF (3 MB)
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
function campo($nombre) {
    $v = trim($_POST[$nombre] ?? '');
    $v = str_replace(["\r", "\n"], ' ', $v);
    return mb_substr(strip_tags($v), 0, 120);
}

$pago      = campo('pago') === 'banco' ? 'banco' : 'nomina';
$nombre    = campo('nombre');
$apellidos = campo('apellidos');
$dni       = strtoupper(campo('dni'));
$email     = campo('email');
$movil     = campo('movil');
$empresa   = campo('empresa');

// ---- Validación en servidor (nunca fiarse solo del navegador) ----
if ($nombre === '' || $apellidos === '') responder(false, 'Faltan el nombre o los apellidos.');
if (!preg_match('/^[0-9XYZ][0-9]{7}[A-Z]$/', str_replace([' ', '-'], '', $dni))) responder(false, 'El DNI no es válido.');
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) responder(false, 'El correo electrónico no es válido.');
if (empty($_POST['privacidad'])) responder(false, 'Debes aceptar la política de privacidad.');

$f = $_FILES['ficha'] ?? null;
if (!$f || $f['error'] !== UPLOAD_ERR_OK) responder(false, 'No ha llegado la ficha.');
if ($f['size'] > $MAX_BYTES) responder(false, 'La ficha es demasiado grande.');
$pdf = file_get_contents($f['tmp_name']);
if (substr($pdf, 0, 5) !== '%PDF-') responder(false, 'El archivo recibido no es una ficha válida.');

$archivo = preg_replace('/[^a-z0-9-]/', '', strtolower(pathinfo($f['name'], PATHINFO_FILENAME)));
$archivo = ($archivo !== '' ? $archivo : 'ficha-afiliacion') . '.pdf';
$formaPago = $pago === 'banco' ? 'Domiciliación bancaria' : 'Descuento en nómina';

// Correo con el PDF adjunto
function enviarConAdjunto($para, $asunto, $texto, $de, $responderA, $pdf, $archivo) {
    $limite = 'progresa_' . md5(uniqid('', true));
    $cab  = "From: Sindicato Progresa <$de>\r\n";
    $cab .= "Reply-To: $responderA\r\n";
    $cab .= "MIME-Version: 1.0\r\n";
    $cab .= "Content-Type: multipart/mixed; boundary=\"$limite\"\r\n";

    $cuerpo  = "--$limite\r\n";
    $cuerpo .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $cuerpo .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
    $cuerpo .= $texto . "\r\n\r\n";
    $cuerpo .= "--$limite\r\n";
    $cuerpo .= "Content-Type: application/pdf; name=\"$archivo\"\r\n";
    $cuerpo .= "Content-Transfer-Encoding: base64\r\n";
    $cuerpo .= "Content-Disposition: attachment; filename=\"$archivo\"\r\n\r\n";
    $cuerpo .= chunk_split(base64_encode($pdf)) . "\r\n";
    $cuerpo .= "--$limite--\r\n";

    $asunto = '=?UTF-8?B?' . base64_encode($asunto) . '?=';
    return mail($para, $asunto, $cuerpo, $cab);
}

// ---- Al sindicato ----
$texto  = "Nueva ficha de afiliación firmada desde la web\n";
$texto .= "==============================================\n\n";
$texto .= str_pad('Nombre:', 18) . "$nombre $apellidos\n";
$texto .= str_pad('DNI:', 18) . "$dni\n";
$texto .= str_pad('Correo:', 18) . "$email\n";
$texto .= str_pad('Móvil:', 18) . ($movil !== '' ? $movil : '-') . "\n";
$texto .= str_pad('Empresa:', 18) . ($empresa !== '' ? $empresa : '-') . "\n";
$texto .= str_pad('Forma de pago:', 18) . "$formaPago\n\n";
$texto .= "La ficha firmada va adjunta en PDF.\n\n";
$texto .= "PENDIENTE: revisar la ficha, tramitar el cobro de la cuota y CONFIRMAR EL ALTA\n";
$texto .= "a la persona (por correo o por teléfono). La web solo le ha dicho que la ficha\n";
$texto .= "se ha recibido, no que ya esté dada de alta.\n\n";
$texto .= 'Fecha: ' . date('d/m/Y H:i') . "\n";
$texto .= 'IP: ' . ($_SERVER['REMOTE_ADDR'] ?? '-') . "\n";

if (!enviarConAdjunto($CORREO_ADMIN, "Nueva ficha de afiliación (pendiente de confirmar): $nombre $apellidos", $texto, $CORREO_WEB, $email, $pdf, $archivo)) {
    responder(false, 'No se ha podido enviar la ficha.');
}

// ---- Copia a la persona ----
$copia  = "Hola $nombre:\n\n";
$copia .= "Hemos recibido tu ficha de afiliación a PROGRESA. Te adjuntamos una copia firmada.\n\n";
$copia .= "Importante: tu alta todavía no está completa. Revisaremos tus datos y te\n";
$copia .= "escribiremos o llamaremos para confirmarte el alta en el sindicato.\n\n";
$copia .= "Si ves algún error, responde a este correo.\n\n";
$copia .= "Un saludo,\nSindicato Progresa\n$CORREO_ADMIN · 685 049 357 (teléfono y WhatsApp)\n";
@enviarConAdjunto($email, 'Tu ficha de afiliación – Sindicato Progresa', $copia, $CORREO_WEB, $CORREO_ADMIN, $pdf, $archivo);

responder(true);

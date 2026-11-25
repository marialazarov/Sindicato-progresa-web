#!/bin/sh
# Genera todos los carteles en PDF (docs/) y sus miniaturas para la web (img/)
# a partir de los HTML de esta carpeta.
#
#   Uso, desde la carpeta de la web:   sh carteles/generar.sh
#
# Vuelve a ejecutarlo cuando:
#   - cambies un texto de un cartel,
#   - añadas un año de festivos en js/calendario.js (salen solos sus carteles),
#   - añadas o cambies un día importante en js/carteles.js.
# Necesita Google Chrome instalado y conexión a internet (fuentes e iconos).

set -e
cd "$(dirname "$0")/.."
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
TMP="$(mktemp -d)"
mkdir -p docs/dias img/dias

generar() {   # $1 = html   $2 = salida sin extensión (p. ej. docs/x → docs/x.pdf + img/x.jpg)   $3 = ?parámetros
    url="file://$PWD/carteles/$1$3"
    "$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --hide-scrollbars \
        --virtual-time-budget=8000 --run-all-compositor-stages-before-draw \
        --print-to-pdf="docs/$2.pdf" "$url" 2>/dev/null
    "$CHROME" --headless=new --disable-gpu --hide-scrollbars \
        --virtual-time-budget=8000 --window-size=1123,1587 \
        --screenshot="$TMP/cartel.png" "$url" 2>/dev/null
    sips -s format jpeg -s formatOptions 80 -Z 640 "$TMP/cartel.png" --out "img/$2.jpg" >/dev/null
    echo "  docs/$2.pdf"
}

echo "Carteles para la pared…"
generar cartel-legislacion.html            cartel-legislacion
generar cartel-convenio-seguridad.html     cartel-convenio-seguridad
generar cartel-convenio-residencias.html   cartel-convenio-residencias
for anio in $(grep -oE '^    [0-9]{4}:' js/calendario.js | tr -dc '0-9\n'); do
    generar cartel-calendario.html cartel-calendario-$anio "?anio=$anio"
done

echo "Días importantes…"
for id in $(grep -oE "id: '[a-z0-9]+'" js/carteles.js | cut -d"'" -f2); do
    generar cartel-dia.html dias/cartel-$id "?id=$id"
done

echo "Festivos que aún no han pasado…"
HOY=$(date +%Y-%m-%d)
for f in $(grep -oE "fecha: '[0-9]{4}-[0-9]{2}-[0-9]{2}'" js/calendario.js | cut -d"'" -f2); do
    if [ ! "$f" \< "$HOY" ]; then
        generar cartel-dia.html dias/cartel-festivo-$f "?festivo=$f"
    fi
done

rm -rf "$TMP"
echo "Listo."

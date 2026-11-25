/* =========================================================
   CALENDARIOS LABORALES DE OTRAS CIUDADES
   ---------------------------------------------------------
   Se usan para los carteles descargables con el diseño del
   calendario oficial del sindicato (carteles/cartel-calendario-ciudad.html).
   Madrid no está aquí: usa los festivos de js/calendario.js.

   Para añadir una ciudad o un año: copia un bloque, cambia las
   fechas ("AAAA-MM-DD") y vuelve a ejecutar  sh carteles/generar.sh
   Tipos: "nacional", "autonomico" o "local".

   Fuentes 2027:
   - Nacionales y autonómicos: BOE-A-2026-21254 (13/10/2026).
   - Locales: Valencia, BOP de València (19-20/11/2026);
     Alicante, BOP de Alicante (04/11/2026); Cádiz, BOJA nº 210
     (29/10/2026); Albacete, BOP de Albacete (25/11/2026).
   ========================================================= */
const CIUDADES = {
    valencia: {
        nombre: 'Valencia',
        comunidad: 'Comunitat Valenciana',
        festivos: {
            2027: [
                { fecha: '2027-01-01', nombre: 'Año Nuevo',                        tipo: 'nacional' },
                { fecha: '2027-01-06', nombre: 'Epifanía del Señor',               tipo: 'nacional' },
                { fecha: '2027-01-22', nombre: 'San Vicente Mártir',               tipo: 'local' },
                { fecha: '2027-03-19', nombre: 'San José',                         tipo: 'autonomico' },
                { fecha: '2027-03-26', nombre: 'Viernes Santo',                    tipo: 'nacional' },
                { fecha: '2027-03-29', nombre: 'Lunes de Pascua',                  tipo: 'autonomico' },
                { fecha: '2027-04-05', nombre: 'San Vicente Ferrer',               tipo: 'local' },
                { fecha: '2027-05-01', nombre: 'Fiesta del Trabajo',               tipo: 'nacional' },
                { fecha: '2027-10-09', nombre: 'Día de la Comunitat Valenciana',   tipo: 'autonomico' },
                { fecha: '2027-10-12', nombre: 'Fiesta Nacional de España',        tipo: 'nacional' },
                { fecha: '2027-11-01', nombre: 'Todos los Santos',                 tipo: 'nacional' },
                { fecha: '2027-12-06', nombre: 'Día de la Constitución Española',  tipo: 'nacional' },
                { fecha: '2027-12-08', nombre: 'Inmaculada Concepción',            tipo: 'nacional' },
                { fecha: '2027-12-25', nombre: 'Natividad del Señor',              tipo: 'nacional' },
            ]
        }
    },
    alicante: {
        nombre: 'Alicante',
        comunidad: 'Comunitat Valenciana',
        festivos: {
            2027: [
                { fecha: '2027-01-01', nombre: 'Año Nuevo',                        tipo: 'nacional' },
                { fecha: '2027-01-06', nombre: 'Epifanía del Señor',               tipo: 'nacional' },
                { fecha: '2027-03-19', nombre: 'San José',                         tipo: 'autonomico' },
                { fecha: '2027-03-26', nombre: 'Viernes Santo',                    tipo: 'nacional' },
                { fecha: '2027-03-29', nombre: 'Lunes de Pascua',                  tipo: 'autonomico' },
                { fecha: '2027-04-08', nombre: 'Santa Faz',                        tipo: 'local' },
                { fecha: '2027-05-01', nombre: 'Fiesta del Trabajo',               tipo: 'nacional' },
                { fecha: '2027-06-24', nombre: 'San Juan (Hogueras)',              tipo: 'local' },
                { fecha: '2027-10-09', nombre: 'Día de la Comunitat Valenciana',   tipo: 'autonomico' },
                { fecha: '2027-10-12', nombre: 'Fiesta Nacional de España',        tipo: 'nacional' },
                { fecha: '2027-11-01', nombre: 'Todos los Santos',                 tipo: 'nacional' },
                { fecha: '2027-12-06', nombre: 'Día de la Constitución Española',  tipo: 'nacional' },
                { fecha: '2027-12-08', nombre: 'Inmaculada Concepción',            tipo: 'nacional' },
                { fecha: '2027-12-25', nombre: 'Natividad del Señor',              tipo: 'nacional' },
            ]
        }
    },
    cadiz: {
        nombre: 'Cádiz',
        comunidad: 'Andalucía',
        festivos: {
            2027: [
                { fecha: '2027-01-01', nombre: 'Año Nuevo',                        tipo: 'nacional' },
                { fecha: '2027-01-06', nombre: 'Epifanía del Señor',               tipo: 'nacional' },
                { fecha: '2027-02-08', nombre: 'Lunes de Carnaval',                tipo: 'local' },
                { fecha: '2027-03-01', nombre: 'Día de Andalucía',                 tipo: 'autonomico' },
                { fecha: '2027-03-25', nombre: 'Jueves Santo',                     tipo: 'nacional' },
                { fecha: '2027-03-26', nombre: 'Viernes Santo',                    tipo: 'nacional' },
                { fecha: '2027-05-01', nombre: 'Fiesta del Trabajo',               tipo: 'nacional' },
                { fecha: '2027-08-16', nombre: 'Lunes siguiente a la Asunción',    tipo: 'nacional' },
                { fecha: '2027-10-07', nombre: 'Virgen del Rosario',               tipo: 'local' },
                { fecha: '2027-10-12', nombre: 'Fiesta Nacional de España',        tipo: 'nacional' },
                { fecha: '2027-11-01', nombre: 'Todos los Santos',                 tipo: 'nacional' },
                { fecha: '2027-12-06', nombre: 'Día de la Constitución Española',  tipo: 'nacional' },
                { fecha: '2027-12-08', nombre: 'Inmaculada Concepción',            tipo: 'nacional' },
                { fecha: '2027-12-25', nombre: 'Natividad del Señor',              tipo: 'nacional' },
            ]
        }
    },
    albacete: {
        nombre: 'Albacete',
        comunidad: 'Castilla-La Mancha',
        festivos: {
            2027: [
                { fecha: '2027-01-01', nombre: 'Año Nuevo',                        tipo: 'nacional' },
                { fecha: '2027-01-06', nombre: 'Epifanía del Señor',               tipo: 'nacional' },
                { fecha: '2027-03-25', nombre: 'Jueves Santo',                     tipo: 'nacional' },
                { fecha: '2027-03-26', nombre: 'Viernes Santo',                    tipo: 'nacional' },
                { fecha: '2027-05-01', nombre: 'Fiesta del Trabajo',               tipo: 'nacional' },
                { fecha: '2027-05-27', nombre: 'Corpus Christi',                   tipo: 'autonomico' },
                { fecha: '2027-05-31', nombre: 'Día de Castilla-La Mancha',        tipo: 'autonomico' },
                { fecha: '2027-06-24', nombre: 'Fiesta local',                     tipo: 'local' },
                { fecha: '2027-09-08', nombre: 'Virgen de los Llanos (Feria)',     tipo: 'local' },
                { fecha: '2027-10-12', nombre: 'Fiesta Nacional de España',        tipo: 'nacional' },
                { fecha: '2027-11-01', nombre: 'Todos los Santos',                 tipo: 'nacional' },
                { fecha: '2027-12-06', nombre: 'Día de la Constitución Española',  tipo: 'nacional' },
                { fecha: '2027-12-08', nombre: 'Inmaculada Concepción',            tipo: 'nacional' },
                { fecha: '2027-12-25', nombre: 'Natividad del Señor',              tipo: 'nacional' },
            ]
        }
    }
};

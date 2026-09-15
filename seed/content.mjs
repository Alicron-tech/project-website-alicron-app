// Website content, English and Spanish. Edit here, run seed.mjs, or edit in the Studio afterwards.
export const IMAGES = {
  'hero-pipeline': 'img/hero-pipeline.jpg', 'case-pipeline': 'img/case-pipeline.jpg', 'hero-fixedwing': 'img/hero-fixedwing.jpg', 'case-agri': 'img/case-agri.jpg',
  'case-powerline': 'img/case-powerline.jpg', 'case-emergency': 'img/case-emergency.jpg', 'case-mapping': 'img/case-mapping.jpg', 'software-gcs': 'img/software-gcs.jpg',
  'software-ugv': 'img/software-ugv.jpg', 'software-vision': 'img/software-vision.jpg', 'training-field': 'img/training-field.jpg', 'training-class': 'img/training-class.jpg',
  'engineering-lab': 'img/engineering-lab.jpg', 'engineering-test': 'img/engineering-test.jpg', 'company-alicante': 'img/company-alicante.jpg', 'dark-carbon': 'img/dark-carbon.jpg',
  'dark-antenna': 'img/dark-antenna.jpg', 'platform-multirotor': 'img/platform-multirotor.jpg', 'platform-fixedwing': 'img/platform-fixedwing.jpg',
  'p-15sat': 'photos/multirotor-15-satellite.jpg', 'p-15sat-2': 'photos/multirotor-15-satellite-2.jpg', 'p-13': 'photos/multirotor-13.jpg', 'p-13fibre': 'photos/multirotor-13-fibre.jpg',
  'p-10': 'photos/multirotor-10.jpg', 'p-17': 'photos/multirotor-17.jpg', 'p-x8': 'photos/multirotor-coaxial.jpg', 'p-fwlong': 'photos/fixedwing-long.jpg', 'p-fwlong-2': 'photos/fixedwing-long-2.jpg',
  'p-fwfast': 'photos/fixedwing-fast.jpg', 'p-fwfast-2': 'photos/fixedwing-fast-2.jpg', 'p-gcs': 'photos/ground-station.jpg', 'p-gcs-case': 'photos/ground-station-case.jpg', 'p-7': 'photos/multirotor-7.jpg',
}
const L = (en, es) => ({en, es})
const img = (k) => ({$img: k})
const media = (k, opts = {}) => ({image: img(k), ...opts})
const ref = (id) => ({_type: 'reference', _ref: id})
const stat = (value, en, es) => ({value, label: L(en, es)})
const spec = (en, es, ven, ves) => ({label: L(en, es), value: L(ven, ves ?? ven)})

export async function content() {
  const settings = {
    _id: 'siteSettings', _type: 'siteSettings', name: 'ALICRON',
    tagline: L('Unmanned systems, engineered in Spain.', 'Sistemas no tripulados, diseñados en España.'),
    description: L('ALICRON designs, builds and flies unmanned aircraft and the software around them from Alicante, Spain. Inspection, agriculture, mapping, training and engineering services.',
      'ALICRON diseña, fabrica y opera aeronaves no tripuladas y el software que las rodea desde Alicante, España. Inspección, agricultura, cartografía, formación e ingeniería.'),
    nav: [
      {label: L('Platforms', 'Plataformas'), href: '/platforms'}, {label: L('Applications', 'Aplicaciones'), href: '/applications'},
      {label: L('Software', 'Software'), href: '/software'}, {label: L('Training', 'Formación'), href: '/training'},
      {label: L('Engineering', 'Ingeniería'), href: '/engineering'}, {label: L('Company', 'Empresa'), href: '/company'},
    ],
    email: 'info@alicron.es', phone: '',
    address: L('ALICRON\nAlicante, Comunidad Valenciana\nSpain', 'ALICRON\nAlicante, Comunidad Valenciana\nEspaña'),
    footerNote: L('Alicante, Spain. Part of a European unmanned-systems group.', 'Alicante, España. Parte de un grupo europeo de sistemas no tripulados.'),
    ctaLabel: L('Talk to us', 'Hablemos'),
  }

  // ---------------------------------------------------------------- platforms
  const platforms = [
    {_id: 'platform-multirotor-10', _type: 'platform', slug: {current: 'multirotor-10'}, order: 1, family: 'Multirotor',
      name: L('10-inch multirotor', 'Multirrotor de 10 pulgadas'),
      role: L('The everyday workhorse: forty minutes in the air with three kilos on board.', 'La plataforma de diario: cuarenta minutos en el aire con tres kilos a bordo.'),
      summary: L('A compact quadcopter that carries a serious sensor and still fits in the back of a car. It is the airframe we reach for when a job needs a camera up quickly and back down again.',
        'Un cuadricóptero compacto que lleva un sensor serio y aun así cabe en el maletero. Es la aeronave que sacamos cuando hay que subir una cámara rápido y bajarla igual de rápido.'),
      body: L(`Ten-inch propellers, an eight-cell battery and a frame that has been through more field days than we can count. The 10-inch class flies for about forty minutes and carries up to three kilograms, which covers most camera and gimbal combinations our customers ask for.

The control link is encrypted and the video link is analogue by default, which sounds old-fashioned until you have flown behind a hill and watched a digital link freeze. Digital 4K video is available as an option.

It takes off vertically from a patch of ground the size of a table. Two people can run a full day of flights out of one vehicle.`,
        `Hélices de diez pulgadas, batería de ocho celdas y un chasis que ha pasado por más jornadas de campo de las que podemos contar. La clase de 10 pulgadas vuela unos cuarenta minutos y carga hasta tres kilos, que cubren la mayoría de combinaciones de cámara y estabilizador que nos piden los clientes.

El enlace de control va cifrado y el vídeo es analógico por defecto, algo que suena anticuado hasta que vuelas detrás de una loma y ves cómo un enlace digital se congela. El vídeo digital 4K está disponible como opción.

Despega en vertical desde un trozo de suelo del tamaño de una mesa. Dos personas sacan una jornada entera de vuelos con un solo vehículo.`),
      status: L('In service', 'En servicio'),
      stats: [stat('40 min', 'flight time', 'autonomía'), stat('30 km', 'operating range', 'alcance'), stat('3 kg', 'payload', 'carga útil'), stat('3 000 m', 'ceiling', 'techo')],
      specs: [spec('Frame', 'Chasis', '10-inch, carbon fibre', '10 pulgadas, fibra de carbono'), spec('Battery', 'Batería', '8S lithium', '8S litio'), spec('Max speed', 'Velocidad máx.', '140 km/h'), spec('Control link', 'Enlace de control', 'Encrypted radio', 'Radio cifrada'), spec('Video', 'Vídeo', 'Analogue, encrypted; digital 4K optional', 'Analógico cifrado; 4K digital opcional'), spec('Take-off', 'Despegue', 'Vertical')],
      image: img('p-10'), gallery: [img('p-7'), img('dark-carbon')], applications: [ref('application-power-lines'), ref('application-mapping')]},

    {_id: 'platform-multirotor-13', _type: 'platform', slug: {current: 'multirotor-13'}, order: 2, family: 'Multirotor',
      name: L('13-inch multirotor', 'Multirrotor de 13 pulgadas'),
      role: L('Reach over speed: forty kilometres out, fifty minutes on station, with a fibre-optic option that cannot be jammed.', 'Alcance por encima de velocidad: cuarenta kilómetros, cincuenta minutos en estación y una opción de fibra óptica que no se puede interferir.'),
      summary: L('The long-range multirotor. It flies further and stays longer than the 10-inch, and it is the airframe we fit with a spooled optical fibre when radio is not an option.',
        'El multirrotor de largo alcance. Vuela más lejos y aguanta más que el de 10 pulgadas, y es la aeronave a la que montamos una bobina de fibra óptica cuando la radio no es una opción.'),
      body: L(`Thirteen-inch propellers buy endurance. This class stays up for around fifty minutes and works out to forty kilometres with a digital 4K link, which is what you want when the target is a positive identification and not just a glimpse.

The fibre-optic version replaces radio altogether. Control and video travel down a hair-thin optical fibre that unwinds from a spool on the aircraft. Nothing radiates, so nothing can be jammed or located, and the picture stays clean inside tunnels, under bridges and in industrial plants full of interference. Range in that configuration is around thirty kilometres, with a lower ceiling because the fibre has to reach the ground.

Both versions share batteries, spares and training with the rest of the multirotor line.`,
        `Las hélices de trece pulgadas compran autonomía. Esta clase se mantiene unos cincuenta minutos en el aire y trabaja hasta cuarenta kilómetros con un enlace digital 4K, que es lo que hace falta cuando el objetivo es una identificación positiva y no un vistazo.

La versión de fibra óptica prescinde de la radio por completo. El control y el vídeo viajan por una fibra fina como un cabello que se desenrolla de una bobina en la aeronave. Nada emite, así que nada se puede interferir ni localizar, y la imagen sigue limpia dentro de túneles, bajo puentes y en plantas industriales llenas de ruido electromagnético. El alcance en esa configuración ronda los treinta kilómetros, con un techo más bajo porque la fibra tiene que llegar al suelo.

Las dos versiones comparten baterías, repuestos y formación con el resto de la línea multirrotor.`),
      status: L('In service', 'En servicio'),
      stats: [stat('50 min', 'flight time', 'autonomía'), stat('40 km', 'operating range', 'alcance'), stat('2 kg', 'payload', 'carga útil'), stat('4K', 'digital video', 'vídeo digital')],
      specs: [spec('Frame', 'Chasis', '13-inch, carbon fibre', '13 pulgadas, fibra de carbono'), spec('Battery', 'Batería', '8S lithium', '8S litio'), spec('Max speed', 'Velocidad máx.', '110 km/h'), spec('Ceiling', 'Techo', '1 500 m (800 m on fibre)', '1 500 m (800 m con fibra)'), spec('Control link', 'Enlace de control', 'Encrypted radio or optical fibre', 'Radio cifrada o fibra óptica'), spec('Video', 'Vídeo', 'Digital 4K, encrypted; 20 Mbit over fibre', 'Digital 4K cifrado; 20 Mbit por fibra')],
      image: img('p-13'), gallery: [img('p-13fibre'), img('dark-carbon')], applications: [ref('application-pipeline-inspection'), ref('application-power-lines'), ref('application-emergency')]},

    {_id: 'platform-multirotor-15-satellite', _type: 'platform', slug: {current: 'multirotor-15-satellite'}, order: 3, family: 'Multirotor',
      name: L('15-inch satellite-linked multirotor', 'Multirrotor de 15 pulgadas con enlace satelital'),
      role: L('No line-of-sight ceiling. Both links run over satellite, so the operator can sit in an office two provinces away.', 'Sin límite de línea de visión. Los dos enlaces van por satélite, así que el operador puede estar en una oficina a dos provincias de distancia.'),
      summary: L('Our long-range inspection aircraft. A flat satellite terminal on top of the frame carries control and video, which removes the ground station from the picture entirely.',
        'Nuestra aeronave de inspección de largo alcance. Un terminal satelital plano sobre el chasis lleva el control y el vídeo, lo que saca a la estación de tierra de la ecuación.'),
      body: L(`This is the aircraft in the pipeline video. A vehicle drives to the start of the section, a case opens, the aircraft lifts off and follows the line while the engineer watches the feed from the office. When the battery runs low it lands next to the vehicle, and the technician swaps the pack.

The satellite link means the flight does not depend on a radio horizon, a mast or a relay. It also means the same person can supervise flights in different valleys on the same day. Latency is higher than a direct radio link, so the aircraft flies the route itself and the operator steps in for the interesting parts.

It carries up to two kilograms, enough for a zoom camera and a thermal sensor together, and flies for about forty minutes per pack.`,
        `Es la aeronave del vídeo de la tubería. Un vehículo llega al inicio del tramo, se abre una maleta, la aeronave despega y sigue la conducción mientras el ingeniero mira la señal desde la oficina. Cuando la batería baja, aterriza junto al vehículo y el técnico cambia el pack.

El enlace satelital hace que el vuelo no dependa de un horizonte de radio, un mástil ni un repetidor. También permite que la misma persona supervise vuelos en valles distintos el mismo día. La latencia es mayor que con radio directa, así que la aeronave vuela la ruta por sí misma y el operador interviene en las partes que importan.

Carga hasta dos kilos, suficiente para una cámara con zoom y un sensor térmico a la vez, y vuela unos cuarenta minutos por pack.`),
      status: L('In service', 'En servicio'),
      stats: [stat('40 min', 'flight time', 'autonomía'), stat('35 km', 'operating range', 'alcance'), stat('2 kg', 'payload', 'carga útil'), stat('SAT', 'control and video', 'control y vídeo')],
      specs: [spec('Frame', 'Chasis', '15-inch, carbon fibre', '15 pulgadas, fibra de carbono'), spec('Battery', 'Batería', '8S lithium', '8S litio'), spec('Max speed', 'Velocidad máx.', '90 km/h'), spec('Ceiling', 'Techo', '1 500 m'), spec('Control link', 'Enlace de control', 'Satellite', 'Satelital'), spec('Video', 'Vídeo', 'Digital over satellite', 'Digital por satélite'), spec('Relay role', 'Función de repetidor', 'Can carry a radio relay for other aircraft', 'Puede llevar un repetidor de radio para otras aeronaves')],
      image: img('p-15sat'), gallery: [img('p-15sat-2'), img('dark-antenna')], applications: [ref('application-pipeline-inspection'), ref('application-emergency'), ref('application-mapping')]},

    {_id: 'platform-multirotor-15-coaxial', _type: 'platform', slug: {current: 'multirotor-15-coaxial'}, order: 4, family: 'Multirotor',
      name: L('15-inch coaxial heavy lifter', 'Multirrotor coaxial de 15 pulgadas'),
      role: L('Eight motors in four coaxial pairs: four kilograms of payload and a motor to spare.', 'Ocho motores en cuatro pares coaxiales: cuatro kilos de carga útil y un motor de reserva.'),
      summary: L('The heaviest rotary airframe in the range. Coaxial pairs give redundancy, so losing one motor is a note in the log rather than a lost aircraft.',
        'La aeronave de rotor más pesada de la gama. Los pares coaxiales dan redundancia, así que perder un motor es una anotación en el registro y no una aeronave perdida.'),
      body: L(`Some sensors are heavy. Lidar heads, multispectral rigs with their own compute, delivery boxes. The coaxial 15-inch lifts four kilograms and keeps the flight envelope of the rest of the line, with a satellite link as standard.

The eight-motor layout is the point. Each arm carries two motors turning in opposite directions. If one fails, the aircraft flies home on seven. Over a town, a plant or a crowd, that is the difference between an incident report and a phone call to a lawyer.`,
        `Algunos sensores pesan. Cabezales lidar, equipos multiespectrales con su propio procesador, cajas de entrega. El coaxial de 15 pulgadas levanta cuatro kilos y mantiene la envolvente de vuelo del resto de la línea, con enlace satelital de serie.

La disposición de ocho motores es la clave. Cada brazo lleva dos motores girando en sentidos opuestos. Si uno falla, la aeronave vuelve a casa con siete. Sobre un pueblo, una planta o una multitud, esa es la diferencia entre un informe de incidencia y una llamada a un abogado.`),
      status: L('In service', 'En servicio'),
      stats: [stat('4 kg', 'payload', 'carga útil'), stat('40 min', 'flight time', 'autonomía'), stat('30 km', 'operating range', 'alcance'), stat('8', 'motors', 'motores')],
      specs: [spec('Frame', 'Chasis', '15-inch, coaxial X8', '15 pulgadas, coaxial X8'), spec('Battery', 'Batería', '8S lithium', '8S litio'), spec('Max speed', 'Velocidad máx.', '100 km/h'), spec('Ceiling', 'Techo', '1 500 m'), spec('Links', 'Enlaces', 'Satellite control and video', 'Control y vídeo por satélite')],
      image: img('p-x8'), gallery: [img('platform-multirotor')], applications: [ref('application-mapping'), ref('application-agriculture')]},

    {_id: 'platform-multirotor-17', _type: 'platform', slug: {current: 'multirotor-17'}, order: 5, family: 'Multirotor',
      name: L('17-inch long-endurance multirotor', 'Multirrotor de 17 pulgadas de larga autonomía'),
      role: L('The longest rotary reach we build: fifty-five minutes and forty-five kilometres on a full satellite link.', 'El mayor alcance en rotor que fabricamos: cincuenta y cinco minutos y cuarenta y cinco kilómetros con enlace satelital completo.'),
      summary: L('When a multirotor has to cover a whole valley or a full section of coast in one flight, this is the airframe. Large propellers, slow turning, very efficient.',
        'Cuando un multirrotor tiene que cubrir un valle entero o un tramo completo de costa en un solo vuelo, esta es la aeronave. Hélices grandes, giro lento, muy eficiente.'),
      body: L(`Seventeen-inch propellers turn slowly and quietly. The aircraft is not fast, but it stays up for close to an hour and it does so with two kilograms on board. It is our first choice for survey lines, repeated inspections of the same asset and any job where you would rather not land halfway.

Satellite links on both control and video, as on the 15-inch. It folds for transport and travels in the same case family as the rest of the line.`,
        `Las hélices de diecisiete pulgadas giran despacio y en silencio. La aeronave no es rápida, pero se mantiene cerca de una hora en el aire y lo hace con dos kilos a bordo. Es nuestra primera opción para líneas de levantamiento, inspecciones repetidas del mismo activo y cualquier trabajo en el que prefieras no aterrizar a mitad.

Enlaces satelitales de control y vídeo, como en el de 15 pulgadas. Se pliega para el transporte y viaja en la misma familia de maletas que el resto de la línea.`),
      status: L('In service', 'En servicio'),
      stats: [stat('55 min', 'flight time', 'autonomía'), stat('45 km', 'operating range', 'alcance'), stat('2 kg', 'payload', 'carga útil'), stat('1 500 m', 'ceiling', 'techo')],
      specs: [spec('Frame', 'Chasis', '17-inch, carbon fibre, folding', '17 pulgadas, fibra de carbono, plegable'), spec('Battery', 'Batería', '8S lithium', '8S litio'), spec('Max speed', 'Velocidad máx.', '90 km/h'), spec('Links', 'Enlaces', 'Satellite control and video', 'Control y vídeo por satélite')],
      image: img('p-17'), gallery: [img('dark-antenna')], applications: [ref('application-pipeline-inspection'), ref('application-mapping')]},

    {_id: 'platform-fixed-wing-endurance', _type: 'platform', slug: {current: 'fixed-wing-endurance'}, order: 6, family: 'Fixed-wing',
      name: L('Fixed-wing survey aircraft', 'Aeronave de ala fija para levantamientos'),
      role: L('A 1.8-metre wing that carries five kilograms at ninety kilometres per hour, for fields and coastlines that a multirotor cannot finish.', 'Un ala de 1,8 metros que lleva cinco kilos a noventa kilómetros por hora, para campos y costas que un multirrotor no termina.'),
      summary: L('Electric, launched from a rail, landed on its belly in a field. The fixed-wing covers ground the way a multirotor never will, and it does it with a real sensor bay.',
        'Eléctrica, lanzada desde un raíl, aterriza sobre el vientre en un campo. El ala fija cubre terreno como un multirrotor nunca podrá, y lo hace con una bahía de sensores de verdad.'),
      body: L(`A wing is the efficient way to cover distance. This aircraft cruises at ninety kilometres per hour for fifty minutes, which is roughly seventy kilometres of survey line per flight with a mapping camera or a multispectral head in the bay.

Five kilograms of payload is unusual for an electric aircraft of this size. It means the sensor does not have to be the smallest one on the market, and it means there is room for a second instrument.

Launch is from a rail that packs into the vehicle. Recovery is a belly landing on grass or a field, with the sensor protected inside the fuselage. Two people run the whole cycle.`,
        `Un ala es la forma eficiente de cubrir distancia. Esta aeronave cruza a noventa kilómetros por hora durante cincuenta minutos, que son unos setenta kilómetros de línea de levantamiento por vuelo con una cámara de cartografía o un cabezal multiespectral en la bahía.

Cinco kilos de carga útil es poco habitual en una aeronave eléctrica de este tamaño. Significa que el sensor no tiene que ser el más pequeño del mercado, y que hay sitio para un segundo instrumento.

El lanzamiento se hace desde un raíl que se guarda en el vehículo. La recuperación es un aterrizaje sobre el vientre en hierba o campo, con el sensor protegido dentro del fuselaje. Dos personas gestionan el ciclo completo.`),
      status: L('In service', 'En servicio'),
      stats: [stat('1.8 m', 'wingspan', 'envergadura'), stat('5 kg', 'payload', 'carga útil'), stat('50 min', 'flight time', 'autonomía'), stat('45 km', 'operating range', 'alcance')],
      specs: [spec('Wingspan / length', 'Envergadura / longitud', '1 800 mm / 1 600 mm'), spec('Cruise / max speed', 'Crucero / máx.', '90 / 140 km/h'), spec('Ceiling', 'Techo', '2 000 m'), spec('Propulsion', 'Propulsión', 'Electric', 'Eléctrica'), spec('Launch / recovery', 'Lanzamiento / recuperación', 'Rail / belly landing', 'Raíl / aterrizaje sobre el vientre'), spec('Links', 'Enlaces', 'Encrypted control, 8 W analogue video', 'Control cifrado, vídeo analógico de 8 W')],
      image: img('p-fwlong'), gallery: [img('p-fwlong-2'), img('engineering-test')], applications: [ref('application-agriculture'), ref('application-mapping'), ref('application-emergency')]},

    {_id: 'platform-fixed-wing-fast', _type: 'platform', slug: {current: 'fixed-wing-fast'}, order: 7, family: 'Fixed-wing',
      name: L('High-speed fixed-wing', 'Ala fija de alta velocidad'),
      role: L('Catapult launch, ninety minutes aloft, a dash speed most light aircraft would envy. In development at the R&D centre.', 'Lanzamiento por catapulta, noventa minutos en el aire y una velocidad punta que envidiarían muchas avionetas. En desarrollo en el centro de I+D.'),
      summary: L('A compact electric aircraft built for rapid response: get to a point sixty kilometres away, look, and come back before a helicopter has finished its checklist.',
        'Una aeronave eléctrica compacta pensada para respuesta rápida: llegar a un punto a sesenta kilómetros, mirar y volver antes de que un helicóptero termine su lista de comprobación.'),
      body: L(`Most survey aircraft are slow on purpose. This one is not. It leaves the catapult, climbs two thousand metres in about ninety seconds and cruises at 140 to 160 kilometres per hour, with a dash well above that. Ninety minutes of endurance at cruise gives a practical radius of thirty kilometres and a maximum range of sixty.

The use cases are the ones where minutes matter: a fire report from a remote valley, a vessel in trouble off the coast, a road cut by a landslide. A thermal or a light-sensitive camera in the nose, analogue or digital video back to the ground station.

The airframe is flying at the R&D centre. Figures on this page are from the current test configuration and will change.`,
        `La mayoría de aeronaves de levantamiento son lentas a propósito. Esta no. Sale de la catapulta, sube dos mil metros en unos noventa segundos y cruza a 140 o 160 kilómetros por hora, con una punta bastante superior. Noventa minutos de autonomía en crucero dan un radio práctico de treinta kilómetros y un alcance máximo de sesenta.

Los casos de uso son aquellos en los que cuentan los minutos: un aviso de incendio en un valle remoto, una embarcación con problemas frente a la costa, una carretera cortada por un desprendimiento. Una cámara térmica o de alta sensibilidad en el morro, y vídeo analógico o digital de vuelta a la estación de tierra.

La aeronave está volando en el centro de I+D. Las cifras de esta página corresponden a la configuración de pruebas actual y cambiarán.`),
      status: L('In development', 'En desarrollo'),
      stats: [stat('90 min', 'endurance', 'autonomía'), stat('60 km', 'max range', 'alcance máx.'), stat('2 000 m', 'in 90 s', 'en 90 s'), stat('3 min', 'to launch', 'hasta el lanzamiento')],
      specs: [spec('Dimensions', 'Dimensiones', '1 300 × 570 × 160 mm'), spec('Take-off mass', 'Masa al despegue', '3.6 kg', '3,6 kg'), spec('Cruise', 'Crucero', '140 to 160 km/h', '140 a 160 km/h'), spec('Ceiling', 'Techo', '6 000 m (working 500 to 3 500 m)', '6 000 m (operativo 500 a 3 500 m)'), spec('Launch', 'Lanzamiento', 'Catapult', 'Catapulta'), spec('Wind limit', 'Límite de viento', '25 m/s'), spec('Operating temperature', 'Temperatura de operación', '−20 to +40 °C', '−20 a +40 °C')],
      image: img('p-fwfast'), gallery: [img('p-fwfast-2'), img('platform-fixedwing')], applications: [ref('application-emergency')]},
  ]

  // ---------------------------------------------------------------- applications
  const applications = [
    {_id: 'application-pipeline-inspection', _type: 'application', slug: {current: 'pipeline-inspection'}, order: 1,
      name: L('Pipeline and linear infrastructure', 'Tuberías e infraestructura lineal'),
      role: L('Fly the line every week instead of driving it every quarter.', 'Volar la línea cada semana en vez de recorrerla en coche cada trimestre.'),
      summary: L('Pipelines, aqueducts, canals and rail corridors are long, remote and boring to inspect on foot. A satellite-linked multirotor flies the corridor on its own route while an engineer watches from the office.',
        'Las tuberías, acueductos, canales y corredores ferroviarios son largos, remotos y aburridos de inspeccionar a pie. Un multirrotor con enlace satelital vuela el corredor por su propia ruta mientras un ingeniero mira desde la oficina.'),
      body: L(`Here is how a section gets flown. A technician drives to the start of the corridor with the aircraft in a case. The case opens, the aircraft runs its checks and lifts off. From that moment the engineer responsible for the section has the live picture on a screen at the office, with the aircraft\'s position on the map next to the pipeline\'s own alignment sheet.

The aircraft follows the corridor at a set height and speed, stops where the route says to stop, and looks where the route says to look: valve stations, river crossings, places where the ground moved last winter. Thermal video shows leaks and wet ground. Zoom video shows third-party digging, vegetation over the right of way and damage to markers.

When the battery runs low the aircraft lands by the vehicle, the technician changes the pack and the next leg starts. At the end of the day the flight log, the video and the flagged frames are in the customer\'s system.`,
        `Así se vuela un tramo. Un técnico llega al inicio del corredor con la aeronave en una maleta. La maleta se abre, la aeronave hace sus comprobaciones y despega. Desde ese momento, el ingeniero responsable del tramo tiene la imagen en directo en una pantalla de la oficina, con la posición de la aeronave en el mapa junto al plano de trazado de la propia tubería.

La aeronave sigue el corredor a una altura y velocidad fijadas, se detiene donde la ruta dice que se detenga y mira donde la ruta dice que mire: estaciones de válvulas, cruces de ríos, zonas donde el terreno se movió el invierno pasado. El vídeo térmico muestra fugas y suelo húmedo. El vídeo con zoom muestra excavaciones de terceros, vegetación sobre la servidumbre y daños en los hitos.

Cuando la batería baja, la aeronave aterriza junto al vehículo, el técnico cambia el pack y empieza el siguiente tramo. Al final del día, el registro de vuelo, el vídeo y los fotogramas marcados están en el sistema del cliente.`),
      outcomes: [L('A flown record of every kilometre, dated and georeferenced', 'Un registro volado de cada kilómetro, con fecha y georreferenciado'), L('Thermal and visual video with flagged frames', 'Vídeo térmico y visual con fotogramas marcados'), L('One engineer supervising several crews from one screen', 'Un ingeniero supervisando varios equipos desde una pantalla'), L('Fewer vehicle kilometres on the right of way', 'Menos kilómetros de vehículo sobre la servidumbre')],
      stats: [stat('35 km', 'per flight leg', 'por tramo de vuelo'), stat('40 min', 'per battery', 'por batería'), stat('2', 'people in the field', 'personas en campo'), stat('SAT', 'no radio horizon', 'sin horizonte de radio')],
      image: img('case-pipeline'), media: media('hero-pipeline', {isVideoPlaceholder: true, alt: L('A satellite-linked multirotor lifts off from a vehicle beside a pipeline in the hills', 'Un multirrotor con enlace satelital despega desde un vehículo junto a una tubería en las montañas'), caption: L('Scenario film: office to valley to pipeline. In production.', 'Película del escenario: de la oficina al valle y a la tubería. En producción.')}),
      platforms: [ref('platform-multirotor-15-satellite'), ref('platform-multirotor-17'), ref('platform-multirotor-13')]},

    {_id: 'application-agriculture', _type: 'application', slug: {current: 'agriculture'}, order: 2,
      name: L('Crop monitoring', 'Seguimiento de cultivos'),
      role: L('A multispectral camera on a wing sees stress in a field two weeks before a person does.', 'Una cámara multiespectral en un ala ve el estrés de un campo dos semanas antes que una persona.'),
      summary: L('The fixed-wing flies the farm in one pass. The multispectral head records what the plants reflect in bands the eye cannot see, and the software turns that into a map of where to water, feed or look closer.',
        'El ala fija sobrevuela la finca en una sola pasada. El cabezal multiespectral registra lo que reflejan las plantas en bandas que el ojo no ve, y el software lo convierte en un mapa de dónde regar, abonar o mirar más de cerca.'),
      body: L(`Healthy leaves reflect near-infrared light strongly. Stressed leaves do not, and they stop doing it before they look any different. A multispectral camera measures that reflection in several narrow bands. Fly it over a field and you get an index map that shows the plants' condition plot by plot.

We fly the survey aircraft along parallel lines at a fixed height, usually early in the morning when the air is calm and the light is even. Seventy kilometres of line per flight covers several hundred hectares. The images are stitched and processed the same day.

The output is not a pretty picture. It is a set of zones, each with a recommendation: this corner is short of water, this strip is short of nitrogen, this patch should be walked because something is wrong and the camera cannot tell what. Over a season the maps show whether the changes worked.`,
        `Las hojas sanas reflejan con fuerza la luz del infrarrojo cercano. Las hojas estresadas no, y dejan de hacerlo antes de que se vea ninguna diferencia. Una cámara multiespectral mide esa reflexión en varias bandas estrechas. Vuélala sobre un campo y obtienes un mapa de índices que muestra el estado de las plantas parcela por parcela.

Volamos la aeronave de levantamiento en líneas paralelas a altura fija, normalmente a primera hora de la mañana, cuando el aire está en calma y la luz es uniforme. Setenta kilómetros de línea por vuelo cubren varios cientos de hectáreas. Las imágenes se unen y se procesan el mismo día.

El resultado no es una foto bonita. Es un conjunto de zonas, cada una con una recomendación: a esta esquina le falta agua, a esta franja le falta nitrógeno, este rodal hay que recorrerlo a pie porque algo pasa y la cámara no sabe qué. A lo largo de una campaña, los mapas muestran si los cambios funcionaron.`),
      outcomes: [L('Vegetation index maps per plot, same-day', 'Mapas de índice de vegetación por parcela, el mismo día'), L('Zoned recommendations for irrigation and fertiliser', 'Recomendaciones por zonas para riego y abonado'), L('Season-over-season comparison of the same fields', 'Comparación campaña a campaña de los mismos campos'), L('Flight planning that repeats exactly, every time', 'Planificación de vuelo que se repite exactamente igual cada vez')],
      stats: [stat('70 km', 'of survey line per flight', 'de línea por vuelo'), stat('5 kg', 'sensor bay', 'bahía de sensores'), stat('5', 'spectral bands', 'bandas espectrales'), stat('1 day', 'to processed maps', 'hasta los mapas procesados')],
      image: img('case-agri'), media: media('hero-fixedwing', {isVideoPlaceholder: true, alt: L('A fixed-wing aircraft over olive groves at golden hour', 'Una aeronave de ala fija sobre olivares al atardecer'), caption: L('Scenario film: a morning survey over the farm. In production.', 'Película del escenario: un levantamiento matinal sobre la finca. En producción.')}),
      platforms: [ref('platform-fixed-wing-endurance'), ref('platform-multirotor-15-coaxial')]},

    {_id: 'application-power-lines', _type: 'application', slug: {current: 'power-lines'}, order: 3,
      name: L('Power lines and substations', 'Líneas eléctricas y subestaciones'),
      role: L('Insulators, clamps and hot spots, photographed from three metres without switching anything off.', 'Aisladores, grapas y puntos calientes, fotografiados a tres metros sin desconectar nada.'),
      summary: L('A multirotor with a zoom camera and a thermal sensor works its way along a line tower by tower. The line stays live. The pictures go straight into the maintenance system.',
        'Un multirrotor con cámara de zoom y sensor térmico recorre una línea torre a torre. La línea sigue en tensión. Las fotos van directas al sistema de mantenimiento.'),
      body: L(`The old way is a lineman in a bucket truck, or a helicopter, or a person with binoculars. The aircraft does the same job from a standoff distance, and it does it in the same order every time, so the photos from this year line up with the photos from last year.

Thermal video finds the hot clamp before it fails. Zoom video finds the cracked insulator, the bird nest and the tree that has grown into the clearance. At a substation the aircraft flies a fixed pattern over the yard and the operator reviews the thermal image transformer by transformer.

Where the line runs through terrain with no radio coverage, the 13-inch fibre-optic version or the satellite-linked 15-inch keeps the picture steady.`,
        `La forma antigua es un liniero en una cesta, o un helicóptero, o una persona con prismáticos. La aeronave hace el mismo trabajo desde una distancia de seguridad, y lo hace en el mismo orden cada vez, así que las fotos de este año encajan con las del año pasado.

El vídeo térmico encuentra la grapa caliente antes de que falle. El vídeo con zoom encuentra el aislador agrietado, el nido y el árbol que ha crecido dentro de la distancia de seguridad. En una subestación, la aeronave vuela un patrón fijo sobre el parque y el operador revisa la imagen térmica transformador a transformador.

Donde la línea atraviesa terreno sin cobertura de radio, la versión de fibra óptica de 13 pulgadas o la de 15 pulgadas con enlace satelital mantienen la imagen estable.`),
      outcomes: [L('Photo set per tower, in a fixed order, year after year', 'Juego de fotos por torre, en orden fijo, año tras año'), L('Thermal anomalies with temperature readings', 'Anomalías térmicas con lecturas de temperatura'), L('No outage, no bucket truck, no climbing', 'Sin corte, sin cesta, sin escalada'), L('Vegetation encroachment flagged on the map', 'Vegetación invasora marcada en el mapa')],
      stats: [stat('3 m', 'standoff distance', 'distancia de trabajo'), stat('0', 'outages', 'cortes'), stat('50 min', 'per flight', 'por vuelo'), stat('4K', 'zoom video', 'vídeo con zoom')],
      image: img('case-powerline'), platforms: [ref('platform-multirotor-13'), ref('platform-multirotor-10')]},

    {_id: 'application-emergency', _type: 'application', slug: {current: 'emergency'}, order: 4,
      name: L('Emergency response', 'Emergencias'),
      role: L('A picture of the situation in the first twenty minutes, from an aircraft that was already in the truck.', 'Una imagen de la situación en los primeros veinte minutos, desde una aeronave que ya iba en el camión.'),
      summary: L('Wildfire, flood, a search in the hills, a road cut off. The first question is always the same: what does it look like right now? The answer should not depend on a helicopter being available.',
        'Incendio, inundación, una búsqueda en la sierra, una carretera cortada. La primera pregunta es siempre la misma: ¿qué aspecto tiene ahora mismo? La respuesta no debería depender de que haya un helicóptero disponible.'),
      body: L(`The aircraft lives in a case in the response vehicle. It launches from the roadside and gives the incident commander a live thermal and visual picture within minutes. For a fire, that is the front line and the spot fires behind it. For a flood, the water\'s edge and the roads that still work. For a search, a thermal signature in a ravine that nobody could see from the path.

For long distances we use the fixed-wing: sixty kilometres out and back in under an hour, faster than any vehicle on a mountain road. For hovering over one spot and reading detail, the multirotor. The satellite-linked aircraft lets a coordination centre in the city see the same feed as the crew on the ground.

The rules for flying near emergencies are strict, for good reasons. We train crews to work inside them and we help customers set up the standing authorisations before the first incident, not after.`,
        `La aeronave vive en una maleta en el vehículo de intervención. Despega desde el arcén y da al jefe de la emergencia una imagen térmica y visual en directo en cuestión de minutos. En un incendio, es el frente y los focos secundarios detrás. En una inundación, el borde del agua y las carreteras que aún funcionan. En una búsqueda, una firma térmica en un barranco que nadie veía desde el sendero.

Para largas distancias usamos el ala fija: sesenta kilómetros de ida y vuelta en menos de una hora, más rápido que cualquier vehículo por una carretera de montaña. Para quedarse sobre un punto y leer detalle, el multirrotor. La aeronave con enlace satelital permite que un centro de coordinación en la ciudad vea la misma señal que el equipo sobre el terreno.

Las normas para volar cerca de emergencias son estrictas, y con razón. Formamos a los equipos para trabajar dentro de ellas y ayudamos a los clientes a tramitar las autorizaciones permanentes antes del primer incidente, no después.`),
      outcomes: [L('Live thermal and visual feed to the command post', 'Señal térmica y visual en directo al puesto de mando'), L('The same feed at the coordination centre over satellite', 'La misma señal en el centro de coordinación por satélite'), L('Crews trained on the flight rules for emergencies', 'Equipos formados en las normas de vuelo en emergencias'), L('A recorded timeline of the incident from above', 'Una cronología grabada del incidente desde el aire')],
      stats: [stat('< 20 min', 'to first picture', 'hasta la primera imagen'), stat('60 km', 'fixed-wing reach', 'alcance del ala fija'), stat('90 min', 'fixed-wing endurance', 'autonomía del ala fija'), stat('SAT', 'feed to the centre', 'señal al centro')],
      image: img('case-emergency'), platforms: [ref('platform-fixed-wing-fast'), ref('platform-multirotor-15-satellite'), ref('platform-multirotor-13')]},

    {_id: 'application-mapping', _type: 'application', slug: {current: 'mapping'}, order: 5,
      name: L('Mapping and surveying', 'Cartografía y topografía'),
      role: L('Orthophotos, elevation models and volumes, flown on a schedule and delivered in the customer\'s coordinate system.', 'Ortofotos, modelos de elevación y volúmenes, volados según calendario y entregados en el sistema de coordenadas del cliente.'),
      summary: L('Quarries, construction sites, coastlines and municipalities all need the same thing: an accurate, recent map. We fly it, process it and hand over files that open in the tools the customer already uses.',
        'Canteras, obras, costas y municipios necesitan lo mismo: un mapa preciso y reciente. Lo volamos, lo procesamos y entregamos archivos que se abren en las herramientas que el cliente ya usa.'),
      body: L(`Photogrammetry is mostly discipline. Fly the lines with the right overlap, at the right height, with control points measured on the ground. Do that and the orthophoto lands within a few centimetres. Skip it and nothing lines up.

We fly small sites with a multirotor and large ones with the fixed-wing. The heavy lifter carries a lidar head where vegetation hides the ground. Processing runs the same night. Deliverables are an orthomosaic, a digital surface model, a digital terrain model, contour lines and, for stockpiles and earthworks, volumes against the previous flight.

For a site that changes every month, we set the flight up once and repeat it. The comparison between flights is where the value is: what moved, what grew, what was removed.`,
        `La fotogrametría es sobre todo disciplina. Volar las líneas con el solape correcto, a la altura correcta, con puntos de control medidos en tierra. Si se hace así, la ortofoto cae dentro de unos pocos centímetros. Si se salta, nada encaja.

Volamos los emplazamientos pequeños con un multirrotor y los grandes con el ala fija. El multirrotor pesado lleva un cabezal lidar donde la vegetación oculta el suelo. El procesado se ejecuta esa misma noche. Los entregables son una ortomosaico, un modelo digital de superficie, un modelo digital del terreno, curvas de nivel y, para acopios y movimientos de tierra, volúmenes respecto al vuelo anterior.

Para un emplazamiento que cambia cada mes, configuramos el vuelo una vez y lo repetimos. La comparación entre vuelos es donde está el valor: qué se movió, qué creció, qué se retiró.`),
      outcomes: [L('Orthomosaic and elevation models in the customer\'s coordinate system', 'Ortomosaico y modelos de elevación en el sistema de coordenadas del cliente'), L('Volumes against the previous flight', 'Volúmenes respecto al vuelo anterior'), L('Ground control points measured and reported', 'Puntos de control medidos y documentados'), L('Repeatable flight plans for monthly comparison', 'Planes de vuelo repetibles para comparación mensual')],
      stats: [stat('3 cm', 'ground sample distance', 'resolución en el suelo'), stat('500 ha', 'per fixed-wing flight', 'por vuelo de ala fija'), stat('4 kg', 'lidar on the heavy lifter', 'lidar en el multirrotor pesado'), stat('1 night', 'processing', 'de procesado')],
      image: img('case-mapping'), platforms: [ref('platform-fixed-wing-endurance'), ref('platform-multirotor-15-coaxial'), ref('platform-multirotor-10')]},
  ]

  // ---------------------------------------------------------------- offerings
  const offerings = [
    {_id: 'offering-mission-software', _type: 'offering', slug: {current: 'mission-software'}, order: 1, category: 'software',
      name: L('Mission software for the ground station', 'Software de misión para la estación de tierra'),
      role: L('What the operator sees, and what the aircraft does when the operator is not looking.', 'Lo que ve el operador, y lo que hace la aeronave cuando el operador no mira.'),
      body: L(`The ground station runs our own mission software. It plans routes on the map, flies them, and hands control to the operator where the route says so. The on-screen display shows the numbers that matter and hides the ones that do not.

Two things we are proud of. The video channel can be switched in flight, synchronised between the aircraft and the operator\'s receiver, so a noisy channel costs seconds rather than a landing. And the station monitors two receivers at once and shows the link quality of each, so the operator knows which one is carrying the picture and how much margin is left.`,
        `La estación de tierra ejecuta nuestro propio software de misión. Planifica rutas sobre el mapa, las vuela y cede el control al operador donde la ruta lo indica. La información en pantalla muestra los números que importan y esconde los que no.

Dos cosas de las que estamos orgullosos. El canal de vídeo se puede cambiar en vuelo, sincronizado entre la aeronave y el receptor del operador, de modo que un canal con ruido cuesta segundos y no un aterrizaje. Y la estación vigila dos receptores a la vez y muestra la calidad de enlace de cada uno, así que el operador sabe cuál lleva la imagen y cuánto margen queda.`),
      points: [L('Route planning and automatic flight with operator hand-over points', 'Planificación de rutas y vuelo automático con puntos de cesión al operador'), L('In-flight video channel switching', 'Cambio de canal de vídeo en vuelo'), L('Dual-receiver monitoring with link quality per channel', 'Vigilancia de dos receptores con calidad de enlace por canal'), L('Extended on-screen display', 'Información en pantalla ampliada'), L('Flight logs exported to the customer\'s systems', 'Registros de vuelo exportados a los sistemas del cliente')],
      status: L('In service', 'En servicio'), image: img('software-gcs')},
    {_id: 'offering-ground-robotics', _type: 'offering', slug: {current: 'ground-robotics'}, order: 2, category: 'software',
      name: L('Control suite for ground robots', 'Sistema de control para robots terrestres'),
      role: L('The same map, the same operator, a vehicle instead of an aircraft.', 'El mismo mapa, el mismo operador, un vehículo en vez de una aeronave.'),
      body: L(`Wheeled robots are useful in the places aircraft are not: inside a plant, along a row of trees, across a site where something heavy has to be carried. We are building the control layer for them on the same software the ground station already runs, so an operator who can fly a route can drive one.

The suite handles teleoperation with front and rear cameras, waypoint driving, and a payload interface for whatever the vehicle carries. It is in development at the R&D centre with a partner\'s platform and will be released when it has done a season of real work.`,
        `Los robots con ruedas son útiles donde las aeronaves no lo son: dentro de una planta, a lo largo de una hilera de árboles, en una obra donde hay que mover algo pesado. Estamos construyendo su capa de control sobre el mismo software que ya ejecuta la estación de tierra, para que un operador capaz de volar una ruta pueda conducir una.

El sistema gestiona la teleoperación con cámaras delantera y trasera, la conducción por puntos de ruta y una interfaz de carga útil para lo que lleve el vehículo. Está en desarrollo en el centro de I+D con la plataforma de un socio y se publicará cuando haya hecho una temporada de trabajo real.`),
      points: [L('Teleoperation with front and rear cameras', 'Teleoperación con cámaras delantera y trasera'), L('Waypoint driving on the same map as the aircraft', 'Conducción por puntos de ruta sobre el mismo mapa que las aeronaves'), L('Payload interface for carriers, sprayers and sensors', 'Interfaz de carga útil para portadores, pulverizadores y sensores'), L('Shared operator training with the air side', 'Formación de operador compartida con la parte aérea')],
      status: L('In development', 'En desarrollo'), image: img('software-ugv')},
    {_id: 'offering-onboard-vision', _type: 'offering', slug: {current: 'onboard-vision'}, order: 3, category: 'software',
      name: L('On-board vision', 'Visión a bordo'),
      role: L('A small computer next to the camera that recognises what it is looking at.', 'Un pequeño ordenador junto a la cámara que reconoce lo que está viendo.'),
      body: L(`A camera on an aircraft produces far more video than anyone will ever watch. On-board vision reads it as it is recorded. It finds the things the mission is about, marks them in the frame, and tells the operator when a decision is needed: a person in a search area, a vehicle on a right of way, a hot spot on a line.

The same module can hold the aircraft on a target when the link is poor or the operator is busy. It runs on a credit-card-sized computer next to the camera and it is trained on our own flight footage. The research team in Alicante works on it together with the visual recognition group of the wider company.`,
        `Una cámara en una aeronave produce mucho más vídeo del que nadie verá jamás. La visión a bordo lo lee según se graba. Encuentra las cosas de las que trata la misión, las marca en la imagen y avisa al operador cuando hace falta una decisión: una persona en una zona de búsqueda, un vehículo sobre una servidumbre, un punto caliente en una línea.

El mismo módulo puede mantener la aeronave sobre un objetivo cuando el enlace es pobre o el operador está ocupado. Funciona en un ordenador del tamaño de una tarjeta junto a la cámara y se entrena con nuestras propias grabaciones de vuelo. El equipo de investigación de Alicante trabaja en él junto con el grupo de reconocimiento visual del conjunto de la empresa.`),
      points: [L('Detection and marking of people, vehicles and thermal anomalies', 'Detección y marcado de personas, vehículos y anomalías térmicas'), L('Target hold when the link degrades', 'Mantenimiento de objetivo cuando el enlace se degrada'), L('Runs on the aircraft, not in the cloud', 'Se ejecuta en la aeronave, no en la nube'), L('Trained on our own flight footage', 'Entrenado con nuestras propias grabaciones')],
      status: L('Research', 'Investigación'), image: img('software-vision')},

    {_id: 'offering-first-flights', _type: 'offering', slug: {current: 'first-flights'}, order: 1, category: 'training',
      name: L('First flights', 'Primeros vuelos'),
      role: L('Two days. You arrive having never held a controller and leave having flown a route on your own.', 'Dos días. Llegas sin haber tocado un mando y te vas habiendo volado una ruta por tu cuenta.'),
      body: L(`This is where everyone starts, including our own engineers. Day one is the simulator and the small trainer aircraft on the airfield: hover, box, figure of eight, landing on a mark. Day two is the 10-inch with a camera, a planned route, and the checklist we use on real jobs.

Groups are four people per instructor. We keep it that small because the useful part is the instructor standing next to you.`,
        `Aquí empieza todo el mundo, incluidos nuestros propios ingenieros. El primer día es el simulador y la aeronave pequeña de entrenamiento en el campo de vuelo: estacionario, cuadrado, ocho, aterrizaje sobre una marca. El segundo día es el de 10 pulgadas con cámara, una ruta planificada y la lista de comprobación que usamos en trabajos reales.

Los grupos son de cuatro personas por instructor. Lo mantenemos así de pequeño porque la parte útil es tener al instructor al lado.`),
      points: [L('Simulator, trainer aircraft, then the 10-inch', 'Simulador, aeronave de entrenamiento y luego el de 10 pulgadas'), L('Pre-flight, checklist and airspace basics', 'Prevuelo, lista de comprobación y nociones de espacio aéreo'), L('Four trainees per instructor', 'Cuatro alumnos por instructor'), L('Held at our airfield near Alicante or at the customer\'s site', 'En nuestro campo de vuelo cerca de Alicante o en las instalaciones del cliente')],
      status: L('2 days', '2 días'), image: img('training-field')},
    {_id: 'offering-pilot-course', _type: 'offering', slug: {current: 'pilot-course'}, order: 2, category: 'training',
      name: L('Operator course', 'Curso de operador'),
      role: L('Two weeks to fly the whole line, plan a mission and bring the aircraft back when something goes wrong.', 'Dos semanas para volar toda la línea, planificar una misión y traer la aeronave de vuelta cuando algo falla.'),
      body: L(`The operator course takes someone from first flights to being trusted with a customer\'s aircraft. It covers every airframe in the line, the ground station software, mission planning, weather, batteries and the failures we have actually seen: lost link, lost video, a motor out, a fibre snag.

The second week is flown against a scenario a day. Pipeline, power line, mapping grid, a search at dusk. Each ends with a debrief on the flight log. Trainees who pass fly with us on real work for their first jobs.`,
        `El curso de operador lleva a alguien desde los primeros vuelos hasta poder confiarle la aeronave de un cliente. Cubre todas las aeronaves de la línea, el software de la estación de tierra, la planificación de misiones, la meteorología, las baterías y los fallos que hemos visto de verdad: pérdida de enlace, pérdida de vídeo, un motor fuera, una fibra enganchada.

La segunda semana se vuela con un escenario por día. Tubería, línea eléctrica, malla de cartografía, una búsqueda al anochecer. Cada uno termina con un análisis del registro de vuelo. Los alumnos que aprueban vuelan con nosotros en trabajos reales en sus primeros encargos.`),
      points: [L('All airframes, both link types, the ground station', 'Todas las aeronaves, los dos tipos de enlace, la estación de tierra'), L('Mission planning and weather', 'Planificación de misiones y meteorología'), L('Failure drills from real incidents', 'Ejercicios de fallo basados en incidentes reales'), L('A scenario a day in the second week', 'Un escenario al día en la segunda semana')],
      status: L('2 weeks', '2 semanas'), image: img('training-class')},
    {_id: 'offering-technical-course', _type: 'offering', slug: {current: 'technical-course'}, order: 3, category: 'training',
      name: L('Technical course', 'Curso técnico'),
      role: L('Keep a fleet flying: batteries, motors, links, firmware and the paperwork that goes with them.', 'Mantener una flota en vuelo: baterías, motores, enlaces, firmware y el papeleo que los acompaña.'),
      body: L(`Aircraft that fly every day need someone who understands them. The technical course is one week at the workshop in Alicante. Trainees strip and rebuild an airframe, replace motors and controllers, cycle and grade batteries, update firmware and tune a link.

The last day is about records: what to log after every flight, how to read the logs when something looks wrong, and when to ground an aircraft rather than fly it.`,
        `Las aeronaves que vuelan a diario necesitan a alguien que las entienda. El curso técnico es una semana en el taller de Alicante. Los alumnos desmontan y vuelven a montar una aeronave, cambian motores y controladores, ciclan y clasifican baterías, actualizan firmware y ajustan un enlace.

El último día trata de registros: qué anotar después de cada vuelo, cómo leer los registros cuando algo no cuadra y cuándo dejar una aeronave en tierra en vez de volarla.`),
      points: [L('Strip and rebuild of a multirotor and a fixed-wing', 'Desmontaje y montaje de un multirrotor y un ala fija'), L('Battery management and grading', 'Gestión y clasificación de baterías'), L('Firmware, link tuning and ground station setup', 'Firmware, ajuste de enlaces y configuración de la estación'), L('Maintenance records and when to ground an aircraft', 'Registros de mantenimiento y cuándo dejar una aeronave en tierra')],
      status: L('1 week', '1 semana'), image: img('engineering-lab')},
    {_id: 'offering-instructor-course', _type: 'offering', slug: {current: 'instructor-course'}, order: 4, category: 'training',
      name: L('Instructor course', 'Curso de instructor'),
      role: L('For customers who want to train their own people, on their own site, with our material.', 'Para clientes que quieren formar a su propia gente, en su propio emplazamiento, con nuestro material.'),
      body: L(`Some organisations will train dozens of operators over a few years. For them we train instructors. The course takes experienced operators through how we teach, why the drills are the way they are, and how to run a course safely with people who have never flown.

Instructors leave with the full course material in Spanish and English, the simulator licences, and a line to us for the questions that come up in the first year.`,
        `Algunas organizaciones formarán a decenas de operadores en pocos años. Para ellas formamos instructores. El curso enseña a operadores con experiencia cómo enseñamos nosotros, por qué los ejercicios son como son y cómo llevar un curso con seguridad con gente que nunca ha volado.

Los instructores se van con todo el material del curso en español e inglés, las licencias del simulador y una línea directa con nosotros para las dudas que surgen el primer año.`),
      points: [L('For experienced operators', 'Para operadores con experiencia'), L('Course material in Spanish and English', 'Material del curso en español e inglés'), L('Simulator licences included', 'Licencias del simulador incluidas'), L('Support line for the first year', 'Línea de apoyo durante el primer año')],
      status: L('1 week', '1 semana'), image: img('p-gcs')},

    {_id: 'offering-design', _type: 'offering', slug: {current: 'design'}, order: 1, category: 'engineering',
      name: L('Design and prototyping', 'Diseño y prototipado'),
      role: L('From a sketch on a whiteboard to an airframe on the bench, with the people who will fly it in the room.', 'De un boceto en la pizarra a una aeronave en el banco, con la gente que la volará en la sala.'),
      body: L(`We design airframes, payload mounts and the electronics between them. The workshop in Alicante has the tools to go from CAD to a flying prototype in weeks: printers for structural parts, a small machine shop, a bench for electronics, and a field ten minutes away to fly the result.

Most of our own line started as a customer asking for something that did not exist. A camera that needed a different mount. A fibre spool that had to survive a landing. We would rather build it than tell you it cannot be done.`,
        `Diseñamos aeronaves, soportes de carga útil y la electrónica que hay entre ellos. El taller de Alicante tiene las herramientas para pasar del CAD a un prototipo volando en semanas: impresoras para piezas estructurales, un pequeño taller mecánico, un banco de electrónica y un campo a diez minutos para volar el resultado.

Buena parte de nuestra propia línea empezó con un cliente pidiendo algo que no existía. Una cámara que necesitaba otro soporte. Una bobina de fibra que tenía que sobrevivir a un aterrizaje. Preferimos construirlo antes que decirte que no se puede.`),
      points: [L('Airframe and payload design in CAD', 'Diseño de aeronave y carga útil en CAD'), L('Printed and machined prototypes in-house', 'Prototipos impresos y mecanizados en casa'), L('Custom flight electronics and links', 'Electrónica de vuelo y enlaces a medida'), L('First flight within weeks of the brief', 'Primer vuelo pocas semanas después del encargo')],
      status: L('Alicante', 'Alicante'), image: img('engineering-lab')},
    {_id: 'offering-testing', _type: 'offering', slug: {current: 'testing'}, order: 2, category: 'engineering',
      name: L('Test and validation', 'Pruebas y validación'),
      role: L('Every aircraft flies before it ships. Every design flies a lot before it is a product.', 'Cada aeronave vuela antes de entregarse. Cada diseño vuela mucho antes de ser producto.'),
      body: L(`A serial number is assigned to every airframe and every one of them goes through a flight test before it leaves. Batteries are cycled and graded. Links are checked against a spectrum analyser. The test card is kept with the aircraft for its whole life.

For new designs the programme is longer: endurance flights, wind limits, link range, drop tests of the cases, temperature cycles. We publish the figures we measured, not the figures we hoped for, and we say which configuration they were measured in.`,
        `Cada aeronave recibe un número de serie y todas pasan una prueba de vuelo antes de salir. Las baterías se ciclan y se clasifican. Los enlaces se comprueban con un analizador de espectro. La ficha de pruebas acompaña a la aeronave toda su vida.

Para diseños nuevos el programa es más largo: vuelos de autonomía, límites de viento, alcance de enlace, pruebas de caída de las maletas, ciclos de temperatura. Publicamos las cifras que medimos, no las que esperábamos, y decimos en qué configuración se midieron.`),
      points: [L('Flight test and serial number for every airframe', 'Prueba de vuelo y número de serie para cada aeronave'), L('Battery grading and link verification', 'Clasificación de baterías y verificación de enlaces'), L('Endurance, wind and range programmes for new designs', 'Programas de autonomía, viento y alcance para diseños nuevos'), L('Measured figures, stated configuration', 'Cifras medidas, configuración declarada')],
      status: L('Alicante', 'Alicante'), image: img('engineering-test')},
    {_id: 'offering-integration', _type: 'offering', slug: {current: 'integration'}, order: 3, category: 'engineering',
      name: L('Integration', 'Integración'),
      role: L('Your sensor, our aircraft, one system that the operator does not have to think about.', 'Tu sensor, nuestra aeronave, un sistema en el que el operador no tiene que pensar.'),
      body: L(`Customers arrive with a sensor they already trust, a mapping pipeline they already run or a control room that already exists. We fit the aircraft to that, not the other way round. Mounts, power, data links, the format the files come out in, the screen the feed lands on.

The same applies to ground infrastructure. A mast and a relay for a valley with no coverage, a satellite terminal for a site with no valley at all, a case that fits the vehicle you have.`,
        `Los clientes llegan con un sensor en el que ya confían, un flujo de cartografía que ya ejecutan o una sala de control que ya existe. Adaptamos la aeronave a eso, no al revés. Soportes, alimentación, enlaces de datos, el formato en que salen los archivos, la pantalla en la que aterriza la señal.

Lo mismo vale para la infraestructura de tierra. Un mástil y un repetidor para un valle sin cobertura, un terminal satelital para un emplazamiento donde no hay valle, una maleta que quepa en el vehículo que ya tienes.`),
      points: [L('Sensor mounts, power and data', 'Soportes de sensor, alimentación y datos'), L('Output formats for the customer\'s tools', 'Formatos de salida para las herramientas del cliente'), L('Ground stations, masts, relays and satellite terminals', 'Estaciones de tierra, mástiles, repetidores y terminales satelitales'), L('Transport cases fitted to the customer\'s vehicles', 'Maletas de transporte adaptadas a los vehículos del cliente')],
      status: L('Alicante', 'Alicante'), image: img('p-gcs-case')},
    {_id: 'offering-centre', _type: 'offering', slug: {current: 'centre'}, order: 4, category: 'engineering',
      name: L('The Alicante centre', 'El centro de Alicante'),
      role: L('Workshop, electronics bench, flight test field and a classroom, in one place, a short drive from the airport.', 'Taller, banco de electrónica, campo de pruebas de vuelo y un aula, en un mismo lugar, a poca distancia del aeropuerto.'),
      body: L(`ALICRON\'s research and development centre is in the province of Alicante. It is where designs are drawn, prototypes are built, aircraft are tested and operators are trained. The wider group\'s serial manufacturing is in the Netherlands; Alicante is where things are worked out first.

Visitors are welcome by appointment. Bring the problem, and if the weather allows we will fly something at it the same afternoon.`,
        `El centro de investigación y desarrollo de ALICRON está en la provincia de Alicante. Es donde se dibujan los diseños, se construyen los prototipos, se prueban las aeronaves y se forman los operadores. La fabricación en serie del grupo está en los Países Bajos; en Alicante es donde las cosas se resuelven primero.

Recibimos visitas con cita previa. Traiga el problema y, si el tiempo lo permite, volaremos algo sobre él esa misma tarde.`),
      points: [L('Design office and electronics bench', 'Oficina de diseño y banco de electrónica'), L('Prototype workshop with printing and machining', 'Taller de prototipos con impresión y mecanizado'), L('Flight test field ten minutes away', 'Campo de pruebas de vuelo a diez minutos'), L('Classroom and simulator room', 'Aula y sala de simulador')],
      status: L('Alicante', 'Alicante'), image: img('company-alicante')},
  ]

  // ---------------------------------------------------------------- pages
  const pages = [
    {_id: 'page-home', _type: 'page', slug: {current: 'home'},
      title: L('Home', 'Inicio'), metaDescription: settings.description,
      heroEyebrow: L('Alicante, Spain', 'Alicante, España'),
      heroTitle: L('Aircraft that work where people should not have to.', 'Aeronaves que trabajan donde las personas no deberían tener que hacerlo.'),
      heroLead: L('ALICRON designs, builds and flies unmanned aircraft and the software around them. Pipelines, fields, power lines, coastlines. Engineered and tested in Spain.',
        'ALICRON diseña, fabrica y opera aeronaves no tripuladas y el software que las rodea. Tuberías, campos, líneas eléctricas, costas. Diseñado y probado en España.'),
      heroMedia: media('hero-pipeline', {isVideoPlaceholder: true, alt: L('A multirotor with a satellite terminal lifts off from a pickup on a mountain road beside a pipeline', 'Un multirrotor con terminal satelital despega desde una camioneta en una carretera de montaña junto a una tubería')}),
      heroCtaLabel: L('Talk to us', 'Hablemos'), heroCtaHref: '/contact',
      sections: [
        {kind: 'features', eyebrow: L('What we do', 'Qué hacemos'), title: L('Four things, done properly.', 'Cuatro cosas, bien hechas.'),
          features: [
            {title: L('Aerial platforms', 'Plataformas aéreas'), text: L('Multirotors from ten to seventeen inches and two fixed-wing aircraft. Radio, fibre-optic or satellite links. Built to be flown every day, not shown once.', 'Multirrotores de diez a diecisiete pulgadas y dos aeronaves de ala fija. Enlaces por radio, fibra óptica o satélite. Hechas para volar a diario, no para enseñarse una vez.'), href: '/platforms'},
            {title: L('Software and robotics', 'Software y robótica'), text: L('Our own mission software on the ground station, on-board vision next to the camera, and a control suite for ground robots in development.', 'Nuestro propio software de misión en la estación de tierra, visión a bordo junto a la cámara y un sistema de control para robots terrestres en desarrollo.'), href: '/software'},
            {title: L('Training', 'Formación'), text: L('First flights in two days, operators in two weeks, technicians in one, instructors for customers who will train their own people.', 'Primeros vuelos en dos días, operadores en dos semanas, técnicos en una, e instructores para clientes que formarán a su propia gente.'), href: '/training'},
            {title: L('Engineering', 'Ingeniería'), text: L('Design, prototyping, testing and integration at the centre in Alicante. Bring a sensor or a problem; we will fly something at it.', 'Diseño, prototipado, pruebas e integración en el centro de Alicante. Traiga un sensor o un problema; volaremos algo sobre él.'), href: '/engineering'},
          ]},
        {kind: 'split', eyebrow: L('Field case', 'Caso de campo'), title: L('The engineer stays in the office. The aircraft flies the pipeline.', 'El ingeniero se queda en la oficina. La aeronave vuela la tubería.'),
          body: L(`A technician drives to the start of the section. A case opens on the tailgate. A 15-inch multirotor with a satellite terminal on its back lifts off and follows the line at a set height, stopping at the valve stations and the river crossings. Two provinces away, the engineer responsible for the section watches the thermal feed and the map, and steps in when something looks wrong.

Forty minutes later the aircraft lands beside the vehicle for a battery, and the next leg begins. By evening the flight log, the video and the flagged frames are in the customer\'s system.`,
            `Un técnico conduce hasta el inicio del tramo. Se abre una maleta en el portón. Un multirrotor de 15 pulgadas con un terminal satelital en el lomo despega y sigue la conducción a una altura fija, deteniéndose en las estaciones de válvulas y en los cruces de ríos. A dos provincias de distancia, el ingeniero responsable del tramo mira la señal térmica y el mapa, e interviene cuando algo no cuadra.

Cuarenta minutos después, la aeronave aterriza junto al vehículo para cambiar la batería, y empieza el siguiente tramo. Al anochecer, el registro de vuelo, el vídeo y los fotogramas marcados están en el sistema del cliente.`),
          media: media('case-pipeline', {isVideoPlaceholder: true, alt: L('Satellite-linked multirotor over a pipeline', 'Multirrotor con enlace satelital sobre una tubería')}),
          ctaLabel: L('Pipeline inspection', 'Inspección de tuberías'), ctaHref: '/applications/pipeline-inspection'},
        {kind: 'cards', eyebrow: L('Platforms', 'Plataformas'), title: L('Named by what they are, not by a brand.', 'Nombradas por lo que son, no por una marca.'),
          lead: L('Each class is a size and a link type. Pick by the job: how far, how long, how heavy, and whether radio is allowed to exist where you fly.', 'Cada clase es un tamaño y un tipo de enlace. Se elige por el trabajo: cuánto de lejos, cuánto tiempo, cuánto peso y si la radio puede existir donde se vuela.'),
          refs: [ref('platform-multirotor-15-satellite'), ref('platform-multirotor-13'), ref('platform-fixed-wing-endurance')],
          ctaLabel: L('All platform types', 'Todas las plataformas'), ctaHref: '/platforms'},
        {kind: 'dark', eyebrow: L('Links', 'Enlaces'), title: L('Radio when it works. Fibre or satellite when it must.', 'Radio cuando funciona. Fibra o satélite cuando hace falta.'),
          lead: L('Most drone problems are link problems. We build three answers into the same airframes.', 'La mayoría de problemas con drones son problemas de enlace. Montamos tres respuestas en las mismas aeronaves.'),
          body: L(`Encrypted radio is the default: cheap, light, and good for thirty to forty-five kilometres with a clear horizon. Where the horizon is not clear, or where nothing may radiate, the 13-inch flies on a spooled optical fibre. Where the operator is far away, the 15 and 17-inch carry a satellite terminal and the ground station stops being a place.

The same operator training covers all three. The same cases carry all three.`,
            `La radio cifrada es lo habitual: barata, ligera y válida para treinta a cuarenta y cinco kilómetros con horizonte despejado. Donde el horizonte no está despejado, o donde nada puede emitir, el de 13 pulgadas vuela con una bobina de fibra óptica. Donde el operador está lejos, el de 15 y el de 17 pulgadas llevan un terminal satelital y la estación de tierra deja de ser un lugar.

La misma formación de operador cubre los tres. Las mismas maletas transportan los tres.`),
          media: media('dark-antenna', {alt: L('Satellite terminal on a drone frame', 'Terminal satelital sobre el chasis de un dron')}),
          stats: [stat('45 km', 'radio, clear horizon', 'radio, horizonte despejado'), stat('30 km', 'on optical fibre', 'por fibra óptica'), stat('∞', 'over satellite', 'por satélite'), stat('55 min', 'longest rotary endurance', 'mayor autonomía en rotor')]},
        {kind: 'split', reverse: true, eyebrow: L('Engineering', 'Ingeniería'), title: L('Worked out in Alicante, built in series in the Netherlands.', 'Resuelto en Alicante, fabricado en serie en los Países Bajos.'),
          body: L(`ALICRON is the engineering company of a European unmanned-systems group. Designs are drawn, prototyped, flown and taught here, on the coast of Alicante. Serial production runs at the group\'s plant in the Netherlands. Customers get an engineering team they can visit and a factory that ships on schedule.

The workshop has printers, a small machine shop, an electronics bench and a flight field ten minutes away. Most of what is on this site started as something a customer asked for.`,
            `ALICRON es la empresa de ingeniería de un grupo europeo de sistemas no tripulados. Los diseños se dibujan, se prototipan, se vuelan y se enseñan aquí, en la costa de Alicante. La producción en serie se hace en la planta del grupo en los Países Bajos. Los clientes tienen un equipo de ingeniería al que pueden visitar y una fábrica que entrega a tiempo.

El taller tiene impresoras, un pequeño taller mecánico, un banco de electrónica y un campo de vuelo a diez minutos. Casi todo lo que hay en esta web empezó como algo que pidió un cliente.`),
          media: media('engineering-lab', {alt: L('Engineer at a workbench with a drone frame', 'Ingeniero en un banco de trabajo con el chasis de un dron')}),
          ctaLabel: L('About the company', 'Sobre la empresa'), ctaHref: '/company'},
        {kind: 'cta', title: L('Tell us what you need to see, and from where.', 'Cuéntenos qué necesita ver, y desde dónde.'),
          lead: L('We reply within a working day, in Spanish or English, with the questions we need answered before proposing anything.', 'Respondemos en un día laborable, en español o en inglés, con las preguntas que necesitamos aclarar antes de proponer nada.'),
          ctaLabel: L('Contact', 'Contacto'), ctaHref: '/contact'},
      ]},

    {_id: 'page-platforms', _type: 'page', slug: {current: 'platforms'},
      title: L('Platforms', 'Plataformas'), metaDescription: L('Multirotor and fixed-wing unmanned aircraft by class: size, endurance, payload and link type.', 'Aeronaves no tripuladas multirrotor y de ala fija por clase: tamaño, autonomía, carga útil y tipo de enlace.'),
      heroEyebrow: L('Platforms', 'Plataformas'),
      heroTitle: L('Seven airframes. Three kinds of link. One set of cases, batteries and training.', 'Siete aeronaves. Tres tipos de enlace. Un solo juego de maletas, baterías y formación.'),
      heroLead: L('We name platforms by what they are: the propeller size for multirotors, the role for fixed-wings. The figures below are class figures from the current configurations; the detail pages say what each was measured with.',
        'Nombramos las plataformas por lo que son: el tamaño de hélice en los multirrotores, la función en las alas fijas. Las cifras son de clase, de las configuraciones actuales; las páginas de detalle dicen con qué se midió cada una.'),
      heroMedia: media('p-15sat', {alt: L('15-inch multirotor with a satellite terminal', 'Multirrotor de 15 pulgadas con terminal satelital')}),
      sections: [
        {kind: 'stats', eyebrow: L('Across the line', 'En toda la línea'), title: L('Where the numbers sit.', 'Dónde están los números.'),
          stats: [stat('40 to 55 min', 'rotary endurance', 'autonomía en rotor'), stat('90 min', 'fixed-wing endurance', 'autonomía en ala fija'), stat('1 to 5 kg', 'payload', 'carga útil'), stat('30 to 60 km', 'operating range', 'alcance')]},
        {kind: 'prose', eyebrow: L('How to choose', 'Cómo elegir'), title: L('Start with the link, then the endurance, then the weight.', 'Empiece por el enlace, luego la autonomía y después el peso.'),
          body: L(`If radio can exist where you fly and the horizon is clear, any airframe works and you choose by endurance and payload. If nothing may radiate, or the picture must stay clean inside a plant or a tunnel, the 13-inch on fibre is the answer. If the operator is far from the aircraft, or one person must cover several sites in a day, the satellite-linked 15 and 17-inch take the ground station out of the equation.

Fixed-wings cover distance. The survey aircraft is for lines and areas; the high-speed aircraft, still in development, is for getting somewhere fast and looking.

Every platform ships with a serial number, a test card and a flight log. Spares, batteries and training are shared across the line, so a fleet with three classes is not three fleets.`,
            `Si la radio puede existir donde vuela y el horizonte está despejado, cualquier aeronave sirve y se elige por autonomía y carga útil. Si nada puede emitir, o la imagen debe seguir limpia dentro de una planta o un túnel, la respuesta es el de 13 pulgadas con fibra. Si el operador está lejos de la aeronave, o una persona debe cubrir varios emplazamientos en un día, el de 15 y el de 17 pulgadas con enlace satelital sacan la estación de tierra de la ecuación.

Las alas fijas cubren distancia. La aeronave de levantamiento es para líneas y áreas; la de alta velocidad, todavía en desarrollo, es para llegar rápido a un sitio y mirar.

Cada plataforma se entrega con número de serie, ficha de pruebas y registro de vuelo. Repuestos, baterías y formación se comparten en toda la línea, así que una flota con tres clases no son tres flotas.`)},
      ]},

    {_id: 'page-applications', _type: 'page', slug: {current: 'applications'},
      title: L('Applications', 'Aplicaciones'), metaDescription: L('Pipeline inspection, crop monitoring, power lines, emergency response and mapping with unmanned aircraft.', 'Inspección de tuberías, seguimiento de cultivos, líneas eléctricas, emergencias y cartografía con aeronaves no tripuladas.'),
      heroEyebrow: L('Applications', 'Aplicaciones'),
      heroTitle: L('Five jobs we do every week.', 'Cinco trabajos que hacemos cada semana.'),
      heroLead: L('Each page describes the job the way we would describe it to a new operator: what happens, who is where, and what the customer has at the end of the day.', 'Cada página describe el trabajo como se lo contaríamos a un operador nuevo: qué pasa, quién está dónde y qué tiene el cliente al final del día.'),
      sections: [
        {kind: 'cta', title: L('A job that is not on this list?', '¿Un trabajo que no está en la lista?'),
          lead: L('Most of the list started that way. Describe it and we will tell you honestly whether an aircraft is the right tool.', 'Casi toda la lista empezó así. Descríbalo y le diremos con franqueza si una aeronave es la herramienta adecuada.'),
          ctaLabel: L('Contact', 'Contacto'), ctaHref: '/contact'},
      ]},

    {_id: 'page-software', _type: 'page', slug: {current: 'software'},
      title: L('Software and robotics', 'Software y robótica'), metaDescription: L('Mission software for the ground station, on-board vision and a control suite for ground robots.', 'Software de misión para la estación de tierra, visión a bordo y un sistema de control para robots terrestres.'),
      heroEyebrow: L('Software and robotics', 'Software y robótica'),
      heroTitle: L('The aircraft is half the product. The other half runs on the ground station.', 'La aeronave es la mitad del producto. La otra mitad se ejecuta en la estación de tierra.'),
      heroLead: L('We write the software that plans the route, keeps the link alive, reads the video and, increasingly, drives things that do not fly.', 'Escribimos el software que planifica la ruta, mantiene vivo el enlace, lee el vídeo y, cada vez más, conduce cosas que no vuelan.'),
      sections: [
        {kind: 'dark', eyebrow: L('Robotics', 'Robótica'), title: L('One operator, one map, air and ground.', 'Un operador, un mapa, aire y tierra.'),
          lead: L('The ground robot control suite reuses the mission software, so the skill transfers.', 'El sistema de control de robots terrestres reutiliza el software de misión, así que la habilidad se transfiere.'),
          body: L('An operator who can plan and fly a route on the ground station can drive a wheeled robot along one with the same tools. Teleoperation, waypoints, payload control. The suite is in development at the R&D centre with a partner platform and will be released after a season of real work.',
            'Un operador que sabe planificar y volar una ruta en la estación de tierra puede conducir un robot con ruedas por una con las mismas herramientas. Teleoperación, puntos de ruta, control de carga útil. El sistema está en desarrollo en el centro de I+D con la plataforma de un socio y se publicará tras una temporada de trabajo real.'),
          media: media('software-ugv', {alt: L('Field robot between rows of orange trees', 'Robot de campo entre hileras de naranjos')})},
      ]},

    {_id: 'page-training', _type: 'page', slug: {current: 'training'},
      title: L('Training', 'Formación'), metaDescription: L('First flights, operator, technical and instructor courses at the Alicante centre or on site.', 'Primeros vuelos y cursos de operador, técnico e instructor en el centro de Alicante o en las instalaciones del cliente.'),
      heroEyebrow: L('Training', 'Formación'),
      heroTitle: L('Nobody flies our aircraft without flying with us first.', 'Nadie vuela nuestras aeronaves sin volar antes con nosotros.'),
      heroLead: L('Four courses, small groups, real airframes, and the same checklists we use on paid work. In Spanish or English, at the airfield near Alicante or at your site.', 'Cuatro cursos, grupos pequeños, aeronaves reales y las mismas listas de comprobación que usamos en trabajos de pago. En español o en inglés, en el campo de vuelo cerca de Alicante o en sus instalaciones.'),
      heroMedia: media('training-field', {isVideoPlaceholder: true, alt: L('Instructor and trainees with controllers on an airfield', 'Instructor y alumnos con mandos en un campo de vuelo'), caption: L('A morning of first flights. Film in production.', 'Una mañana de primeros vuelos. Película en producción.')}),
      sections: [
        {kind: 'stats', eyebrow: L('How a course runs', 'Cómo funciona un curso'), title: L('Small on purpose.', 'Pequeño a propósito.'),
          stats: [stat('4', 'trainees per instructor', 'alumnos por instructor'), stat('2', 'languages', 'idiomas'), stat('7', 'airframes to fly', 'aeronaves para volar'), stat('1', 'checklist, the real one', 'lista de comprobación, la de verdad')]},
      ]},

    {_id: 'page-engineering', _type: 'page', slug: {current: 'engineering'},
      title: L('Engineering', 'Ingeniería'), metaDescription: L('Design, prototyping, testing and integration of unmanned aircraft at the Alicante centre.', 'Diseño, prototipado, pruebas e integración de aeronaves no tripuladas en el centro de Alicante.'),
      heroEyebrow: L('Engineering', 'Ingeniería'),
      heroTitle: L('Bring a sensor or a problem. We will fly something at it.', 'Traiga un sensor o un problema. Volaremos algo sobre él.'),
      heroLead: L('The centre in Alicante designs, builds, tests and integrates. Serial production is at the group plant in the Netherlands. Here is where things get worked out first.', 'El centro de Alicante diseña, construye, prueba e integra. La producción en serie está en la planta del grupo en los Países Bajos. Aquí es donde las cosas se resuelven primero.'),
      heroMedia: media('engineering-test', {alt: L('Fixed-wing aircraft on a launch rail at sunrise', 'Aeronave de ala fija en un raíl de lanzamiento al amanecer')}),
      sections: []},

    {_id: 'page-company', _type: 'page', slug: {current: 'company'},
      title: L('Company', 'Empresa'), metaDescription: L('ALICRON is the Spanish engineering company of a European unmanned-systems group, based in Alicante.', 'ALICRON es la empresa de ingeniería española de un grupo europeo de sistemas no tripulados, con sede en Alicante.'),
      heroEyebrow: L('Company', 'Empresa'),
      heroTitle: L('A small engineering company on the coast of Alicante, inside a European group.', 'Una pequeña empresa de ingeniería en la costa de Alicante, dentro de un grupo europeo.'),
      heroLead: L('We build unmanned aircraft and the software around them for people who inspect, measure, farm and respond. Everything we sell, we fly ourselves first.', 'Construimos aeronaves no tripuladas y el software que las rodea para quienes inspeccionan, miden, cultivan y responden a emergencias. Todo lo que vendemos lo volamos antes nosotros.'),
      heroMedia: media('company-alicante', {alt: L('The ALICRON building near Alicante', 'El edificio de ALICRON cerca de Alicante')}),
      sections: [
        {kind: 'prose', eyebrow: L('Who we are', 'Quiénes somos'), title: L('Engineers who fly.', 'Ingenieros que vuelan.'),
          body: L(`ALICRON was set up in Spain as the engineering company of a European unmanned-systems group. The group manufactures in series in the Netherlands; ALICRON is where designs are drawn, prototyped, tested and taught. The team is aeronautical and electronics engineers, software developers and instructors, several of whom came to drones from designing full-size aircraft.

We work in Spanish and English, and in Ukrainian, because a good part of the group\'s engineering experience comes from there. We are a comfortable partner for Spanish-speaking customers in Europe and Latin America who want a European company they can visit, call and hold to account.

We are small and we intend to stay useful rather than large. If you need a hundred aircraft next month, the group\'s plant can do that. If you need the right aircraft for a job nobody has done before, that is us.`,
            `ALICRON se constituyó en España como la empresa de ingeniería de un grupo europeo de sistemas no tripulados. El grupo fabrica en serie en los Países Bajos; ALICRON es donde los diseños se dibujan, se prototipan, se prueban y se enseñan. El equipo lo forman ingenieros aeronáuticos y de electrónica, desarrolladores de software e instructores, varios de los cuales llegaron a los drones desde el diseño de aeronaves de tamaño real.

Trabajamos en español y en inglés, y en ucraniano, porque buena parte de la experiencia de ingeniería del grupo viene de allí. Somos un socio cómodo para clientes hispanohablantes de Europa y América Latina que quieren una empresa europea a la que poder visitar, llamar y pedir cuentas.

Somos pequeños y pretendemos seguir siendo útiles antes que grandes. Si necesita cien aeronaves el mes que viene, la planta del grupo puede hacerlo. Si necesita la aeronave adecuada para un trabajo que nadie ha hecho antes, esos somos nosotros.`)},
        {kind: 'features', eyebrow: L('How we work', 'Cómo trabajamos'), title: L('Four habits.', 'Cuatro costumbres.'),
          features: [
            {title: L('Measured, not hoped', 'Medido, no esperado'), text: L('Every figure we publish was measured in a stated configuration. When a number changes, the page changes.', 'Cada cifra que publicamos se midió en una configuración declarada. Cuando un número cambia, la página cambia.')},
            {title: L('Flown before shipped', 'Volado antes de entregado'), text: L('Every airframe has a serial number and a flight test card. Every design flies for months before it is a product.', 'Cada aeronave tiene número de serie y ficha de prueba de vuelo. Cada diseño vuela meses antes de ser producto.')},
            {title: L('One set of everything', 'Un solo juego de todo'), text: L('Cases, batteries, spares and training are shared across the line. A fleet with three classes is one fleet.', 'Maletas, baterías, repuestos y formación se comparten en toda la línea. Una flota con tres clases es una sola flota.')},
            {title: L('Reachable', 'Localizables'), text: L('A named engineer for every customer, a phone that is answered, a workshop you can visit.', 'Un ingeniero con nombre para cada cliente, un teléfono que se contesta, un taller que se puede visitar.')},
          ]},
        {kind: 'dark', eyebrow: L('The group', 'El grupo'), title: L('Engineering in Spain. Manufacturing in the Netherlands.', 'Ingeniería en España. Fabricación en los Países Bajos.'),
          lead: L('Two sites, one product line, one quality system.', 'Dos sedes, una línea de producto, un sistema de calidad.'),
          body: L('The group was set up to bring a proven line of unmanned aircraft to European and Latin American customers under European engineering, manufacturing and quality control. ALICRON is its Spanish engineering company. The Netherlands plant handles serial production, quality control and logistics.',
            'El grupo se creó para llevar una línea probada de aeronaves no tripuladas a clientes europeos y latinoamericanos bajo ingeniería, fabricación y control de calidad europeos. ALICRON es su empresa de ingeniería en España. La planta de los Países Bajos se ocupa de la producción en serie, el control de calidad y la logística.'),
          media: media('dark-carbon', {alt: L('Carbon fibre drone arm and motor', 'Brazo de fibra de carbono y motor de un dron')}),
          stats: [stat('2', 'sites', 'sedes'), stat('7', 'airframe classes', 'clases de aeronave'), stat('3', 'working languages', 'idiomas de trabajo'), stat('1', 'quality system', 'sistema de calidad')]},
        {kind: 'cta', title: L('Come and see the workshop.', 'Venga a ver el taller.'),
          lead: L('Visits by appointment. Alicante airport is a short drive away.', 'Visitas con cita previa. El aeropuerto de Alicante está a poca distancia.'),
          ctaLabel: L('Contact', 'Contacto'), ctaHref: '/contact'},
      ]},

    {_id: 'page-contact', _type: 'page', slug: {current: 'contact'},
      title: L('Contact', 'Contacto'), metaDescription: L('Write to ALICRON in Alicante, Spain.', 'Escriba a ALICRON en Alicante, España.'),
      heroEyebrow: L('Contact', 'Contacto'),
      heroTitle: L('Say what you need to see, and from where.', 'Diga qué necesita ver, y desde dónde.'),
      heroLead: L('One email is enough to start. We answer within a working day.', 'Con un correo basta para empezar. Respondemos en un día laborable.'),
      sections: []},

    {_id: 'page-privacy', _type: 'page', slug: {current: 'privacy'},
      title: L('Privacy', 'Privacidad'), metaDescription: L('How ALICRON handles personal data on this website.', 'Cómo trata ALICRON los datos personales en esta web.'),
      heroEyebrow: L('Legal', 'Legal'),
      heroTitle: L('Privacy notice', 'Aviso de privacidad'),
      sections: [
        {kind: 'prose', title: L('What this site collects', 'Qué recoge esta web'),
          body: L(`This website does not use analytics or advertising cookies. The only cookie it sets is the one that remembers you have entered the access password, and it holds no personal data.

If you write to us by email, we keep the correspondence for as long as the conversation and any resulting work require, and we do not pass it to anyone outside the group. You can ask us to delete it at any time by writing to the same address.

ALICRON is the data controller for this website. Its registered details will be listed here when the site opens to the public.`,
            `Esta web no utiliza cookies de analítica ni de publicidad. La única cookie que establece es la que recuerda que ha introducido la contraseña de acceso, y no contiene datos personales.

Si nos escribe por correo electrónico, conservamos la correspondencia mientras lo requieran la conversación y el trabajo que se derive, y no la cedemos a nadie fuera del grupo. Puede pedirnos que la borremos en cualquier momento escribiendo a la misma dirección.

ALICRON es la responsable del tratamiento de esta web. Sus datos registrales figurarán aquí cuando la web se abra al público.`)},
      ]},
  ]

  return [settings, ...platforms, ...applications, ...offerings, ...pages]
}

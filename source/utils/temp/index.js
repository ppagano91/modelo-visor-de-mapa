// Esta función es temporal y debe ser reemplazada por la descripción creada para cada Grupo en Geonetwork.
export const findSectionDescription = (section)  => {
    let description;
    switch (section) {
        case "transporte":
            description =  "Información sobre la infraestructura de transporte en Buenos Aires, incluyendo vías de circulación, redes de ferrocarril, subte, prematros, metrobús, ciclovías y estaciones relacionadas. Facilita la movilidad y planificación del transporte urbano."
            break;

        case "urbanismo":
            description =  "Datos relacionados con la planificación y uso del suelo en la Ciudad de Buenos Aires, incluyendo parcelas, manzanas, secciones catastrales, barrios, comunas, y más. Utilizado para la gestión y planificación urbana."
            break;

        case "servicios":
            description =  "Información sobre diversos servicios públicos en Buenos Aires, como comisarías, estaciones de bomberos, fiscalías, y servicios comunitarios como ferias y centros de integración laboral. Facilita la localización de servicios esenciales."
            break;

        case "salud":
            description =  "Datos sobre los servicios de salud en Buenos Aires, incluyendo hospitales, centros de salud, farmacias, y vacunatorios. Proporciona información crucial para el acceso y gestión de servicios de salud."
            break;
    
        default:
            description = "Datos relevantes relacionados con diversos aspectos de la Ciudad de Buenos Aires. Puede incluir información sobre infraestructura, planificación urbana, servicios públicos, salud, y más. Útil para la gestión, planificación y acceso a servicios esenciales en la ciudad."
            break;
    }
    return description
}


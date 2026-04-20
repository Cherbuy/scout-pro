export interface Jugador {
  id: string;
  user_id: string;
  nombre_completo: string;
  fecha_nacimiento: string | null;
  pie_dominante: string | null;
  posicion_principal: string | null;
  nacionalidad: string | null;
  club_actual: string | null;
  altura_cm: number | null;
  telefono: string | null;
  email: string | null;
  contacto_familiar: string | null;
  contacto_manager: string | null;
  created_at: string;
  // Perfil Geográfico
  demarcacion_principal: string | null;
  demarcacion_secundaria: string | null;
  zonas_influencia: number[] | null;
  tendencias_movimiento: string | null;
  // Computed
  informes?: Informe[];
  media_tecnica?: number;
  media_fisica?: number;
  media_tactica?: number;
}

export interface Informe {
  id: string;
  jugador_id: string;
  partido_id: string | null;
  fecha_partido: string | null;
  rival: string | null;
  demarcacion_partido: string | null;
  zona_accion: number[];
  tendencias_movimiento: string | null;
  etiquetas: string[];
  metrica_tecnica: number;
  metrica_fisica: number;
  metrica_tactica: number;
  conclusiones: string | null;
  created_at: string;
  jugador?: Jugador;
}

export interface FiltrosJugador {
  posicion?: string;
  pie_dominante?: string;
  etiqueta?: string;
  zona?: number;
  busqueda?: string;
  valoracion_min?: number;
}

export const POSICIONES = [
  "Portero",
  "Lateral Derecho",
  "Lateral Izquierdo",
  "Central",
  "Mediocentro Defensivo",
  "Mediocentro",
  "Mediapunta",
  "Extremo Derecho",
  "Extremo Izquierdo",
  "Delantero Centro",
  "Falso 9",
] as const;

export const ETIQUETAS_PREDEFINIDAS = [
  "#RompeAlEspacio",
  "#Falso9",
  "#CaeABanda",
  "#PivoteSolido",
  "#ElasticoAltoPressing",
  "#LanzaLargo",
  "#RegateEnCorto",
  "#ExcelentePase",
  "#LiderEnAreaPropia",
  "#DefinidorFrio",
  "#AltaIntensidad",
  "#BuenAereo",
  "#RápidoEnTransicion",
  "#Organizador",
  "#MarcaAlHombre",
];

export const ZONAS_CAMPO: { id: number; label: string; descripcion: string }[] = [
  // Portería propia (arriba izq a der)
  { id: 1, label: "Z1", descripcion: "Área propia izquierda" },
  { id: 2, label: "Z2", descripcion: "Área propia central" },
  { id: 3, label: "Z3", descripcion: "Área propia derecha" },
  // Zona defensiva media
  { id: 4, label: "Z4", descripcion: "Defensa izquierda" },
  { id: 5, label: "Z5", descripcion: "Defensa central izquierda" },
  { id: 6, label: "Z6", descripcion: "Defensa central derecha" },
  { id: 7, label: "Z7", descripcion: "Defensa derecha" },
  // Zona media defensiva
  { id: 8, label: "Z8", descripcion: "Medio-defensiva izquierda" },
  { id: 9, label: "Z9", descripcion: "Centro izquierda" },
  { id: 10, label: "Z10", descripcion: "Centro" },
  { id: 11, label: "Z11", descripcion: "Centro derecha" },
  { id: 12, label: "Z12", descripcion: "Medio-defensiva derecha" },
  // Zona media ofensiva
  { id: 13, label: "Z13", descripcion: "Medio-ofensiva izquierda" },
  { id: 14, label: "Z14", descripcion: "Ofensiva izquierda" },
  { id: 15, label: "Z15", descripcion: "Mediapunta" },
  { id: 16, label: "Z16", descripcion: "Ofensiva derecha" },
  { id: 17, label: "Z17", descripcion: "Medio-ofensiva derecha" },
  // Portería rival
  { id: 18, label: "Z18", descripcion: "Área rival izquierda" },
  { id: 19, label: "Z19", descripcion: "Área rival central" },
  { id: 20, label: "Z20", descripcion: "Área rival derecha" },
];

import { MotivationalQuote } from '../types';

export const MOTIVATIONAL_QUOTES: MotivationalQuote[] = [
  {
    quote: "La disciplina tarde o temprano vencerá a la inteligencia.",
    author: "Kenji Orito Yokoi",
    category: "Disciplina"
  },
  {
    quote: "No estudias para aprobar un examen, estudias para construir tu libertad.",
    author: "Enfoque RACHA",
    category: "Mentalidad"
  },
  {
    quote: "El interés compuesto del conocimiento rinde los mayores beneficios.",
    author: "Benjamin Franklin",
    category: "Crecimiento"
  },
  {
    quote: "Un día a la vez. Cada hora de concentración forja la mente que querés tener mañana.",
    author: "Hábitos Imparables",
    category: "Constancia"
  },
  {
    quote: "Somos lo que hacemos día tras día. La excelencia no es un acto, es un hábito.",
    author: "Aristóteles",
    category: "Excelencia"
  },
  {
    quote: "La motivación te pone en marcha, pero la racha te mantiene en el camino.",
    author: "Jim Ryun",
    category: "Constancia"
  },
  {
    quote: "Cuando sientas que querés aflojar, recordá por qué empezaste este viaje.",
    author: "Resiliencia Pura",
    category: "Foco"
  },
  {
    quote: "Pequeñas victorias diarias acumuladas producen resultados colosales.",
    author: "Robin Sharma",
    category: "Progreso"
  },
  {
    quote: "El dolor de la disciplina pesa gramos; el dolor del arrepentimiento pesa toneladas.",
    author: "Jim Rohn",
    category: "Disciplina"
  },
  {
    quote: "No busques tener ganas para estudiar: estudiá y las ganas van a llegar con el progreso.",
    author: "Acción Primero",
    category: "Productividad"
  },
  {
    quote: "El secreto de salir adelante es simplemente empezar.",
    author: "Mark Twain",
    category: "Inicio"
  },
  {
    quote: "Hoy diste el paso que el 90% postergó para el lunes. Tu racha habla por vos.",
    author: "Comunidad RACHA",
    category: "Orgullo"
  },
  {
    quote: "La mente que se abre a un nuevo aprendizaje jamás vuelve a su tamaño original.",
    author: "Albert Einstein",
    category: "Sabiduría"
  },
  {
    quote: "No se trata de ser perfecto, se trata de ser consistente día tras día.",
    author: "Mentalidad de Acero",
    category: "Hábitos"
  },
  {
    quote: "Tu futuro yo te va a agradecer los minutos de estudio que le dedicaste hoy.",
    author: "Visión",
    category: "Constancia"
  },
  {
    quote: "El talento sin dedicación es solo potencial desperdiciado. Vos elegiste actuar.",
    author: "Esfuerzo Consciente",
    category: "Acción"
  },
  {
    quote: "Protegé tu racha como oro: es la prueba viva de tu compromiso personal.",
    author: "Filosofía RACHA",
    category: "Racha"
  },
  {
    quote: "El éxito es la suma de pequeños esfuerzos repetidos día tras día.",
    author: "Robert Collier",
    category: "Constancia"
  },
  {
    quote: "El conocimiento es el único activo que nadie te puede arrebatar.",
    author: "B.B. King",
    category: "Valor"
  },
  {
    quote: "Cada página leída y cada problema resuelto es un ladrillo más en tu futuro.",
    author: "Construcción Diaria",
    category: "Foco"
  },
  {
    quote: "No cuentes los días, hacé que los días cuenten.",
    author: "Muhammad Ali",
    category: "Impacto"
  }
];

export function getRandomQuoteIndex(excludeIndex?: number): number {
  if (MOTIVATIONAL_QUOTES.length <= 1) return 0;
  let newIndex: number;
  do {
    newIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
  } while (newIndex === excludeIndex);
  return newIndex;
}

import React, { useState } from 'react';

// Datos cargados directamente
const charactersData = [
  {
    id: "char-1",
    name: "Sugasano Allen",
    group: "BAE",
    role: "Estudiante",
    academicLevel: "2do año, curso general, Clase C",
    club: "Presidente del club de hip-hop",
    council: "N/A",
    description: "Un presidente del club de hip-hop que aspira a que el club llegue a la cima una vez que se gradúen.",
    image: "https://i.imgur.com/c0rngvV.jpeg"
  },
  {
    id: "char-2",
    name: "Yeon Hajun",
    group: "BAE",
    role: "Estudiante",
    academicLevel: "2do año, curso avanzado",
    club: "Club de tenis",
    council: "Presidente del consejo estudiantil de la escuela secundaria",
    description: "El noble sonriente que dirige la escuela como si fuera su propio castillo.",
    image: "https://i.imgur.com/GqXpiP8.jpeg"
  },
  {
    id: "char-3",
    name: "Anne Faulkner",
    group: "BAE",
    role: "Estudiante",
    academicLevel: "2do año, curso general, Clase B",
    club: "Presidenta del club de sastrería",
    council: "Comité ejecutivo del festival cultural",
    description: "Un influencer abrumadoramente popular.",
    image: "https://i.imgur.com/cPsipv2.jpeg"
  },
  {
    id: "char-4",
    name: "Yatonokami Kanata",
    group: "cozmez",
    role: "Estudiante",
    academicLevel: "2do año, curso general, Clase C",
    club: "No está en ningún club",
    council: "N/A",
    description: "Una persona que no tiene miedo de arriesgarse, solo se presenta los días que son necesarios para no reprobar.",
    image: "https://i.imgur.com/xh6HHYD.jpeg"
  },
  {
    id: "char-5",
    name: "Yatonokami Nayuta",
    group: "cozmez",
    role: "Estudiante",
    academicLevel: "2do año, curso general, Clase B",
    club: "No está en ningún club",
    council: "N/A",
    description: "Es el holgazán de clase S más poderoso en la historia de la escuela.",
    image: "https://i.imgur.com/n8a52Et.jpeg"
  },
  {
    id: "char-6",
    name: "Saimon Naoakira",
    group: "The Cat's Whiskers",
    role: "Profesor de japonés",
    academicLevel: "Curso avanzado de secundaria, primeros años",
    club: "Asesor del club de teatro",
    description: "Un guardián del tiempo cuya hermosa voz atrajo a miles de estudiantes a una tierra de los sueños.",
    image: "https://i.imgur.com/93kdqP2.jpeg"
  },
  {
    id: "char-7",
    name: "Kanbayashi Yohei",
    group: "The Cat's Whiskers",
    role: "Jefe de conserjes",
    club: "No afiliado",
    description: "Es el guardián de la escuela, siempre está armado con alcohol y cigarrillos.",
    image: "https://i.imgur.com/39Pxn9V.jpeg"
  },
  {
    id: "char-8",
    name: "Natsume Ryu",
    group: "The Cat's Whiskers",
    role: "Estudiante",
    description: "Un excelente ejemplo de una persona que se supone que ya se ha graduado, pero aún así aparece en el campus todos los días.",
    image: "https://i.imgur.com/601gh5F.jpeg"
  },
  {
    id: "char-9",
    name: "Ando Shiki",
    group: "The Cat's Whiskers",
    role: "Estudiante",
    academicLevel: "1er año, curso avanzado",
    club: "Club de fútbol",
    description: "Es un niño con buena salud y es tan serio que da miedo.",
    image: "https://i.imgur.com/yc5snxU.jpeg"
  },
  {
    id: "char-10",
    name: "Suiseki Iori",
    group: "Akanyatsura",
    role: "Profesor de matemáticas",
    academicLevel: "Curso general de secundaria, 3er año, clase F",
    club: "Asesor del club de baloncesto",
    description: "Es un completo demonio de cálculo mental que inculca en las cabezas de sus alumnos un espíritu temerario.",
    image: "https://i.imgur.com/TmlS4Q5.jpeg"
  },
  {
    id: "char-11",
    name: "Gaho Zen",
    group: "Akanyatsura",
    role: "Profesor de educación física",
    academicLevel: "Curso general de secundaria, 2º año, clase C",
    club: "Asesor del club de judo",
    description: "Es un gran fanfarrón con los bíceps, y tiene los músculos más voluminosos de la escuela.",
    image: "https://i.imgur.com/SDVJOq3.jpeg"
  },
  {
    id: "char-12",
    name: "Masaki Hokusai",
    group: "Akanyatsura",
    role: "Estudiante",
    academicLevel: "3er año, curso general, Clase D",
    club: "Club de tiro con arco",
    description: "Es un gigante gentil que prefiere pasar tiempo en el patio con los gatos en lugar de asistir a clases.",
    image: "https://i.imgur.com/rJJIj9C.jpeg"
  }
];

const chaptersData = [
  {
    id: "cap-1",
    number: 1,
    title: "Capítulo 1",
    pages: []
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'manga' | 'characters'>('home');
  const [selectedChapter, setSelectedChapter] = useState<any | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navegación Superior */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            PARADOX LIVE LATAM
          </h1>
          <nav className="flex gap-4 text-sm font-medium">
            <button 
              onClick={() => { setActiveTab('home'); setSelectedChapter(null); }}
              className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'home' ? 'bg-purple-600 text-white' : 'hover:text-purple-400'}`}
            >
              Inicio
            </button>
            <button 
              onClick={() => { setActiveTab('manga'); setSelectedChapter(null); }}
              className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'manga' ? 'bg-purple-600 text-white' : 'hover:text-purple-400'}`}
            >
              Manga ({chaptersData.length})
            </button>
            <button 
              onClick={() => { setActiveTab('characters'); setSelectedChapter(null); }}
              className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'characters' ? 'bg-purple-600 text-white' : 'hover:text-purple-400'}`}
            >
              Personajes ({charactersData.length})
            </button>
          </nav>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6">
        {selectedChapter ? (
          <div className="space-y-6">
            <button 
              onClick={() => setSelectedChapter(null)} 
              className="text-purple-400 hover:underline text-sm font-semibold"
            >
              ← Volver a la lista de capítulos
            </button>
            <h2 className="text-2xl font-bold">Capítulo {selectedChapter.number}: {selectedChapter.title}</h2>
            {selectedChapter.pages && selectedChapter.pages.length > 0 ? (
              <div className="space-y-4 max-w-2xl mx-auto">
                {selectedChapter.pages.map((imgUrl: string, idx: number) => (
                  <img key={idx} src={imgUrl} alt={`Página ${idx + 1}`} className="w-full rounded shadow-lg" />
                ))}
              </div>
            ) : (
              <p className="text-slate-400 py-10 text-center">Próximamente se cargarán las imágenes de este capítulo.</p>
            )}
          </div>
        ) : activeTab === 'home' ? (
          <div className="space-y-8 py-10 text-center">
            <div className="max-w-2xl mx-auto space-y-4">
              <h2 className="text-4xl font-extrabold tracking-tight">Bienvenido a Paradox Live LATAM</h2>
              <p className="text-slate-400">
                Tu plataforma dedicada al universo de Paradox Live en español. Explora los mangas oficiales traducidos y conoce las fichas de los equipos.
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => setActiveTab('manga')}
                className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition"
              >
                Leer Manga
              </button>
              <button 
                onClick={() => setActiveTab('characters')}
                className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-bold transition"
              >
                Ver Personajes
              </button>
            </div>
          </div>
        ) : activeTab === 'manga' ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold border-b border-slate-800 pb-2">Capítulos Disponibles</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {chaptersData.map((chap) => (
                <div 
                  key={chap.id}
                  onClick={() => setSelectedChapter(chap)}
                  className="bg-slate-900 border border-slate-800 hover:border-purple-500 p-4 rounded-xl cursor-pointer transition flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold text-lg">Capítulo {chap.number}</h3>
                    <p className="text-slate-400 text-sm">{chap.title}</p>
                  </div>
                  <span className="text-purple-400 text-sm font-semibold">Leer →</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold border-b border-slate-800 pb-2">Personajes ({charactersData.length})</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {charactersData.map((char) => (
                <div key={char.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between">
                  {char.image && (
                    <div className="w-full h-72 bg-slate-800 overflow-hidden">
                      <img 
                        src={char.image} 
                        alt={char.name} 
                        className="w-full h-full object-cover object-top hover:scale-105 transition duration-300"
                      />
                    </div>
                  )}
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-xl text-purple-300">{char.name}</h3>
                        <span className="bg-purple-950 text-purple-300 text-xs px-2.5 py-1 rounded-full border border-purple-800 font-semibold">
                          {char.group}
                        </span>
                      </div>
                      
                      <div className="text-xs text-slate-400 space-y-1 mb-3">
                        {char.role && <p><span className="text-slate-500">Rol/Puesto:</span> {char.role}</p>}
                        {char.academicLevel && <p><span className="text-slate-500">Nivel:</span> {char.academicLevel}</p>}
                        {char.club && <p><span className="text-slate-500">Club:</span> {char.club}</p>}
                      </div>

                      <p className="text-sm text-slate-300">{char.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        Paradox Live LATAM — Proyecto Fan Translation
      </footer>
    </div>
  );
}

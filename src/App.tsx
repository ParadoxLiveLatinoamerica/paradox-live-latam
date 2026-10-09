import React, { useState } from 'react';

const charactersData = [
  {
    id: 1,
    name: "Sugasano Allen",
    group: "BAE",
    role: "Estudiante",
    academicLevel: "2do año, curso general, Clase C",
    club: "Presidente del club de hip-hop",
    description: "Un presidente del club de hip-hop que aspira a que el club llegue a la cima una vez que se gradúen.",
    image: "https://i.imgur.com/c0rngvV.jpeg"
  },
  {
    id: 2,
    name: "Yeon Hajun",
    group: "BAE",
    role: "Estudiante",
    academicLevel: "2do año, curso avanzado",
    club: "Club de tenis",
    description: "El noble sonriente que dirige la escuela como si fuera su propio castillo.",
    image: "https://i.imgur.com/GqXpiP8.jpeg"
  },
  {
    id: 3,
    name: "Anne Faulkner",
    group: "BAE",
    role: "Estudiante",
    academicLevel: "2do año, curso general, Clase B",
    club: "Presidenta del club de sastrería",
    description: "Un influencer abrumadoramente popular.",
    image: "https://i.imgur.com/cPsipv2.jpeg"
  },
  {
    id: 4,
    name: "Yatonokami Kanata",
    group: "cozmez",
    role: "Estudiante",
    academicLevel: "2do año, curso general, Clase C",
    club: "No está en ningún club",
    description: "Una persona que no tiene miedo de arriesgarse, solo se presenta los días necesarios para no reprobar.",
    image: "https://i.imgur.com/xh6HHYD.jpeg"
  },
  {
    id: 5,
    name: "Yatonokami Nayuta",
    group: "cozmez",
    role: "Estudiante",
    academicLevel: "2do año, curso general, Clase B",
    club: "No está en ningún club",
    description: "Es el holgazán de clase S más poderoso en la historia de la escuela.",
    image: "https://i.imgur.com/n8a52Et.jpeg"
  },
  {
    id: 6,
    name: "Saimon Naoakira",
    group: "The Cat's Whiskers",
    role: "Profesor de japonés",
    academicLevel: "Curso avanzado, primeros años",
    club: "Asesor del club de teatro",
    description: "Un guardián del tiempo cuya hermosa voz atrajo a miles de estudiantes a una tierra de los sueños.",
    image: "https://i.imgur.com/93kdqP2.jpeg"
  },
  {
    id: 7,
    name: "Kanbayashi Yohei",
    group: "The Cat's Whiskers",
    role: "Jefe de conserjes",
    club: "No afiliado",
    description: "Es el guardián de la escuela, siempre está armado con alcohol y cigarrillos.",
    image: "https://i.imgur.com/39Pxn9V.jpeg"
  },
  {
    id: 8,
    name: "Natsume Ryu",
    group: "The Cat's Whiskers",
    role: "Estudiante",
    academicLevel: "?",
    club: "?",
    description: "Un excelente ejemplo de una persona que se supone que ya se ha graduado, pero aún así aparece en el campus todos los días.",
    image: "https://i.imgur.com/601gh5F.jpeg"
  },
  {
    id: 9,
    name: "Ando Shiki",
    group: "The Cat's Whiskers",
    role: "Estudiante",
    academicLevel: "1er año, curso avanzado",
    club: "Club de fútbol",
    description: "Es un niño con buena salud y es tan serio que da miedo.",
    image: "https://i.imgur.com/yc5snxU.jpeg"
  },
  {
    id: 10,
    name: "Suiseki Iori",
    group: "Akanyatsura",
    role: "Profesor de matemáticas",
    academicLevel: "Curso general, 3er año, clase F",
    club: "Asesor del club de baloncesto",
    description: "Es un completo demonio de cálculo mental que inculca en las cabezas de sus alumnos un espíritu temerario.",
    image: "https://i.imgur.com/TmlS4Q5.jpeg"
  },
  {
    id: 11,
    name: "Gaho Zen",
    group: "Akanyatsura",
    role: "Profesor de educación física",
    academicLevel: "Curso general, 2º año, clase C",
    club: "Asesor del club de judo",
    description: "Es un gran fanfarrón con los bíceps, y tiene los músculos más voluminosos de la escuela.",
    image: "https://i.imgur.com/SDVJOq3.jpeg"
  },
  {
    id: 12,
    name: "Masaki Hokusai",
    group: "Akanyatsura",
    role: "Estudiante",
    academicLevel: "3er año, curso general, Clase D",
    club: "Club de tiro con arco",
    description: "Es un gigante gentil que prefiere pasar tiempo en el patio con los gatos en lugar de asistir a clases.",
    image: "https://i.imgur.com/rJJIj9C.jpeg"
  },
  {
    id: 13,
    name: "Maruyama Reo",
    group: "Akanyatsura",
    role: "Estudiante",
    academicLevel: "1er año, curso general",
    club: "Club de hip-hop",
    description: "Miembro de Akanyatsura.",
    image: "https://i.imgur.com/rJJIj9C.jpeg"
  }
];

const chaptersData = [
  {
    id: 1,
    number: 1,
    title: "Capítulo 1: Stage Battle",
    pages: [
      "https://i.imgur.com/c0rngvV.jpeg",
      "https://i.imgur.com/GqXpiP8.jpeg"
    ]
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'manga' | 'characters'>('home');
  const [selectedChapter, setSelectedChapter] = useState<any | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      {/* Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-lg md:text-xl font-extrabold tracking-wider bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            PARADOX LIVE LATAM
          </h1>
          <nav className="flex gap-2 md:gap-4 text-sm font-medium">
            <button 
              onClick={() => { setActiveTab('home'); setSelectedChapter(null); }}
              className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'home' ? 'bg-purple-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
            >
              Inicio
            </button>
            <button 
              onClick={() => { setActiveTab('manga'); setSelectedChapter(null); }}
              className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'manga' ? 'bg-purple-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
            >
              Manga ({chaptersData.length})
            </button>
            <button 
              onClick={() => { setActiveTab('characters'); setSelectedChapter(null); }}
              className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'characters' ? 'bg-purple-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
            >
              Personajes ({charactersData.length})
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6">
        {selectedChapter ? (
          <div className="space-y-6">
            <button 
              onClick={() => setSelectedChapter(null)} 
              className="text-purple-400 hover:underline text-sm font-semibold flex items-center gap-1"
            >
              ← Volver a la lista de capítulos
            </button>
            <h2 className="text-2xl font-bold">Capítulo {selectedChapter.number}: {selectedChapter.title}</h2>
            <div className="space-y-4 max-w-2xl mx-auto">
              {selectedChapter.pages.map((imgUrl: string, idx: number) => (
                <img key={idx} src={imgUrl} alt={`Página ${idx + 1}`} className="w-full rounded-xl shadow-2xl border border-slate-800" />
              ))}
            </div>
          </div>
        ) : activeTab === 'home' ? (
          <div className="space-y-8 py-16 text-center">
            <div className="max-w-2xl mx-auto space-y-4">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Bienvenido a Paradox Live LATAM</h2>
              <p className="text-slate-400 text-lg">
                Tu plataforma dedicada al universo de Paradox Live en español. Explora los mangas oficiales traducidos y conoce las fichas detalladas de los equipos.
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => setActiveTab('manga')}
                className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition transform hover:-translate-y-0.5"
              >
                Leer Manga
              </button>
              <button 
                onClick={() => setActiveTab('characters')}
                className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-bold transition transform hover:-translate-y-0.5"
              >
                Ver Personajes
              </button>
            </div>
          </div>
        ) : activeTab === 'manga' ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold border-b border-slate-800 pb-3">Capítulos Disponibles</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {chaptersData.map((chap) => (
                <div 
                  key={chap.id}
                  onClick={() => setSelectedChapter(chap)}
                  className="bg-slate-900 border border-slate-800 hover:border-purple-500 p-5 rounded-2xl cursor-pointer transition flex justify-between items-center group shadow-md"
                >
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-purple-300 transition">Capítulo {chap.number}</h3>
                    <p className="text-slate-400 text-sm">{chap.title}</p>
                  </div>
                  <span className="text-purple-400 font-semibold text-sm bg-purple-950/50 px-3 py-1.5 rounded-lg border border-purple-900/50">Leer →</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold border-b border-slate-800 pb-3">Personajes ({charactersData.length})</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {charactersData.map((char) => (
                <div key={char.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl">
                  <div className="w-full h-80 bg-slate-950 overflow-hidden relative">
                    <img 
                      src={char.image} 
                      alt={char.name} 
                      className="w-full h-full object-cover object-top hover:scale-105 transition duration-500"
                    />
                    <span className="absolute top-3 right-3 bg-purple-950/90 backdrop-blur text-purple-300 text-xs px-3 py-1 rounded-full border border-purple-800/80 font-bold shadow">
                      {char.group}
                    </span>
                  </div>
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-xl text-purple-200 mb-2">{char.name}</h3>
                      
                      <div className="text-xs text-slate-400 space-y-1 mb-3 bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
                        <p><span className="text-slate-500 font-medium">Rol:</span> {char.role}</p>
                        {char.academicLevel && <p><span className="text-slate-500 font-medium">Nivel:</span> {char.academicLevel}</p>}
                        {char.club && <p><span className="text-slate-500 font-medium">Club:</span> {char.club}</p>}
                      </div>

                      <p className="text-sm text-slate-300 leading-relaxed">{char.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        Paradox Live LATAM — Proyecto Fan Translation & Community
      </footer>
    </div>
  );
}

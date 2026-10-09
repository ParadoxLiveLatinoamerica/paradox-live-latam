import React, { useState } from 'react';
import initialChapters from './chapters.json';
import charactersData from './characters.json';

interface Character {
  id: string;
  name: string;
  group: string;
  role: string;
  academicLevel?: string;
  age?: string;
  height?: string;
  image: string;
  description: string;
}

interface Chapter {
  id: string;
  chapterNumber: number;
  title: string;
  coverUrl: string;
  pages: string[];
}

export default function App() {
  const [chapters] = useState<Chapter[]>(initialChapters);
  const [characters] = useState<Character[]>(charactersData);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [activeTab, setActiveTab] = useState<'manga' | 'characters'>('manga');

  return (
    <div className="min-w-screen min-h-screen bg-slate-950 text-slate-100 font-sans pb-24">
      {/* Encabezado */}
      <header className="border-b border-slate-800 bg-slate-900/50 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl font-black bg-gradient-to-r from-fuchsia-500 to-indigo-500 bg-clip-text text-transparent uppercase">
            Paradox Live Latam
          </h1>
          <nav className="flex gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 w-full sm:w-auto">
            <button
              onClick={() => { setActiveTab('manga'); setSelectedChapter(null); setSelectedCharacter(null); }}
              className={flex-1 px-6 py-2 rounded-lg font-bold text-sm ${
                activeTab === 'manga' ? 'bg-fuchsia-600 text-white' : 'text-slate-400'
              }}
            >
              📖 Manga
            </button>
            <button
              onClick={() => { setActiveTab('characters'); setSelectedChapter(null); setSelectedCharacter(null); }}
              className={flex-1 px-6 py-2 rounded-lg font-bold text-sm ${
                activeTab === 'characters' ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }}
            >
              👥 Personajes
            </button>
          </nav>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {activeTab === 'manga' ? (
          !selectedChapter ? (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-fuchsia-400">📖 Lista de Capítulos</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {chapters.map((chapter) => (
                  <button
                    key={chapter.id}
                    onClick={() => setSelectedChapter(chapter)}
                    className="flex gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left w-full hover:border-fuchsia-500/50 transition-colors"
                  >
                    <div className="w-20 h-28 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                      {chapter.coverUrl ? (
                        <img src={chapter.coverUrl} alt={chapter.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">Sin Portada</div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="font-bold text-lg text-slate-200">{chapter.title}</h3>
                      <p className="text-xs text-fuchsia-500 mt-1">Ver capítulo →</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            ) : (
/* Visor de Manga */
<div className="space-y-6">
<button onClick={() => setSelectedChapter(null)} className="text-sm font-bold text-slate-400 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
← Volver a la lista
</button>
<h2 className="text-2xl font-black text-center">{selectedChapter.title}</h2>
<div className="flex flex-col items-center gap-4 max-w-2xl mx-auto">
{selectedChapter.pages.map((pageUrl, index) => (
<div key={index} className="w-full relative bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
<img src={pageUrl} alt={Página ${index + 1}} className="w-full h-auto block" loading="lazy" />
</div>
))}
</div>
</div>
)
) : (
/* Sección de Personajes */
!selectedCharacter ? (
<div className="space-y-6">
<h2 className="text-xl font-bold text-indigo-400">👥 Lista de Personajes</h2>
<div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
{characters.map((char) => (
<button key={char.id} onClick={() => setSelectedCharacter(char)} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl w-full hover:border-indigo-500/50 transition-colors">
<div className="aspect-[3/4] rounded-xl overflow-hidden mb-3">
<img src={char.image} alt={char.name} className="w-full h-full object-cover" />
</div>
<h3 className="font-bold text-sm truncate">{char.name}</h3>
</button>
))}
</div>
</div>
) : (
/* Detalle de Personaje */
<div className="space-y-6 max-w-xl mx-auto">
<button onClick={() => setSelectedCharacter(null)} className="text-sm font-bold text-slate-400 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
← Volver a personajes
</button>
<div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row gap-6">
<div className="w-44 aspect-[3/4] rounded-2xl overflow-hidden flex-shrink-0">
<img src={selectedCharacter.image} alt={selectedCharacter.name} className="w-full h-full object-cover" />
</div>
<div className="flex-1 space-y-4">
<h2 className="text-2xl font-black">{selectedCharacter.name}</h2>
<p className="text-sm text-indigo-400">{selectedCharacter.role}</p>
<p className="text-sm text-slate-400">{selectedCharacter.description}</p>
</div>
</div>
</div>
)
)}
</main>

{/* Pie de Página fijo abajo */}
<footer className="bg-slate-950 text-center py-4 text-xs text-slate-600 fixed bottom-0 left-0 right-0 z-40 border-t border-slate-900">
<p className="uppercase tracking-wider text-[10px]">
Paradox Live Latinoamérica © Fan-made sin fines de lucro.
</p>
</footer>
</div>
);
}

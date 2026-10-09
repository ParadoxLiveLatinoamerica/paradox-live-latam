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
  const [chapters, setChapters] = useState<Chapter[]>(initialChapters);
  const [characters] = useState<Character[]>(charactersData);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [activeTab, setActiveTab] = useState<'manga' | 'characters'>('manga');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-fuchsia-500 selection:text-white">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl font-black tracking-wider bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent uppercase">
            Paradox Live Latam
          </h1>
          <nav className="flex gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 w-full sm:w-auto">
            <button
              onClick={() => { setActiveTab('manga'); setSelectedChapter(null); setSelectedCharacter(null); }}
              className={`flex-1 sm:flex-none px-6 py-2 rounded-lg font-bold text-sm transition-all duration-200 ${
                activeTab === 'manga' ? 'bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              📖 Manga
            </button>
            <button
              onClick={() => { setActiveTab('characters'); setSelectedChapter(null); setSelectedCharacter(null); }}
              className={`flex-1 sm:flex-none px-6 py-2 rounded-lg font-bold text-sm transition-all duration-200 ${
                activeTab === 'characters' ? 'bg-gradient-to-r from-purple-600 to-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              👥 Personajes
            </button>
          </nav>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8 pb-24">
        {activeTab === 'manga' ? (
          !selectedChapter ? (
            <div className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2 text-fuchsia-400">
                <span>📖</span> Lista de Capítulos
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {chapters.map((chapter) => (
                  <button
                    key={chapter.id}
                    onClick={() => setSelectedChapter(chapter)}
                    className="flex gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-fuchsia-500/50 transition-all duration-300 text-left group overflow-hidden relative"
                  >
                    <div className="w-20 h-28 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0 border border-slate-700/50 shadow-md">
                      {chapter.coverUrl ? (
                        <img src={chapter.coverUrl} alt={chapter.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-slate-500 text-center p-1">Sin Portada</div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <h3 className="font-bold text-lg text-slate-200 group-hover:text-fuchsia-400 transition-colors truncate">
                        {chapter.title}
                      </h3>
                      <p className="text-xs font-semibold mt-1 tracking-wider uppercase text-fuchsia-500/80">
                        {chapter.pages.length === 0 ? "Próximamente" : `Capítulo ${chapter.chapterNumber}`}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <button
                onClick={() => setSelectedChapter(null)}
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-fuchsia-400 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800"
              >
                ← Volver a la lista
              </button>
              <div className="text-center py-2">
                <h2 className="text-2xl font-black text-slate-100">{selectedChapter.title}</h2>
              </div>
              <div className="flex flex-col items-center gap-4 bg-slate-900/40 p-2 sm:p-4 rounded-3xl border border-slate-900 shadow-2xl max-w-2xl mx-auto">
                {selectedChapter.pages.map((pageUrl, index) => (
                  <div key={index} className="w-full relative bg-slate-950 rounded-xl overflow-hidden border border-slate-800/50">
                    <img src={pageUrl} alt={`Página ${index + 1}`} className="w-full h-auto object-contain block" loading="lazy" />
                    <div className="absolute bottom-2 right-2 bg-slate-950/80 backdrop-blur text-[10px] font-bold px-2 py-1 rounded-md text-slate-400 border border-slate-800">
                      {index + 1} / {selectedChapter.pages.length}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => { setSelectedChapter(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold rounded-xl border border-slate-800"
                >
                  Volver Arriba ↑
                </button>
              </div>
            </div>
          )
        ) : (
          !selectedCharacter ? (
            <div className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-400">
                <span>👥</span> Lista de Personajes
              </h2>
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
                {characters.map((char) => (
                  <button
                    key={char.id}
                    onClick={() => setSelectedCharacter(char)}
                    className="p-3 bg-slate-900/60 border border-slate-800 rounded-2xl text-center hover:border-indigo-500/50 transition-all duration-300 group"
                  >
                    <div className="aspect-[3/4] rounded-xl overflow-hidden bg-slate-800 border border-slate-700/30 mb-3 shadow-inner">
                      <img src={char.image} alt={char.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-200 group-hover:text-indigo-400 transition-colors truncate">
                      {char.name}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5 truncate">
                      {char.group}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 max-w-xl mx-auto">
              <button
                onClick={() => setSelectedCharacter(null)}
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-400 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800"
              >
                ← Volver a personajes
              </button>
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                <div className="w-44 aspect-[3/4] rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 flex-shrink-0 shadow-lg">
                  <img src={selectedCharacter.image} alt={selectedCharacter.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-4 text-center sm:text-left min-w-0">
                  <div>
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {selectedCharacter.group}
                    </span>
                    <h2 className="text-2xl font-black text-slate-100 mt-2 truncate">{selectedCharacter.name}</h2>
                    <p className="text-sm text-indigo-400/90 font-medium mt-0.5">{selectedCharacter.role}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs border-y border-slate-800/80 py-3 text-left">
                    {selectedCharacter.age && <p className="text-slate-400"><strong className="text-slate-200">Edad:</strong> {selectedCharacter.age}</p>}
                    {selectedCharacter.height && <p className="text-slate-400"><strong className="text-slate-200">Altura:</strong> {selectedCharacter.height}</p>}
                    {selectedCharacter.academicLevel && <p className="text-slate-400 col-span-2"><strong className="text-slate-200">Nivel:</strong> {selectedCharacter.academicLevel}</p>}
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed text-justify whitespace-pre-line">{selectedCharacter.description}</p>
                </div>
              </div>
            </div>
          )
        )}
      </main>
      <footer className="border-t border-slate-900 bg-slate-950 text-center py-6 text-xs text-slate-600 fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-slate-950 via-slate-950 to-slate-950/90 backdrop-blur-sm">
        <p className="max-w-md mx-auto px-4 uppercase tracking-wider font-semibold text-[10px]">
          Paradox Live Latinoamérica © Proyecto Fan-made sin fines de lucro.
        </p>
      </footer>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://oblliicjkguzifjnmvay.supabase.co"; 
const SUPABASE_ANON_KEY = "sb_publishable_GypvVUE5PIbGyZf4YfT2gw_0aRGPn9i";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface Character {
  id: string;
  name: string;
  group: string;
  role: string;
  description: string;
  image?: string;
  academicLevel?: string;
  club?: string;
  council?: string;
  occupation?: string;
  classroom?: string;
}

interface Chapter {
  id: string;
  number: number;
  title: string;
  pages: string[];
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'manga' | 'characters'>('home');
  const [characters, setCharacters] = useState<Character[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: chars } = await supabase.from('characters').select('*');
      const { data: chaps } = await supabase.from('chapters').select('*').order('number', { ascending: true });

      if (chars) setCharacters(chars);
      if (chaps) setChapters(chaps);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
              Manga ({chapters.length})
            </button>
            <button 
              onClick={() => { setActiveTab('characters'); setSelectedChapter(null); }}
              className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'characters' ? 'bg-purple-600 text-white' : 'hover:text-purple-400'}`}
            >
              Personajes ({characters.length})
            </button>
          </nav>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6">
        {loading ? (
          <div className="text-center py-20 text-slate-400">Cargando la plataforma...</div>
        ) : selectedChapter ? (
          /* Lector de Manga */
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
                {selectedChapter.pages.map((imgUrl, idx) => (
                  <img key={idx} src={imgUrl} alt={`Página ${idx + 1}`} className="w-full rounded shadow-lg" />
                ))}
              </div>
            ) : (
              <p className="text-slate-400 py-10 text-center">Este capítulo aún no tiene páginas cargadas.</p>
            )}
          </div>
        ) : activeTab === 'home' ? (
          /* Pantalla de Inicio */
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
          /* Lista de Capítulos */
          <div className="space-y-4">
            <h2 className="text-2xl font-bold border-b border-slate-800 pb-2">Capítulos Disponibles</h2>
            {chapters.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl text-center text-slate-400">
                Aún no hay capítulos agregados en Supabase.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {chapters.map((chap) => (
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
            )}
          </div>
        ) : (
          /* Galería de Personajes con Imagen y Ficha Completa */
          <div className="space-y-4">
            <h2 className="text-2xl font-bold border-b border-slate-800 pb-2">Personajes</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {characters.map((char) => (
                <div key={char.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between">
                  {char.image && (
                    <div className="w-full h-64 bg-slate-800 overflow-hidden">
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
                        {char.academicLevel && <p><span className="text-slate-500">Nivel Acd.:</span> {char.academicLevel}</p>}
                        {char.occupation && <p><span className="text-slate-500">Ocupación:</span> {char.occupation}</p>}
                        {char.club && <p><span className="text-slate-500">Club:</span> {char.club}</p>}
                      </div>

                      <p className="text-sm text-slate-300">{char.description || 'Sin descripción disponible.'}</p>
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

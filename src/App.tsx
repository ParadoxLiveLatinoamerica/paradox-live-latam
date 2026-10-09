import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Conexión directa a Supabase con tus credenciales
const SUPABASE_URL = "https://oblliicjkguzifjnmvay.supabase.co"; 
const SUPABASE_ANON_KEY = "sb_publishable_GypvVUE5PIbGyZf4YfT2gw_0aRGPn9i";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface Chapter {
  id: string;
  number: number;
  title: string;
  pages: string[];
}

interface Character {
  id: string;
  name: string;
  group: string;
  role: string;
  description: string;
}

export default function App() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: chaptersData } = await supabase.from('chapters').select('*').order('number', { ascending: true });
      const { data: charactersData } = await supabase.from('characters').select('*');

      if (chaptersData) setChapters(chaptersData);
      if (charactersData) setCharacters(charactersData);
    } catch (error) {
      console.error("Error al cargar datos desde Supabase:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Paradox Live LATAM</h1>
      {loading ? (
        <p className="text-center text-gray-400">Cargando contenido...</p>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          <p className="text-green-400 text-center">
            Conexión activa. Capítulos cargados: {chapters.length} | Personajes: {characters.length}
          </p>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Settings, 
  Image as ImageIcon, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Save, 
  Search,
  Lock,
  Eye,
  EyeOff,
  Radio,
  User,
  Users
} from 'lucide-react';

// Inicialización de Supabase con variables de entorno de React
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  image?: string;
  academicLevel?: string;
  club?: string;
  council?: string;
  occupation?: string;
  classroom?: string;
  description: string;
}

const ADMIN_PASSWORD = "paradoxlatamadmin";

export default function App() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos desde Supabase al iniciar
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
      console.error("Error al cargar datos de Supabase:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Paradox Live LATAM</h1>
      {loading ? (
        <p className="text-center text-gray-400">Cargando contenido desde Supabase...</p>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          <p className="text-green-400 text-center">Conexión a Supabase activa. Capítulos: {chapters.length} | Personajes: {characters.length}</p>
        </div>
      )}
    </div>
  );
}


  

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

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

const DEFAULT_18_CHAPTERS: Chapter[] = Array.from({ length: 18 }, (_, i) => ({
  id: `cap-${i + 1}`,
  number: i + 1,
  title: `Capítulo ${i + 1}`,
  pages: []
}));

export default function App() {
  const [activeTab, setActiveTab] = useState<'manga' | 'characters' | 'admin'>('manga');
  const [chapters, setChapters] = useState<Chapter[]>(DEFAULT_18_CHAPTERS);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [mangaStatus, setMangaStatus] = useState<string>('En emisión');
  const [characters, setCharacters] = useState<Character[]>([]);

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [inputPassword, setInputPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>('');

  const [chapNumber, setChapNumber] = useState<number>(1);
  const [chapTitle, setChapTitle] = useState<string>('');
  const [chapPagesText, setChapPagesText] = useState<string>('');
  
  const [selectedCharId, setSelectedCharId] = useState<string>('');
  const [charImageUrl, setCharImageUrl] = useState<string>('');

  const [notification, setNotification] = useState<string>('');

  // Cargar datos de Supabase para todos los visitantes en tiempo real
  useEffect(() => {
    async function fetchDataFromSupabase() {
      try {
        // 1. Cargar Capítulos
        const { data: chapData, error: chapError } = await supabase
          .from('chapters')
          .select('*');

        if (!chapError && chapData && chapData.length > 0) {
          const merged = DEFAULT_18_CHAPTERS.map(def => {
            const found = chapData.find((c: any) => c.number === def.number);
            return found ? { id: found.id || def.id, number: found.number, title: found.title || def.title, pages: found.pages || [] } : def;
          });
          setChapters(merged);
        } else {
          setChapters(DEFAULT_18_CHAPTERS);
        }

        // 2. Cargar Personajes desde tu base de datos
        const { data: charData, error: charError } = await supabase
          .from('characters')
          .select('*');

        if (!charError && charData && charData.length > 0) {
          // Mapeamos los campos de la BD asegurando el formato correcto
          const formattedChars = charData.map((c: any) => ({
            id: c.id,
            name: c.name,
            group: c.group,
            role: c.role,
            image: c.image || '',
            academicLevel: c.academicLevel || '',
            club: c.club || '',
            council: c.council || '',
            occupation: c.occupation || '',
            classroom: c.classroom || '',
            description: c.description || ''
          }));
          setCharacters(formattedChars);
          if (formattedChars.length > 0) {
            setSelectedCharId(formattedChars[0].id);
          }
        }

        // 3. Cargar Estado del Manga
        const { data: statusData } = await supabase
          .from('settings')
          .select('*')
          .eq('key', 'manga_status')
          .single();

        if (statusData && statusData.value) {
          setMangaStatus(statusData.value);
        }
      } catch (err) {
        console.error("Error conectando a Supabase:", err);
      }
    }

    fetchDataFromSupabase();
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPassword === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      setPasswordError('');
      setInputPassword('');
    } else {
      setPasswordError('Contraseña incorrecta.');
    }
  };

  const handleChangeStatus = async (status: string) => {
    setMangaStatus(status);
    showNotification(`Estado actualizado a: "${status}"`);
    try {
      await supabase
        .from('settings')
        .upsert({ key: 'manga_status', value: status }, { onConflict: 'key' });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    const pages = chapPagesText
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const updatedChapterData = {
      number: chapNumber,
      title: chapTitle || `Capítulo ${chapNumber}`,
      pages
    };

    try {
      // Guardar en Supabase usando el número como referencia única
      const { error } = await supabase
        .from('chapters')
        .upsert(updatedChapterData, { onConflict: 'number' });

      if (error) {
        alert("Error al guardar en Supabase: " + error.message);
        return;
      }
    } catch (err) {
      console.error(err);
    }

    const updatedList = chapters.map(c => c.number === chapNumber ? { ...c, ...updatedChapterData } : c);
    setChapters(updatedList);
    showNotification(`¡Capítulo ${chapNumber} guardado en la nube con éxito!`);
    setChapPagesText('');
    setChapTitle('');
  };

  const handleDeleteChapter = async (num: number) => {
    const updatedList = chapters.map(c => c.number === num ? { ...c, pages: [] } : c);
    setChapters(updatedList);
    
    try {
      await supabase
        .from('chapters')
        .upsert({ number: num, title: `Capítulo ${num}`, pages: [] }, { onConflict: 'number' });
    } catch (e) {
      console.error(e);
    }

    showNotification(`Páginas del Capítulo ${num} vaciadas.`);
    if (selectedChapter?.number === num) setSelectedChapter(null);
  };

  const handleUpdateCharacterImage = async (e: React.FormEvent) => {
    e.preventDefault();
    const newImageUrl = charImageUrl.trim();

    try {
      const { error } = await supabase
        .from('characters')
        .update({ image: newImageUrl })
        .eq('id', selectedCharId);

      if (error) {
        alert("Error al actualizar la imagen en Supabase: " + error.message);
        return;
      }

      const updated = characters.map((c) => {
        if (c.id === selectedCharId) {
          return { ...c, image: newImageUrl };
        }
        return c;
      });
      setCharacters(updated);
      showNotification('¡Foto de personaje actualizada en la nube!');
      setCharImageUrl('');
    } catch (err) {
      console.error(err);
    }
  };

  const groups = ['ALL', 'BAE', 'cozmez', 'The Cat\'s Whiskers', 'Akanyatsura', 'Amprule', 'VISTY', '1Nm8', 'Goku Luck', 'BURAIKAN'];

  const filteredCharacters = characters.filter((c) => {
    const matchesGroup = selectedGroup === 'ALL' || c.group === selectedGroup;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setActiveTab('manga'); setSelectedChapter(null); }}>
            <span className="text-xl font-black tracking-wider text-pink-500">PARADOX LIVE LATINOAMERICA</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { setActiveTab('manga'); setSelectedChapter(null); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${activeTab === 'manga' ? 'bg-pink-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}
            >
              Manga
            </button>
            <button
              onClick={() => setActiveTab('characters')}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${activeTab === 'characters' ? 'bg-pink-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}
            >
              Estudiantes
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`p-2 rounded-lg transition ${activeTab === 'admin' ? 'bg-pink-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
              title="Panel de Administración"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
      </header>

      {notification && (
        <div className="bg-pink-600 text-white text-center py-2 px-4 text-sm font-bold animate-pulse">
          {notification}
        </div>
      )}

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        {activeTab === 'manga' && (
          <div>
            {!selectedChapter ? (
              <div>
                <div className="mb-6 p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-2xl font-bold text-pink-400">Paralove School</h1>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${mangaStatus === 'En emisión' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-300 border border-slate-700'}`}>
                        {mangaStatus}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm">
                      Traducción al español del manga Paralove School e información detallada sobre sus personajes y estudiantes.
                    </p>
                  </div>
                </div>

                <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <BookOpen size={20} className="text-pink-500" />
                  Lista de Capítulos (18 Capítulos)
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {chapters.map((chap) => (
                    <div
                      key={chap.id}
                      onClick={() => setSelectedChapter(chap)}
                      className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-pink-500/50 cursor-pointer transition flex items-center justify-between group"
                    >
                      <div>
                        <span className="font-bold text-white group-hover:text-pink-400 transition">
                          Capítulo {chap.number}
                        </span>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {chap.pages && chap.pages.length > 0 ? `${chap.pages.length} páginas` : 'Próximamente'}
                        </p>
                      </div>
                      <ChevronRight size={18} className="text-slate-600 group-hover:text-pink-400 transition" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4 bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setSelectedChapter(null)}
                    className="flex items-center gap-1 text-sm font-semibold text-slate-300 hover:text-pink-400 transition"
                  >
                    <BookOpen size={16} />
                    Lista de Capítulos
                  </button>

                  <span className="font-bold text-pink-400">Capítulo {selectedChapter.number}</span>

                  <div className="flex items-center gap-1">
                    {selectedChapter.number > 1 && (
                      <button
                        onClick={() => {
                          const prev = chapters.find((c) => c.number === selectedChapter.number - 1);
                          if (prev) setSelectedChapter(prev);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                        title="Capítulo anterior"
                      >
                        <ChevronLeft size={18} />
                      </button>
                    )}
                    {selectedChapter.number < chapters.length && (
                      <button
                        onClick={() => {
                          const next = chapters.find((c) => c.number === selectedChapter.number + 1);
                          if (next) setSelectedChapter(next);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                        title="Capítulo siguiente"
                      >
                        <ChevronRight size={18} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2 max-w-2xl mx-auto">
                  {selectedChapter.pages && selectedChapter.pages.length > 0 ? (
                    selectedChapter.pages.map((imgUrl, idx) => (
                      <img
                        key={idx}
                        src={imgUrl}
                        alt={`Página ${idx + 1}`}
                        className="w-full rounded-lg shadow-lg border border-slate-800"
                      />
                    ))
                  ) : (
                    <div className="text-center py-16 text-slate-500">
                      <ImageIcon size={48} className="mx-auto mb-2 opacity-40" />
                      <p>Este capítulo aún no tiene páginas publicadas.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'characters' && (
          <div>
            <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-64">
                <Search size={18} className="absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Buscar estudiante..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
                {groups.map((grp) => (
                  <button
                    key={grp}
                    onClick={() => setSelectedGroup(grp)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${selectedGroup === grp ? 'bg-pink-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'}`}
                  >
                    {grp}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCharacters.map((char) => (
                <div key={char.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row gap-4">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 flex-shrink-0 flex items-center justify-center">
                    {char.image ? (
                      <img src={char.image} alt={char.name} className="w-full h-full object-cover" />
                    ) : (
                      <User size={40} className="text-slate-700" />
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                        <h3 className="text-base font-bold text-white">{char.name}</h3>
                        <div className="flex items-center gap-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-950 text-pink-300 border border-pink-800">
                            {char.group}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                            {char.role}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-0.5 mb-2 text-[11px] text-slate-400">
                        {char.academicLevel && <p><strong className="text-slate-300">Nivel académico:</strong> {char.academicLevel}</p>}
                        {char.occupation && <p><strong className="text-slate-300">Ocupación:</strong> {char.occupation}</p>}
                        {char.classroom && <p><strong className="text-slate-300">Aula:</strong> {char.classroom}</p>}
                        {char.club && <p><strong className="text-slate-300">Club:</strong> {char.club}</p>}
                        {char.council && <p><strong className="text-slate-300">Consejo estudiantil:</strong> {char.council}</p>}
                      </div>

                      <p className="text-xs text-slate-300 italic">{char.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-xl p-6">
            {!isAdminAuthenticated ? (
              <form onSubmit={handleAdminAuth} className="space-y-4">
                <div className="text-center mb-4">
                  <Lock size={36} className="mx-auto text-pink-500 mb-2" />
                  <h2 className="text-lg font-bold text-white">Acceso Restringido</h2>
                  <p className="text-xs text-slate-400">Ingresa la clave de administrador para editar.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Contraseña</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={inputPassword}
                      onChange={(e) => setInputPassword(e.target.value)}
                      placeholder="Introduce la contraseña"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-pink-500 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {passwordError && <p className="text-xs text-red-400 mt-1">{passwordError}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-2.5 rounded-lg transition text-sm"
                >
                  Entrar al Panel
                </button>
              </form>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                  <h2 className="text-lg font-bold flex items-center gap-2 text-pink-400">
                    <Settings size={20} />
                    Panel de Administración
                  </h2>
                  <button
                    onClick={() => setIsAdminAuthenticated(false)}
                    className="text-xs bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded text-slate-300"
                  >
                    Cerrar Sesión
                  </button>
                </div>

                <div className="mb-6 p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <label className="block text-xs font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                    <Radio size={14} className="text-pink-500" />
                    Estado de Publicación del Manga
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleChangeStatus('En emisión')}
                      className={`py-2 rounded-lg text-xs font-bold transition ${mangaStatus === 'En emisión' ? 'bg-emerald-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'}`}
                    >
                      🟢 En emisión
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChangeStatus('Finalizado')}
                      className={`py-2 rounded-lg text-xs font-bold transition ${mangaStatus === 'Finalizado' ? 'bg-slate-700 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'}`}
                    >
                      🏁 Finalizado
                    </button>
                  </div>
                </div>

                <div className="mb-6 p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <label className="block text-xs font-bold text-pink-400 mb-2 flex items-center gap-1.5">
                    <Users size={14} />
                    Asignar Foto a Estudiante / Profesor
                  </label>
                  <form onSubmit={handleUpdateCharacterImage} className="space-y-3">
                    <div>
                      <select
                        value={selectedCharId}
                        onChange={(e) => setSelectedCharId(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-pink-500"
                      >
                        {characters.map((c) => (
                          <option key={c.id} value={c.id}>{c.name} ({c.group})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="Pega aquí el enlace de Imgur (ej: https://i.imgur.com/...)"
                        value={charImageUrl}
                        onChange={(e) => setCharImageUrl(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-pink-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-slate-800 hover:bg-slate-700 text-pink-300 font-bold py-1.5 rounded-lg transition text-xs border border-slate-700"
                    >
                      Actualizar Foto del Personaje
                    </button>
                  </form>
                </div>

                <form onSubmit={handleSaveChapter} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Número de Capítulo (1 al 18)</label>
                    <input
                      type="number"
                      min="1"
                      max="18"
                      value={chapNumber}
                      onChange={(e) => setChapNumber(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-pink-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Título del Capítulo (Opcional)</label>
                    <input
                      type="text"
                      placeholder="Ej: El comienzo"
                      value={chapTitle}
                      onChange={(e) => setChapTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">
                      Enlaces Directos de Imgur o Base64 (Uno por línea)
                    </label>
                    <textarea
                      rows={5}
                      value={chapPagesText}
                      onChange={(e) => setChapPagesText(e.target.value)}
                      placeholder="Ejemplo:&#10;https://i.imgur.com/foto1.jpg&#10;https://i.imgur.com/foto2.jpg"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none focus:border-pink-500 font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-2.5 rounded-lg transition flex items-center justify-center gap-2 text-sm"
                  >
                    <Save size={18} />
                    Guardar Capítulo en la Nube
                  </button>
                </form>

                <hr className="my-6 border-slate-800" />

                <h3 className="text-sm font-bold text-slate-300 mb-3">Gestión de Capítulos</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {chapters.map((c) => (
                    <div key={c.id} className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800 text-xs">
                      <span>Capítulo {c.number} - ({c.pages.length} páginas)</span>
                      <button
                        onClick={() => handleDeleteChapter(c.number)}
                        className="text-red-400 hover:text-red-300 p-1"
                        title="Vaciar páginas del capítulo"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        <p>PARADOX LIVE LATINOAMERICA &copy; Proyecto Fan-made sin fines de lucro.</p>
      </footer>
    </div>
  );
}

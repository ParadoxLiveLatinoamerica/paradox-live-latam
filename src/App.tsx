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

// ==========================================
// CONFIGURACIÓN DE SUPABASE
// ==========================================
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'TU_SUPABASE_URL';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'TU_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

// PERSONAJES OFICIALES DE RESPALDO (INITIAL_CHARACTERS)
const INITIAL_CHARACTERS: Character[] = [
  { id: 'char-1', name: 'Sugasano Allen', group: 'BAE', role: 'Estudiante', academicLevel: '2do año, curso general, Clase C', club: 'Presidente del club de hip-hop', council: 'N/A', description: 'Un presidente del club de hip-hop que aspira a que el club llegue a la cima una vez que se gradúen.', image: 'https://i.imgur.com/c0rngvV.jpeg' },
  { id: 'char-2', name: 'Yeon Hajun', group: 'BAE', role: 'Estudiante', academicLevel: '2do año, curso avanzado', club: 'Club de tenis', council: 'Presidente del consejo estudiantil de la escuela secundaria', description: 'El noble sonriente que dirige la escuela como si fuera su propio castillo.', image: 'https://i.imgur.com/GqXpiP8.jpeg' },
  { id: 'char-3', name: 'Anne Faulkner', group: 'BAE', role: 'Estudiante', academicLevel: '2do año, curso general, Clase B', club: 'Presidenta del club de sastrería', council: 'Comité ejecutivo del festival cultural', description: 'Un influencer abrumadoramente popular.', image: 'https://i.imgur.com/cPsipv2.jpeg' },
  { id: 'char-4', name: 'Yatonokami Kanata', group: 'cozmez', role: 'Estudiante', academicLevel: '2do año, curso general, Clase C', club: 'No está en ningún club', council: 'N/A', description: 'Una persona que no tiene miedo de arriesgarse, solo se presenta los días que son necesarios para no reprobar.', image: 'https://i.imgur.com/xh6HHYD.jpeg' },
  { id: 'char-5', name: 'Yatonokami Nayuta', group: 'cozmez', role: 'Estudiante', academicLevel: '2do año, curso general, Clase B', club: 'No está en ningún club', council: 'N/A', description: 'Es el holgazán de clase S más poderoso en la historia de la escuela.', image: 'https://i.imgur.com/n8a52Et.jpeg' },
  { id: 'char-6', name: 'Saimon Naoakira', group: 'The Cat\'s Whiskers', role: 'Profesor', occupation: 'Profesor de japonés', classroom: 'Curso avanzado de secundaria, primeros años', club: 'Asesor del club de teatro', description: 'Un guardián del tiempo cuya hermosa voz atrajo a miles de estudiantes a una tierra de los sueños.', image: 'https://i.imgur.com/93kdqP2.jpeg' },
  { id: 'char-7', name: 'Kanbayashi Yohei', group: 'The Cat\'s Whiskers', role: 'Personal', occupation: 'Jefe de conserjes', club: 'No afiliado', description: 'Es el guardián de la escuela, siempre está armado con alcohol y cigarrillos.', image: 'https://i.imgur.com/39Pxn9V.jpeg' },
  { id: 'char-8', name: 'Natsume Ryu', group: 'The Cat\'s Whiskers', role: 'Estudiante', academicLevel: '?', club: '?', council: 'N/A', description: 'Un excelente ejemplo de una persona que se supone que ya se ha graduado, pero aún así aparece en el campus todos los días.', image: 'https://i.imgur.com/601gh5F.jpeg' },
  { id: 'char-9', name: 'Ando Shiki', group: 'The Cat\'s Whiskers', role: 'Estudiante', academicLevel: '1er año, curso avanzado', club: 'Club de fútbol', council: 'Departamento de animales', description: 'Es un niño con buena salud y es tan serio que da miedo.', image: 'https://i.imgur.com/yc5snxU.jpeg' },
  { id: 'char-10', name: 'Suiseki Iori', group: 'Akanyatsura', role: 'Profesor', occupation: 'Profesor de matemáticas', classroom: 'Curso general de secundaria, 3er año, clase F', club: 'Asesor del club de baloncesto', description: 'Es un completo demonio de cálculo mental que inculca en las cabezas de sus alumnos un espíritu temerario.', image: 'https://i.imgur.com/TmlS4Q5.jpeg' },
  { id: 'char-11', name: 'Gaho Zen', group: 'Akanyatsura', role: 'Profesor', occupation: 'Profesor de educación física', classroom: 'Curso general de secundaria, 2º año, clase C', club: 'Asesor del club de judo', description: 'Es un gran fanfarrón con los bíceps, y tiene los músculos más voluminosos de la escuela.', image: 'https://i.imgur.com/SDVJOq3.jpeg' },
  { id: 'char-12', name: 'Masaki Hokusai', group: 'Akanyatsura', role: 'Estudiante', academicLevel: '3er año, curso general, Clase D', club: 'Club de tiro con arco', council: 'Departamento de animales', description: 'Es un gigante gentil que prefiere pasar tiempo en el patio con los gatos en lugar de asistir a clases.', image: 'https://i.imgur.com/rJJIj9C.jpeg' },
  { id: 'char-13', name: 'Maruyama Reo', group: 'Akanyatsura', role: 'Estudiante', academicLevel: '1er año, curso general', club: 'Club de hip-hop', council: 'N/A', description: 'Miembro de Akanyatsura.', image: 'https://i.imgur.com/rJJIj9C.jpeg' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'manga' | 'characters' | 'admin'>('manga');
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [mangaStatus, setMangaStatus] = useState<string>('En emisión');
  const [characters, setCharacters] = useState<Character[]>(INITIAL_CHARACTERS);

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [inputPassword, setInputPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>('');

  const [chapNumber, setChapNumber] = useState<number>(1);
  const [chapTitle, setChapTitle] = useState<string>('');
  const [chapPagesText, setChapPagesText] = useState<string>('');
  
  const [selectedCharId, setSelectedCharId] = useState<string>(INITIAL_CHARACTERS[0].id);
  const [charImageUrl, setCharImageUrl] = useState<string>('');

  const [notification, setNotification] = useState<string>('');

  // CARGAR DATOS DESDE SUPABASE AL INICIAR
  useEffect(() => {
    fetchChaptersFromSupabase();
    fetchCharactersFromSupabase();

    const savedStatus = localStorage.getItem('pl_latam_status');
    if (savedStatus) setMangaStatus(savedStatus);
  }, []);

  const fetchChaptersFromSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .order('number', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        const formattedChapters: Chapter[] = data.map((item: any) => ({
          id: item.id,
          number: item.number,
          title: item.title,
          pages: item.pages || []
        }));
        setChapters(formattedChapters);
      }
    } catch (err) {
      console.error('Error al cargar capítulos de Supabase:', err);
      showNotification('Error al sincronizar con la nube.');
    }
  };

  const fetchCharactersFromSupabase = async () => {
    try {
      const { data, error } = await supabase.from('characters').select('*');
      if (error) throw error;

      if (data && data.length > 0) {
        const formattedChars: Character[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          group: item.group,
          role: item.role,
          image: item.image,
          academicLevel: item.academicLevel,
          club: item.club,
          council: item.council,
          occupation: item.occupation,
          classroom: item.classroom,
          description: item.description || ''
        }));
        setCharacters(formattedChars);
      }
    } catch (err) {
      console.error('Error al cargar personajes de Supabase:', err);
    }
  };

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

  const handleChangeStatus = (status: string) => {
    setMangaStatus(status);
    localStorage.setItem('pl_latam_status', status);
    showNotification(`Estado actualizado a: "${status}"`);
  };

  // GUARDAR CAPÍTULO DIRECTAMENTE EN SUPABASE (GLOBAL PARA TODOS CON UPSERT)
  const handleSaveChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    const pages = chapPagesText
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const chapterData = {
      id: `chap-${chapNumber}`,
      number: chapNumber,
      title: chapTitle || `Capítulo ${chapNumber}`,
      pages
    };

    try {
      const { error } = await supabase
        .from('chapters')
        .upsert([chapterData], { onConflict: 'id' });

      if (error) throw error;

      showNotification(`¡Capítulo ${chapNumber} guardado en la nube para todos!`);
      setChapPagesText('');
      setChapTitle('');
      fetchChaptersFromSupabase();
    } catch (err: any) {
      console.error('Error al guardar en Supabase:', err);
      showNotification(`Error al guardar: ${err.message || 'Revisa la consola'}`);
    }
  };

  // ELIMINAR CAPÍTULO DE SUPABASE
  const handleDeleteChapter = async (num: number) => {
    if (!window.confirm(`¿Estás seguro de eliminar el capítulo ${num}?`)) return;

    try {
      const { error } = await supabase
        .from('chapters')
        .delete()
        .eq('number', num);

      if (error) throw error;

      showNotification(`Capítulo ${num} eliminado de la nube.`);
      if (selectedChapter?.number === num) setSelectedChapter(null);
      fetchChaptersFromSupabase();
    } catch (err) {
      console.error('Error al eliminar capítulo:', err);
      showNotification('No se pudo eliminar el capítulo.');
    }
  };

  // ACTUALIZAR FOTO DE PERSONAJE EN SUPABASE
  const handleUpdateCharacterImage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('characters')
        .update({ image: charImageUrl.trim() })
        .eq('id', selectedCharId);

      if (error) throw error;

      showNotification('¡Foto de personaje actualizada en la nube!');
      setCharImageUrl('');
      fetchCharactersFromSupabase();
    } catch (err) {
      console.error('Error al actualizar personaje:', err);
      showNotification('Error al actualizar la foto.');
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
                  Lista de Capítulos
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
                          {chap.pages.length > 0 ? `${chap.pages.length} páginas` : 'Próximamente'}
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
                    <label className="block text-xs font-bold text-slate-400 mb-1">Número de Capítulo</label>
                    <input
                      type="number"
                      min="1"
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
                      Enlaces Directos de Imgur (Uno por línea)
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
                    Guardar / Publicar Capítulo en la Nube
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
                        title="Eliminar capítulo"
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

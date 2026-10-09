import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Image as ImageIcon, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Upload, 
  Save, 
  CheckCircle2,
  Search,
  GraduationCap
} from 'lucide-react';

interface Chapter {
  id: string;
  number: number;
  title: string;
  pages: string[];
}

interface Character {
  name: string;
  group: string;
  role: string;
  academicLevel?: string;
  club?: string;
  council?: string;
  occupation?: string;
  classroom?: string;
  description: string;
}

const INITIAL_CHARACTERS: Character[] = [
  // BAE
  { name: 'Sugasano Allen', group: 'BAE', role: 'Estudiante', academicLevel: '2do año, curso general, Clase C', club: 'Presidente del club de hip-hop', council: 'N/A', description: 'Un presidente del club de hip-hop que aspira a que el club llegue a la cima una vez que se gradúen.' },
  { name: 'Yeon Hajun', group: 'BAE', role: 'Estudiante', academicLevel: '2do año, curso avanzado', club: 'Club de tenis', council: 'Presidente del consejo estudiantil de la escuela secundaria', description: 'El noble sonriente que dirige la escuela como si fuera su propio castillo.' },
  { name: 'Anne Faulkner', group: 'BAE', role: 'Estudiante', academicLevel: '2do año, curso general, Clase B', club: 'Presidenta del club de sastrería', council: 'Comité ejecutivo del festival cultural', description: 'Un influencer abrumadoramente popular.' },
  
  // cozmez
  { name: 'Yatonokami Kanata', group: 'cozmez', role: 'Estudiante', academicLevel: '2do año, curso general, Clase C', club: 'No está en ningún club', council: 'N/A', description: 'Una persona que no tiene miedo de arriesgarse, solo se presenta los días que son necesarios para no reprobar.' },
  { name: 'Yatonokami Nayuta', group: 'cozmez', role: 'Estudiante', academicLevel: '2do año, curso general, Clase B', club: 'No está en ningún club', council: 'N/A', description: 'Es el holgazán de clase S más poderoso en la historia de la escuela.' },
  
  // TCW
  { name: 'Saimon Naoakira', group: 'The Cat\'s Whiskers', role: 'Profesor', occupation: 'Profesor de japonés', classroom: 'Curso avanzado de secundaria, primeros años', club: 'Asesor del club de teatro', description: 'Un guardián del tiempo cuya hermosa voz atrajo a miles de estudiantes a una tierra de los sueños.' },
  { name: 'Kanbayashi Yohei', group: 'The Cat\'s Whiskers', role: 'Personal', occupation: 'Jefe de conserjes', club: 'No afiliado', description: 'Es el guardián de la escuela, siempre está armado con alcohol y cigarrillos.' },
  { name: 'Natsume Ryu', group: 'The Cat\'s Whiskers', role: 'Estudiante', academicLevel: '?', club: '?', council: 'N/A', description: 'Un excelente ejemplo de una persona que se supone que ya se ha graduado, pero aún así aparece en el campus todos los días.' },
  { name: 'Ando Shiki', group: 'The Cat\'s Whiskers', role: 'Estudiante', academicLevel: '1er año, curso avanzado', club: 'Club de fútbol', council: 'Departamento de animales', description: 'Es un niño con buena salud y es tan serio que da miedo.' },

  // Akanyatsura
  { name: 'Suiseki Iori', group: 'Akanyatsura', role: 'Profesor', occupation: 'Profesor de matemáticas', classroom: 'Curso general de secundaria, 3er año, clase F', club: 'Asesor del club de baloncesto', description: 'Es un completo demonio de cálculo mental que inculca en las cabezas de sus alumnos un espíritu temerario.' },
  { name: 'Gaho Zen', group: 'Akanyatsura', role: 'Profesor', occupation: 'Profesor de educación física', classroom: 'Curso general de secundaria, 2º año, clase C', club: 'Asesor del club de judo', description: 'Es un gran fanfarrón con los bíceps, y tiene los músculos más voluminosos de la escuela.' },
  { name: 'Masaki Hokusai', group: 'Akanyatsura', role: 'Estudiante', academicLevel: '3er año, curso general, Clase D', club: 'Club de tiro con arco', council: 'Departamento de animales', description: 'Es un gigante gentil que prefiere pasar tiempo en el patio con los gatos en lugar de asistir a clases.' },
  { name: 'Maruyama Reo', group: 'Akanyatsura', role: 'Estudiante', academicLevel: '1er año, curso general, Clase E', club: 'Club de música', council: 'N/A', description: 'Un pequeño y astuto demonio que se ganó el apodo de "El Senpai Asesino".' },
  { name: 'Ito Satsuki', group: 'Akanyatsura', role: 'Estudiante', academicLevel: '1er año, curso general, Clase A', club: 'Club de baloncesto', council: 'N/A', description: 'Un delincuente de élite que ha logrado la impresionante hazaña de reprobar absolutamente todas las materias.' },

  // Amprule
  { name: 'Yeon Dongha', group: 'Amprule', role: 'Estudiante', academicLevel: '3er año, curso avanzado', club: 'Club de arte', council: 'Presidente del consejo estudiantil de secundaria', description: 'Este pequeño emperador gobierna con puño de hierro sobre la clase de secundaria.' },
  { name: 'Baek Chungsung', group: 'Amprule', role: 'Profesor', occupation: 'Profesor de arte', classroom: 'Curso avanzado de secundaria, segundo año', club: 'Asesor del club de arte', description: 'Este es sin dudas, un profesor masoquista que espera ansiosamente ser castigado por su amo.' },

  // VISTY
  { name: 'Yamato Shogo', group: 'VISTY', role: 'Estudiante', academicLevel: '2do año, curso general, Clase D', club: 'Presidente del club de astronomía', council: 'N/A', description: 'Un joven serio pero un poco tonto, realmente ama las estrellas y las gomitas.' },
  { name: 'Hikage Toma', group: 'VISTY', role: 'Estudiante', academicLevel: '3er año, curso general, Clase F', club: 'Club de música', council: 'Comité ejecutivo del festival cultural', description: 'Un auténtico fiestero con mucho amor para dar, ama la paz y los consejos de belleza.' },
  { name: 'Misuji Kantaro', group: 'VISTY', role: 'Estudiante', academicLevel: '1er año, curso general, Clase C', club: 'Club de artesanía', council: 'Comité ejecutivo del festival cultural', description: 'Es un joven con ojos de cachorrito que prioriza verse bien en las redes sociales.' },
  { name: 'Kureha Aoi', group: 'VISTY', role: 'Estudiante', academicLevel: '1er año, curso general, Clase A', club: 'Club de teatro, club de jardinería', council: 'N/D', description: 'El príncipe fresco y hermoso del club de teatro.' },

  // 1Nm8
  { name: 'Itsuki', group: '1Nm8', role: 'Estudiante', academicLevel: '2do año, curso avanzado', club: 'Club de ciencias', council: 'Comité de biblioteca', description: 'Un entusiasta de la eficiencia y precisión sin igual.' },
  { name: 'Rokuta', group: '1Nm8', role: 'Estudiante', academicLevel: '1er año, curso general, Clase E', club: 'Club de estudios culinarios', council: 'Comité ejecutivo del festival deportivo', description: 'Un niño que parece un cachorro y que infunde miedo en los corazones de los empleados de la tienda de la escuela.' },
  { name: 'Miyama Kei', group: '1Nm8', role: 'Estudiante', academicLevel: '3er año, curso avanzado', club: 'No está en ningún club', council: 'Comité de biblioteca', description: 'Un hermoso joven lleno de misterio que pasa mucho tiempo en la enfermería.' },

  // Goku Luck
  { name: 'Tosa Ryoga', group: 'Goku Luck', role: 'Estudiante', academicLevel: '3er año, curso general, Clase F', club: 'Club de judo', council: 'N/A', description: 'Es como un incontrolable perro rabioso.' },
  { name: 'Mikoshiba Kenta', group: 'Goku Luck', role: 'Estudiante', academicLevel: '3er año, curso avanzado', club: 'Club de informática', council: 'N/A', description: 'Un juez, jurado y verdugo del juicio final que te invita a adentrarte aún más en la oscuridad.' },
  { name: 'Yuto Inukai', group: 'Goku Luck', role: 'Profesor', occupation: 'Profesor de educación cívica', classroom: 'Curso avanzado de secundaria, tercer año', club: 'Asesor del club de tiro con arco', description: 'Es un líder con experiencia y trabajador que oculta una dualidad secreta.' },
  { name: 'Kaida Shion', group: 'Goku Luck', role: 'Personal', occupation: 'Médico escolar', club: 'Asesor del club de música', description: 'El travieso médico escolar que seduce a hombres y mujeres de todas las edades.' },

  // BURAIKAN
  { name: 'Kuzuryu Chisei', group: 'BURAIKAN', role: 'Personal', occupation: 'Presidente', description: 'El original y el mejor, un presidente abrumadoramente irracional.' },
  { name: 'Shingu Haruomi', group: 'BURAIKAN', role: 'Personal', occupation: 'Director', description: 'El carismático director que dirige la escuela al lado del presidente.' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'manga' | 'characters' | 'admin'>('manga');
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Form states for Admin
  const [chapNumber, setChapNumber] = useState<number>(1);
  const [chapTitle, setChapTitle] = useState<string>('');
  const [chapPagesText, setChapPagesText] = useState<string>('');
  const [notification, setNotification] = useState<string>('');

  // Load chapters from localStorage on mount
  useEffect(() => {
    const savedChapters = localStorage.getItem('pl_latam_chapters');
    if (savedChapters) {
      try {
        const parsed = JSON.parse(savedChapters);
        setChapters(parsed);
      } catch (e) {
        console.error('Error loading chapters', e);
      }
    } else {
      // Create empty slots for 17 chapters by default
      const initial: Chapter[] = Array.from({ length: 17 }, (_, i) => ({
        id: `cap-${i + 1}`,
        number: i + 1,
        title: `Capítulo ${i + 1}`,
        pages: []
      }));
      setChapters(initial);
      localStorage.setItem('pl_latam_chapters', JSON.stringify(initial));
    }
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const promises = fileList.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target?.result as string || '');
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then((dataUrls) => {
      const formattedUrls = dataUrls.join('\n');
      setChapPagesText((prev) => (prev ? `${prev}\n${formattedUrls}` : formattedUrls));
      showNotification(`${files.length} imagen(es) procesada(s) correctamente.`);
    });
  };

  const handleSaveChapter = (e: React.FormEvent) => {
    e.preventDefault();
    const pages = chapPagesText
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const newChapter: Chapter = {
      id: `cap-${chapNumber}`,
      number: chapNumber,
      title: chapTitle || `Capítulo ${chapNumber}`,
      pages
    };

    const updated = [...chapters];
    const index = updated.findIndex((c) => c.number === chapNumber);

    if (index >= 0) {
      updated[index] = newChapter;
    } else {
      updated.push(newChapter);
      updated.sort((a, b) => a.number - b.number);
    }

    setChapters(updated);
    try {
      localStorage.setItem('pl_latam_chapters', JSON.stringify(updated));
      showNotification(`¡Capítulo ${chapNumber} guardado correctamente!`);
    } catch (err) {
      showNotification('Alerta: Las imágenes superan el límite de almacenamiento local.');
    }

    setChapPagesText('');
    setChapTitle('');
  };

  const handleDeleteChapter = (num: number) => {
    const updated = chapters.filter((c) => c.number !== num);
    setChapters(updated);
    localStorage.setItem('pl_latam_chapters', JSON.stringify(updated));
    showNotification(`Capítulo ${num} eliminado.`);
    if (selectedChapter?.number === num) {
      setSelectedChapter(null);
    }
  };

  const groups = ['ALL', 'BAE', 'cozmez', 'The Cat\'s Whiskers', 'Akanyatsura', 'Amprule', 'VISTY', '1Nm8', 'Goku Luck', 'BURAIKAN'];

  const filteredCharacters = INITIAL_CHARACTERS.filter((c) => {
    const matchesGroup = selectedGroup === 'ALL' || c.group === selectedGroup;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
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
              title="Panel de Control"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Notification Banner */}
      {notification && (
        <div className="bg-pink-600 text-white text-center py-2 px-4 text-sm font-bold animate-pulse">
          {notification}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        {/* MANGA TAB */}
        {activeTab === 'manga' && (
          <div>
            {!selectedChapter ? (
              <div>
                <div className="mb-6 p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <h1 className="text-2xl font-bold text-pink-400 mb-1">Paralove School</h1>
                  <p className="text-slate-400 text-sm">
                    Traducción al español del manga Paralove School e información detallada sobre sus personajes y estudiantes.
                  </p>
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
              /* Reader View */
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

                {/* Chapter Images */}
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

        {/* CHARACTERS TAB */}
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

              {/* Group Filter */}
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

            {/* Characters List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCharacters.map((char, index) => (
                <div key={index} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-white">{char.name}</h3>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-950 text-pink-300 border border-pink-800">
                          {char.group}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                          {char.role}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 mb-3 text-xs text-slate-400">
                      {char.academicLevel && <p><strong className="text-slate-300">Nivel académico:</strong> {char.academicLevel}</p>}
                      {char.occupation && <p><strong className="text-slate-300">Ocupación:</strong> {char.occupation}</p>}
                      {char.classroom && <p><strong className="text-slate-300">Aula:</strong> {char.classroom}</p>}
                      {char.club && <p><strong className="text-slate-300">Club:</strong> {char.club}</p>}
                      {char.council && <p><strong className="text-slate-300">Consejo estudiantil:</strong> {char.council}</p>}
                    </div>

                    <p className="text-sm text-slate-300 italic">{char.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ADMIN TAB */}
        {activeTab === 'admin' && (
          <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-pink-400">
              <Settings size={22} />
              Panel de Administración
            </h2>

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
                <label className="block text-xs font-bold text-slate-400 mb-1">Subir Fotos desde la Galería</label>
                <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-700 hover:border-pink-500 rounded-xl cursor-pointer bg-slate-950 transition">
                  <Upload size={24} className="text-slate-400 mb-1" />
                  <span className="text-xs font-semibold text-slate-300">Seleccionar fotos de la Galería</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">
                  URLs de las Páginas (Una por línea o generadas automáticamente)
                </label>
                <textarea
                  rows={4}
                  value={chapPagesText}
                  onChange={(e) => setChapPagesText(e.target.value)}
                  placeholder="Pega las URLs de las imágenes o usa el botón de arriba"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none focus:border-pink-500 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-2.5 rounded-lg transition flex items-center justify-center gap-2 text-sm"
              >
                <Save size={18} />
                Guardar / Publicar Capítulo
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
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        <p>PARADOX LIVE LATINOAMERICA &copy; Proyecto Fan-made sin fines de lucro.</p>
      </footer>
    </div>
  );
}

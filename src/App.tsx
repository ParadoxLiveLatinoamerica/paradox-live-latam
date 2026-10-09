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
  Search,
  Lock,
  Eye,
  EyeOff
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

const ADMIN_PASSWORD = "paradoxlatamadmin";

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

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [inputPassword, setInputPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>('');

  const [chapNumber, setChapNumber] = useState<number>(1);
  const [chapTitle, setChapTitle] = useState<string>('');
  const [chapPagesText, setChapPagesText] = useState<string>('');
  const [notification, setNotification] = useState<string>('');

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

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPassword === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      setPasswordError('');
      setInputPassword('');
    } else {
      setPasswordError('Contraseña incorrecta. Solo el administrador puede entrar.');
    }
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

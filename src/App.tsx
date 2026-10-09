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
  Users,
  CheckCircle2
} from 'lucide-react';

// ==========================================
// CONEXIÓN A SUPABASE CON PROTECCIÓN TOTAL ANTI-CRASH
// ==========================================
const supabaseUrl = "https://oblliicjkguzifjnmvay.supabase.co";
const supabaseAnonKey = "sb_publishable_GypvVUE5PIbGyZf4YfT2gw_0aRGPn9i";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Chapter {
  id: string;
  number: number;
  title: string;
  pages: string[];
  credits?: string;
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
  { id: 'char-13', name: 'Maruyama Reo', group: 'Akanyatsura', role: 'Estudiante', academicLevel: '1er año, curso general, Clase E', club: 'Club de música', council: 'N/A', description: 'Un pequeño y astuto demonio que se ganó el apodo de "El Senpai Asesino".', image: 'https://i.imgur.com/MMda3Im.jpeg' },
  { id: 'char-14', name: 'Ito Satsuki', group: 'Akanyatsura', role: 'Estudiante', academicLevel: '1er año, curso general, Clase A', club: 'Club de baloncesto', council: 'N/A', description: 'Un delincuente de élite que has logrado la impresionante hazaña de reprobar absolutamente todas las materias.', image: 'https://i.imgur.com/S1sMDHB.jpeg' },
  { id: 'char-15', name: 'Yeon Dongha', group: 'Amprule', role: 'Estudiante', academicLevel: '3er año, curso avanzado', club: 'Club de arte', council: 'Presidente del consejo estudiantil de secundaria', description: 'Este pequeño emperador gobierna con puño de hierro sobre la clase de secundaria.', image: 'https://i.imgur.com/ysTNgqU.jpeg' },
  { id: 'char-16', name: 'Baek Chungsung', group: 'Amprule', role: 'Profesor', occupation: 'Profesor de arte', classroom: 'Curso avanzado de secundaria, segundo año', club: 'Asesor del club de arte', description: 'Este es sin dudas, un profesor masoquista que espera ansiosamente ser castigado por su amo.', image: 'https://i.imgur.com/FRQxsWT.jpeg' },
  { id: 'char-17', name: 'Yamato Shogo', group: 'VISTY', role: 'Estudiante', academicLevel: '2do año, curso general, Clase D', club: 'Presidente del club de astronomía', council: 'N/A', description: 'Un joven serio pero un poco tonto, realmente ama las estrellas y las gomitas.', image: 'https://i.imgur.com/wIHHDdY.jpeg' },
  { id: 'char-18', name: 'Hikage Toma', group: 'VISTY', role: 'Estudiante', academicLevel: '3er año, curso general, Clase F', club: 'Club de música', council: 'Comité ejecutivo del festival cultural', description: 'Un auténtico fiestero con mucho amor para dar, ama la paz y los consejos de belleza.', image: 'https://i.imgur.com/vVq3D6c.jpeg' },
  { id: 'char-19', name: 'Misuji Kantaro', group: 'VISTY', role: 'Estudiante', academicLevel: '1er año, curso general, Clase C', club: 'Club de artesanía', council: 'Comité ejecutivo del festival cultural', description: 'Es un joven con ojos de cachorrito que prioriza verse bien en las redes sociales.', image: 'https://i.imgur.com/Wm0sJAF.jpeg' },
  { id: 'char-20', name: 'Kureha Aoi', group: 'VISTY', role: 'Estudiante', academicLevel: '1er año, curso general, Clase A', club: 'Club de teatro, club de jardinería', council: 'N/D', description: 'El príncipe fresco y hermoso del club de teatro.', image: 'https://i.imgur.com/TpB547T.jpeg' },
  { id: 'char-21', name: 'Itsuki', group: '1Nm8', role: 'Estudiante', academicLevel: '2do año, curso avanzado', club: 'Club de ciencias', council: 'Comité de biblioteca', description: 'Un entusiasta de la eficiencia y precisión sin igual.', image: 'https://i.imgur.com/ZVeW5O8.jpeg' },
  { id: 'char-22', name: 'Rokuta', group: '1Nm8', role: 'Estudiante', academicLevel: '1er año, curso general, Clase E', club: 'Club de estudios culinarios', council: 'Comité ejecutivo del festival deportivo', description: 'Un niño que parece un cachorro y que infunde miedo en los corazones de los empleados de la tienda de la escuela.', image: 'https://i.imgur.com/PKG84GJ.jpeg' },
  { id: 'char-23', name: 'Miyama Kei', group: '1Nm8', role: 'Estudiante', academicLevel: '3er año, curso avanzado', club: 'No está en ningún club', council: 'Comité de biblioteca', description: 'Un hermoso joven lleno de misterio que pasa mucho tiempo en la enfermería.', image: 'https://i.imgur.com/RarkCZT.jpeg' },
  { id: 'char-24', name: 'Tosa Ryoga', group: 'Goku Luck', role: 'Estudiante', academicLevel: '3er año, curso general, Clase F', club: 'Club de judo', council: 'N/A', description: 'Es como un incontrolable perro rabioso.', image: 'https://i.imgur.com/fYY5foO.jpeg' },
  { id: 'char-25', name: 'Mikoshiba Kenta', group: 'Goku Luck', role: 'Estudiante', academicLevel: '3er año, curso avanzado', club: 'Club de informática', council: 'N/A', description: 'Un juez, jurado y verdugo del juicio final que te invita a adentrarte aún más en la oscuridad.', image: 'https://i.imgur.com/ZdsQ7OU.jpeg' },
  { id: 'char-26', name: 'Yuto Inukai', group: 'Goku Luck', role: 'Profesor', occupation: 'Profesor de educación cívica', classroom: 'Curso avanzado de secundaria, tercer año', club: 'Asesor del club de tiro con arco', description: 'Es un líder con experiencia y trabajador que oculta una dualidad secreta.', image: 'https://i.imgur.com/x8YIWtc.jpeg' },
  { id: 'char-27', name: 'Kaida Shion', group: 'Goku Luck', role: 'Personal', occupation: 'Médico escolar', club: 'Asesor del club de música', description: 'El travieso médico escolar que seduce a hombres y mujeres de todas las edades.', image: 'https://i.imgur.com/QEXC2WB.jpeg' },
  { id: 'char-28', name: 'Kuzuryu Chisei', group: 'BURAIKAN', role: 'Personal', occupation: 'Presidente', description: 'El original y el mejor, un presidente abrumadoramente irracional.', image: 'https://i.imgur.com/Exq5phR.jpeg' },
  { id: 'char-29', name: 'Shingu Haruomi', group: 'BURAIKAN', role: 'Personal', occupation: 'Director', description: 'El carismático director que dirige la escuela al lado del presidente.', image: 'https://i.imgur.com/iY8x4Zh.jpeg' }
];

const INITIAL_CHAPTERS: Chapter[] = [
  { id: "cap-1", number: 1, title: "Capítulo 1", pages: ["https://i.imgur.com/XAS2iVk.jpeg", "https://i.imgur.com/MNnUKjM.jpeg", "https://i.imgur.com/f8c4j3Y.jpeg"], credits: "Traducido y editado por Paradox Live Latam" },
  { id: "cap-2", number: 2, title: "Capítulo 2", pages: ["https://i.imgur.com/m6xdydz.jpeg", "https://i.imgur.com/qdxNUtl.jpeg", "https://i.imgur.com/muYCLJu.jpeg"], credits: "Traducido y editado por Paradox Live Latam" },
  { id: "cap-3", number: 3, title: "Capítulo 3", pages: ["https://i.imgur.com/UkUEZgZ.jpeg", "https://i.imgur.com/4B5x9D3.jpeg", "https://i.imgur.com/B8NZCid.jpeg"], credits: "Traducido y editado por Paradox Live Latam" },
  { id: "cap-4", number: 4, title: "Capítulo 4", pages: ["https://i.imgur.com/GIAOdMn.jpeg", "https://i.imgur.com/eb1XJ1m.jpeg", "https://i.imgur.com/HUSfxHU.jpeg"], credits: "Traducido y editado por Paradox Live Latam" },
  { id: "cap-5", number: 5, title: "Capítulo 5", pages: ["https://i.imgur.com/eMYK4rf.jpeg", "https://i.imgur.com/mlCE4l2.jpeg", "https://i.imgur.com/53E0xQx.jpeg"], credits: "Traducido y editado por Paradox Live Latam" },
  { id: "cap-6", number: 6, title: "Capítulo 6", pages: ["https://i.imgur.com/FsxIjzl.jpeg", "https://i.imgur.com/rCAUxk7.jpeg", "https://i.imgur.com/IkehzeN.jpeg"], credits: "Traducido y editado por Paradox Live Latam" },
  { id: "cap-7", number: 7, title: "Capítulo 7", pages: ["https://i.imgur.com/hqTZC4U.jpeg", "https://i.imgur.com/MclvqJB.jpeg", "https://i.imgur.com/91vl20j.jpeg"], credits: "Traducido y editado por Paradox Live Latam" },
  { id: "cap-8", number: 8, title: "Capítulo 8", pages: ["https://i.imgur.com/STbr9j4.jpeg", "https://i.imgur.com/rkWqRz1.jpeg", "https://i.imgur.com/tswZG2s.jpeg"], credits: "Traducido y editado por Paradox Live Latam" },
  { id: "cap-9", number: 9, title: "Capítulo 9", pages: ["https://i.imgur.com/gVLfs6a.jpeg", "https://i.imgur.com/FHeE3jn.jpeg", "https://i.imgur.com/wXboHVj.jpeg"], credits: "Traducido y editado por Paradox Live Latam" },
  { id: "cap-10", number: 10, title: "Capítulo 10", pages: ["https://i.imgur.com/WzET5Vk.jpeg", "https://i.imgur.com/dNW2FNP.jpeg", "https://i.imgur.com/paV5s6V.jpeg"], credits: "Traducido y editado por Paradox Live Latam" },
  { id: "cap-11", number: 11, title: "Capítulo 11", pages: ["https://i.imgur.com/8WSFFO2.jpeg", "https://i.imgur.com/wdkRbE6.jpeg", "https://i.imgur.com/3nG4Cgr.jpeg"], credits: "Traducido y editado por Paradox Live Latam" },
  { id: "cap-12", number: 12, title: "Capítulo 12", pages: ["https://i.imgur.com/HLSyQTe.jpeg", "https://i.imgur.com/tQB9nFt.jpeg", "https://i.imgur.com/dOhFz2J.jpeg"], credits: "Traducido y editado por Paradox Live Latam" },
  { id: "cap-13", number: 13, title: "Capítulo 13", pages: ["https://i.imgur.com/NRXI5qk.jpeg", "https://i.imgur.com/2JIyzIS.jpeg", "https://i.imgur.com/GJJTjVr.jpeg"], credits: "Traducido y editado por Paradox Live Latam" },
  { id: "cap-14", number: 14, title: "Capítulo 14", pages: ["https://i.imgur.com/GQ09xoh.jpeg", "https://i.imgur.com/4BXRA9b.jpeg", "https://i.imgur.com/HSDp1Xt.jpeg"], credits: "Traducido y editado por Paradox Live Latam" },
  { id: "cap-15", number: 15, title: "Capítulo 15", pages: ["https://i.imgur.com/bkXSM8F.jpeg", "https://i.imgur.com/8HLCfd6.jpeg", "https://i.imgur.com/t9xI5JD.jpeg"], credits: "Traducido y editado por Paradox Live Latam" },
  { id: "cap-16", number: 16, title: "Capítulo 16", pages: ["https://i.imgur.com/ZMKcYkh.jpeg", "https://i.imgur.com/xOclLfS.jpeg", "https://i.imgur.com/nCcNLPJ.jpeg"], credits: "Traducido y editado por Paradox Live Latam" },
  { id: "cap-17", number: 17, title: "Capítulo 17", pages: ["https://i.imgur.com/LwAKthp.jpeg", "https://i.imgur.com/UP8n6at.jpeg", "https://i.imgur.com/X41npYa.jpeg"], credits: "Traducido y editado por Paradox Live Latam" },
  { id: "cap-18", number: 18, title: "Capítulo 18", pages: ["https://i.imgur.com/Ld0Hg4X.jpeg", "https://i.imgur.com/fuCJD1Q.jpeg", "https://i.imgur.com/5tUjryh.jpeg"], credits: "Traducido y editado por Paradox Live Latam" }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'manga' | 'characters' | 'admin'>('manga');
  const [chapters, setChapters] = useState<Chapter[]>(INITIAL_CHAPTERS);
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
  const [chapCredits, setChapCredits] = useState<string>('Traducción y edición: Paradox Live Latam');
  
  const [selectedCharId, setSelectedCharId] = useState<string>(INITIAL_CHARACTERS[0].id);
  const [charImageUrl, setCharImageUrl] = useState<string>('');

  const [notification, setNotification] = useState<string>('');
  const [readChapters, setReadChapters] = useState<Record<number, boolean>>({});

  useEffect(() => {
    loadChaptersSafely();
    const savedStatus = localStorage.getItem('pl_latam_status');
    if (savedStatus) setMangaStatus(savedStatus);
    setCharacters(INITIAL_CHARACTERS);

    // Cargar capítulos marcados como leídos
    const savedRead = localStorage.getItem('pl_latam_read_chapters');
    if (savedRead) {
      try {
        setReadChapters(JSON.parse(savedRead));
      } catch (e) {}
    }
  }, []);

  const toggleReadStatus = (num: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = { ...readChapters, [num]: !readChapters[num] };
    setReadChapters(updated);
    localStorage.setItem('pl_latam_read_chapters', JSON.stringify(updated));
    showNotification(updated[num] ? `Capítulo ${num} marcado como visto` : `Capítulo ${num} desmarcado`);
  };

  const loadChaptersSafely = async () => {
    try {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .order('number', { ascending: true });

      if (!error && data && data.length > 0) {
        const formatted: Chapter[] = data.map((item: any) => ({
          id: item.id || `cap-${item.number}`,
          number: item.number,
          title: item.title || `Capítulo ${item.number}`,
          pages: item.pages || [],
          credits: item.credits || 'Traducido y editado por Paradox Live Latam'
        }));
        setChapters(formatted);
        return;
      }
    } catch (err) {
      console.log("Usando respaldo local por seguridad");
    }

    const saved = localStorage.getItem('pl_latam_chapters');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          setChapters(parsed);
          return;
        }
      } catch (e) {}
    }
    setChapters(INITIAL_CHAPTERS);
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

  const handleSaveChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    const pages = chapPagesText
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const newChapter: Chapter = {
      id: `cap-${chapNumber}`,
      number: chapNumber,
      title: chapTitle || `Capítulo ${chapNumber}`,
      pages,
      credits: chapCredits.trim() || 'Traducido y editado por Paradox Live Latam'
    };

    try {
      await supabase
        .from('chapters')
        .upsert([newChapter], { onConflict: 'id' });
    } catch (err) {
      console.error("Supabase error al guardar:", err);
    }

    const updated = [...chapters];
    const index = updated.findIndex((c) => c.number === chapNumber);
    if (index >= 0) {
      updated[index] = newChapter;
    } else {
      updated.push(newChapter);
      updated.sort((a, b) => a.number - b.number);
    }

    setChapters(updated);
    localStorage.setItem('pl_latam_chapters', JSON.stringify(updated));
    showNotification(`¡Capítulo ${chapNumber} guardado y publicado!`);
    setChapPagesText('');
    setChapTitle('');
    loadChaptersSafely();
  };

  const handleDeleteChapter = async (num: number) => {
    if (!window.confirm(`¿Estás seguro de eliminar el capítulo ${num}?`)) return;

    try {
      await supabase.from('chapters').delete().eq('number', num);
    } catch (err) {}

    const updated = chapters.filter((c) => c.number !== num);
    setChapters(updated);
    localStorage.setItem('pl_latam_chapters', JSON.stringify(updated));
    showNotification(`Capítulo ${num} eliminado.`);
    if (selectedChapter?.number === num) setSelectedChapter(null);
  };

  const handleUpdateCharacterImage = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = characters.map((c) => {
      if (c.id === selectedCharId) {
        return { ...c, image: charImageUrl.trim() };
      }
      return c;
    });
    setCharacters(updated);
    localStorage.setItem('pl_latam_characters', JSON.stringify(updated));
    showNotification('¡Foto de personaje actualizada!');
    setCharImageUrl('');
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
                  {chapters.map((chap) => {
                    const isRead = readChapters[chap.number];
                    return (
                      <div
                        key={chap.id}
                        onClick={() => setSelectedChapter(chap)}
                        className={`p-4 rounded-xl bg-slate-900 border cursor-pointer transition flex items-center justify-between group ${isRead ? 'border-emerald-500/40 bg-slate-900/80' : 'border-slate-800 hover:border-pink-500/50'}`}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => toggleReadStatus(chap.number, e)}
                            className={`p-2 rounded-lg transition ${isRead ? 'text-emerald-400 bg-emerald-950/60' : 'text-slate-500 hover:text-slate-300 bg-slate-950'}`}
                            title={isRead ? "Marcado como visto" : "Marcar como visto"}
                          >
                            {isRead ? <Eye size={18} /> : <EyeOff size={18} />}
                          </button>
                          <div>
                            <span className="font-bold text-white group-hover:text-pink-400 transition flex items-center gap-1.5">
                              Capítulo {chap.number}
                              {isRead && <CheckCircle2 size={14} className="text-emerald-400" />}
                            </span>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {chap.pages.length > 0 ? `${chap.pages.length} páginas` : 'Próximamente'}
                            </p>
                          </div>
                        </div>
                        <ChevronRight size={18} className="text-slate-600 group-hover:text-pink-400 transition" />
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div>
                {/* Título arriba limpio */}
                <div className="text-center mb-6">
                  <span className="text-xs uppercase tracking-widest text-pink-500 font-bold">Paralove School</span>
                  <h2 className="text-2xl font-bold text-white">Capítulo {selectedChapter.number} {selectedChapter.title ? `- ${selectedChapter.title}` : ''}</h2>
                </div>

                {/* Páginas del manga */}
                <div className="flex flex-col items-center gap-2 max-w-2xl mx-auto mb-8">
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

                {/* Créditos de traducción al finalizar el capítulo */}
                <div className="max-w-2xl mx-auto mb-8 p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Créditos de este capítulo</p>
                  <p className="text-sm font-bold text-pink-400">{selectedChapter.credits || 'Traducido y editado por Paradox Live Latam'}</p>
                </div>

                {/* Navegación y Botones ABAJO (Más cómodo) */}
                <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800 mb-10">
                  <button
                    onClick={() => {
                      const currentNum = selectedChapter.number;
                      const updated = { ...readChapters, [currentNum]: true };
                      setReadChapters(updated);
                      localStorage.setItem('pl_latam_read_chapters', JSON.stringify(updated));
                      setSelectedChapter(null);
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                  >
                    <BookOpen size={16} />
                    Volver a Lista
                  </button>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
                    {selectedChapter.number > 1 && (
                      <button
                        onClick={() => {
                          const prev = chapters.find((c) => c.number === selectedChapter.number - 1);
                          if (prev) setSelectedChapter(prev);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-semibold text-sm transition"
                      >
                        <ChevronLeft size={16} />
                        Anterior
                      </button>
                    )}
                    {selectedChapter.number < chapters.length && (
                      <button
                        onClick={() => {
                          const currentNum = selectedChapter.number;
                          const updated = { ...readChapters, [currentNum]: true };
                          setReadChapters(updated);
                          localStorage.setItem('pl_latam_read_chapters', JSON.stringify(updated));
                          
                          const next = chapters.find((c) => c.number === selectedChapter.number + 1);
                          if (next) setSelectedChapter(next);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-semibold text-sm transition"
                      >
                        Siguiente
                        <ChevronRight size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Lista Completa de Capítulos al Final */}
                <div className="max-w-2xl mx-auto border-t border-slate-800 pt-6">
                  <h3 className="text-md font-bold mb-3 text-slate-300 flex items-center gap-2">
                    <BookOpen size={16} className="text-pink-500" />
                    Seleccionar otro capítulo
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {chapters.map((chap) => {
                      const isCurrent = chap.number === selectedChapter.number;
                      const isRead = readChapters[chap.number];
                      return (
                        <button
                          key={chap.id}
                          onClick={() => {
                            setSelectedChapter(chap);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`p-2.5 rounded-lg text-xs font-bold transition flex items-center justify-between ${isCurrent ? 'bg-pink-600 text-white' : isRead ? 'bg-emerald-950/60 border border-emerald-800/60 text-emerald-300' : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-pink-500'}`}
                        >
                          <span>Cap. {chap.number}</span>
                          {isRead && <CheckCircle2 size={12} className="text-emerald-400" />}
                        </button>
                      );
                    })}
                  </div>
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
                    <label className="block text-xs font-bold text-slate-400 mb-1">Créditos de Traducción / Edición</label>
                    <input
                      type="text"
                      placeholder="Ej: Trad. TuNombre / Ed. TuNombre"
                      value={chapCredits}
                      onChange={(e) => setChapCredits(e.target.value)}
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
                    Guardar y Publicar Capítulo
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

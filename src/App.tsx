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
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, deleteDoc, onSnapshot, collection } from 'firebase/firestore';

const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        resolve(canvas.toDataURL('image/jpeg', 0.5));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

const safeLocalStorageSave = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn("Storage quota exceeded. Skipping local backup for large payload:", e);
    try {
      if (Array.isArray(data)) {
        const lightData = data.map(item => ({
          id: item.id,
          number: item.number,
          title: item.title,
          pageCount: item.pages ? item.pages.length : 0
        }));
        localStorage.setItem(`${key}_meta`, JSON.stringify(lightData));
      }
    } catch (metaErr) {
      console.warn("Meta storage also failed:", metaErr);
    }
  }
};

export default function App() {
  const [user, setUser] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [view, setView] = useState('home');
  const [currentChapter, setCurrentChapter] = useState(null);
  const [characterSearch, setCharacterSearch] = useState('');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState('Todos');

  const [adminChapNumber, setAdminChapNumber] = useState('');
  const [adminChapTitle, setAdminChapTitle] = useState('');
  const [adminChapPages, setAdminChapPages] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [notification, setNotification] = useState('');

  const teamsData = [
    {
      team: "BAE",
      color: "from-pink-600 to-purple-600",
      members: [
        { 
          name: "Sugasano Allen", 
          role: "Estudiante", 
          grade: "2do año, curso general, Clase C",
          club: "Presidente del club de hip-hop",
          council: "N/A",
          desc: "Un presidente del club de hip-hop que aspira a que el club llegue a la cima una vez que se graduen." 
        },
        { 
          name: "Yeon Hajun", 
          role: "Estudiante", 
          grade: "2do año, curso avanzado",
          club: "Club de tenis",
          council: "Presidente del consejo estudiantil de la escuela secundaria",
          desc: "El noble sonriente que dirige la escuela como si fuera su propio castillo." 
        },
        { 
          name: "Anne Faulkner", 
          role: "Estudiante", 
          grade: "2do año, curso general, Clase B",
          club: "Presidenta del club de sastrería",
          council: "Comité ejecutivo del festival cultural",
          desc: "Un influencer abrumadoramente popular." 
        }
      ]
    },
    {
      team: "cozmez",
      color: "from-blue-600 to-indigo-700",
      members: [
        { 
          name: "Yatonokami Kanata", 
          role: "Estudiante", 
          grade: "2do año, curso general, Clase C",
          club: "No está en ningún club",
          council: "N/A",
          desc: "Una persona que no tiene miedo de arriesgarse, solo se presenta los días que son necesarios para no reprobar." 
        },
        { 
          name: "Yatonokami Nayuta", 
          role: "Estudiante", 
          grade: "2do año, curso general, Clase B",
          club: "No está en ningún club",
          council: "N/A",
          desc: "Es el holgazán de clase S más poderoso en la historia de la escuela." 
        }
      ]
    },
    {
      team: "The Cat's Whiskers",
      color: "from-amber-600 to-red-700",
      members: [
        { 
          name: "Saimon Naoakira", 
          role: "Profesor", 
          occupation: "Profesor de japonés",
          classroom: "Curso avanzado de secundaria, primeros años",
          club: "Asesor del club de teatro",
          desc: "Un guardián del tiempo cuya hermosa voz atrajo a miles de estudiantes a una tierra de los sueños." 
        },
        { 
          name: "Kanbayashi Yohei", 
          role: "Jefe de conserjes", 
          occupation: "Jefe de conserjes",
          classroom: "N/A",
          club: "No afiliado",
          desc: "Es el guardián de la escuela, siempre está armado con alcohol y cigarrillos." 
        },
        { 
          name: "Natsume Ryu", 
          role: "Estudiante", 
          grade: "?",
          club: "?",
          council: "N/A",
          desc: "Un excelente ejemplo de una persona que se supone que ya se ha graduado, pero aún así aparece en el campus todos los días." 
        },
        { 
          name: "Ando Shiki", 
          role: "Estudiante", 
          grade: "1er año, curso avanzado",
          club: "Club de fútbol",
          council: "Departamento de animales",
          desc: "Es un niño con buena salud y es tan serio que da miedo." 
        }
      ]
    },
    {
      team: "Akanyatsura",
      color: "from-emerald-600 to-teal-800",
      members: [
        { 
          name: "Suiseki Iori", 
          role: "Profesor", 
          occupation: "Profesor de matemáticas",
          classroom: "Curso general de secundaria, 3er año, clase F",
          club: "Asesor del club de baloncesto",
          desc: "Es un completo demonio de cálculo mental que inculca en las cabezas de sus alumnos un espíritu temerario y un buen sentido de contabilidad financiera." 
        },
        { 
          name: "Gaho Zen", 
          role: "Profesor", 
          occupation: "Profesor de educación física",
          classroom: "Curso general de secundaria, 2º año, clase C",
          club: "Asesor del club de judo",
          desc: "Es un gran fanfarrón con los bíceps, y tiene los músculos más voluminosos de la escuela." 
        },
        { 
          name: "Masaki Hokusai", 
          role: "Estudiante", 
          grade: "3er año, curso general, Clase D",
          club: "Club de tiro con arco",
          council: "Departamento de animales",
          desc: "Es un gigante gentil que prefiere pasar tiempo en el patio con los gatos en lugar de asistir a clases." 
        },
        { 
          name: "Maruyama Reo", 
          role: "Estudiante", 
          grade: "1er año, curso general, Clase E",
          club: "Club de música",
          council: "N/A",
          desc: "Un pequeño y astuto demonio que se ganó el apodo de 'El Senpai Asesino'." 
        },
        { 
          name: "Ito Satsuki", 
          role: "Estudiante", 
          grade: "1er año, curso general, Clase A",
          club: "Club de baloncesto",
          council: "N/A",
          desc: "Un delincuente de élite que ha logrado la impresionante hazaña de reprobar absolutamente todas las materias." 
        }
      ]
    },
    {
      team: "Amprule",
      color: "from-purple-700 to-indigo-900",
      members: [
        { 
          name: "Yeon Dongha", 
          role: "Estudiante", 
          grade: "3er año, curso avanzado",
          club: "Club de arte",
          council: "Presidente del consejo estudiantil de secundaria",
          desc: "Este pequeño emperador gobierna con puño de hierro sobre la clase de secundaria." 
        },
        { 
          name: "Baek Chungsung", 
          role: "Profesor", 
          occupation: "Profesor de arte",
          classroom: "Curso avanzado de secundaria, segundo año",
          club: "Asesor del club de arte",
          desc: "Este es sin dudas, un profesor masoquista que espera ansiosamente ser castigado por su amo." 
        }
      ]
    },
    {
      team: "VISTY",
      color: "from-sky-500 to-pink-500",
      members: [
        { 
          name: "Yamato Shogo", 
          role: "Estudiante", 
          grade: "2do año, curso general, Clase D",
          club: "Presidente del club de astronomía",
          council: "N/A",
          desc: "Un joven serio pero un poco tonto, realmente ama las estrellas y las gomitas." 
        },
        { 
          name: "Hikage Toma", 
          role: "Estudiante", 
          grade: "3er año, curso general, Clase F",
          club: "Club de música",
          council: "Comité ejecutivo del festival cultural",
          desc: "Un auténtico fiestero con mucho amor para dar, ama la paz y los consejos de belleza." 
        },
        { 
          name: "Misuji Kantaro", 
          role: "Estudiante", 
          grade: "1er año, curso general, Clase C",
          club: "Club de artesanía",
          council: "Comité ejecutivo del festival cultural",
          desc: "Es un joven con ojos de cachorrito que prioriza verse bien en las redes sociales." 
        },
        { 
          name: "Kureha Aoi", 
          role: "Estudiante", 
          grade: "1er año, curso general, Clase A",
          club: "Club de teatro, club de jardinería",
          council: "N/D",
          desc: "El príncipe fresco y hermoso del club de teatro." 
        }
      ]
    },
    {
      team: "1Nm8",
      color: "from-cyan-600 to-blue-800",
      members: [
        { 
          name: "Itsuki", 
          role: "Estudiante", 
          grade: "2do año, curso avanzado",
          club: "Club de ciencias",
          council: "Comité de biblioteca",
          desc: "Un entusiasta de la eficiencia y precisión sin igual." 
        },
        { 
          name: "Rokuta", 
          role: "Estudiante", 
          grade: "1er año, curso general, Clase E",
          club: "Club de estudios culinarios",
          council: "Comité ejecutivo del festival deportivo",
          desc: "Un niño que parece un cachorro y que infunde miedo en los corazones de los empleados de la tienda de la escuela." 
        },
        { 
          name: "Miyama Kei", 
          role: "Estudiante", 
          grade: "3er año, curso avanzado",
          club: "No está en ningún club",
          council: "Comité de biblioteca",
          desc: "Un hermoso joven lleno de misterio que pasa mucho tiempo en la enfermería." 
        }
      ]
    },
    {
      team: "Goku Luck",
      color: "from-red-600 to-orange-600",
      members: [
        { 
          name: "Tosa Ryoga", 
          role: "Estudiante", 
          grade: "3er año, curso general, Clase F",
          club: "Club de judo",
          council: "N/A",
          desc: "Es como un incontrolable perro rabioso." 
        },
        { 
          name: "Mikoshiba Kenta", 
          role: "Estudiante", 
          grade: "3er año, curso avanzado",
          club: "Club de informática",
          council: "N/A",
          desc: "Un juez, jurado y verdugo del juicio final que te invita a adentrarte aún más en la oscuridad." 
        },
        { 
          name: "Yuto Inukai", 
          role: "Profesor", 
          occupation: "Profesor de educación cívica, oficial de orientación no curricular",
          classroom: "Curso avanzado de secundaria, tercer año",
          club: "Asesor del club de tiro con arco",
          desc: "Es un líder con experiencia y trabajador que oculta una dualidad secreta." 
        },
        { 
          name: "Kaida Shion", 
          role: "Médico escolar", 
          occupation: "Médico escolar",
          classroom: "N/A",
          club: "Asesor del club de música",
          desc: "El travieso médico escolar que seduce a hombres y mujeres de todas las edades." 
        }
      ]
    },
    {
      team: "BURAIKAN",
      color: "from-amber-500 to-yellow-600",
      members: [
        { 
          name: "Kuzuryu Chisei", 
          role: "Directivo", 
          occupation: "Presidente",
          classroom: "N/A",
          club: "N/A",
          desc: "El original y el mejor, un presidente abrumadoramente irracional que se deleita en hacer que otros se encarguen de limpiar sus travesuras." 
        },
        { 
          name: "Shingu Haruomi", 
          role: "Directivo", 
          occupation: "Director",
          classroom: "N/A",
          club: "N/A",
          desc: "El carismático director que dirige la escuela al lado del presidente." 
        }
      ]
    }
  ];

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        signInAnonymously(auth).catch((err) => console.warn("Aviso en autenticación anónima:", err?.message || err));
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    try {
      const localData = localStorage.getItem('manga_chapters_backup');
      if (localData) {
        setChapters(JSON.parse(localData));
      }
    } catch (e) {
      console.warn("Could not load local storage chapters:", e);
    }

    const chaptersRef = collection(db, 'artifacts', appId, 'public_chapters');
    const unsubscribeDoc = onSnapshot(chaptersRef, (snapshot) => {
      const fetchedChapters = [];
      snapshot.forEach((docSnap) => {
        fetchedChapters.push({ id: docSnap.id, ...docSnap.data() });
      });
      
      fetchedChapters.sort((a, b) => Number(a.number) - Number(b.number));
      
      if (fetchedChapters.length > 0) {
        setChapters(fetchedChapters);
        safeLocalStorageSave('manga_chapters_backup', fetchedChapters);
      }
    }, (err) => {
      console.warn("Firestore access info (using local storage fallback):", err?.message || err);
    });

    return () => unsubscribeDoc();
  }, []);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleUploadChapter = async (e) => {
    e.preventDefault();
    if (!adminChapNumber || !adminChapPages.trim()) {
      showNotification("Por favor ingresa un número de capítulo y al menos una URL de imagen o archivo.");
      return;
    }

    const pagesArray = adminChapPages
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    if (pagesArray.length === 0) {
      showNotification("No se detectaron páginas válidas.");
      return;
    }

    const newChapter = {
      id: `chap_${Date.now()}`,
      number: adminChapNumber,
      title: adminChapTitle || `Capítulo ${adminChapNumber}`,
      pages: pagesArray,
      createdAt: new Date().toISOString()
    };

    const updatedList = [...chapters.filter(c => c.number !== adminChapNumber), newChapter];
    updatedList.sort((a, b) => Number(a.number) - Number(b.number));
    setChapters(updatedList);
    safeLocalStorageSave('manga_chapters_backup', updatedList);

    try {
      const chapDocRef = doc(db, 'artifacts', appId, 'public_chapters', newChapter.id);
      await setDoc(chapDocRef, newChapter);
      showNotification(`¡Capítulo ${adminChapNumber} publicado con éxito!`);
    } catch (err) {
      console.warn("Firestore sync skipped due to permissions. Saved locally:", err?.message || err);
      showNotification(`¡Capítulo ${adminChapNumber} guardado localmente en tu navegador!`);
    }

    setAdminChapNumber('');
    setAdminChapTitle('');
    setAdminChapPages('');
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    setIsCompressing(true);
    showNotification("Procesando y optimizando imágenes...");

    try {
      const compressedPages = [];
      for (const file of files) {
        const compressedDataUrl = await compressImage(file);
        compressedPages.push(compressedDataUrl);
      }

      setAdminChapPages((prev) => {
        const existing = prev ? prev + '\n' : '';
        return existing + compressedPages.join('\n');
      });

      showNotification(`¡${files.length} página(s) optimizada(s) e insertada(s)!`);
    } catch (error) {
      console.error("Error al comprimir imágenes:", error);
      showNotification("Error procesando una o más imágenes.");
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDeleteChapter = async (chapId) => {
    const updatedList = chapters.filter(c => c.id !== chapId);
    setChapters(updatedList);
    safeLocalStorageSave('manga_chapters_backup', updatedList);

    try {
      const chapDocRef = doc(db, 'artifacts', appId, 'public_chapters', chapId);
      await deleteDoc(chapDocRef);
      showNotification("Capítulo eliminado.");
    } catch (err) {
      console.warn("Firestore delete skipped due to permissions. Deleted locally:", err?.message || err);
      showNotification("Capítulo eliminado localmente.");
    }
  };

  const openChapter = (chap) => {
    setCurrentChapter(chap);
    setView('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getAdjacentChapters = () => {
    if (!currentChapter) return { prev: null, next: null };
    const currentIndex = chapters.findIndex(c => c.id === currentChapter.id);
    const prev = currentIndex > 0 ? chapters[currentIndex - 1] : null;
    const next = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;
    return { prev, next };
  };

  const filteredTeams = teamsData.map(t => {
    if (selectedTeamFilter !== 'Todos' && t.team !== selectedTeamFilter) {
      return null;
    }

    const filteredMembers = t.members.filter(m => {
      const q = characterSearch.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        (m.role && m.role.toLowerCase().includes(q)) ||
        (m.grade && m.grade.toLowerCase().includes(q)) ||
        (m.club && m.club.toLowerCase().includes(q)) ||
        (m.occupation && m.occupation.toLowerCase().includes(q))
      );
    });

    if (filteredMembers.length === 0) return null;

    return {
      ...t,
      members: filteredMembers
    };
  }).filter(Boolean);

  const renderHeader = () => (
    <header className="bg-slate-900 border-b border-pink-900/40 text-white sticky top-0 z-40 shadow-xl backdrop-blur-md bg-opacity-95">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div 
          onClick={() => { setView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="cursor-pointer flex items-center gap-2 group"
        >
          <div className="bg-gradient-to-tr from-pink-600 to-purple-600 p-2 rounded-lg text-white shadow-lg shadow-pink-500/20 group-hover:scale-105 transition-transform">
            <BookOpen size={22} />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-wider bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
              PARADOX LIVE LATINOAMERICA
            </h1>
            <p className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
              <span>Paralove School</span> • <span className="text-pink-400">Traducción Fan</span>
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-2 text-sm font-semibold">
          <button
            onClick={() => { setView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              view === 'home' 
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30' 
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BookOpen size={16} />
            <span>Manga</span>
          </button>

          <button
            onClick={() => { setView('characters'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              view === 'characters' 
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30' 
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <GraduationCap size={16} />
            <span>Estudiantes</span>
          </button>

          <button
            onClick={() => { setView('admin'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={`p-2 rounded-lg transition-all ${
              view === 'admin' 
                ? 'bg-slate-700 text-pink-400' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
            title="Panel de Administración"
          >
            <Settings size={18} />
          </button>
        </nav>
      </div>
    </header>
  );

  const renderHome = () => (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6 bg-slate-900/80 border border-pink-500/30 rounded-2xl p-4 shadow-lg backdrop-blur-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20">
              No Oficial / Proyecto Fan
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            Traducción al español del manga <strong className="text-white font-semibold">Paralove School</strong> e información detallada sobre sus personajes y estudiantes.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-wide flex items-center gap-2">
            <BookOpen className="text-pink-500" size={24} />
            CAPÍTULOS DISPONIBLES
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Selecciona un capítulo para comenzar a leer
          </p>
        </div>
        <span className="text-xs font-bold text-pink-400 bg-pink-950/60 border border-pink-800/40 px-3 py-1 rounded-full">
          {chapters.length} {chapters.length === 1 ? 'Capítulo' : 'Capítulos'}
        </span>
      </div>

      {chapters.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center my-8">
          <BookOpen size={48} className="mx-auto text-slate-600 mb-3" />
          <h3 className="text-lg font-bold text-slate-300">Aún no hay capítulos subidos</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Puedes agregar capítulos accediendo al panel de configuración ⚙️ en la barra superior.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {chapters.map((chap) => (
            <div
              key={chap.id}
              onClick={() => openChapter(chap)}
              className="bg-slate-900 hover:bg-slate-800/90 border border-slate-800 hover:border-pink-500/50 rounded-xl p-4 transition-all cursor-pointer group shadow-lg hover:shadow-pink-500/10 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-xs font-black text-pink-400 tracking-wider uppercase block mb-1">
                    Capítulo {chap.number}
                  </span>
                  <h3 className="text-base font-bold text-white group-hover:text-pink-300 transition-colors line-clamp-2">
                    {chap.title}
                  </h3>
                </div>
                <div className="bg-slate-800 group-hover:bg-pink-600 p-2 rounded-lg text-slate-400 group-hover:text-white transition-colors shrink-0">
                  <ChevronRight size={18} />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <ImageIcon size={14} className="text-slate-500" />
                  {chap.pages ? chap.pages.length : 0} páginas
                </span>
                <span className="text-pink-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                  Leer ahora →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderReader = () => {
    if (!currentChapter) return null;
    const { prev, next } = getAdjacentChapters();

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
        <div className="bg-slate-900/95 border-b border-slate-800 sticky top-14 z-30 backdrop-blur-md px-4 py-3">
          <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-pink-400 block uppercase tracking-wider">
                Capítulo {currentChapter.number}
              </span>
              <h2 className="text-sm md:text-base font-bold text-white truncate max-w-xs md:max-w-md">
                {currentChapter.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => { setView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                <BookOpen size={14} />
                <span>Lista de Capítulos</span>
              </button>

              {prev && (
                <button
                  onClick={() => openChapter(prev)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors border border-slate-700"
                >
                  <ChevronLeft size={14} />
                  <span>Anterior</span>
                </button>
              )}

              {next && (
                <button
                  onClick={() => openChapter(next)}
                  className="bg-pink-600 hover:bg-pink-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shadow-md shadow-pink-600/30"
                >
                  <span>Siguiente</span>
                  <ChevronRight size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-2 py-6 flex flex-col items-center gap-2">
          {currentChapter.pages && currentChapter.pages.length > 0 ? (
            currentChapter.pages.map((url, idx) => (
              <div key={idx} className="w-full bg-slate-900 rounded-lg overflow-hidden shadow-2xl border border-slate-800/80">
                <img 
                  src={url} 
                  alt={`Página ${idx + 1}`} 
                  className="w-full h-auto block loading-lazy" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='300' viewBox='0 0 800 300'%3E%3Crect fill='%211e293b' width='800' height='300'/%3E%3Ctext fill='%2194a3b8' font-family='sans-serif' font-size='18' x='50%25' y='50%25' text-anchor='middle'%3EError al cargar la imagen de la página%3C/text%3E%3C/svg%3E";
                  }}
                />
                <div className="text-center text-[10px] text-slate-500 py-1 bg-slate-900/90 border-t border-slate-800">
                  {idx + 1} / {currentChapter.pages.length}
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-slate-400">
              No hay imágenes disponibles para este capítulo.
            </div>
          )}
        </div>

        <div className="max-w-3xl mx-auto px-4 mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => { setView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all border border-slate-700"
          >
            <BookOpen size={16} className="text-pink-400" />
            <span>Lista de Capítulos</span>
          </button>

          <div className="flex items-center gap-2 ml-auto">
            {prev && (
              <button
                onClick={() => openChapter(prev)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-1.5 transition-all border border-slate-700"
              >
                <ChevronLeft size={16} />
                <span>Capítulo anterior</span>
              </button>
            )}

            {next && (
              <button
                onClick={() => openChapter(next)}
                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-pink-600/30"
              >
                <span>Capítulo siguiente</span>
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderCharacters = () => (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-purple-900/60 via-slate-900 to-slate-900 border border-purple-500/30 rounded-2xl p-6 mb-8 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <GraduationCap className="text-purple-400" size={28} />
          <h2 className="text-2xl font-black text-white tracking-wide">
            ESTUDIANTES Y PERSONAL DE PARALOVE SCHOOL
          </h2>
        </div>
        <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
          Fichas de datos, clubes, niveles académicos y detalles de los estudiantes y docentes de Paralove School.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Buscar por nombre, club, cargo..."
              value={characterSearch}
              onChange={(e) => setCharacterSearch(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700 focus:border-purple-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {['Todos', 'BAE', 'cozmez', "The Cat's Whiskers", 'Akanyatsura', 'Amprule', 'VISTY', '1Nm8', 'Goku Luck', 'BURAIKAN'].map((teamName) => (
              <button
                key={teamName}
                onClick={() => setSelectedTeamFilter(teamName)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedTeamFilter === teamName
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
              >
                {teamName}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredTeams.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800">
          <Search size={40} className="mx-auto text-slate-600 mb-2" />
          <p className="text-slate-400 font-semibold">No se encontraron estudiantes o personajes con ese criterio.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {filteredTeams.map((t) => (
            <div key={t.team} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`h-6 w-2 rounded-full bg-gradient-to-b ${t.color}`} />
                <h3 className="text-xl font-black text-white tracking-wider uppercase">
                  {t.team}
                </h3>
                <span className="text-xs text-slate-500 font-bold">
                  ({t.members.length})
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {t.members.map((member, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all hover:translate-y-[-2px]"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-3 mb-3">
                        <div>
                          <h4 className="text-lg font-black text-white">
                            {member.name}
                          </h4>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded-md border border-slate-700/60 uppercase">
                          {member.role}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs text-slate-300">
                        {member.grade && (
                          <div className="flex items-start gap-2">
                            <span className="font-bold text-slate-400 shrink-0">Nivel académico:</span>
                            <span className="text-white font-medium">{member.grade}</span>
                          </div>
                        )}

                        {member.occupation && (
                          <div className="flex items-start gap-2">
                            <span className="font-bold text-slate-400 shrink-0">Ocupación:</span>
                            <span className="text-white font-medium">{member.occupation}</span>
                          </div>
                        )}

                        {member.classroom && (
                          <div className="flex items-start gap-2">
                            <span className="font-bold text-slate-400 shrink-0">Aula:</span>
                            <span className="text-white font-medium">{member.classroom}</span>
                          </div>
                        )}

                        {member.club && (
                          <div className="flex items-start gap-2">
                            <span className="font-bold text-slate-400 shrink-0">Actividades extracurriculares:</span>
                            <span className="text-purple-300 font-medium">{member.club}</span>
                          </div>
                        )}

                        {member.council && (
                          <div className="flex items-start gap-2">
                            <span className="font-bold text-slate-400 shrink-0">Consejo estudiantil:</span>
                            <span className="text-pink-300 font-medium">{member.council}</span>
                          </div>
                        )}
                      </div>

                      {member.desc && (
                        <p className="mt-4 text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 italic leading-relaxed">
                          "{member.desc}"
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAdmin = () => (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl mb-8">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
          <Settings size={24} className="text-pink-500" />
          <div>
            <h2 className="text-xl font-black text-white">Panel de Administración de Capítulos</h2>
            <p className="text-xs text-slate-400">Sube y gestiona la lista de manga publicada</p>
          </div>
        </div>

        <form onSubmit={handleUploadChapter} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                Número de Capítulo *
              </label>
              <input 
                type="number"
                step="0.1"
                placeholder="Ej: 1 o 1.5"
                value={adminChapNumber}
                onChange={(e) => setAdminChapNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-pink-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                Título del Capítulo
              </label>
              <input 
                type="text"
                placeholder="Ej: Primer día en Paralove School"
                value={adminChapTitle}
                onChange={(e) => setAdminChapTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-pink-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
              Seleccionar imágenes desde el dispositivo
            </label>
            <div className="border-2 border-dashed border-slate-800 hover:border-pink-500/50 rounded-xl p-4 text-center bg-slate-950/50 transition-colors">
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleFileUpload}
                id="file-upload" 
                className="hidden" 
                disabled={isCompressing}
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                <Upload size={24} className="text-pink-400" />
                <span className="text-xs font-semibold text-slate-300">
                  {isCompressing ? 'Optimizando imágenes...' : 'Haz clic aquí para seleccionar imágenes'}
                </span>
                <span className="text-[10px] text-slate-500">
                  Se comprimirán automáticamente para carga rápida
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
              URLs de las Páginas (una por línea)
            </label>
            <textarea 
              rows={6}
              placeholder="https://ejemplo.com/pagina1.jpg&#10;https://ejemplo.com/pagina2.jpg"
              value={adminChapPages}
              onChange={(e) => setAdminChapPages(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-pink-500 rounded-xl p-4 text-xs font-mono text-slate-200 outline-none leading-relaxed"
            />
          </div>

          <button
            type="submit"
            disabled={isCompressing}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-lg shadow-pink-600/30 flex items-center justify-center gap-2"
          >
            <Save size={18} />
            <span>Publicar Capítulo</span>
          </button>
        </form>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-4">Capítulos Publicados ({chapters.length})</h3>
        {chapters.length === 0 ? (
          <p className="text-xs text-slate-500">No hay capítulos agregados aún.</p>
        ) : (
          <div className="space-y-3">
            {chapters.map((chap) => (
              <div key={chap.id} className="flex items-center justify-between bg-slate-950 border border-slate-800/80 p-3.5 rounded-xl">
                <div>
                  <span className="text-xs font-bold text-pink-400">Capítulo {chap.number}</span>
                  <h4 className="text-sm font-semibold text-white">{chap.title}</h4>
                  <span className="text-[10px] text-slate-500">{chap.pages?.length || 0} páginas</span>
                </div>
                <button
                  onClick={() => handleDeleteChapter(chap.id)}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-900 rounded-lg transition-colors"
                  title="Eliminar capítulo"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-pink-500 selection:text-white flex flex-col justify-between">
      <div>
        {renderHeader()}

        {notification && (
          <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-pink-500 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-bounce">
            <CheckCircle2 size={18} className="text-pink-400" />
            <span>{notification}</span>
          </div>
        )}

        <main>
          {view === 'home' && renderHome()}
          {view === 'reader' && renderReader()}
          {view === 'characters' && renderCharacters()}
          {view === 'admin' && renderAdmin()}
        </main>
      </div>

      <footer className="bg-slate-900 border-t border-slate-800 text-slate-500 text-xs py-6 px-4 mt-12 text-center">
        <div className="max-w-4xl mx-auto space-y-2">
          <p className="font-semibold text-slate-400">
            PARADOX LIVE LATINOAMERICA • Traducción Fan de Paralove School
          </p>
          <p className="text-[11px] text-slate-500 max-w-xl mx-auto leading-relaxed">
            Este es un proyecto no oficial realizado sin fines de lucro. Todos los derechos del manga Paralove School y la franquicia Paradox Live pertenecen a sus autores y titulares originales (avex / GCREST).
          </p>
        </div>
      </footer>
    </div>
  );
}



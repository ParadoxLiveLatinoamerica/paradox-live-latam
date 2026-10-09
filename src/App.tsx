import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'manga' | 'characters'>('home');

  const characters = [
    {
      name: "Sugasano Allen",
      group: "BAE",
      role: "Estudiante",
      desc: "Un presidente del club de hip-hop que aspira a que el club llegue a la cima.",
      image: "https://i.imgur.com/c0rngvV.jpeg"
    },
    {
      name: "Yeon Hajun",
      group: "BAE",
      role: "Estudiante",
      desc: "El noble sonriente que dirige la escuela como si fuera su propio castillo.",
      image: "https://i.imgur.com/GqXpiP8.jpeg"
    },
    {
      name: "Anne Faulkner",
      group: "BAE",
      role: "Estudiante",
      desc: "Un influencer abrumadoramente popular.",
      image: "https://i.imgur.com/cPsipv2.jpeg"
    },
    {
      name: "Yatonokami Kanata",
      group: "cozmez",
      role: "Estudiante",
      desc: "Solo se presenta los días necesarios para no reprobar.",
      image: "https://i.imgur.com/xh6HHYD.jpeg"
    },
    {
      name: "Yatonokami Nayuta",
      group: "cozmez",
      role: "Estudiante",
      desc: "Es el holgazán de clase S más poderoso en la historia de la escuela.",
      image: "https://i.imgur.com/n8a52Et.jpeg"
    }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#030712', color: '#fff', fontFamily: 'sans-serif', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1f2937', paddingBottom: '15px', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#c084fc' }}>PARADOX LIVE LATAM</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setActiveTab('home')} style={{ background: activeTab === 'home' ? '#9333ea' : '#1f2937', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' }}>Inicio</button>
          <button onClick={() => setActiveTab('manga')} style={{ background: activeTab === 'manga' ? '#9333ea' : '#1f2937', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' }}>Manga</button>
          <button onClick={() => setActiveTab('characters')} style={{ background: activeTab === 'characters' ? '#9333ea' : '#1f2937', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' }}>Personajes</button>
        </div>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto' }}>
        {activeTab === 'home' && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <h2 style={{ fontSize: '32px', marginBottom: '10px' }}>Bienvenido a Paradox Live LATAM</h2>
            <p style={{ color: '#9ca3af' }}>Tu plataforma en español con mangas y personajes oficiales.</p>
          </div>
        )}

        {activeTab === 'manga' && (
          <div>
            <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Capítulo 1: Stage Battle</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <img src="https://i.imgur.com/c0rngvV.jpeg" alt="Página 1" style={{ width: '100%', borderRadius: '8px' }} />
            </div>
          </div>
        )}

        {activeTab === 'characters' && (
          <div>
            <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Personajes</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              {characters.map((char, index) => (
                <div key={index} style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '12px', overflow: 'hidden' }}>
                  <img src={char.image} alt={char.name} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                  <div style={{ padding: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#d8b4fe', margin: 0 }}>{char.name}</h3>
                      <span style={{ background: '#3b0764', color: '#d8b4fe', fontSize: '12px', padding: '2px 8px', borderRadius: '20px' }}>{char.group}</span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '8px' }}>Rol: {char.role}</p>
                    <p style={{ fontSize: '14px', color: '#e5e7eb', margin: 0 }}>{char.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

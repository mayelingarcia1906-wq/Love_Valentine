import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HEART_COUNT = 30;

const App: React.FC = () => {
  const [isAccepted, setIsAccepted] = useState(false);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [windowOpen, setWindowOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Función para reiniciar la aplicación sin recargar la página completa
  const resetApp = () => {
    setWindowOpen(false);
    setIsAccepted(false);
    setNoButtonPos({ x: 0, y: 0 });
    setTimeout(() => setWindowOpen(true), 500);
  };

  useEffect(() => {
    const timer = setTimeout(() => setWindowOpen(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleEscape = () => {
    if (!containerRef.current) return;
    
    const container = containerRef.current.getBoundingClientRect();
    const btnWidth = 100;
    const btnHeight = 40;

    // Calculamos una posición aleatoria. 
    // Usamos márgenes más grandes para que el salto sea más "violento" y difícil de seguir
    const margin = 50;
    const availableWidth = container.width - btnWidth - (margin * 2);
    const availableHeight = container.height - btnHeight - (margin * 2);

    const newX = Math.random() * availableWidth + margin;
    const newY = Math.random() * availableHeight + margin;

    // Convertir coordenadas absolutas a relativas al centro (que es donde empieza el botón)
    setNoButtonPos({ 
      x: newX - (container.width / 2) + (btnWidth / 2), 
      y: newY - (container.height / 2) + (btnHeight / 2) 
    });
  };

  const handleNoClick = (e: React.MouseEvent | React.TouchEvent) => {
    // Evitamos que el evento se propague o haga cosas raras
    e.preventDefault();
    // Si logran darle clic a pesar de todo, reiniciamos el estado
    resetApp();
  };

  const handleYesClick = () => {
    setIsAccepted(true);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-screen h-screen flex items-center justify-center overflow-hidden bg-[#ffeef2] select-none touch-none"
    >
      {/* Fondo de corazones animados */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: HEART_COUNT }).map((_, i) => (
          <FallingHeart key={i} delay={i * 0.4} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!isAccepted ? (
          windowOpen && (
            <motion.div
              key="question-box"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              className="relative z-10 w-[90%] max-w-[450px] bg-white border-[4px] border-[#ff8fa3] pixel-window-shadow"
            >
              {/* Barra superior */}
              <div className="bg-[#ff8fa3] p-2 flex justify-between items-center text-white text-[10px]">
                <span className="ml-2 uppercase tracking-widest">VALENTINE.EXE</span>
                <div className="flex gap-2 mr-1">
                  <div className="w-5 h-5 border-2 border-white flex items-center justify-center cursor-default">−</div>
                  <div className="w-5 h-5 border-2 border-white flex items-center justify-center cursor-default">□</div>
                  <div className="w-5 h-5 border-2 border-white flex items-center justify-center cursor-default">×</div>
                </div>
              </div>

              {/* Contenido */}
              <div className="p-6 md:p-10 flex flex-col items-center gap-6 text-center">
                <h1 className="text-[#ff8fa3] text-[12px] md:text-[16px] leading-relaxed mb-4">
                  ¿QUIERES SER MI SAN VALENTÍN?
                </h1>

                {/* FOTO INICIAL: Gatito con rosa */}
                <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
                  <img 
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEJggUAwBiZwzt7rjfkcsxmdbP8m6kpGWKrQ&s" 
                    alt="Gatito con rosa"
                    className="w-full h-full object-cover rounded-xl border-4 border-[#ffb3c1] shadow-lg floating"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?q=80&w=500&auto=format&fit=crop";
                    }}
                  />
                  
                  {/* Botón NO mejorado: ahora reacciona a 'onTouchStart' para móviles */}
                  <motion.button
                    animate={{ x: noButtonPos.x, y: noButtonPos.y }}
                    onMouseEnter={handleEscape}
                    onTouchStart={handleEscape}
                    onClick={handleNoClick}
                    className="absolute z-30 px-4 py-2 bg-black text-white text-[12px] border-2 border-white pixel-border hover:cursor-default active:bg-gray-800 transition-colors"
                  >
                    NO
                  </motion.button>
                </div>

                <button
                  onClick={handleYesClick}
                  className="mt-4 px-10 py-5 bg-[#ff8fa3] text-white text-[16px] border-[4px] border-[#ffb3c1] hover:bg-[#ff758f] active:scale-95 transition-all pixel-border"
                >
                  SÍ
                </button>
              </div>
            </motion.div>
          )
        ) : (
          <motion.div
            key="success-screen"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="z-20 text-center flex flex-col items-center p-4"
          >
            <div className="mb-8 relative inline-block">
               {/* FOTO ÉXITO: Gatitos besándose corazón */}
               <img 
                src="https://i.pinimg.com/736x/ed/70/d7/ed70d7e7ffea6a509fb2026d2c86d2c1.jpg" 
                alt="Gatitos besándose corazón"
                className="w-72 h-72 md:w-96 md:h-96 mx-auto rounded-2xl shadow-2xl border-[8px] border-white object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=500&auto=format&fit=crop";
                }}
              />
              <div className="absolute -top-6 -right-12 animate-bounce text-7xl">❤️</div>
              <div className="absolute top-1/2 -left-20 animate-pulse text-6xl">💖</div>
              <div className="absolute -bottom-6 -right-8 animate-bounce delay-300 text-7xl">💝</div>
            </div>
            
            <h2 className="text-[#ff8fa3] text-[20px] md:text-[32px] mb-4 drop-shadow-md">¡SABÍA QUE DIRÍAS QUE SÍ! 🐱💕</h2>
            <p className="text-[#ffb3c1] text-[16px] md:text-[20px] animate-pulse uppercase">¡Nos vemos el 14! ✨</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FallingHeart: React.FC<{ delay: number }> = ({ delay }) => {
  const [startX, setStartX] = useState(0);
  useEffect(() => {
    setStartX(Math.random() * 100);
  }, []);

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ 
        y: '110vh', 
        opacity: [0, 1, 1, 0],
        x: [0, (Math.random() - 0.5) * 150, 0] 
      }}
      transition={{ 
        duration: 6 + Math.random() * 4, 
        repeat: Infinity, 
        delay: delay,
        ease: "linear"
      }}
      className="absolute text-pink-400 text-2xl"
      style={{ left: `${startX}%` }}
    >
      ❤
    </motion.div>
  );
};

export default App;
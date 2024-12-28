import { useState, useEffect } from 'react';
import './App.css';

interface Timer {
  minutes: number;
  seconds: number;
}

function App() {
  const [time, setTime] = useState<Timer>({ minutes: 0, seconds: 0 });
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [theme, setTheme] = useState<string>('light'); // Modo claro por defecto

  // Recuperar el tema del localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      localStorage.setItem('theme', 'light');
    }
  }, []);

  // Cambiar el tema y guardarlo en localStorage
  useEffect(() => {
    document.body.className = theme; // Cambiar clase de body según el tema
    localStorage.setItem('theme', theme); // Guardar preferencia
  }, [theme]);

  useEffect(() => {
    let interval: number | null = null;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime.seconds > 0) {
            return { ...prevTime, seconds: prevTime.seconds - 1 };
          } else if (prevTime.minutes > 0) {
            return { minutes: prevTime.minutes - 1, seconds: 59 };
          }
          return prevTime;
        });
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }

    if (time.minutes === 0 && time.seconds === 0 && isActive) {
      alert("¡Tiempo terminado!");
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, time]);

  const handleStart = () => {
    if (time.minutes > 0 || time.seconds > 0) {
      setIsActive(true);
      setIsPaused(false);
    }
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(false);
    setTime({ minutes: 0, seconds: 0 });
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="App" style={{ display:`flex`,justifyContent:`center`, width:`100vw` }}>
      <div className="timer">
        <input
          type="number"
          value={time.minutes}
          onChange={(e) => setTime({ ...time, minutes: Math.max(0, +e.target.value) })}
          min="0"
          placeholder="Minutos"
        />
        <span>:</span>
        <input
          type="number"
          value={time.seconds}
          onChange={(e) => setTime({ ...time, seconds: Math.max(0, Math.min(59, +e.target.value)) })}
          min="0"
          max="59"
          placeholder="Segundos"
        />
        <div className="controls">
          <button onClick={handleStart} disabled={isActive}>
            Iniciar
          </button>
          <button onClick={handlePause} disabled={!isActive}>
            {isPaused ? "Reanudar" : "Pausar"}
          </button>
          <button onClick={handleReset}>
            Reiniciar
          </button>
        </div>
        <div className="time">
          {String(time.minutes).padStart(2, '0')}:{String(time.seconds).padStart(2, '0')}
        </div>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? '🌙 Modo Oscuro' : '🌞 Modo Claro'}
        </button>
      </div>
    </div>
  );
}

export default App;

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type CountdownProps = {
  className?: string;
};

type TimeParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const TARGET_DATE = new Date("2026-07-31T23:59:59");

function getRemainingTime(): TimeParts {
  const diff = Math.max(
    0,
    TARGET_DATE.getTime() - new Date().getTime()
  );

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return {
    days,
    hours,
    minutes,
    seconds,
  };
}

// Componente de dígito con efecto de "explosión" profesional
function ExplosiveDigit({
  digit,
  isChanging,
  index,
}: {
  digit: string;
  isChanging: boolean;
  index: number;
}) {
  if (!isChanging) {
    return (
      <span className="inline-block min-w-[0.5em] text-center relative">
        <span className="block">{digit}</span>
      </span>
    );
  }

  return (
    <div className="inline-block min-w-[0.5em] text-center relative">
      <AnimatePresence mode="wait">
        <motion.span
          key={digit}
          className="block relative"
          initial={{ 
            scale: 0.2, 
            opacity: 0,
            rotateY: 180,
            filter: "blur(4px)"
          }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            rotateY: 0,
            filter: "blur(0px)"
          }}
          exit={{ 
            scale: 1.5, 
            opacity: 0,
            rotateY: -180,
            filter: "blur(8px)"
          }}
          transition={{
            duration: 0.5,
            delay: index * 0.04,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

// Componente de número animado con efecto de "cascada"
function AnimatedNumber({
  value,
  pad = 2,
  className,
  urgency = false,
}: {
  value: number;
  pad?: number;
  className?: string;
  urgency?: boolean;
}) {
  const text = value.toString().padStart(pad, "0");
  const [display, setDisplay] = useState(text);
  const [changingDigits, setChangingDigits] = useState<boolean[]>([]);

  useEffect(() => {
    if (text === display) return;

    // Identificar dígitos que cambiaron
    const changed = text.split("").map((digit, index) => {
      return digit !== display[index];
    });

    setChangingDigits(changed);
    setDisplay(text);

    // Resetear estado de cambio
    const timeout = setTimeout(() => {
      setChangingDigits(new Array(text.length).fill(false));
    }, 600);

    return () => clearTimeout(timeout);
  }, [text, display]);

  const currentDigits = display.split("");

  return (
    <div className={`relative overflow-hidden h-[1.2em] ${className}`}>
      <div className="flex justify-center items-center h-full gap-[0.02em]">
        {currentDigits.map((digit, index) => {
          const isChanging = changingDigits[index] || false;

          return (
            <ExplosiveDigit
              key={`${index}-${digit}`}
              digit={digit}
              isChanging={isChanging}
              index={index}
            />
          );
        })}
      </div>
    </div>
  );
}

// Tarjeta de tiempo con efecto de "premio"
function TimeCard({
  label,
  value,
  pad = 2,
  className,
  urgency = false,
  delay = 0,
}: {
  label: string;
  value: number;
  pad?: number;
  className?: string;
  urgency?: boolean;
  delay?: number;
}) {
  return (
    <motion.div 
      className="flex flex-col items-center relative group"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: [0.34, 1.56, 0.64, 1]
      }}
    >
      {/* Efecto de resplandor de fondo */}
      <div className="absolute -inset-4 bg-linear-to-r from-yellow-500/5 via-transparent to-yellow-500/5 rounded-3xl blur-2xl group-hover:from-yellow-500/10 group-hover:to-yellow-500/10 transition-all duration-700" />

      <div
        className={`
          relative
          rounded-lg
          border-2
          ${urgency 
            ? 'border-yellow-400/30 hover:border-yellow-400/60' 
            : 'border-white/15 hover:border-white/30'
          }
          bg-linear-to-br 
          ${urgency 
            ? 'from-yellow-500/10 to-yellow-500/5' 
            : 'from-white/5 to-white/10'
          }
          backdrop-blur-xl
          px-1
          py-2
          shadow-2xl
          hover:shadow-[0_20px_70px_-15px_rgba(234,179,8,0.3)]
          hover:scale-105
          transition-all
          duration-500
          flex
          justify-center
          overflow-hidden
        `}
      >
        {/* Efecto de brillo deslizante */}
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

        <AnimatedNumber
          value={value}
          pad={pad}
          className={`text-3xl md:text-lg font-black tabular-nums leading-none ${
            className ?? "text-white"
          }`}
          urgency={urgency}
        />
        
        {/* Borde con gradiente animado */}
        <div className={`absolute inset-0 rounded-2xl bg-linear-to-r from-transparent via-${urgency ? 'yellow-400/20' : 'white/10'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      </div>

      <span
        className={`
          mt-3 
          text-xs
          uppercase 
          font-bold 
          ${urgency ? 'text-yellow-400/90' : 'text-white/70'}
          transition-all 
          duration-300 
          group-hover:tracking-[0.4em]
          group-hover:text-white
        `}
      >
        {label}
      </span>
    </motion.div>
  );
}

export default function Countdown({
  className,
}: CountdownProps) {
  const [time, setTime] = useState(getRemainingTime());
  const [isClient, setIsClient] = useState(false);
  const [showUrgency, setShowUrgency] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsClient(true);
    
    // Activar urgencia después de 5 segundos
    const urgencyTimer = setTimeout(() => {
      setShowUrgency(true);
    }, 5000);

    intervalRef.current = setInterval(() => {
      setTime(getRemainingTime());
      
      // Activar urgencia si quedan menos de 30 días
      const remaining = getRemainingTime();
      if (remaining.days < 30) {
        setShowUrgency(true);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      clearTimeout(urgencyTimer);
    };
  }, []);

  const color = useMemo(
    () => className ?? "text-white",
    [className]
  );

  if (!isClient) {
    return (
      <div className="flex flex-col items-center">
        <div className="flex flex-col justify-center">
          {["Días", "Horas", "Minutos", "Segundos"].map((label) => (
            <div key={label} className="flex flex-col items-center">
              <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md px-1 pt-1">
                <div className="text-3xl font-black text-white/50">00</div>
              </div>
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/50">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 w-full mx-auto">
      

      {/* Contador principal */}
      <motion.div 
        className="flex justify-center items-center pt-3 pb-3 md:pb-0 font-bold"
        initial={{ opacity: 0, scale: 0.2 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
      >
        <TimeCard
          label="Días"
          value={time.days}
          pad={3}
          className={color}
          delay={0.1}
          urgency={showUrgency && time.days < 60}
        />

        <div className="flex items-center -mt-7 px-2">
          <span className="text-2xl text-white">:</span>
        </div>

        <TimeCard
          label="Hrs"
          value={time.hours}
          className={color}
          delay={0.2}
          urgency={showUrgency && time.days < 60}
        />
        
        <div className="flex items-center -mt-7 px-2">
          <span className="text-2xl text-white">:</span>
        </div>

        <TimeCard
          label="Mins"
          value={time.minutes}
          className={color}
          delay={0.3}
          urgency={showUrgency}
        />

        <div className="flex items-center -mt-7 px-2">
          <span className="text-2xl text-white">:</span>
        </div>

        <TimeCard
          label="Secs"
          value={time.seconds}
          className={color}
          delay={0.4}
          urgency={true}
        />
      </motion.div>
    </div>
  );
}
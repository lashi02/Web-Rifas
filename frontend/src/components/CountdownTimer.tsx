import { useState, useEffect } from 'react';

interface Props {
  targetDate: string;
  compact?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({ targetDate, compact = false }: Props) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    function calculateTimeLeft(): TimeLeft {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const diff = target - now;

      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      };
    }

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!mounted) {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`${compact ? 'px-2 py-1' : 'px-3 py-2'} rounded-lg bg-dark`}>
            <span className={`${compact ? 'text-lg' : 'text-2xl'} font-bold text-neutral-600`}>--</span>
          </div>
        ))}
      </div>
    );
  }

  const isFinished = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  if (isFinished) {
    return (
      <div className="text-center">
        <span className="text-xl font-bold text-gold">Sorteo Finalizado</span>
      </div>
    );
  }

  const blocks = [
    { value: timeLeft.days, label: compact ? 'D' : 'Días' },
    { value: timeLeft.hours, label: compact ? 'H' : 'Horas' },
    { value: timeLeft.minutes, label: compact ? 'M' : 'Min' },
    { value: timeLeft.seconds, label: compact ? 'S' : 'Seg', highlight: true },
  ];

  return (
    <div className="flex gap-2">
      {blocks.map((block, i) => (
        <div
          key={i}
          className={`flex flex-col items-center rounded-lg bg-dark ${
            compact ? 'px-2 py-1' : 'px-3 py-2 sm:px-4 sm:py-3'
          }`}
        >
          <span
            className={`${
              compact ? 'text-lg' : 'text-2xl sm:text-3xl'
            } font-bold ${block.highlight ? 'text-gold' : 'text-white'}`}
          >
            {String(block.value).padStart(2, '0')}
          </span>
          <span className={`${compact ? 'text-[10px]' : 'text-xs'} text-neutral-500`}>
            {block.label}
          </span>
        </div>
      ))}
    </div>
  );
}

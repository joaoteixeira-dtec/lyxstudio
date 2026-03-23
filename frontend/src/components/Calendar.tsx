import { useState, useMemo } from 'react';

interface CalendarProps {
  unavailableDates: string[];
  onSelectRange?: (checkIn: string, checkOut: string) => void;
  selectedCheckIn?: string;
  selectedCheckOut?: string;
}

export default function Calendar({ unavailableDates, onSelectRange, selectedCheckIn, selectedCheckOut }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const unavailableSet = useMemo(() => new Set(unavailableDates), [unavailableDates]);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  const monthLabel = currentMonth.toLocaleDateString('pt', {
    month: 'long',
    year: 'numeric',
  });

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const handleDayClick = (day: number) => {
    const dateStr = formatDate(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (unavailableSet.has(dateStr)) return;
    if (!onSelectRange) return;

    if (!selectedCheckIn || (selectedCheckIn && selectedCheckOut)) {
      onSelectRange(dateStr, '');
    } else {
      if (dateStr > selectedCheckIn) {
        onSelectRange(selectedCheckIn, dateStr);
      } else {
        onSelectRange(dateStr, '');
      }
    }
  };

  const isInRange = (day: number) => {
    if (!selectedCheckIn || !selectedCheckOut) return false;
    const dateStr = formatDate(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return dateStr >= selectedCheckIn && dateStr <= selectedCheckOut;
  };

  const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  return (
    <div className="bg-[#111] rounded-xl border border-white/10 p-4" role="application" aria-label="Calendário">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-white/5 rounded-md transition-colors"
          aria-label="Mês anterior"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/50" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        <h3 className="font-semibold text-white capitalize">{monthLabel}</h3>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-white/5 rounded-md transition-colors"
          aria-label="Próximo mês"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/50" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekDays.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-white/30 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const dateStr = formatDate(currentMonth.getFullYear(), currentMonth.getMonth(), day);
          const isUnavailable = unavailableSet.has(dateStr);
          const isPast = dateStr < new Date().toISOString().slice(0, 10);
          const isSelected = dateStr === selectedCheckIn || dateStr === selectedCheckOut;
          const inRange = isInRange(day);

          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              disabled={isUnavailable || isPast}
              className={`
                h-10 text-sm rounded-md font-medium transition-all
                ${isUnavailable ? 'bg-red-500/10 text-red-400/50 cursor-not-allowed line-through' : ''}
                ${isPast && !isUnavailable ? 'text-white/15 cursor-not-allowed' : ''}
                ${isSelected ? 'bg-[#e2ff00] text-black shadow-sm shadow-[#e2ff00]/20' : ''}
                ${inRange && !isSelected ? 'bg-[#e2ff00]/15 text-[#e2ff00]' : ''}
                ${!isUnavailable && !isPast && !isSelected && !inRange ? 'hover:bg-white/5 text-white/70' : ''}
              `}
              aria-label={`${day} ${monthLabel}${isUnavailable ? ' - indisponível' : ''}`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs text-white/40">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-red-500/10 border border-red-500/20" />
          Indisponível
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-[#e2ff00]" />
          Selecionado
        </span>
      </div>
    </div>
  );
}

function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

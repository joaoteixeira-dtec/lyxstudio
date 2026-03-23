import { useState, useMemo } from 'react';

interface CalendarProps {
  unavailableDates: string[];
  onSelectDate?: (date: string) => void;
  selectedDate?: string;
  multiDay?: boolean;
  selectedDates?: string[];
  onSelectMultiple?: (dates: string[]) => void;
}

export default function Calendar({
  unavailableDates,
  onSelectDate,
  selectedDate,
  multiDay,
  selectedDates = [],
  onSelectMultiple,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const unavailableSet = useMemo(() => new Set(unavailableDates), [unavailableDates]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  // Build 42-cell grid (6 rows × 7 cols) with adjacent month days
  const cells: { day: number; inMonth: boolean; dateStr: string }[] = [];

  for (let i = startOffset - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const m = month === 0 ? 11 : month - 1;
    const y = month === 0 ? year - 1 : year;
    cells.push({ day: d, inMonth: false, dateStr: fmtDate(y, m, d) });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, inMonth: true, dateStr: fmtDate(year, month, d) });
  }
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    const m = month === 11 ? 0 : month + 1;
    const y = month === 11 ? year + 1 : year;
    cells.push({ day: d, inMonth: false, dateStr: fmtDate(y, m, d) });
  }

  const raw = currentMonth.toLocaleDateString('pt', { month: 'long', year: 'numeric' });
  const monthLabel = raw.charAt(0).toUpperCase() + raw.slice(1).replace(' de ', ' De ');

  const prevMonthNav = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonthNav = () => setCurrentMonth(new Date(year, month + 1, 1));

  const todayStr = new Date().toISOString().slice(0, 10);

  const handleDayClick = (cell: (typeof cells)[0]) => {
    if (!cell.inMonth || unavailableSet.has(cell.dateStr) || cell.dateStr < todayStr) return;

    if (multiDay && onSelectMultiple) {
      if (selectedDates.includes(cell.dateStr)) {
        onSelectMultiple(selectedDates.filter((d) => d !== cell.dateStr));
      } else {
        onSelectMultiple([...selectedDates, cell.dateStr]);
      }
    } else if (onSelectDate) {
      onSelectDate(cell.dateStr);
    }
  };

  const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  return (
    <div role="application" aria-label="Calendário">
      {/* Month navigation */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
        <button
          onClick={prevMonthNav}
          className="w-7 h-7 flex items-center justify-center hover:bg-white/5 rounded transition-colors"
          aria-label="Mês anterior"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white/40" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        <h3 className="text-sm font-medium text-white/80 tracking-wide">{monthLabel}</h3>
        <button
          onClick={nextMonthNav}
          className="w-7 h-7 flex items-center justify-center hover:bg-white/5 rounded transition-colors"
          aria-label="Próximo mês"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white/40" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-white/[0.06]">
        {weekDays.map((d) => (
          <div key={d} className="text-center text-[11px] font-medium text-white/30 py-2.5">
            {d}
          </div>
        ))}
      </div>

      {/* Days grid — 6 rows */}
      <div className="grid grid-cols-7">
        {cells.map((cell, idx) => {
          const isUnavailable = cell.inMonth && unavailableSet.has(cell.dateStr);
          const isPast = cell.dateStr < todayStr;
          const isSelected = cell.inMonth && (multiDay ? selectedDates.includes(cell.dateStr) : cell.dateStr === selectedDate);
          const disabled = !cell.inMonth || isUnavailable || isPast;

          return (
            <button
              key={idx}
              onClick={() => handleDayClick(cell)}
              disabled={disabled}
              className={`
                relative h-[62px] text-left px-2.5 pt-2 transition-all
                border-b border-r border-white/[0.04]
                ${idx % 7 === 0 ? '' : ''}
                ${!cell.inMonth ? 'text-white/[0.08]' : ''}
                ${cell.inMonth && isPast ? 'text-white/15 cursor-not-allowed' : ''}
                ${cell.inMonth && isUnavailable ? 'text-white/15 cursor-not-allowed' : ''}
                ${cell.inMonth && !isPast && !isUnavailable && !isSelected ? 'text-white/50 hover:bg-white/[0.03] cursor-pointer' : ''}
                ${isSelected ? 'ring-1 ring-inset ring-white/30 bg-white/[0.04] text-white' : ''}
              `}
              aria-label={`${cell.day}${isUnavailable ? ' - indisponível' : ''}`}
            >
              <span className="text-xs font-medium">{cell.day}</span>
              {/* Availability dots */}
              {cell.inMonth && !isPast && (
                <div className="flex gap-[3px] mt-1.5">
                  <span className={`w-[5px] h-[5px] rounded-full ${isUnavailable ? 'bg-white/[0.06]' : 'bg-white/20'}`} />
                  <span className={`w-[5px] h-[5px] rounded-full ${isUnavailable ? 'bg-white/[0.06]' : 'bg-white/15'}`} />
                  <span className={`w-[5px] h-[5px] rounded-full ${isUnavailable ? 'bg-white/[0.06]' : 'bg-white/10'}`} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function fmtDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

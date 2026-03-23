import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface CalendarProps {
  unavailableDates: string[];
  onSelectRange?: (checkIn: string, checkOut: string) => void;
  selectedCheckIn?: string;
  selectedCheckOut?: string;
}

export default function Calendar({ unavailableDates, onSelectRange, selectedCheckIn, selectedCheckOut }: CalendarProps) {
  const { t } = useTranslation();
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const unavailableSet = useMemo(() => new Set(unavailableDates), [unavailableDates]);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  // Adjust: Monday = 0
  const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  const monthLabel = currentMonth.toLocaleDateString(document.documentElement.lang || 'pt', {
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
    <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-4" role="application" aria-label={t('reservations.calendar_title')}>
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-stone-100 rounded-md transition-colors"
          aria-label="Previous month"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-stone-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        <h3 className="font-semibold text-stone-800 capitalize">{monthLabel}</h3>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-stone-100 rounded-md transition-colors"
          aria-label="Next month"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-stone-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekDays.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-stone-500 py-1">
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
                ${isUnavailable ? 'bg-red-50 text-red-300 cursor-not-allowed line-through' : ''}
                ${isPast && !isUnavailable ? 'text-stone-300 cursor-not-allowed' : ''}
                ${isSelected ? 'bg-amber-600 text-white shadow-sm' : ''}
                ${inRange && !isSelected ? 'bg-amber-100 text-amber-800' : ''}
                ${!isUnavailable && !isPast && !isSelected && !inRange ? 'hover:bg-stone-100 text-stone-700' : ''}
              `}
              aria-label={`${day} ${monthLabel}${isUnavailable ? ` - ${t('reservations.unavailable')}` : ''}`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs text-stone-500">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-red-50 border border-red-200" />
          {t('reservations.unavailable')}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-amber-600" />
          Selecionado
        </span>
      </div>
    </div>
  );
}

function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

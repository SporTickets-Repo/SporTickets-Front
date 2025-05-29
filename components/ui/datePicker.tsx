import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Locale } from "@/i18n-config";
import { cn } from "@/lib/utils";
import { eachMonthOfInterval, endOfYear, format, startOfYear } from "date-fns";
import { enUS, ptBR } from "date-fns/locale";
import { CalendarIcon, Clock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { isMobile } from "react-device-detect";

const localeMap = {
  pt: ptBR,
  en: enUS,
};

const translation = {
  pt: {
    selectDate: "Selecione a data",
    selectDateTime: "Selecione a data e hora",
    year: "Ano",
    month: "Mês",
    hours: "Horas",
    minutes: "Minutos",
  },
  en: {
    selectDate: "Select date",
    selectDateTime: "Select date and time",
    year: "Year",
    month: "Month",
    hours: "Hours",
    minutes: "Minutes",
  },
};

interface DateTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  placeholder?: string;
  showTime?: boolean;
  disabled?: boolean;
  lang: Locale;
}

export function DatePicker({
  date,
  setDate,
  placeholder,
  showTime = false,
  disabled = false,
  lang,
}: DateTimePickerProps) {
  const t = translation[lang];
  const locale = localeMap[lang];

  const [month, setMonth] = useState(date?.getMonth() ?? new Date().getMonth());
  const [year, setYear] = useState(
    date?.getFullYear() ?? new Date().getFullYear()
  );
  const [hours, setHours] = useState(
    date ? String(date.getHours()).padStart(2, "0") : "00"
  );
  const [minutes, setMinutes] = useState(
    date ? String(date.getMinutes()).padStart(2, "0") : "00"
  );

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from(
      { length: currentYear - 1900 + 1 },
      (_, i) => currentYear - i
    );
  }, []);

  const months = useMemo(() => {
    if (year) {
      return eachMonthOfInterval({
        start: startOfYear(new Date(year, 0, 1)),
        end: endOfYear(new Date(year, 0, 1)),
      });
    }
    return [];
  }, [year]);

  const hoursArray = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  const minutesArray = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0")
  );

  useEffect(() => {
    if (date) {
      setMonth(date.getMonth());
      setYear(date.getFullYear());
      setHours(String(date.getHours()).padStart(2, "0"));
      setMinutes(String(date.getMinutes()).padStart(2, "0"));
    }
  }, [date]);

  const updateDateTime = (newYear: number, newMonth: number) => {
    const newDate = new Date(newYear, newMonth, 1);
    newDate.setHours(Number(hours));
    newDate.setMinutes(Number(minutes));
    setDate(newDate);
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      newDate.setHours(Number(hours));
      newDate.setMinutes(Number(minutes));
    }
    setDate(newDate);
  };

  if (isMobile) {
    return (
      <input
        type={showTime ? "datetime-local" : "date"}
        disabled={disabled}
        value={
          date
            ? showTime
              ? `${date.toISOString().split("T")[0]}T${hours}:${minutes}`
              : date.toISOString().split("T")[0]
            : ""
        }
        onChange={(e) => {
          if (e.target.value) {
            const newDate = new Date(e.target.value);
            setDate(newDate);
            setHours(String(newDate.getHours()).padStart(2, "0"));
            setMinutes(String(newDate.getMinutes()).padStart(2, "0"));
          } else {
            setDate(undefined);
          }
        }}
        className="w-full bg-neutral-100 border rounded px-3 py-2 text-sm"
        placeholder={
          placeholder || (showTime ? t.selectDateTime : t.selectDate)
        }
      />
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal bg-neutral-100 border",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" color="#6426B1" />
          {date ? (
            format(date, showTime ? "dd/MM/yyyy HH:mm" : "dd/MM/yyyy", {
              locale,
            })
          ) : (
            <span>
              {placeholder || (showTime ? t.selectDateTime : t.selectDate)}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex justify-between p-2 space-x-1">
          <Select
            onValueChange={(v) => updateDateTime(Number(v), month)}
            value={year.toString()}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder={t.year} />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={(v) => updateDateTime(year, Number(v))}
            value={month.toString()}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder={t.month} />
            </SelectTrigger>
            <SelectContent>
              {months.map((m, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {format(m, "MMMM", { locale })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Calendar
          locale={locale}
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          month={new Date(year, month)}
          onMonthChange={(newMonth) => {
            setMonth(newMonth.getMonth());
            setYear(newMonth.getFullYear());
          }}
          initialFocus
        />
        {showTime && (
          <div className="flex items-center justify-center p-2 space-x-2 border-t">
            <Clock className="h-4 w-4" color="#6426B1" />
            <Select onValueChange={setHours} value={hours}>
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder={t.hours} />
              </SelectTrigger>
              <SelectContent>
                {hoursArray.map((hour) => (
                  <SelectItem key={hour} value={hour}>
                    {hour}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>:</span>
            <Select onValueChange={setMinutes} value={minutes}>
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder={t.minutes} />
              </SelectTrigger>
              <SelectContent>
                {minutesArray.map((minute) => (
                  <SelectItem key={minute} value={minute}>
                    {minute}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

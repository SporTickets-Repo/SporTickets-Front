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
import { cn } from "@/lib/utils";
import { eachMonthOfInterval, endOfYear, format, startOfYear } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface DateTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  placeholder?: string;
  showTime?: boolean;
}

export function DatePicker({
  date,
  setDate,
  placeholder,
  showTime = false,
}: DateTimePickerProps) {
  const [month, setMonth] = useState<number>(
    date ? date.getMonth() : new Date().getMonth()
  );
  const [year, setYear] = useState<number>(
    date ? date.getFullYear() : new Date().getFullYear()
  );
  const [hours, setHours] = useState<string>(
    date ? String(date.getHours()).padStart(2, "0") : "00"
  );
  const [minutes, setMinutes] = useState<string>(
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

  const handleYearChange = (selectedYear: string) => {
    const newYear = parseInt(selectedYear, 10);
    setYear(newYear);
    updateDateTime(newYear, month);
  };

  const handleMonthChange = (selectedMonth: string) => {
    const newMonth = parseInt(selectedMonth, 10);
    setMonth(newMonth);
    updateDateTime(year, newMonth);
  };

  const handleHoursChange = (selectedHours: string) => {
    setHours(selectedHours);
    if (date) {
      const newDate = new Date(date);
      newDate.setHours(parseInt(selectedHours, 10));
      setDate(newDate);
    } else {
      const newDate = new Date(year, month, 1);
      newDate.setHours(parseInt(selectedHours, 10));
      newDate.setMinutes(parseInt(minutes, 10));
      setDate(newDate);
    }
  };

  const handleMinutesChange = (selectedMinutes: string) => {
    setMinutes(selectedMinutes);
    if (date) {
      const newDate = new Date(date);
      newDate.setMinutes(parseInt(selectedMinutes, 10));
      setDate(newDate);
    } else {
      const newDate = new Date(year, month, 1);
      newDate.setHours(parseInt(hours, 10));
      newDate.setMinutes(parseInt(selectedMinutes, 10));
      setDate(newDate);
    }
  };

  const updateDateTime = (newYear: number, newMonth: number) => {
    if (date) {
      const newDate = new Date(date);
      newDate.setFullYear(newYear);
      newDate.setMonth(newMonth);
      setDate(newDate);
    } else {
      const newDate = new Date(newYear, newMonth, 1);
      newDate.setHours(parseInt(hours, 10));
      newDate.setMinutes(parseInt(minutes, 10));
      setDate(newDate);
    }
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      newDate.setHours(parseInt(hours, 10));
      newDate.setMinutes(parseInt(minutes, 10));
    }
    setDate(newDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal bg-neutral-100 border",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" color="#6426B1" />
          {date ? (
            format(date, showTime ? "dd/MM/yyyy HH:mm" : "dd/MM/yyyy", {
              locale: ptBR,
            })
          ) : (
            <span>
              {placeholder
                ? placeholder
                : `Selecione a data${showTime ? " e hora" : ""}`}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex justify-between p-2 space-x-1">
          <Select onValueChange={handleYearChange} value={year.toString()}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={handleMonthChange} value={month.toString()}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((m, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {format(m, "MMMM", { locale: ptBR })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Calendar
          locale={ptBR}
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
            <Select onValueChange={handleHoursChange} value={hours}>
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="Hours" />
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
            <Select onValueChange={handleMinutesChange} value={minutes}>
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="Minutes" />
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

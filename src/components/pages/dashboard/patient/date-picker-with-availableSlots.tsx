"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface AppointmentSlot {
  day: string;
  enabled: boolean;
  startTime: any;
  endTime: any;
}

interface DatePickerWithSlotsProps {
  value: string;
  onChange: (date: string) => void;
  availableSlots: AppointmentSlot[] | undefined;
  minDate?: string;
  maxDate?: string;
  error?: string;
}

export function DatePickerWithSlots({
  value,
  onChange,
  availableSlots,
  minDate,
  maxDate,
  error,
}: DatePickerWithSlotsProps) {
  console.log("🧞‍♂️  availableSlots --->", availableSlots);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [isOpen, setIsOpen] = useState(false);

  // Check if a date's day is enabled in availableSlots
  const isDateAvailable = (date: Date): boolean => {
    const dayNameLower = date
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    const dayName =
      dayNameLower.charAt(0).toUpperCase() + dayNameLower.slice(1);

    return (
      availableSlots?.some((slot) => slot.day === dayName && slot.enabled) ??
      false
    );
  };

  // Check if date is within min/max range
  const isDateInRange = (date: Date): boolean => {
    const dateStr = date.toISOString().split("T")[0];
    if (minDate && dateStr < minDate) return false;
    if (maxDate && dateStr > maxDate) return false;
    return true;
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );

    if (isDateAvailable(selectedDate) && isDateInRange(selectedDate)) {
      const dateString = selectedDate.toISOString().split("T")[0];
      onChange(dateString);
      setIsOpen(false);
    }
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
  const days = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }

  // Add all days in month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthName = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const selectedDateObj = value ? new Date(value + "T00:00:00") : null;
  const displayDate = selectedDateObj
    ? selectedDateObj.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Select date";

  return (
    <div className="space-y-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`w-full justify-start text-left font-normal ${
              error ? "border-red-500" : ""
            } ${!value ? "text-muted-foreground" : ""}`}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {displayDate}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-4">
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">{monthName}</h3>
              <button
                onClick={handleNextMonth}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-gray-500 w-8 h-8 flex items-center justify-center"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="w-8 h-8" />;
                }

                const date = new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth(),
                  day
                );
                const isAvailable = isDateAvailable(date);
                console.log("🧞‍♂️  isAvailable --->", date);
                const isInRange = isDateInRange(date);
                const isSelectable = isAvailable && isInRange;
                const isSelected =
                  selectedDateObj &&
                  selectedDateObj.toDateString() === date.toDateString();
                const isToday =
                  new Date().toDateString() === date.toDateString();

                return (
                  <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    disabled={!isSelectable}
                    className={`
                      w-8 h-8 rounded text-sm font-medium transition-colors
                      ${
                        isSelected
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : isSelectable
                            ? "hover:bg-blue-100 text-gray-900"
                            : "text-gray-300 cursor-not-allowed bg-gray-50 line-through"
                      }
                      ${isToday && !isSelected ? "border-2 border-blue-600" : ""}
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 pt-4 border-t space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded border-2 border-blue-600" />
                <span className="text-gray-600">Today</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded" />
                <span className="text-gray-600">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-50 rounded border border-gray-200" />
                <span className="text-gray-600">Unavailable</span>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}

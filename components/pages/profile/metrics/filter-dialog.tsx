"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";

interface Event {
  id: string;
  name: string;
}

interface EventFilterDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  availableEvents: Event[];
  selectedEvents: string[];
  setSelectedEvents: (selected: string[]) => void;
}

export function EventFilterDialog({
  isOpen,
  onOpenChange,
  availableEvents,
  selectedEvents,
  setSelectedEvents,
}: EventFilterDialogProps) {
  const [localSelected, setLocalSelected] = useState<string[]>(selectedEvents);

  useEffect(() => {
    setLocalSelected(selectedEvents);
  }, [selectedEvents]);

  const toggleEvent = (id: string) => {
    if (localSelected.includes(id)) {
      setLocalSelected(localSelected.filter((eventId) => eventId !== id));
    } else {
      setLocalSelected([...localSelected, id]);
    }
  };

  const handleApply = () => {
    setSelectedEvents(localSelected);
    onOpenChange(false);
  };

  const handleSelectAll = () => {
    setLocalSelected(availableEvents.map((event) => event.id));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader className="flex flex-col items-center">
          <DialogTitle>Filtrar por Evento</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-2">
          {availableEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={localSelected.includes(event.id)}
                  onCheckedChange={() => toggleEvent(event.id)}
                />
                <span className="font-medium text-gray-700">{event.name}</span>
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            className="bg-neutral-200 px-2 py-1 h-10"
            onClick={handleSelectAll}
          >
            Selecionar Todos
          </Button>
          <Button onClick={handleApply} className="h-10">
            Aplicar
          </Button>
        </DialogFooter>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}

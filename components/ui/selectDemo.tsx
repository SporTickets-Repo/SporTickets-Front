import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import * as React from "react";
import { useController } from "react-hook-form";

interface SelectProps {
  name: string;
  control: any;
  children: React.ReactNode;
  placeholder?: string;
}

export function SelectDemo({
  name,
  control,
  children,
  placeholder,
}: SelectProps) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  return (
    <div className="w-full">
      <Select {...field} onValueChange={field.onChange}>
        <SelectTrigger
          className={cn(
            "w-full bg-neutral-100 border px-3 py-1 text-base rounded-md transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-1",
            error ? "border-red-500 focus-visible:ring-red-500" : "border-input"
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="w-full">
          <SelectGroup>
            <SelectLabel>{placeholder}</SelectLabel>
            {children}
          </SelectGroup>
        </SelectContent>
      </Select>
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
}

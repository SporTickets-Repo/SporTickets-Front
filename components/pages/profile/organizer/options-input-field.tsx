import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface OptionsInputFieldProps {
  name: string;
  value: string[] | string;
  onChange: (val: string[]) => void;
  onBlur: () => void;
}

export function OptionsInputField({
  name,
  value,
  onChange,
  onBlur,
}: OptionsInputFieldProps) {
  const [inputValue, setInputValue] = useState(
    Array.isArray(value) ? value.join(", ") : ""
  );

  return (
    <FormItem>
      <FormLabel>Opções</FormLabel>
      <FormControl>
        <Input
          placeholder="Ex: sim, não, talvez"
          className="bg-muted"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={() => {
            const optionsArray = inputValue
              .split(",")
              .map((option) => option.trim())
              .filter(Boolean);
            onChange(optionsArray);
            onBlur();
          }}
          name={name}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}

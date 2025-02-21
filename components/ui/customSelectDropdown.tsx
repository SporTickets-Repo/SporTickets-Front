import { DropdownProps } from "react-day-picker";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "./select";

export function CustomSelectDropdown(props: DropdownProps) {
  const { value, onChange, children, name, className, style, ...rest } = props;

  const handleValueChange = (newValue: string) => {
    if (onChange) {
      const syntheticEvent = {
        target: { value: newValue },
      } as React.ChangeEvent<HTMLSelectElement>;

      onChange(syntheticEvent);
    }
  };

  return (
    <Select value={value?.toString()} onValueChange={handleValueChange}>
      <SelectTrigger className={className} style={style} {...rest}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>{children}</SelectContent>
    </Select>
  );
}

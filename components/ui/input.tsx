import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import * as React from "react";

interface InputProps extends React.ComponentProps<"input"> {
  error?: string;
  password?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, password = false, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const isPassword = password && type === "password";

    return (
      <div className="w-full">
        <div className="flex flex-1 relative">
          <input
            type={isPassword && showPassword ? "text" : type}
            className={cn(
              "flex h-12 w-full rounded-md border px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              error
                ? "border-red-500 focus-visible:ring-red-500"
                : "border-input bg-neutral-100",
              className
            )}
            ref={ref}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };

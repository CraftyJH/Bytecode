import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className = "", ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-prose-muted"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`w-full px-3.5 py-2.5 rounded-md text-sm text-prose bg-subtle border transition-colors duration-100
            placeholder:text-prose-faint
            focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? "border-fail" : "border-[var(--border-default)]"}
            ${className}`}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-fail" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-prose-faint">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

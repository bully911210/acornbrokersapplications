import * as React from "react";
import { cn } from "@/lib/utils";

type MaskType = 'mobile' | 'saId' | 'accountNumber';

interface MaskedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: string;
  onValueChange: (rawValue: string) => void;
  maskType: MaskType;
}

const formatters: Record<MaskType, (value: string) => string> = {
  mobile: (value: string) => {
    const clean = value.replace(/\D/g, '').substring(0, 10);
    let formatted = '';
    if (clean.length > 0) formatted += clean.substring(0, 3);
    if (clean.length > 3) formatted += ' ' + clean.substring(3, 6);
    if (clean.length > 6) formatted += ' ' + clean.substring(6, 10);
    return formatted;
  },
  saId: (value: string) => {
    const clean = value.replace(/\D/g, '').substring(0, 13);
    let formatted = '';
    // 6-4-2-1 pattern
    if (clean.length > 0) formatted += clean.substring(0, 6);
    if (clean.length > 6) formatted += ' ' + clean.substring(6, 10);
    if (clean.length > 10) formatted += ' ' + clean.substring(10, 12);
    if (clean.length > 12) formatted += ' ' + clean.substring(12, 13);
    return formatted;
  },
  accountNumber: (value: string) => {
    const clean = value.replace(/\D/g, '').substring(0, 20);
    const groups = clean.match(/.{1,4}/g) || [];
    return groups.join(' ');
  },
};

const maxLengths: Record<MaskType, number> = {
  mobile: 10,
  saId: 13,
  accountNumber: 20,
};

const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ className, value, onValueChange, maskType, ...props }, ref) => {
    const formattedValue = formatters[maskType](value);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const rawValue = inputValue.replace(/\D/g, '').substring(0, maxLengths[maskType]);
      onValueChange(rawValue);
    };

    return (
      <input
        ref={ref}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="off"
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        value={formattedValue}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

MaskedInput.displayName = "MaskedInput";

export { MaskedInput };

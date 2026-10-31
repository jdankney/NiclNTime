'use client';

import { ReactNode, useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  id: providedId,
  ...props
}: InputProps) {
  const generatedId = useId();
  const id = providedId || generatedId;
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;

  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-zinc-300 mb-1.5">
        {label}
      </label>
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          id={id}
          className={`
            w-full rounded-xl border bg-zinc-950/60 px-4 py-2.5 text-zinc-100 placeholder-zinc-600
            transition-all duration-200 shadow-inner shadow-black/20
            hover:border-zinc-600
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950
            disabled:opacity-50 disabled:cursor-not-allowed
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${error ? 'border-red-500/60 focus:ring-red-500/50' : 'border-zinc-700 focus:border-cyan-500/50 focus:ring-cyan-400/30'}
            ${className}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={helperId} className="mt-1.5 text-xs leading-relaxed text-zinc-500">
          {helperText}
        </p>
      )}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  helperText?: ReactNode;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function Select({
  label,
  error,
  helperText,
  options,
  placeholder,
  className = '',
  id: providedId,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const id = providedId || generatedId;
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;

  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-zinc-300 mb-1.5">
        {label}
      </label>
      <select
        id={id}
        className={`
          w-full rounded-xl border bg-zinc-950/60 px-4 py-2.5 text-zinc-100
          transition-all duration-200 shadow-inner shadow-black/20
          hover:border-zinc-600
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500/60 focus:ring-red-500/50' : 'border-zinc-700 focus:border-cyan-500/50 focus:ring-cyan-400/30'}
          ${className}
        `}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        {...props}
      >
        {placeholder && (
          <option value="" disabled className="bg-zinc-900">
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-zinc-900">
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={helperId} className="mt-1.5 text-xs leading-relaxed text-zinc-500">
          {helperText}
        </p>
      )}
    </div>
  );
}

interface SliderProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  className?: string;
  id?: string;
  helperText?: string;
}

export function Slider({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  formatValue,
  className = '',
  id: providedId,
  helperText,
  ...props
}: SliderProps) {
  const generatedId = useId();
  const id = providedId || generatedId;
  const helperId = `${id}-helper`;
  const percentage = max === min ? 0 : ((value - min) / (max - min)) * 100;
  const displayValue = formatValue ? formatValue(value) : String(value);

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <label htmlFor={id} className="text-sm font-medium text-zinc-300">
          {label}
        </label>
        <span className="text-xs font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2 py-1 rounded-md">
          {displayValue}
        </span>
      </div>
      <input
        type="range"
        id={id}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-valuetext={displayValue}
        aria-describedby={helperText ? helperId : undefined}
        className={`
          w-full h-2 appearance-none rounded-full cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:ring-offset-2 focus:ring-offset-zinc-950
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-5
          [&::-webkit-slider-thumb]:h-5
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-cyan-300
          [&::-webkit-slider-thumb]:border-2
          [&::-webkit-slider-thumb]:border-zinc-950
          [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(34,211,238,0.55)]
          [&::-webkit-slider-thumb]:transition-transform
          [&::-webkit-slider-thumb]:hover:scale-110
          [&::-moz-range-thumb]:w-5
          [&::-moz-range-thumb]:h-5
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-cyan-300
          [&::-moz-range-thumb]:border-2
          [&::-moz-range-thumb]:border-zinc-950
        `}
        style={{
          background: `linear-gradient(to right, #22d3ee 0%, #22d3ee ${percentage}%, #27272a ${percentage}%, #27272a 100%)`,
        }}
        {...props}
      />
      <div className="flex justify-between text-[11px] text-zinc-600 mt-1.5">
        <span>{formatValue ? formatValue(min) : min}</span>
        <span>{formatValue ? formatValue(max) : max}</span>
      </div>
      {helperText && (
        <p id={helperId} className="mt-1 text-xs text-zinc-500">
          {helperText}
        </p>
      )}
    </div>
  );
}

interface ToggleProps {
  label?: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

export function Toggle({
  label,
  description,
  checked,
  onChange,
  disabled,
  className = '',
  ariaLabel,
}: ToggleProps) {
  return (
    <label
      className={`flex items-start gap-3 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
    >
      <div className="relative mt-1 shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          disabled={disabled}
          aria-label={ariaLabel || label || 'Toggle'}
          className="sr-only peer"
        />
        <div
          className={`
            w-11 h-6 rounded-full transition-colors duration-200
            ${checked ? 'bg-cyan-400' : 'bg-zinc-700'}
            peer-focus-visible:ring-2 peer-focus-visible:ring-cyan-400/60 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-zinc-950
          `}
        >
          <div
            className={`
              w-5 h-5 rounded-full bg-white shadow-lg transition-transform duration-200
              ${checked ? 'translate-x-[22px]' : 'translate-x-0.5'} translate-y-0.5
            `}
          />
        </div>
      </div>
      {(label || description) && (
        <div>
          {label && <span className="block text-sm font-medium text-zinc-100">{label}</span>}
          {description && <span className="block text-xs text-zinc-500 mt-0.5">{description}</span>}
        </div>
      )}
    </label>
  );
}

interface NumberInputProps extends Omit<InputProps, 'type'> {
  min?: number;
  max?: number;
  step?: number;
}

export function NumberInput({
  min = 0,
  max = 1000,
  step = 1,
  className = '',
  ...props
}: NumberInputProps) {
  return (
    <Input
      type="number"
      min={min}
      max={max}
      step={step}
      className={className}
      inputMode="decimal"
      {...props}
    />
  );
}

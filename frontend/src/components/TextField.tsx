import React from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';

// Interface defining props for the reusable input component
interface TextFieldProps {
  label: string;
  id: string;
  type: string;
  errors: FieldErrors;
  register: UseFormRegister<any>; // Accepts register function from any form schema
  required?: boolean;
  message?: string;
  className?: string;
  min?: number;
  value?: string | number;
  placeholder?: string;
}

// Reusable form input component with integrated React Hook Form validation
const TextField: React.FC<TextFieldProps> = ({
  label,
  id,
  type,
  errors,
  register,
  required,
  message,
  className,
  min,
  placeholder,
}) => {
  return (
    <div className="flex flex-col gap-1">
      {/* Input Label */}
      <label
        htmlFor={id}
        className={`${className ? className : ""} font-semibold text-md`}
      >
        {label}
      </label>

      {/* Input Field with Validation Rules */}
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        className={`${
          className ? className : ""
        } px-2 py-2 border outline-none bg-transparent text-slate-700 rounded-md ${
          errors[id]?.message ? "border-red-500" : "border-slate-600"
        }`}
        {...register(id, {
          required: { value: required || false, message: message || "This field is required" },
          minLength: min
            ? { value: min, message: `Minimum ${min} characters required` }
            : undefined,
          pattern:
            type === "email"
              ? {
                  value: /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+com+$/,
                  message: "Invalid email",
                }
              : type === "url"
              ? {
                  value:
                    /^(https?:\/\/)?(([a-zA-Z0-9\u00a1-\uffff-]+\.)+[a-zA-Z\u00a1-\uffff]{2,})(:\d{2,5})?(\/[^\s]*)?$/,
                  message: "Please enter a valid url",
                }
              : undefined,
        })}
      />

      {/* Error Message Display */}
      {errors[id]?.message && (
        <p className="text-sm font-semibold text-red-600 mt-0">
          {errors[id]?.message as string}*
        </p>
      )}
    </div>
  );
};

export default TextField;
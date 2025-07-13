import React from "react";

// Button
export function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// Input
export function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400 ${className}`}
      {...props}
    />
  );
}

// Label
export function Label({ children, htmlFor, className = "" }) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-gray-700 ${className}`}
    >
      {children}
    </label>
  );
}

// Card Components
export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return (
    <div className={`border-b p-4 ${className}`}>{children}</div>
  );
}

export function CardTitle({ children, className = "" }) {
  return (
    <h2 className={`text-xl font-bold ${className}`}>{children}</h2>
  );
}

export function CardDescription({ children, className = "" }) {
  return (
    <p className={`text-gray-500 text-sm ${className}`}>{children}</p>
  );
}

export function CardContent({ children, className = "" }) {
  return (
    <div className={`p-4 ${className}`}>{children}</div>
  );
}

export function CardFooter({ children, className = "" }) {
  return (
    <div className={`border-t p-4 flex justify-end ${className}`}>{children}</div>
  );
}

// Alert Components
export function Alert({ children, className = "", variant = "default" }) {
  const baseStyle = "p-4 rounded border text-sm";
  const variantStyle =
    variant === "destructive"
      ? "bg-red-100 border-red-400 text-red-700"
      : "bg-gray-100 border-gray-300 text-gray-700";

  return (
    <div className={`${baseStyle} ${variantStyle} ${className}`}>
      {children}
    </div>
  );
}

export function AlertDescription({ children, className = "" }) {
  return <p className={`mt-1 ${className}`}>{children}</p>;
}

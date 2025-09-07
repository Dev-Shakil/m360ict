"use client";
import React from "react";

interface FieldErrorProps {
  error?: string | undefined;
}

export const FieldError: React.FC<FieldErrorProps> = ({ error }) => {
  if (!error) return null;
  return <p className="text-sm text-red-600">{error}</p>;
};


// components/onboarding/Stepper.tsx
import React from "react";
import clsx from "clsx";

export default function Stepper({ steps, current }: { steps: string[], current: number }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center flex-wrap gap-3">
          <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center font-medium",
            i === current ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700")}>
            {i+1}
          </div>
          <div className={clsx("text-sm", i === current ? "text-blue-700" : "text-gray-600") }>{s}</div>
        </div>
      ))}
    </div>
  );
}

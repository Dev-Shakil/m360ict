// components/onboarding/Step3Skills.tsx
"use client";
import React, { useMemo } from "react";
import { useFormContext, FieldErrors } from "react-hook-form";
import { skillsByDepartment } from "@/mock/skills";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { OnboardingValues } from "@/lib/validation/schemas";

export default function Step3Skills() {
  const { register, watch, setValue, formState } = useFormContext<OnboardingValues>();
  const errors: FieldErrors<OnboardingValues> = formState.errors;

  const department = watch("job.department") || "Engineering";
  const skills = useMemo(() => skillsByDepartment[department] || [], [department]);
  const selected: string[] = watch("skills.skills") || [];

  return (
    <div className="space-y-4">
      {/* Primary Skills */}
      <div className="space-y-2">
        <Label>Primary Skills (select at least 3)</Label>
        <div className="grid md:grid-cols-3 grid-cols-2 gap-2">
          {skills.map((s) => {
            const checked = selected.includes(s);
            return (
              <label
                key={s}
                className={`flex items-center gap-2 p-2 rounded ${
                  checked ? "bg-blue-50 border-blue-200" : "border-gray-100"
                }`}
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={(v: boolean) => {
                    const next = new Set(selected);
                    if (v) next.add(s);
                    else next.delete(s);
                    setValue("skills.skills", Array.from(next));
                  }}
                />
                <span>{s}</span>
              </label>
            );
          })}
        </div>
        <p className="text-sm text-red-600">{errors.skills?.skills?.message}</p>
      </div>

      {/* Experience per Skill */}
      <div className="space-y-2">
        <Label>Experience per selected skill (years)</Label>
        <div className="grid md:grid-cols-2 gap-2">
          {selected.map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div className="w-40">{s}</div>
              <Input
                type="number"
                step="0.5"
                {...register(`skills.experienceBySkill.${s}`, { valueAsNumber: true })}
              />
              <div className="text-sm text-gray-500">years</div>
              <div className="text-sm text-red-600">
                {errors.skills?.experienceBySkill?.[s]?.message}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Work Hours & Remote Preference */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Preferred Start</Label>
          <Input type="time" {...register("skills.workStart")} />
        </div>
        <div className="space-y-2">
          <Label>Preferred End</Label>
          <Input type="time" {...register("skills.workEnd")} />
          <p className="text-sm text-red-600">{errors.skills?.workEnd?.message}</p>
        </div>
        <div className="space-y-2">
          <Label>Remote Preference: {watch("skills.remotePreference") ?? 0}%</Label>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            {...register("skills.remotePreference", { valueAsNumber: true })}
          />
        </div>
      </div>

      {/* Manager Approval if Remote >50% */}
      {watch("skills.remotePreference") > 50 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input type="checkbox" {...register("skills.managerApproved")} />
            <span>Manager Approved</span>
          </div>
          <p className="text-sm text-red-600">{errors.skills?.managerApproved?.message}</p>
        </div>
      )}

      {/* Extra Notes */}
      <div className="space-y-2">
        <Label>Extra Notes</Label>
        <textarea
          {...register("skills.notes")}
          className="w-full border p-2 rounded"
          maxLength={500}
        />
        <div className="text-sm text-gray-500">
          {(watch("skills.notes")?.length || 0)}/500
        </div>
      </div>
    </div>
  );
}

"use client";
import React, { useMemo } from "react";
import { useFormContext, Controller, FieldErrors } from "react-hook-form";
import { mockManagers } from "@/mock/managers";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { OnboardingValues } from "@/lib/validation/schemas";

export default function Step2Job() {
  const { register, control, watch, formState } =
    useFormContext<OnboardingValues>();
  const errors: FieldErrors<OnboardingValues> = formState.errors;

  const department = watch("job.department") || "";
  const jobType = watch("job.jobType") || "Full-time";

  // Get unique departments from manager data
  const departments = useMemo(() => {
    return Array.from(new Set(mockManagers.map((m) => m.department)));
  }, []);

  // Filter managers based on selected department
  const managers = useMemo(
    () => mockManagers.filter((m) => m.department === department),
    [department]
  );

  return (
    <div className="space-y-4">
      {/* Department + Manager */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 w-full">
          <Label>Department</Label>
          <Controller
            name="job.department"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <p className="text-sm text-red-600">
            {errors.job?.department?.message}
          </p>
        </div>

        <div className="space-y-2 w-full">
          <Label>Manager</Label>
          <Controller
            name="job.managerId"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select manager" />
                </SelectTrigger>
                <SelectContent>
                  {managers.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <p className="text-sm text-red-600">
            {errors.job?.managerId?.message}
          </p>
        </div>
      </div>

      {/* Position Title + Start Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Position Title</Label>
          <Input {...register("job.positionTitle")} />
          <p className="text-sm text-red-600">
            {errors.job?.positionTitle?.message}
          </p>
        </div>

        <div className="space-y-2">
          <Label>Start Date</Label>
          <Input type="date" {...register("job.startDate")} />
          <p className="text-sm text-red-600">
            {errors.job?.startDate?.message}
          </p>
        </div>
      </div>

      {/* Job Type + Salary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Job Type</Label>
          <Controller
            name="job.jobType"
            control={control}
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="Full-time" id="jt-full" />
                  <label htmlFor="jt-full">Full-time</label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="Part-time" id="jt-part" />
                  <label htmlFor="jt-part">Part-time</label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="Contract" id="jt-ct" />
                  <label htmlFor="jt-ct">Contract</label>
                </div>
              </RadioGroup>
            )}
          />
        </div>

        <div className="space-y-2">
          {jobType === "Contract" ? (
            <>
              <Label>Hourly ($50–$150)</Label>
              <Input
                type="number"
                {...register("job.salaryHourly", { valueAsNumber: true })}
              />
              <p className="text-sm text-red-600">
                {errors.job?.salaryHourly?.message}
              </p>
            </>
          ) : (
            <>
              <Label>Annual ($30k–$200k)</Label>
              <Input
                type="number"
                {...register("job.salaryAnnual", { valueAsNumber: true })}
              />
              <p className="text-sm text-red-600">
                {errors.job?.salaryAnnual?.message}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

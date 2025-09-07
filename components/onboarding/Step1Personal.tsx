"use client";
import React from "react";
import { useFormContext, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OnboardingValues } from "@/lib/validation/schemas";
import { FieldError } from "./_FeildError";

export default function Step1Personal() {
  const { register, formState, setValue } = useFormContext<OnboardingValues>();
  const errors: FieldErrors<OnboardingValues> = formState.errors;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setValue("personal.profilePicture", files[0], { shouldValidate: true });
    } else {
      setValue("personal.profilePicture", undefined, { shouldValidate: true });
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Full Name</Label>
        <Input {...register("personal.fullName")} placeholder="Jane Doe" />
        <FieldError error={errors.personal?.fullName?.message} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Email</Label>
          <Input {...register("personal.email")} />
          <FieldError error={errors.personal?.email?.message} />
        </div>
        <div className="space-y-2">
          <Label>Phone</Label>
          <Input {...register("personal.phone")} placeholder="+1-123-456-7890" />
          <FieldError error={errors.personal?.phone?.message} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Date of Birth</Label>
          <Input type="date" {...register("personal.dob")} />
          <FieldError error={errors.personal?.dob?.message} />
        </div>
        <div className="space-y-2">
          <Label>Profile Picture</Label>
          <Input type="file" accept="image/png,image/jpg" onChange={handleFileChange} />
          <FieldError error={errors.personal?.profilePicture?.message as string | undefined} />
        </div>
      </div>
    </div>
  );
}

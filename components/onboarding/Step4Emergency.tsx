"use client";

import React from "react";
import { useFormContext, FieldErrors } from "react-hook-form";
import { getAgeFromDOB } from "@/utils/form";
import { OnboardingValues } from "@/lib/validation/schemas";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Step4Emergency() {
  const { register, watch, formState, setValue } =
    useFormContext<OnboardingValues>();
  const errors: FieldErrors<OnboardingValues> = formState.errors;

  const dob = watch("personal.dob");
  const age = getAgeFromDOB(dob);

  return (
    <div className="space-y-4">
      {/* Contact Name */}
      <div className="space-y-2">
        <Label htmlFor="contactName">Contact Name</Label>
        <Input id="contactName" {...register("emergency.contactName")} />
        {errors.emergency?.contactName && (
          <p className="text-sm text-red-600">
            {errors.emergency.contactName.message}
          </p>
        )}
      </div>

      {/* Relationship */}
      <div className="space-y-2">
        <Label>Relationship</Label>
        <Select
          onValueChange={(val) => setValue("emergency.relationship", val)}
          defaultValue={watch("emergency.relationship")}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Parent">Parent</SelectItem>
            <SelectItem value="Spouse">Spouse</SelectItem>
            <SelectItem value="Sibling">Sibling</SelectItem>
            <SelectItem value="Friend">Friend</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.emergency?.relationship && (
          <p className="text-sm text-red-600">
            {errors.emergency.relationship.message}
          </p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="contactPhone">Phone</Label>
        <Input
          id="contactPhone"
          {...register("emergency.contactPhone")}
          placeholder="+1-123-456-7890"
        />
        {errors.emergency?.contactPhone && (
          <p className="text-sm text-red-600">
            {errors.emergency.contactPhone.message}
          </p>
        )}
      </div>

      {/* Guardian Info if under 21 */}
      {age !== null && age < 21 && (
        <div className="border p-3 rounded space-y-4">
          <div className="space-y-2">
            <Label htmlFor="guardianName">Guardian Name</Label>
            <Input id="guardianName" {...register("emergency.guardianName")} />
            {errors.emergency?.guardianName && (
              <p className="text-sm text-red-600">
                {errors.emergency.guardianName.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="guardianPhone">Guardian Phone</Label>
            <Input
              id="guardianPhone"
              {...register("emergency.guardianPhone")}
              placeholder="+1-123-456-7890"
            />
            {errors.emergency?.guardianPhone && (
              <p className="text-sm text-red-600">
                {errors.emergency.guardianPhone.message}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

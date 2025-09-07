"use client";
import React from "react";
import { useFormContext, FieldErrors } from "react-hook-form";
import { OnboardingValues } from "@/lib/validation/schemas";
import { mockManagers } from "@/mock/managers";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Step5Review() {
  const { watch, setValue, formState } = useFormContext<OnboardingValues>();
  const errors: FieldErrors<OnboardingValues> = formState.errors;
  const values = watch();

  const managerName =
    mockManagers.find((m) => m.id === values.job?.managerId)?.name ?? "";
  const skillsList = (values.skills?.skills || []).join(", ");

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Review Your Information</h3>
      <p className="text-sm text-muted-foreground">
        Please check carefully before submitting.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal */}
        <Card>
          <CardHeader>
            <CardTitle>Personal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><b>Name:</b> {values.personal?.fullName}</div>
            <div><b>Email:</b> {values.personal?.email}</div>
            <div><b>Phone:</b> {values.personal?.phone}</div>
            <div><b>DOB:</b> {values.personal?.dob}</div>
          </CardContent>
        </Card>

        {/* Job */}
        <Card>
          <CardHeader>
            <CardTitle>Job</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><b>Department:</b> {values.job?.department}</div>
            <div><b>Title:</b> {values.job?.positionTitle}</div>
            <div><b>Start Date:</b> {values.job?.startDate}</div>
            <div><b>Job Type:</b> {values.job?.jobType}</div>
            <div>
              <b>Salary:</b>{" "}
              {values.job?.jobType === "Contract"
                ? `$${values.job.salaryHourly ?? 0}/hr`
                : `$${values.job.salaryAnnual ?? 0}`}
            </div>
            <div><b>Manager:</b> {managerName}</div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><b>Skills:</b> {skillsList}</div>
            <div>
              <b>Hours:</b> {values.skills?.workStart} – {values.skills?.workEnd}
            </div>
            <div>
              <b>Remote:</b> {values.skills?.remotePreference}%
              {values.skills?.remotePreference > 50
                ? values.skills?.managerApproved
                  ? " (Approved)"
                  : " (Pending)"
                : ""}
            </div>
            {values.skills?.notes && (
              <div><b>Notes:</b> {values.skills.notes}</div>
            )}
          </CardContent>
        </Card>

        {/* Emergency */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><b>Contact:</b> {values.emergency?.contactName}</div>
            <div><b>Relationship:</b> {values.emergency?.relationship}</div>
            <div><b>Phone:</b> {values.emergency?.contactPhone}</div>
            {values.emergency?.guardianName && (
              <div>
                <b>Guardian:</b> {values.emergency.guardianName} (
                {values.emergency.guardianPhone})
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Confirmation */}
      <div className="flex items-center gap-3">
        <Checkbox
          id="confirm"
          checked={!!values.review?.confirm}
          onCheckedChange={(v) => setValue("review.confirm", v === true)}
        />
        <Label htmlFor="confirm">
          I confirm all information provided is correct
        </Label>
      </div>
      {errors.review?.confirm && (
        <p className="text-sm text-red-600">{errors.review.confirm.message}</p>
      )}
    </div>
  );
}

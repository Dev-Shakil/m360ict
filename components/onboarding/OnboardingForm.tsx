"use client";

import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Step1Personal from "./Step1Personal";
import Step2Job from "./Step2Job";
import Step3Skills from "./Step3Skills";
import Step4Emergency from "./Step4Emergency";
import Step5Review from "./Step5Review";
import Stepper from "./Stepper";
import { onboardingSchema, OnboardingValues } from "@/lib/validation/schemas";
import { getAgeFromDOB, transformPayload } from "@/utils/form";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

const STEPS = ["Personal", "Job", "Skills", "Emergency", "Review"];

const defaultValues: Partial<OnboardingValues> = {
  personal: {
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    profilePicture: undefined,
  },
  job: {
    department: "Engineering",
    positionTitle: "",
    startDate: "",
    jobType: "Full-time",
    salaryAnnual: undefined,
    salaryHourly: undefined,
    managerId: "",
  },
  skills: {
    skills: [],
    experienceBySkill: {},
    workStart: "09:00",
    workEnd: "17:00",
    remotePreference: 0,
    managerApproved: false,
    notes: "",
  },
  emergency: {
    contactName: "",
    relationship: "",
    contactPhone: "",
    guardianName: undefined,
    guardianPhone: undefined,
  },
  review: {
    confirm: false,
  },
};

export default function OnboardingForm() {
  const [step, setStep] = useState(0);
  const [autoSaved, setAutoSaved] =
    useState<Partial<OnboardingValues>>(defaultValues);
  const [dirty, setDirty] = useState(false);

  const methods = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues,
    mode: "onChange",
  });

  const { handleSubmit, watch, trigger, getValues } = methods;

  // autosave into React state (NOT localStorage)
  useEffect(() => {
    const sub = watch((v) => {
      setAutoSaved(v as Partial<OnboardingValues>);
      setDirty(true);
    });
    return () => sub.unsubscribe();
  }, [watch]);

  // warn before unload
  useEffect(() => {
    const onBefore = (e: BeforeUnloadEvent) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBefore);
    return () => window.removeEventListener("beforeunload", onBefore);
  }, [dirty]);

  // helper to validate current step before moving next
  const stepFields: (keyof OnboardingValues | string)[][] = [
  ["personal.fullName", "personal.email", "personal.phone", "personal.dob"],
  [
    "job.department",
    "job.positionTitle",
    "job.startDate",
    "job.jobType",
    "job.managerId",
    "job.salaryAnnual",
    "job.salaryHourly",
  ],
  [
    "skills.skills",
    "skills.experienceBySkill",
    "skills.workStart",
    "skills.workEnd",
    "skills.remotePreference",
  ],
  [
    "emergency.contactName",
    "emergency.relationship",
    "emergency.contactPhone",
    "emergency.guardianName",
    "emergency.guardianPhone",
  ],
  ["review.confirm"],
];


  const canGoNext = async () => {
    // guardian requirement if age < 21
    const dob = getValues("personal.dob");
    const age = getAgeFromDOB(dob);
    if (age !== null && age < 21) {
      const gName = getValues("emergency.guardianName");
      const gPhone = getValues("emergency.guardianPhone");
      if (!gName || !gPhone) {
        await trigger([
          "emergency.guardianName",
          "emergency.guardianPhone",
        ]);
      }
    }
    const ok = await trigger(stepFields[step] as (keyof OnboardingValues)[]);
    return ok;
  };

  const next = async () => {
    if (await canGoNext()) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = (values: OnboardingValues) => {
    const payload = transformPayload(values);
    console.log("Final payload", payload);
    setDirty(false);
    alert("Submitted! Check console for payload.");
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto p-6 space-y-6"
      >
        <h2 className="text-2xl font-bold">New Employee Onboarding</h2>
        <Stepper steps={STEPS} current={step} />

        {step === 0 && <Step1Personal />}
        {step === 1 && <Step2Job />}
        {step === 2 && <Step3Skills />}
        {step === 3 && <Step4Emergency />}
        {step === 4 && <Step5Review />}

        <div className="md:flex justify-center md:justify-between items-center gap-2 space-y-3  flex-col">
  <div className="flex gap-2">
    {step > 0 && (
      <Button
        type="button"
        variant="destructive"
        onClick={prev}
        className="flex items-center gap-2 rounded-2xl shadow-md transition-all hover:scale-105 active:scale-95"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
    )}

    {step < STEPS.length - 1 && (
      <Button
        type="button"
        onClick={next}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-md transition-all hover:scale-105 active:scale-95"
      >
        Next
        <ArrowRight className="h-4 w-4" />
      </Button>
    )}

    {step === STEPS.length - 1 && (
      <Button
        type="submit"
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-2xl shadow-md transition-all hover:scale-105 active:scale-95"
      >
        <Check className="h-4 w-4" />
        Submit
      </Button>
    )}
  </div>

  <div className="text-sm text-gray-600">
    {dirty ? "Unsaved changes (auto-saved locally)" : "All changes saved"}
  </div>
</div>
      </form>
    </FormProvider>
  );
}

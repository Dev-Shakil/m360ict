// utils/form.ts
import { OnboardingValues } from "@/lib/validation/schemas";

export function getAgeFromDOB(dob?: string): number | null {
  if (!dob) return null;
  const d = new Date(dob);
  if (isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age;
}

// Transform Job type: remove original salaries, add transformed fields
type TransformedJob = Omit<OnboardingValues["job"], "salaryAnnual" | "salaryHourly"> & {
  annualSalary?: number;
  hourlyRate?: number;
};

// Transformed payload type
export interface TransformedPayload {
  personal: OnboardingValues["personal"] & { phone: string };
  job: TransformedJob;
  skills: Omit<OnboardingValues["skills"], "remotePreference"> & { remotePreference: number };
  emergency: OnboardingValues["emergency"];
  meta: { age: number | null };
}

export function transformPayload(values: OnboardingValues): TransformedPayload {
  const job: TransformedJob = {
    department: values.job.department,
    positionTitle: values.job.positionTitle,
    startDate: values.job.startDate,
    jobType: values.job.jobType,
    managerId: values.job.managerId,
    annualSalary: values.job.jobType === "Full-time" || values.job.jobType === "Part-time"
      ? values.job.salaryAnnual
      : undefined,
    hourlyRate: values.job.jobType === "Contract" ? values.job.salaryHourly : undefined,
  };

  const payload: TransformedPayload = {
    personal: {
      ...values.personal,
      phone: values.personal.phone.replace(/\s+/g, ""),
    },
    job,
    skills: {
      ...values.skills,
      remotePreference: values.skills.remotePreference / 100,
    },
    emergency: { ...values.emergency },
    meta: { age: getAgeFromDOB(values.personal.dob) },
  };

  return payload;
}

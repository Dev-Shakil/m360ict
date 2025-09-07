import { z } from "zod";

const phoneRegex = /^\+\d{1,3}-\d{3}-\d{3}-\d{4}$/;

const Departments = ["Engineering", "Marketing", "Sales", "HR", "Finance"] as const;
const JobTypes = ["Full-time", "Part-time", "Contract"] as const;

const todayStart = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const parseDate = (s?: string) => (s ? new Date(s) : undefined);

// Personal Schema
const personalSchema = z.object({
  fullName: z
    .string()
    .min(1, "Required")
    .refine((v) => v.trim().split(/\s+/).length >= 2, "Enter at least 2 words"),
  email: z.string().email("Invalid email"),
  phone: z.string().regex(phoneRegex, "Format: +1-123-456-7890"),
  dob: z.string().refine((v) => {
    const d = parseDate(v);
    if (!d) return false;
    const now = todayStart();
    const e = new Date(d);
    e.setFullYear(e.getFullYear() + 18);
    return e <= now;
  }, "Must be at least 18 years old"),
  profilePicture: z
    .any()
    .optional()
    .refine(
      (f) =>
        !f ||
        f.length === 0 ||
        (f[0] instanceof File &&
          ["image/png", "image/jpg"].includes(f[0].type)),
      "Only JPG/PNG"
    )
    .refine(
      (f) => !f || f.length === 0 || (f[0]?.size ?? 0) <= 2 * 1024 * 1024,
      "Max 2MB"
    ),
});

// Job Schema
const jobSchema = z
  .object({
    department: z.enum(Departments),
    positionTitle: z.string().min(3, "Min 3 chars"),
    startDate: z.string(),
    jobType: z.enum(JobTypes),
    salaryAnnual: z.number().optional(),
    salaryHourly: z.number().optional(),
    managerId: z.string().min(1, "Manager required"),
  })
  .superRefine((val, ctx) => {
    const sd = parseDate(val.startDate);
    if (!sd) {
      ctx.addIssue({ code: "custom", message: "Invalid start date", path: ["startDate"] });
      return;
    }

    const t = todayStart();
    if (sd < t)
      ctx.addIssue({
        code: "custom",
        message: "Start date cannot be in the past",
        path: ["startDate"],
      });

    const max = new Date(t);
    max.setDate(max.getDate() + 90);
    if (sd > max)
      ctx.addIssue({
        code: "custom",
        message: "Start date must be within 90 days",
        path: ["startDate"],
      });

    if ((val.department === "HR" || val.department === "Finance") && [5, 6].includes(sd.getDay())) {
      ctx.addIssue({
        code: "custom",
        message: "HR/Finance cannot start on Friday or Saturday",
        path: ["startDate"],
      });
    }

    // salary rules
    if (val.jobType === "Contract") {
      if (typeof val.salaryHourly !== "number")
        ctx.addIssue({
          code: "custom",
          message: "Hourly rate required for contracts",
          path: ["salaryHourly"],
        });
      else if (val.salaryHourly < 50 || val.salaryHourly > 150)
        ctx.addIssue({
          code: "custom",
          message: "$50–$150/hr",
          path: ["salaryHourly"],
        });
    } else {
      if (typeof val.salaryAnnual !== "number")
        ctx.addIssue({
          code: "custom",
          message: "Annual salary required",
          path: ["salaryAnnual"],
        });
      else if (val.salaryAnnual < 30000 || val.salaryAnnual > 200000)
        ctx.addIssue({
          code: "custom",
          message: "$30k–$200k",
          path: ["salaryAnnual"],
        });
    }
  });

// Skills Schema
const skillsSchema = z
  .object({
    skills: z.array(z.string()).min(3, "Choose at least 3 skills"),
    experienceBySkill: z.record(z.string(), z.number().min(0).max(50)),
    workStart: z.string(),
    workEnd: z.string(),
    remotePreference: z.number().min(0).max(100),
    managerApproved: z.boolean().optional(),
    notes: z.string().max(500).optional(),
  })
  .superRefine((val, ctx) => {
    for (const s of val.skills) {
      if (typeof val.experienceBySkill?.[s] !== "number") {
        ctx.addIssue({
          code: "custom",
          message: `Add experience for ${s}`,
          path: ["experienceBySkill", s],
        });
      }
    }

    const parseHM = (h: string) => {
      const [hh, mm] = h.split(":").map(Number);
      return hh * 60 + mm;
    };
    if (!(parseHM(val.workStart) < parseHM(val.workEnd))) {
      ctx.addIssue({
        code: "custom",
        message: "End time must be after start time",
        path: ["workEnd"],
      });
    }

    if (val.remotePreference > 50 && !val.managerApproved) {
      ctx.addIssue({
        code: "custom",
        message: "Manager approval required for >50% remote",
        path: ["managerApproved"],
      });
    }
  });

// Emergency Schema
const emergencySchema = z
  .object({
    contactName: z.string().min(1, "Contact name required"),
    relationship: z.string().min(1),
    contactPhone: z.string().regex(phoneRegex),
    guardianName: z.string().optional(),
    guardianPhone: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.guardianPhone && !phoneRegex.test(val.guardianPhone)) {
      ctx.addIssue({
        code: "custom",
        message: "Invalid guardian phone",
        path: ["guardianPhone"],
      });
    }
  });

// Review Schema
const reviewSchema = z.object({
  confirm: z.boolean().refine((v) => v === true, "You must confirm"),
});

// Full Onboarding Schema
export const onboardingSchema = z.object({
  personal: personalSchema,
  job: jobSchema,
  skills: skillsSchema,
  emergency: emergencySchema,
  review: reviewSchema,
});

export type OnboardingValues = z.infer<typeof onboardingSchema>;

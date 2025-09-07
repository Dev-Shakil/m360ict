import OnboardingForm from "@/components/onboarding/OnboardingForm";

export default function Home() {
  return (

    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <OnboardingForm />
      </div>
    </div>
  )
}
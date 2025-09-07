🚀 How to Run the Project

Clone the repository

git clone https://github.com/Dev-Shakil/m360ict.git
cd m360ict


Install dependencies

npm install
# or
yarn install


Run the development server

npm run dev
# or
yarn dev


Open in your browser

http://localhost:3000

🧠 Handling Complex Logic

This project involves multiple steps of form onboarding with validation and conditional rendering.

I used React Hook Form with Zod validation schemas to manage nested fields (personal, emergency, etc.).

For age calculation, I created a utility function getAgeFromDOB to dynamically determine if the user is under 21 and display guardian fields.

I replaced native HTML form elements with shadcn/ui components for consistent design and better accessibility.

Error messages are shown directly under each input, ensuring clarity for users during onboarding.

By splitting the logic into modular components (Step1, Step2, Step3, Step4), each part of the onboarding flow remains maintainable and testable.

📌 Assumptions Made

The user’s date of birth is always provided in a valid format (YYYY-MM-DD).

Emergency contacts are required for all users, but guardian details are required only if the user is under 21.

Department values are fetched from the manager’s data (assumed to be available from the API or context).

Phone numbers are entered in international format (e.g., +1-123-456-7890).

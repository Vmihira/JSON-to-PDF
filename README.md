PDF Generation
The PDF report is generated using the generatePDF(data) function which formats the report from the JSON accept.json. This function:

Extracts the score and tech stack

Formats them into a printable PDF

Triggers a download for the user

You can extend the generator to include project name, certificate ID, or add branding.

Running the Project

Install dependencies:
npm install

Start the development server:
npm run dev

# Domain and Email Availability Checker

This project provides a web-based interface to check the availability of domain names and email addresses. It is built using Astro, Tailwind CSS, and Node.js, with APIs for handling domain WHOIS lookups and email verification.

## Features

### Domain Availability Checker
- **Domain Input**: Users can input a domain name to check its availability.
- **TLD Validation**: The application validates the TLD (Top-Level Domain) to ensure it is a known and supported domain extension.
- **WHOIS Lookup**: The application performs a WHOIS lookup to determine if the domain is registered.
  - **Not Registered Domains**: If the WHOIS response includes "Not found" or "No match", the domain is marked as "Not Registered".
  - **Registered Domains**: If the domain is found to be registered, it is marked as "Registered".
- **WHOIS Data Display**: Users can view the WHOIS data of the domain by clicking a toggle button.
- **DNS Record Lookup**: Users can view the DNS records associated with the domain.
  - **DNS Data Fetch**: DNS records are fetched using the application's API and displayed in a scrollable code block.
  - **DNS Data Toggle**: Users can toggle the visibility of the DNS data without re-fetching the information.
- **Purchase Option**: For domains that are not registered, a "Buy with GoDaddy" button is provided, linking directly to GoDaddy's domain purchase page.

### Email Availability Checker
- **Email Input**: Users can input an email address to check its availability.
- **Email Format Validation**: The application checks that the input is in a valid email format.
- **MX Record Check**: The application verifies the domain part of the email by checking its MX records to ensure the domain can receive emails.
- **SMTP Verification**: The application performs an SMTP handshake to verify if the specific email address is in use (subject to the limitations of SMTP verification).
  - **Available Email**: If the email is determined to be available, it is marked as "Email is available".
  - **In Use Email**: If the email is in use, it is marked as "Email is in use".
- **Email Data Display**: Users can view additional data about the email address after the check is performed.

### General Features
- **Loading Indicators**: Both the domain and email checkers provide visual feedback with a loading spinner while the checks are being performed.
- **Error Handling**: The application handles errors gracefully, displaying appropriate messages if a check fails or if the input is invalid.
- **Responsive Design**: The interface is built with Tailwind CSS, ensuring it is responsive and user-friendly across different devices.
- **JavaScript Functions**: Key operations such as WHOIS lookups, DNS data fetching, and SMTP email verification are handled through JavaScript, providing a seamless user experience.

## Installation

To run this project locally, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/Naainz/Domains.git
cd Domains
```

2. Install the dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and visit `http://localhost:4321` to view the application.

## Technologies Used

- **Astro**: A modern static site generator that combines the best parts of traditional frameworks like React, Vue, Svelte, and more.
- **Tailwind CSS**: A utility-first CSS framework that provides low-level utility classes to build custom designs quickly.
- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine that allows you to run JavaScript on the server.

## License

This project is licensed under the [MIT License](LICENSE).
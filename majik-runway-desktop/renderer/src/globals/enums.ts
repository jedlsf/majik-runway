export const GlobalSheetView = {
  VIEW: "View",
  EDIT: "Edit",
  CREATE: "Create",
  DELETE: "Delete",
  ARCHIVE: "Archive",
  CUSTOM_A: "Custom-A",
  CUSTOM_B: "Custom-B",
  CUSTOM_C: "Custom-C",
  CLOSED: "Closed",
} as const;

export type GlobalSheetView =
  (typeof GlobalSheetView)[keyof typeof GlobalSheetView];

export const GlobalViewType = {
  LIST: "List",
  GRID: "Grid",
  TABLE: "Table",
} as const;

export type GlobalViewType =
  (typeof GlobalViewType)[keyof typeof GlobalViewType];

/*
ENUM FOR DATA PRIVACY TERMS

*/

export const ENUM_DataPrivacyTerms_Majikah = Object.freeze({
  SCOPE: {
    index: 1,
    title: "Scope",
    subitems: [
      {
        subtitle:
          "This policy governs how Majikah Creative Solutions collects, uses, stores, shares, and secures personal and sensitive personal information in compliance with the Data Privacy Act of 2012 (RA 10173).",
        subitems: [],
      },
    ],
  },
  DATA_COLLECTION: {
    index: 2,
    title: "Collection of Personal Data",
    subitems: [
      {
        subtitle:
          "Majikah collects personal and sensitive personal information from users, including:",
        subitems: [
          "Full name, first name, middle name, last name, suffix",
          "Display name and profile picture",
          "Phone number",
          "Gender, birthdate, age",
          "Address",
          "Preferred payment method",
          "IP address and activity logs",
          "Google APIs, Spotify, SoundCloud, and Pinterest integrations",
          "Uploaded files, comments, gigs, projects, tickets",
          "Client and artist data, earnings, and events",
        ],
      },
      {
        subtitle:
          "Sensitive personal information includes government-issued IDs (for KYC) and bank details for subscriptions via Maya.",
        subitems: [],
      },
      {
        subtitle:
          "Data is collected via platform forms, Next.js APIs, and third-party integrations.",
        subitems: [],
      },
      {
        subtitle:
          "Automated data (e.g. via cookies, logs, Sentry, Google Analytics) is collected for monitoring and analytics.",
        subitems: [],
      },
    ],
  },
  PURPOSES_AND_PROCESSING: {
    index: 3,
    title: "Purpose and Processing of Data",
    subitems: [
      {
        subtitle: "Personal data is used for the following purposes:",
        subitems: [
          "Account creation and management",
          "Service personalization",
          "Client and business workflows",
          "Marketing and promotions",
          "Security and anti-fraud monitoring",
          "Internal analytics and improvements",
        ],
      },
      {
        subtitle:
          "Majikah does not use personal data for automated decision-making or profiling beyond feed curation.",
        subitems: [],
      },
    ],
  },
  STORAGE_AND_RETENTION: {
    index: 4,
    title: "Storage and Retention of Data",
    subitems: [
      {
        subtitle:
          "User data is stored in secure cloud services including Supabase and AWS (Southeast-1 region).",
        subitems: [],
      },
      {
        subtitle:
          "Data is retained for the duration of the user’s account activity. Users may request deletion at any time.",
        subitems: [],
      },
      {
        subtitle:
          "Notification and old file data follow retention and disposal schedules.",
        subitems: [],
      },
    ],
  },
  SECURITY_MEASURES: {
    index: 5,
    title: "Security Measures",
    subitems: [
      {
        subtitle:
          "Majikah applies robust security protocols to protect user data:",
        subitems: [
          "AES-256 encryption for storage and transmission",
          "Access controls and permission restrictions",
          "Audit logs and system monitoring",
          "Integration with security tools like Sentry and LogRocket",
        ],
      },
    ],
  },
  THIRD_PARTY_SHARING: {
    index: 6,
    title: "Third-Party Sharing and Disclosure",
    subitems: [
      {
        subtitle:
          "Data may be shared with trusted third parties to support platform functionality:",
        subitems: [
          "Supabase (database and auth)",
          "AWS (file storage)",
          "Vercel (frontend hosting)",
          "Maya (payment processing)",
          "Google APIs, SoundCloud, Spotify",
          "Analytics: Google Analytics, Meta Pixel",
        ],
      },
      {
        subtitle:
          "Majikah does not currently have formal Data Sharing Agreements but reviews integrations for compliance.",
        subitems: [],
      },
    ],
  },
  GOOGLE_API_COMPLIANCE: {
    index: 7,
    title: "Google API Services Compliance",
    subitems: [
      {
        subtitle:
          "Majikah Creative Solutions affirms that our use of Google user data strictly complies with Google’s API Services User Data Policy, including adherence to the Limited Use requirements.",
        subitems: [],
      },
      {
        subtitle:
          "We only access Google user data that you explicitly grant access to, specifically for features such as Google Calendar synchronization, event creation, and calendar management within the Majikah platform.",
        subitems: [],
      },
      {
        subtitle:
          "We do not transfer, share, sell, or use Google user data for any purposes unrelated to the direct functionality requested by the user, nor for advertising or marketing.",
        subitems: [],
      },
      {
        subtitle:
          "Majikah does not use Google user data to develop, improve, or train generalized artificial intelligence or machine learning models.",
        subitems: [],
      },
      {
        subtitle: `For full details, refer to Google’s <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer"><strong>API Services User Data Policy</strong></a> and specifically the <a href="https://developers.google.com/workspace/workspace-api-user-data-developer-policy#limited-use" target="_blank" rel="noopener noreferrer"><strong>Limited Use requirements</strong></a>.`,
        subitems: [],
      },
      {
        subtitle:
          "If you have concerns or inquiries about how we handle Google API data, please contact us at business@majikah.solutions.",
        subitems: [],
      },
    ],
  },

  INTERNATIONAL_TRANSFERS: {
    index: 8,
    title: "International Data Transfers",
    subitems: [
      {
        subtitle:
          "Some data may be processed or stored outside the Philippines, such as in AWS Southeast-1 (Singapore) and other international cloud locations.",
        subitems: [],
      },
    ],
  },
  USER_RIGHTS: {
    index: 9,
    title: "User Rights Under the Data Privacy Act",
    subitems: [
      {
        subtitle: "Users are entitled to:",
        subitems: [
          "Access their personal data",
          "Correct or update data",
          "Object to processing",
          "Request deletion of data",
          "Request data portability",
          "Lodge complaints with Majikah or the National Privacy Commission",
        ],
      },
      {
        subtitle: "Requests may be submitted via in-app forms or email.",
        subitems: [],
      },
    ],
  },
  CONSENT_AND_LAWFUL_BASIS: {
    index: 10,
    title: "Consent and Legal Basis for Processing",
    subitems: [
      {
        subtitle: "Majikah processes data on the following lawful bases:",
        subitems: [
          "User consent (via checkboxes, banners, and onboarding forms)",
          "Contractual necessity",
          "Legitimate interest in improving services and ensuring security",
        ],
      },
    ],
  },
  COOKIES_AND_TRACKING: {
    index: 11,
    title: "Cookies and Tracking Technologies",
    subitems: [
      {
        subtitle: "We use cookies and similar tools for:",
        subitems: [
          "User session management",
          "Security and fraud detection",
          "Marketing and analytics",
          "Performance monitoring",
        ],
      },
      {
        subtitle:
          "Third-party cookies such as Google Analytics and Meta Pixel may be used.",
        subitems: [],
      },
    ],
  },
  POLICY_UPDATES: {
    index: 12,
    title: "Privacy Policy Updates",
    subitems: [
      {
        subtitle:
          "This policy is reviewed quarterly or as needed when new features are released.",
        subitems: [],
      },
      {
        subtitle:
          "Users will be notified of updates through email and in-app banners.",
        subitems: [],
      },
    ],
  },
  INCIDENT_RESPONSE: {
    index: 13,
    title: "Breach Notification and Response",
    subitems: [
      {
        subtitle:
          "Majikah has internal policies for responding to data breaches in accordance with the Data Privacy Act.",
        subitems: [],
      },
    ],
  },
  TRAINING_AND_COMPLIANCE: {
    index: 14,
    title: "Staff Training and Compliance",
    subitems: [
      {
        subtitle:
          "Majikah has not yet conducted privacy training for staff but plans to incorporate it in future operations.",
        subitems: [],
      },
    ],
  },
  CONTACT_INFORMATION: {
    index: 15,
    title: "Contact Information",
    subitems: [
      {
        subtitle:
          "For privacy-related inquiries or to exercise your data rights, contact us at business@majikah.solutions",
        subitems: [],
      },
    ],
  },
});

/*
ENUM FOR TERMS OF AGREEMENT
*/

export const ENUM_TermsOfAgreement_Majikah = Object.freeze({
  INTRODUCTION: {
    index: 1,
    title: "Introduction",
    subitems: [
      {
        subtitle:
          "These Terms of Agreement govern the use of Majikah Creative Solutions, a digital platform for creatives and production professionals. By using Majikah, you agree to be bound by these terms and applicable laws.",
        subitems: [],
      },
    ],
  },
  ACCEPTANCE_OF_TERMS: {
    index: 2,
    title: "Acceptance of Terms",
    subitems: [
      {
        subtitle:
          "By accessing or using Majikah, you confirm that you have read, understood, and agreed to these Terms, along with our Privacy Policy and any future updates.",
        subitems: [],
      },
    ],
  },
  ELIGIBILITY: {
    index: 3,
    title: "Eligibility",
    subitems: [
      {
        subtitle:
          "You must be at least 18 years old or of legal age in your jurisdiction to use Majikah. By registering, you affirm that you meet this requirement.",
        subitems: [],
      },
    ],
  },
  PLATFORM_SCOPE: {
    index: 4,
    title: "Platform Scope and Services",
    subitems: [
      {
        subtitle:
          "Majikah is an all-in-one digital ecosystem for managing gigs, projects, legal documents, payments, portfolios, and production workflows.",
        subitems: [],
      },
      {
        subtitle:
          "The platform is designed to support creatives, freelancers, and teams in streamlining their professional activities.",
        subitems: [],
      },
    ],
  },
  USER_CONTENT_OWNERSHIP: {
    index: 5,
    title: "User Content and Ownership",
    subitems: [
      {
        subtitle:
          "Users retain full ownership of any content, media, or projects they upload. Majikah does not claim any rights to user-generated content.",
        subitems: [],
      },
      {
        subtitle:
          "Parties involved in projects are independently responsible for legal contracts and ownership terms between them.",
        subitems: [],
      },
    ],
  },
  PAYMENTS_AND_REFUNDS: {
    index: 6,
    title: "Payments and Refunds",
    subitems: [
      {
        subtitle:
          "Majikah offers both freemium and paid subscription plans. All payments are processed via Maya.",
        subitems: [],
      },
      {
        subtitle:
          "Refunds are subject to project settings and agreement by involved parties. If approved, refunds are processed within 7–14 days.",
        subitems: [],
      },
    ],
  },
  USER_CONDUCT_AND_RESTRICTIONS: {
    index: 7,
    title: "User Conduct and Restrictions",
    subitems: [
      {
        subtitle:
          "You agree not to upload or share NSFW, sexually explicit, gambling-related, illegal, or harmful content on the platform.",
        subitems: [],
      },
      {
        subtitle:
          "Violation of these rules may result in suspension or termination of your account.",
        subitems: [],
      },
    ],
  },
  ACCOUNT_MANAGEMENT: {
    index: 8,
    title: "Account Management and Termination",
    subitems: [
      {
        subtitle: "You may delete or deactivate your account at any time.",
        subitems: [],
      },
      {
        subtitle:
          "Majikah reserves the right to suspend or terminate accounts for any violation of these Terms following investigation.",
        subitems: [],
      },
    ],
  },
  DATA_PRIVACY: {
    index: 9,
    title: "Data Privacy and Security",
    subitems: [
      {
        subtitle:
          "Majikah complies with the Data Privacy Act of 2012 (RA 10173). We process your data according to our published Privacy Policy.",
        subitems: [],
      },
    ],
  },
  INTELLECTUAL_PROPERTY: {
    index: 10,
    title: "Platform Intellectual Property",
    subitems: [
      {
        subtitle:
          "All code, design, branding, and software powering Majikah are owned by Majikah Creative Solutions. You may not replicate or resell any part without permission.",
        subitems: [],
      },
    ],
  },
  DISCLAIMERS_LIMITATION_LIABILITY: {
    index: 11,
    title: "Disclaimers and Limitation of Liability",
    subitems: [
      {
        subtitle:
          'Majikah is provided "as-is." We do not guarantee uninterrupted service or error-free experiences, especially during early access.',
        subitems: [],
      },
      {
        subtitle:
          "We are not liable for data loss, payment errors, or damages resulting from third-party issues. Financial bugs will be investigated and refunded if warranted.",
        subitems: [],
      },
    ],
  },
  EARLY_ACCESS_NOTICE: {
    index: 12,
    title: "Early Access Disclaimer",
    subitems: [
      {
        subtitle:
          "During early access, you acknowledge that the platform is still under development and may experience bugs or feature changes.",
        subitems: [],
      },
    ],
  },
  GOVERNING_LAW_DISPUTE_RESOLUTION: {
    index: 13,
    title: "Governing Law and Dispute Resolution",
    subitems: [
      {
        subtitle:
          "These Terms are governed by the laws of the Republic of the Philippines. Disputes may be resolved through email, arbitration, or proper courts in Mandaluyong City.",
        subitems: [],
      },
    ],
  },
  MODIFICATION_OF_TERMS: {
    index: 14,
    title: "Modification of Terms",
    subitems: [
      {
        subtitle:
          "We may update these Terms from time to time. Continued use of Majikah after any change constitutes your acceptance of the new Terms.",
        subitems: [],
      },
    ],
  },
  CONTACT_INFORMATION: {
    index: 15,
    title: "Contact Information",
    subitems: [
      {
        subtitle:
          "For support or questions about these Terms, please contact us at business@majikah.solutions.",
        subitems: [],
      },
    ],
  },
});

import { Header, Footer } from "@/components/layout/site-chrome";
import { LINKEDIN_URL } from "@/lib/content/site";
import { pageMetadata } from "@/lib/seo/metadata";
export const metadata = pageMetadata(
  "Privacy & Your Data",
  "How project enquiry information is collected and used on Zainab Abdullah’s website.",
  "/privacy",
  false,
);
export default function Privacy() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main className="container prose-page" id="main">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span>/</span>
          <span>Privacy</span>
        </nav>
        <span className="eyebrow">
          LAST UPDATED: 30 OCTOBER 2026 · VERSION 4
        </span>
        <h1>
          Privacy &<br />
          <span className="serif">your project details.</span>
        </h1>
        <p>
          This notice explains how the enquiry form on Zainab Abdullah’s website
          uses the information you choose to share.
        </p>
        <h2>What the form collects</h2>
        <p>
          The form collects your name, email address, WhatsApp number, business
          name, optional website or social profile, country or target market,
          selected services, business goal, estimated budget, timeline and a
          description of your project. It also records your permission to be
          contacted, the submission time and a project reference.
        </p>
        <h2>Why this information is used</h2>
        <p>
          Your information is used to review your enquiry, assess whether the
          services fit your needs and contact you by email or WhatsApp about the
          project. Submitting a brief does not subscribe you to a newsletter or
          commit you to a paid service. Please do not include passwords, payment
          details, account access tokens or sensitive personal information.
        </p>
        <h2>Storage, access and technical information</h2>
        <p>
          Project briefs are stored in the website’s hosted database for review
          by Zainab and authorised website administrators. The hosting provider
          processes the data needed to serve the site. Vercel hosts the website
          and Supabase stores enquiries and articles. A daily changing hash
          derived from a technical network identifier is stored to limit
          repeated submissions; the form database does not store the raw network
          address. The hosting provider may separately process technical access
          logs.
        </p>
        <h2>Cookies and tracking</h2>
        <p>
          This website uses Google Analytics 4 to understand visits, page views
          and how visitors use the site. Google Analytics may use cookies and
          process technical information such as browser, device and page URL.
          The enquiry form’s answers are not included in custom analytics
          events. Learn more in{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google’s privacy policy
          </a>
          . The hosting service may use essential cookies for access,
          authentication or security. The blog editor uses an essential,
          one-hour session cookie for authorised publishing. Your form answers
          remain in page memory while you complete the enquiry; they are not
          saved to browser storage by this website. Your light or dark theme
          preference is saved locally in your browser so it can be remembered
          between visits.
        </p>
        <p>
          We also use Microsoft Clarity to understand page interactions through
          heatmaps and session recordings, including clicks, scrolling and
          navigation. Clarity may use cookies and process device, browser and
          page information. Learn more in{" "}
          <a
            href="https://privacy.microsoft.com/privacystatement"
            target="_blank"
            rel="noopener noreferrer"
          >
            Microsoft’s privacy statement
          </a>
          .
        </p>
        <h2>Keeping and deleting an enquiry</h2>
        <p>
          Enquiry information is kept while it is needed to discuss the project
          or maintain the relevant business record. You can ask about your
          enquiry, request a correction or ask for deletion by contacting{" "}
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
            Zainab on LinkedIn
          </a>
          . Include the email address or project reference used for the enquiry
          so the record can be located.
        </p>
        <h2>External links</h2>
        <p>
          LinkedIn and other websites have their own privacy practices.
          Published articles may display cover images from external sources
          chosen by the site owner. Opening an external link takes you to that
          service.
        </p>
        <p>
          <a href="/#project">Return to your project enquiry →</a>
        </p>
      </main>
      <Footer />
    </>
  );
}

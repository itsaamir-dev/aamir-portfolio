import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { type LegalSection } from "@/components/LegalPage";
import { BUSINESS } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo";

const PATH = "/terms";
export const metadata: Metadata = pageMetadata(
  PATH, "Terms & Conditions",
  "The terms for using Build With Aamir, including the job referral service, referral fees and payments.",
);

const a = "text-ink underline underline-offset-4";
const mail = <a href={`mailto:${BUSINESS.email}`} className={a}>{BUSINESS.email}</a>;

const sections: LegalSection[] = [
  {
    id: "about", title: "About these terms",
    body: <>
      <p>
        {BUSINESS.website} (“the site”) is run by {BUSINESS.owner} under the name {BUSINESS.name}, based in {BUSINESS.country}
        (“we”, “us”). By using the site or any service on it, you agree to these terms. If you don’t agree, please don’t use the site.
      </p>
      <p>You must be at least 18 years old to apply for jobs or make a payment on the site.</p>
    </>,
  },
  {
    id: "content", title: "Educational content",
    body: <p>
      Articles, lessons, the 30-day challenge, the community and other content are shared for general education. Earnings and results
      mentioned on the site are our own and are not a promise or prediction of what you will earn. Nothing on the site is financial,
      legal or career advice for your situation.
    </p>,
  },
  {
    id: "referrals", title: "Job referral service",
    body: <>
      <p>
        We list jobs and contract roles and refer suitable applicants to the hiring team (the company or client offering the role). To
        submit an application you provide your details, a résumé and a proposal, and pay the referral fee shown on the job.
      </p>
      <ul className="list-disc space-y-1 pl-5">
        <li>We are not the employer. The hiring team decides whether to interview or hire anyone, and sets the terms of any work.</li>
        <li>We review applications and decide, at our discretion, which ones to refer.</li>
        <li>Job details come from the hiring team or our own knowledge of the role. We try to keep them accurate but can’t guarantee them,
          and jobs may be filled, changed or withdrawn at any time.</li>
        <li>Paying the fee does not guarantee a referral, interview, job or income.</li>
        <li>You must give true, accurate information and only submit a résumé and proposal that are your own.</li>
      </ul>
    </>,
  },
  {
    id: "fees", title: "Fees and payments",
    body: <>
      <p>
        Referral fees are shown in Indian rupees (INR) on each job before you apply. Payments are processed by our payment provider
        (Cashfree Payments or Razorpay); we never see or store your full card or bank details. Your bank may charge a currency conversion
        or international transaction fee for cards issued outside India.
      </p>
      <p>
        Referral fees are <strong className="text-ink">non-refundable</strong>. See the{" "}
        <Link href="/refund-policy" className={a}>Refund &amp; Cancellation Policy</Link>, which also explains how duplicate or failed
        payments are handled.
      </p>
    </>,
  },
  {
    id: "your-content", title: "Your application and content",
    body: <p>
      You keep ownership of your résumé, proposal and other information you submit. You allow us to store it, review it and share it with
      the hiring team for the job you applied to, and to contact you about your application. See the{" "}
      <Link href="/privacy" className={a}>Privacy Policy</Link> for details.
    </p>,
  },
  {
    id: "acceptable-use", title: "Acceptable use",
    body: <>
      <p>You agree not to:</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>submit false, misleading or someone else’s information or documents;</li>
        <li>upload files containing malware or anything unlawful;</li>
        <li>attempt to break, overload, scrape or bypass the security of the site;</li>
        <li>use the site or its content for spam or to mislead others.</li>
      </ul>
      <p>We may refuse or remove an application, or block access, if these terms are broken. Fees for applications removed for misuse are not refunded.</p>
    </>,
  },
  {
    id: "third-parties", title: "Third-party services",
    body: <p>
      The site links to services we don’t control, such as WhatsApp, LinkedIn, GitHub, Upwork and the hiring teams’ own sites. Their own
      terms and privacy policies apply when you use them.
    </p>,
  },
  {
    id: "ip", title: "Intellectual property",
    body: <p>
      The site’s content, design and brand belong to {BUSINESS.owner}. You may share links and short quotes with credit, but may not copy
      or republish substantial parts without permission.
    </p>,
  },
  {
    id: "liability", title: "Disclaimers and liability",
    body: <>
      <p>
        The site and its services are provided “as is”. To the extent the law allows, we aren’t liable for indirect or consequential
        losses, including lost income or opportunities, or for the actions of hiring teams or other third parties.
      </p>
      <p>
        Where we are liable, our total liability for any claim about a job application is limited to the referral fee you paid for that
        application.
      </p>
    </>,
  },
  {
    id: "changes", title: "Changes to these terms",
    body: <p>
      We may update these terms from time to time. The date at the top shows the latest version. Changes apply from that date and don’t
      affect payments made before it.
    </p>,
  },
  {
    id: "law", title: "Governing law",
    body: <p>These terms are governed by the laws of India. Any dispute is subject to the jurisdiction of the courts of India.</p>,
  },
  {
    id: "contact", title: "Contact",
    body: <p>Questions about these terms: {mail}, or see our <Link href="/contact" className={a}>contact page</Link>.</p>,
  },
];

export default function TermsPage() {
  return (
    <LegalPage path={PATH} crumb="Terms" title="Terms & Conditions" sections={sections}
      intro={<p>The rules for using {BUSINESS.name}, including the job referral service and referral fees.</p>} />
  );
}

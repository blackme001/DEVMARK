import LegalContent from "@/components/LegalContent";

export default function Security() {
    return (
        <LegalContent title="Security & Trust" lastUpdated="March 16, 2026">
            <section className="mb-10">
                <h2 className="text-xl font-black text-navy-dark mb-4 uppercase tracking-widest italic">1. Our Security Commitment</h2>
                <p>
                    DevMarket Pro is committed to maintaining the highest security standards to protect your personal information, payment data, and intellectual property. We continuously monitor and improve our security infrastructure.
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-xl font-black text-navy-dark mb-4 uppercase tracking-widest italic">2. Data Encryption</h2>
                <p>
                    All data transmitted between your browser and our servers is encrypted using TLS 1.3 (Transport Layer Security). Sensitive data at rest is encrypted using AES-256, an industry-standard cryptographic algorithm.
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-xl font-black text-navy-dark mb-4 uppercase tracking-widest italic">3. Authentication</h2>
                <p>
                    We use Supabase Auth, which provides secure, battle-tested authentication mechanisms including:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li><strong>OAuth 2.0:</strong> Sign-in via trusted providers including GitHub and Google.</li>
                    <li><strong>JWT Tokens:</strong> Short-lived access tokens with automatic refresh to minimize exposure.</li>
                    <li><strong>Row Level Security (RLS):</strong> Each user can only access data they are authorized to view in our database.</li>
                </ul>
            </section>

            <section className="mb-10">
                <h2 className="text-xl font-black text-navy-dark mb-4 uppercase tracking-widest italic">4. Payment Security</h2>
                <p>
                    We never store raw credit card numbers. All payment processing is handled by PCI-DSS Level 1 certified partners. Transaction records are stored securely and are never exposed to other users.
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-xl font-black text-navy-dark mb-4 uppercase tracking-widest italic">5. Reporting Vulnerabilities</h2>
                <p>
                    If you discover a security vulnerability, please report it responsibly to our security team via the Contact page. We take all reports seriously and will respond within 48 hours. We appreciate responsible disclosure and will not pursue legal action against researchers who follow this policy.
                </p>
            </section>
        </LegalContent>
    );
}

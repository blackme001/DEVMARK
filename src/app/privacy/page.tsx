import LegalContent from "@/components/LegalContent";

export default function Privacy() {
    return (
        <LegalContent title="Privacy Policy" lastUpdated="March 16, 2026">
            <section className="mb-10">
                <h2 className="text-xl font-black text-navy-dark mb-4 uppercase tracking-widest italic">1. Data Collection</h2>
                <p>
                    We collect minimal personal data necessary to provide our marketplace services. This includes:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li><strong>Account Information:</strong> Name, email address, and professional fields collected via Supabase Auth.</li>
                    <li><strong>Transaction Data:</strong> Subscription status and purchase history to manage asset access.</li>
                    <li><strong>Usage Data:</strong> Anonymous telemetry and browser interactions collected via Vercel Analytics to improve platform performance.</li>
                </ul>
            </section>

            <section className="mb-10">
                <h2 className="text-xl font-black text-navy-dark mb-4 uppercase tracking-widest italic">2. Payment Security</h2>
                <p>
                    DevMarket Pro does not store credit card information on our servers. All payments are processed through our secure PCI-compliant partners.
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-xl font-black text-navy-dark mb-4 uppercase tracking-widest italic">3. Data Sharing</h2>
                <p>
                    Your data is shared with the following third-party services only to the extent necessary:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li><strong>Supabase:</strong> For database management, authentication, and security.</li>
                    <li><strong>Vercel:</strong> For platform hosting and edge-network performance.</li>
                </ul>
            </section>

            <section className="mb-10">
                <h2 className="text-xl font-black text-navy-dark mb-4 uppercase tracking-widest italic">4. Cookies</h2>
                <p>
                    We use functional cookies to maintain your login session and security tokens. We do not use persistent tracking cookies for third-party advertising.
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-xl font-black text-navy-dark mb-4 uppercase tracking-widest italic">5. Your Rights</h2>
                <p>
                    You have the right to access, rectify, or delete your personal data. You can manage your profile information within the Dashboard or contact us to request full account deletion.
                </p>
            </section>
        </LegalContent>
    );
}

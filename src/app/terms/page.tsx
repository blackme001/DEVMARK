import LegalContent from "@/components/LegalContent";

export default function Terms() {
    return (
        <LegalContent title="Terms of Service" lastUpdated="March 16, 2026">
            <section className="mb-10">
                <h2 className="text-xl font-black text-navy-dark mb-4 uppercase tracking-widest italic">1. Acceptance of Terms</h2>
                <p>
                    By accessing or using the DevMarket Pro platform, you agree to be bound by these Terms of Service. If you do not agree, you must immediately cease all use of the platform and its services.
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-xl font-black text-navy-dark mb-4 uppercase tracking-widest italic">2. Marketplace Transactions</h2>
                <p>
                    DevMarket Pro acts as a marketplace facilitating the exchange of digital assets (SaaS boilerplates, UI kits, code modules). We provide the infrastructure, but the contract of sale is directly between the Buyer and the Seller.
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li><strong>Asset Delivery:</strong> Digital assets are delivered immediately upon successful payment verification.</li>
                    <li><strong>Usage License:</strong> Each purchase grants a non-exclusive license for the specific use cases defined in the project description.</li>
                    <li><strong>Prohibited Items:</strong> Sellers may not list malicious code, stolen intellectual property, or assets that violate third-party rights.</li>
                </ul>
            </section>

            <section className="mb-10">
                <h2 className="text-xl font-black text-navy-dark mb-4 uppercase tracking-widest italic">3. Intellectual Property</h2>
                <p>
                    Sellers represent and warrant that they are the original owners of the assets listed or have the necessary rights to sell them. Buyers receive a license to use the code but do not acquire ownership of the source code unless explicitly stated in a custom agreement.
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-xl font-black text-navy-dark mb-4 uppercase tracking-widest italic">4. Limitation of Liability</h2>
                <p>
                    DevMarket Pro is not liable for errors, bugs, or security vulnerabilities within user-submitted assets. Buyers are encouraged to audit code before production deployment. Assets are provided "as-is" without warranty of any kind.
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-xl font-black text-navy-dark mb-4 uppercase tracking-widest italic">5. Modifications</h2>
                <p>
                    We reserve the right to modify these terms at any time. Continued use of the platform after changes are posted constitutes acceptance of those changes.
                </p>
            </section>
        </LegalContent>
    );
}

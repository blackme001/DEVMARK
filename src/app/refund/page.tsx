import LegalContent from "@/components/LegalContent";

export default function RefundPolicy() {
    return (
        <LegalContent title="Refund Policy" lastUpdated="March 16, 2026">
            <section className="mb-10">
                <h2 className="text-xl font-black text-navy-dark mb-4 uppercase tracking-widest italic">1. Digital Nature of Assets</h2>
                <p>
                    Due to the nature of digital products, which are intangible and can be duplicated immediately upon download, all sales on DevMarket Pro are final and non-refundable.
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-xl font-black text-navy-dark mb-4 uppercase tracking-widest italic">2. Exceptions for Faulty Code</h2>
                <p>
                    We maintain a high standard for quality. Refunds may be considered only in the following specific circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li><strong>Critical Defect:</strong> The asset has a fundamental security flaw or bug that makes it unusable for its intended purpose.</li>
                    <li><strong>Misrepresentation:</strong> The asset significantly diverges from the description provided in the marketplace listing.</li>
                    <li><strong>Corrupted Files:</strong> The files cannot be downloaded or are technically corrupted in a way that the platform cannot resolve.</li>
                </ul>
            </section>

            <section className="mb-10">
                <h2 className="text-xl font-black text-navy-dark mb-4 uppercase tracking-widest italic">3. Dispute Process</h2>
                <p>
                    If you believe your purchase meets the criteria for a refund, you must open a dispute within 48 hours of purchase. You should first contact the Seller to attempt a resolution. If no resolution is reached, DevMarket Pro support will arbitrate the final decision.
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-xl font-black text-navy-dark mb-4 uppercase tracking-widest italic">4. Chargebacks</h2>
                <p>
                    Unauthorized chargebacks result in permanent account suspension and the immediate revocation of all licenses associated with your account.
                </p>
            </section>
        </LegalContent>
    );
}

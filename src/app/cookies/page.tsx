import { LegalPage, legalMetadata } from "@/components/legal/legal-page";
export const generateMetadata = () => legalMetadata("cookies");
export default function CookiesPage() { return <LegalPage document="cookies" />; }

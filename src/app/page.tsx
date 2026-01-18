import { getPageContent } from "@/lib/cms-server";
import ClientHome from "@/components/ClientHome";

export default function Home() {
  const content = getPageContent("home");

  return <ClientHome content={content} />;
}

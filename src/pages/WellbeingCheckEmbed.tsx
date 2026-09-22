import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const EMBED = `<iframe src="https://www.innersparkafrica.com/wellbeing-check?embed=1" title="InnerSpark WHO-5 wellbeing check" width="100%" height="720" style="border:0;border-radius:16px;max-width:720px" loading="lazy"></iframe>
<p style="font-family:Arial,sans-serif;font-size:12px;color:#64748b">Powered by <a href="https://www.innersparkafrica.com" target="_blank" rel="noopener">InnerSpark Africa</a></p>`;

export default function WellbeingCheckEmbed() {
  return (
    <div className="min-h-screen bg-[#F7F3EA]">
      <Helmet>
        <title>Embed the free WHO-5 wellbeing check | InnerSpark</title>
        <meta name="description" content="Add InnerSpark Africa’s free WHO-5 mental wellbeing check to your website with a simple embed code." />
        <link rel="canonical" href="https://www.innersparkafrica.com/wellbeing-check/embed" />
      </Helmet>
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-3xl space-y-6">
        <h1 className="text-4xl font-bold">Embed the free WHO-5 wellbeing check</h1>
        <p className="text-[#4B5563]">Paste this code on a health blog, HR page or community site. The attribution link back to InnerSpark must stay visible.</p>
        <pre className="rounded-2xl border bg-white p-4 text-xs overflow-x-auto whitespace-pre-wrap">{EMBED}</pre>
        <Button onClick={async () => { await navigator.clipboard.writeText(EMBED); toast.success("Embed code copied"); }}>Copy embed code</Button>
      </main>
      <Footer />
    </div>
  );
}

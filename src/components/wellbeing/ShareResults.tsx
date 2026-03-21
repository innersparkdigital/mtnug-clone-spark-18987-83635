import { Button } from '@/components/ui/button';
import { Share2, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface ShareResultsProps {
  percentage: number;
  onCtaClick: (type: string) => void;
}

const ShareResults = ({ percentage, onCtaClick }: ShareResultsProps) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = 'https://www.innersparkafrica.com/wellbeing-check';
  const shareText = `I just checked my mental wellbeing on InnerSpark 👀\nTurns out I'm at ${percentage}% today.\n\nBe honest… how are YOU really doing?\n\nTake this 2-minute check 👉 ${shareUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    toast({ title: 'Copied!', description: 'Share message copied to clipboard.' });
    onCtaClick('share_copy');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    onCtaClick('share_whatsapp');
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareTwitter = () => {
    onCtaClick('share_twitter');
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareFacebook = () => {
    onCtaClick('share_facebook');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm mb-6">
      <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
        <Share2 className="w-4 h-4 text-primary" />
        Share Your Results
      </h3>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" size="sm" className="rounded-xl text-sm" onClick={shareWhatsApp}>
          💬 WhatsApp
        </Button>
        <Button variant="outline" size="sm" className="rounded-xl text-sm" onClick={shareTwitter}>
          🐦 Twitter/X
        </Button>
        <Button variant="outline" size="sm" className="rounded-xl text-sm" onClick={shareFacebook}>
          📘 Facebook
        </Button>
        <Button variant="outline" size="sm" className="rounded-xl text-sm" onClick={handleCopy}>
          {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
          {copied ? 'Copied!' : 'Copy Link'}
        </Button>
      </div>
    </div>
  );
};

export default ShareResults;

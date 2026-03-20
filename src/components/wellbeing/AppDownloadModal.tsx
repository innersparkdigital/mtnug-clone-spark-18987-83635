import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Smartphone } from 'lucide-react';

interface AppDownloadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCtaClick: (type: string) => void;
}

const AppDownloadModal = ({ open, onOpenChange, onCtaClick }: AppDownloadModalProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-sm mx-auto">
      <DialogHeader>
        <DialogTitle className="text-center text-xl">Download InnerSpark App</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 pt-2">
        {/* Google Play */}
        <Button
          variant="outline"
          className="w-full py-6 rounded-xl border-2 flex items-center gap-3 text-left"
          onClick={() => {
            onCtaClick('google_play');
            window.open('https://play.google.com/store/apps/details?id=com.innersparkafrica.app&pli=1', '_blank');
          }}
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-10" />
          <span className="text-sm font-medium text-gray-700">Get it on Google Play</span>
        </Button>

        {/* Apple Store */}
        <div
          className="w-full py-5 px-4 rounded-xl border-2 border-gray-200 bg-gray-50 cursor-pointer hover:border-gray-300 transition-all"
          onClick={() => {
            onCtaClick('apple_store');
            window.open('https://lovable.dev/projects/3529fd70-ea43-4055-896a-918270936797', '_blank');
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Smartphone className="w-8 h-8 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Apple App Store</span>
          </div>
          <p className="text-xs text-amber-600 font-medium">
            Our Apologies — The InnerSpark App Is Not Yet Live on Apple Store
          </p>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

export default AppDownloadModal;

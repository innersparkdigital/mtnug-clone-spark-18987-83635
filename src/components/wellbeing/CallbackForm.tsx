import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Phone, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface CallbackFormProps {
  percentage: number;
  rawScore: number;
  sessionId: string | null;
  source: string;
  deviceType: string;
  onCtaClick: (type: string) => void;
}

type PromptState = 'prompt' | 'form' | 'submitted' | 'declined' | 'later';

const CallbackForm = ({ percentage, rawScore, sessionId, source, deviceType, onCtaClick }: CallbackFormProps) => {
  const [state, setState] = useState<PromptState>('prompt');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Only show for low wellbeing (0-50%)
  if (percentage > 50) return null;

  const handleSubmit = async () => {
    if (!fullName.trim() || !phone.trim()) {
      toast({ title: 'Please fill in all fields', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    onCtaClick('callback_request');

    try {
      await supabase.from('callback_requests').insert({
        full_name: fullName.trim(),
        phone_number: phone.trim(),
        wellbeing_score: rawScore,
        wellbeing_percentage: percentage,
        session_id: sessionId || 'unknown',
        source,
        device_type: deviceType,
      } as any);

      // Send WhatsApp notification to support team
      const message = encodeURIComponent(
        `🔔 New Callback Request\n\nName: ${fullName}\nPhone: ${phone}\nWellbeing Score: ${percentage}%\nSource: ${source}\n\nPlease reach out to this person.`
      );
      fetch(`https://wa.me/256792085773?text=${message}`).catch(() => {});

      setState('submitted');
    } catch {
      toast({ title: 'Something went wrong. Please try again.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {state === 'prompt' && (
        <motion.div
          key="prompt"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6"
        >
          <p className="text-base font-semibold text-gray-800 mb-4">
            Would you like to talk to someone about how you're feeling?
          </p>
          <div className="space-y-2">
            <Button
              onClick={() => setState('form')}
              className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl py-5"
            >
              ✅ Yes, I'd like to talk to someone
            </Button>
            <Button
              variant="outline"
              onClick={() => setState('later')}
              className="w-full rounded-xl py-4 text-sm"
            >
              ⏳ Maybe later
            </Button>
            <Button
              variant="ghost"
              onClick={() => setState('declined')}
              className="w-full rounded-xl py-3 text-sm text-gray-400"
            >
              ❌ No, I'm okay for now
            </Button>
          </div>
        </motion.div>
      )}

      {state === 'form' && (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-3">
            <Phone className="w-5 h-5 text-[#F97316]" />
            <h3 className="font-bold text-gray-800">Request a Call Back</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Enter your full name and phone number and a member of our team will reach out to you shortly.
          </p>
          <div className="space-y-3">
            <Input
              placeholder="Full Name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="rounded-xl"
            />
            <Input
              placeholder="Phone Number (e.g. +256...)"
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="rounded-xl"
            />
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl py-5"
            >
              {submitting ? 'Sending...' : '👉 Request Call Back'}
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Your information will be kept private and only used to support you.
          </p>
        </motion.div>
      )}

      {state === 'submitted' && (
        <motion.div
          key="submitted"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6 text-center"
        >
          <p className="text-green-700 font-semibold mb-1">
            Thank you. Our team will contact you shortly.
          </p>
          <p className="text-green-600 text-sm">
            You're taking an important step. 💚
          </p>
        </motion.div>
      )}

      {state === 'later' && (
        <motion.div
          key="later"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-6 text-center"
        >
          <p className="text-gray-500 text-sm">
            That's okay. You can always come back whenever you're ready. 💛
          </p>
        </motion.div>
      )}

      {state === 'declined' && (
        <motion.div
          key="declined"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-6 text-center"
        >
          <p className="text-gray-500 text-sm">
            That's okay. If you ever change your mind, support is available. 🤝
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CallbackForm;

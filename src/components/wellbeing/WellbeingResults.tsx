import { Button } from '@/components/ui/button';
import { Download, MessageCircle, Users, Brain, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '@/assets/innerspark-logo.png';
import ShareResults from './ShareResults';
import CallbackForm from './CallbackForm';
import { useState } from 'react';
import AppDownloadModal from './AppDownloadModal';

type WellbeingLevel = 'low' | 'moderate' | 'high';

const getWellbeingLevel = (percentage: number): WellbeingLevel => {
  if (percentage <= 50) return 'low';
  if (percentage <= 75) return 'moderate';
  return 'high';
};

const getWellbeingConfig = (level: WellbeingLevel) => {
  switch (level) {
    case 'low':
      return {
        label: 'Low Wellbeing',
        color: '#ef4444',
        bgClass: 'bg-red-50 border-red-200',
        textClass: 'text-red-700',
        barClass: 'bg-red-500',
        message: "Your responses suggest that your mental wellbeing may be lower at the moment. It might help to take a closer look at what's been affecting you and consider getting support.",
        emoji: '💛',
      };
    case 'moderate':
      return {
        label: 'Moderate Wellbeing',
        color: '#eab308',
        bgClass: 'bg-yellow-50 border-yellow-200',
        textClass: 'text-yellow-700',
        barClass: 'bg-yellow-500',
        message: "Your wellbeing is at a moderate level. There are areas that seem to be going well, and others that may need more attention.",
        emoji: '🌤️',
      };
    case 'high':
      return {
        label: 'High Wellbeing',
        color: '#22c55e',
        bgClass: 'bg-green-50 border-green-200',
        textClass: 'text-green-700',
        barClass: 'bg-green-500',
        message: "Your responses suggest good mental wellbeing at this time. Continue maintaining the habits that are supporting you.",
        emoji: '✨',
      };
  }
};

interface WellbeingResultsProps {
  rawScore: number;
  percentage: number;
  sessionId: string | null;
  source: string;
  deviceType: string;
  onCtaClick: (type: string, url?: string) => void;
  onRetake: () => void;
}

const WellbeingResults = ({ rawScore, percentage, sessionId, source, deviceType, onCtaClick, onRetake }: WellbeingResultsProps) => {
  const level = getWellbeingLevel(percentage);
  const config = getWellbeingConfig(level);
  const [showDownload, setShowDownload] = useState(false);

  const handleNavigate = (type: string, url: string) => {
    onCtaClick(type, url);
  };

  return (
    <motion.div
      key="results"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="pt-8"
    >
      <img src={logo} alt="InnerSpark Africa" className="h-12 mx-auto mb-6" />

      {/* Score Display */}
      <div className="text-center mb-8">
        <div className="text-6xl font-extrabold mb-1" style={{ color: config.color }}>
          {percentage}%
        </div>
        <div className="text-2xl mb-2">{config.emoji}</div>
        <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold border ${config.bgClass} ${config.textClass}`}>
          {config.label}
        </div>
      </div>

      {/* Score Bar */}
      <div className="mb-6">
        <div className="h-4 rounded-full bg-gray-100 overflow-hidden relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full rounded-full ${config.barClass}`}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
        <div className="flex text-xs mt-0.5">
          <span className="flex-[50] text-red-400 text-center">Low</span>
          <span className="flex-[25] text-yellow-500 text-center">Moderate</span>
          <span className="flex-[25] text-green-500 text-center">High</span>
        </div>
      </div>

      {/* Insight */}
      <div className={`rounded-2xl p-5 border mb-6 ${config.bgClass}`}>
        <p className={`text-base leading-relaxed ${config.textClass}`}>
          {config.message}
        </p>
      </div>

      {/* Raw Score */}
      <div className="text-center text-sm text-gray-400 mb-6">
        Raw score: {rawScore}/25 • WHO-5 Well-Being Index
      </div>

      {/* Callback Form for Low Wellbeing */}
      <CallbackForm
        percentage={percentage}
        rawScore={rawScore}
        sessionId={sessionId}
        source={source}
        deviceType={deviceType}
        onCtaClick={(type) => onCtaClick(type)}
      />

      {/* Share Results */}
      <ShareResults percentage={percentage} onCtaClick={(type) => onCtaClick(type)} />

      {/* Primary CTAs */}
      <div className="space-y-3 mb-8">
        <Button
          onClick={() => setShowDownload(true)}
          size="lg"
          className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl py-6 text-base shadow-lg"
        >
          <Download className="w-5 h-5 mr-2" />
          Download the InnerSpark App
        </Button>

        <Button
          onClick={() => handleNavigate('talk_therapist', '/specialists')}
          variant="outline"
          size="lg"
          className="w-full rounded-xl py-6 text-base border-2 border-[#F97316] text-[#F97316] hover:bg-[#F97316]/5"
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          Talk to a Therapist
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => handleNavigate('support_group', '/support-groups')}
            variant="outline"
            className="rounded-xl py-5 text-sm"
          >
            <Users className="w-4 h-4 mr-1.5" />
            Support Groups
          </Button>
          <Button
            onClick={() => handleNavigate('detailed_assessment', '/mind-check')}
            variant="outline"
            className="rounded-xl py-5 text-sm"
          >
            <Brain className="w-4 h-4 mr-1.5" />
            Detailed Tests
          </Button>
        </div>
      </div>

      {/* Bridge to Detailed Assessments */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Need a deeper understanding?</h3>
        <p className="text-gray-500 text-sm mb-4">
          Take detailed clinical assessments for depression, anxiety, PTSD, and 34+ more conditions.
        </p>
        <Button
          onClick={() => handleNavigate('detailed_assessment', '/mind-check')}
          className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-8"
        >
          👉 Take Detailed Mental Health Assessments
        </Button>
      </div>

      {/* Privacy */}
      <div className="text-center text-xs text-gray-400 space-y-1">
        <p className="flex items-center justify-center gap-1">
          <Lock className="w-3 h-3" />
          Your responses are private and confidential.
        </p>
        <p>This is not a diagnosis, but a mental wellbeing screening tool.</p>
      </div>

      {/* Retake */}
      <div className="text-center mt-6">
        <Button variant="ghost" onClick={onRetake} className="text-gray-400 text-sm">
          Retake Assessment
        </Button>
      </div>

      <AppDownloadModal
        open={showDownload}
        onOpenChange={setShowDownload}
        onCtaClick={(type) => onCtaClick(type)}
      />
    </motion.div>
  );
};

export { getWellbeingLevel, getWellbeingConfig };
export default WellbeingResults;

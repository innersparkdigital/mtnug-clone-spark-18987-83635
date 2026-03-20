import { Button } from '@/components/ui/button';
import { Heart, ArrowRight, Shield, ChevronDown, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '@/assets/innerspark-logo.png';

interface WellbeingHeroProps {
  onStart: () => void;
}

const WellbeingHero = ({ onStart }: WellbeingHeroProps) => (
  <motion.div
    key="hero"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="text-center pt-12"
  >
    <img src={logo} alt="InnerSpark Africa" className="h-14 mx-auto mb-8" />

    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F97316]/10 text-[#F97316] text-sm font-medium mb-8">
      <Heart className="w-4 h-4" />
      Supporting your mental health
    </div>

    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-2">
      How is your mental
    </h1>
    <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6">
      <span className="text-[#F97316]">wellbeing today?</span>
    </h1>

    <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto">
      Take a 2-minute private mental health check — based on the WHO-5, the world's most trusted wellbeing screening tool.
    </p>

    <Button
      onClick={onStart}
      size="lg"
      className="bg-[#F97316] hover:bg-[#EA580C] text-white text-lg px-10 py-6 rounded-full shadow-lg shadow-[#F97316]/25 mb-6"
    >
      Start Mind-Check
      <ArrowRight className="w-5 h-5 ml-2" />
    </Button>

    <div className="flex items-center justify-center gap-6 text-sm text-gray-400 mt-8">
      <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> Anonymous</span>
      <span className="flex items-center gap-1">⏱ 2 minutes</span>
      <span className="flex items-center gap-1">📋 5 questions</span>
    </div>

    <div className="mt-16 animate-bounce text-gray-300">
      <ChevronDown className="w-6 h-6 mx-auto" />
    </div>

    <div className="mt-12 text-left bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h2 className="font-bold text-lg text-gray-800 mb-3">What is the WHO-5?</h2>
      <p className="text-gray-500 text-sm leading-relaxed">
        The WHO-5 Well-Being Index is a short, internationally recognized questionnaire developed by the World Health Organization. It measures your subjective psychological well-being over the past two weeks with just 5 simple questions.
      </p>
    </div>

    <div className="mt-6 text-xs text-gray-400 space-y-1">
      <p>🔒 Your responses are private and confidential.</p>
      <p>This is not a diagnosis, but a mental wellbeing screening tool.</p>
    </div>
  </motion.div>
);

export default WellbeingHero;

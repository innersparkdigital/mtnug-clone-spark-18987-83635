import { motion } from "framer-motion";
import whatsappIcon from "@/assets/whatsapp-icon.png";

const FloatingWhatsApp = () => {
  return (
    <motion.a
      href="https://wa.me/256792085773"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg hover:shadow-xl transition-shadow"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Chat on WhatsApp"
    >
      <img 
        src={whatsappIcon} 
        alt="WhatsApp" 
        className="w-10 h-10 object-contain"
      />
    </motion.a>
  );
};

export default FloatingWhatsApp;

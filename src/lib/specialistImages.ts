// Map specialist names to their profile images
// Images can be uploaded to the specialist-photos storage bucket and linked via image_url in database
// This file provides fallback local images when available

import giftNakayinga from "@/assets/specialists/gift-nakayinga.jpg";
import nanzigeJannet from "@/assets/specialists/nanzige-jannet.jpg";
import mirembeNorah from "@/assets/specialists/mirembe-norah.jpg";
import pamelaKanyange from "@/assets/specialists/pamela-kanyange.jpg";
import juliusKizito from "@/assets/specialists/julius-kizito.png";
import nassuunaMargret from "@/assets/specialists/nassuuna-margret.jpg";
import winnieAnzaziJira from "@/assets/specialists/winnie-anzazi-jira.jpg";
import atwiiinePriscilla from "@/assets/specialists/atwiine-priscilla.jpg";

const specialistImageMap: Record<string, string> = {
  "Nakayinga Gift": giftNakayinga,
  "Nanzige Jannet": nanzigeJannet,
  "Mirembe Norah": mirembeNorah,
  "Kanyange Pamela Mary": pamelaKanyange,
  "Julius Kizito": juliusKizito,
  "Nassuuna Margret": nassuunaMargret,
  "Winnie Anzazi Jira": winnieAnzaziJira,
  "Atwiine Priscilla": atwiiinePriscilla,
};

export const getSpecialistImage = (name: string, imageUrl?: string | null): string | null => {
  // First check local image map by name
  if (specialistImageMap[name]) {
    return specialistImageMap[name];
  }
  // If specialist has an image_url from the database, use it
  if (imageUrl) {
    return imageUrl;
  }
  return null;
};

export default specialistImageMap;

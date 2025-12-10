// Map specialist names to their profile images
// Images can be uploaded to the specialist-photos storage bucket and linked via image_url in database
// This file provides fallback local images when available

import giftNakayinga from "@/assets/specialists/gift-nakayinga.jpg";

const specialistImageMap: Record<string, string> = {
  "Nakayinga Gift": giftNakayinga,
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

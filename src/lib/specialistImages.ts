// Import all specialist images
import sarahNakamya from "@/assets/specialists/sarah-nakamya.jpg";
import jamesOkello from "@/assets/specialists/james-okello.jpg";
import graceTumusiime from "@/assets/specialists/grace-tumusiime.jpg";
import emmanuelWasswa from "@/assets/specialists/emmanuel-wasswa.jpg";
import aminaHassan from "@/assets/specialists/amina-hassan.jpg";
import patriciaNamutebi from "@/assets/specialists/patricia-namutebi.jpg";

// Map specialist names to their images
const specialistImageMap: Record<string, string> = {
  "Dr. Sarah Nakamya": sarahNakamya,
  "James Okello": jamesOkello,
  "Dr. Grace Tumusiime": graceTumusiime,
  "Emmanuel Wasswa": emmanuelWasswa,
  "Dr. Amina Hassan": aminaHassan,
  "Patricia Namutebi": patriciaNamutebi,
};

export const getSpecialistImage = (name: string, imageUrl?: string | null): string | null => {
  // If specialist has an image_url from the database, use it
  if (imageUrl) {
    return imageUrl;
  }
  // Otherwise, try to find a local image by name
  return specialistImageMap[name] || null;
};

export default specialistImageMap;


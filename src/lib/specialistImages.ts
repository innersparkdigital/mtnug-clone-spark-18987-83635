// Map specialist names to their profile images
// Images can be uploaded to the specialist-photos storage bucket and linked via image_url in database
// This file provides fallback local images when available

const specialistImageMap: Record<string, string> = {
  // Add mappings as photos are uploaded
  // Example: "Mariam Nakamanya": "/path/to/image.jpg"
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

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
import mubiruRashid from "@/assets/specialists/mubiru-rashid.jpg";
import leonardOgugu from "@/assets/specialists/leonard-ogugu.jpg";
import mbabaziJovia from "@/assets/specialists/mbabazi-jovia.jpg";
import estherMurungi from "@/assets/specialists/esther-murungi.jpg";
import zemeyiRita from "@/assets/specialists/zemeyi-rita.jpg";
import florenceNakaweesa from "@/assets/specialists/florence-winfred-nakaweesa.jpg";
import nabulyaImmaculate from "@/assets/specialists/nabulya-immaculate.jpg";
import kekiconcoJannet from "@/assets/specialists/kekiconco-jannet.jpg";
import abioMaryEvelyn from "@/assets/specialists/abio-mary-evelyn.jpg";
import maryNicoleNgetich from "@/assets/specialists/mary-nicole-ngetich.jpg";
import enockNyaanga from "@/assets/specialists/enock-nyaanga.jpg";
import akugizibweJulius from "@/assets/specialists/akugizibwe-julius.jpg";
import apinyMelodyGladys from "@/assets/specialists/apiny-melody-gladys.jpg";
import namigoAnnaMary from "@/assets/specialists/namigo-anna-mary.jpg";
import tuhaiseAngella from "@/assets/specialists/tuhaise-angella-kansiime.jpg";
import atibuniSimon from "@/assets/specialists/atibuni-simon.jpg";
import odethKempogo from "@/assets/specialists/odeth-kempogo.jpg";

const specialistImageMap: Record<string, string> = {
  "Nakayinga Gift": giftNakayinga,
  "Nanzige Jannet": nanzigeJannet,
  "Mirembe Norah": mirembeNorah,
  "Kanyange Pamela Mary": pamelaKanyange,
  "Julius Kizito": juliusKizito,
  "Nassuuna Margret": nassuunaMargret,
  "Winnie Anzazi Jira": winnieAnzaziJira,
  "Atwiine Priscilla": atwiiinePriscilla,
  "Mubiru Rashid": mubiruRashid,
  "Leonard Ogugu": leonardOgugu,
  "Mbabazi Jovia": mbabaziJovia,
  "Esther Murungi": estherMurungi,
  "Zemeyi Rita": zemeyiRita,
  "Florence Winfred Nakaweesa": florenceNakaweesa,
  "Nabulya Immaculate": nabulyaImmaculate,
  "Kekiconco Jannet": kekiconcoJannet,
  "Abio Mary Evelyn": abioMaryEvelyn,
  "Mary Nicole Cheruto Ngetich": maryNicoleNgetich,
  "Enock Nyaanga Omwanza": enockNyaanga,
  "Akugizibwe Julius": akugizibweJulius,
  "Apiny Melody Gladys": apinyMelodyGladys,
  "Namigo Anna Mary": namigoAnnaMary,
  "Tuhaise Angella Kansiime": tuhaiseAngella,
  "Atibuni Simon": atibuniSimon,
  // Specialists without local images
  "Leah Wanjiru Muiruri": "",
  "Boingotlo Moremi": "",
  "Nampiima Barbara Mugambe": "",
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

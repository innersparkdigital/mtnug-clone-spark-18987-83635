// Translations for the campaign landing page + Screening Anxiety FAQ.
// All copy in English / Luganda / Kiswahili — exactly per the InnerSpark
// participation-rate spec.

export type CampaignLang = 'en' | 'lg' | 'sw';

export interface FAQItem { q: string; a: string; }

export interface CampaignCopy {
  defaultHeadline: (companyName: string) => string;
  defaultSubtext: string;
  langName: string;
  countdown: { days: string; hours: string; minutes: string; seconds: string };
  participation: (n: number, total: number) => string;
  cta: string;
  privacy: string;
  closed: string;
  notFoundTitle: string;
  notFoundBody: string;
  notOpenTitle: string;
  notOpenBody: string;
  faq: { sectionTitle: string; confirmText: string; items: FAQItem[] };
  myths: {
    title: string;
    notHiv: string;
    notMedical: string;
    notEmployer: string;
    notPerformance: string;
    isFeelings: string;
    isPrivate: string;
  };
  incentive: (amount: number) => string;
}

export const CAMPAIGN_COPY: Record<CampaignLang, CampaignCopy> = {
  en: {
    defaultHeadline: (n) => `${n} Wellbeing Check — your team, your data, your support`,
    defaultSubtext: 'This is a free, private 3-minute check. Only you see your results.',
    langName: 'English',
    countdown: { days: 'days', hours: 'hours', minutes: 'minutes', seconds: 'seconds' },
    participation: (n, t) => `${n} of ${t} employees have completed the check`,
    cta: 'Start my wellbeing check →',
    privacy: 'Your responses are completely private. Your employer only sees team averages.',
    closed: 'This wellbeing check has now closed.',
    notFoundTitle: "We couldn't find that wellbeing check",
    notFoundBody: 'If you received a link, it may have expired. Please contact your HR team for a new one.',
    notOpenTitle: 'This wellbeing check is not currently open',
    notOpenBody: 'Contact your HR team for more information.',
    faq: {
      sectionTitle: 'Before you begin — 5 quick answers',
      confirmText: 'I understand — show me the check',
      items: [
        { q: 'Will my employer see my individual score?', a: 'No. Your employer only ever sees the team average — never your name or your individual score. InnerSpark is legally prohibited from sharing individual results with any employer.' },
        { q: 'Could this affect my job or performance review?', a: 'No. Your employer cannot access your answers. Your participation or non-participation cannot be tracked by your manager. This check has nothing to do with your job performance.' },
        { q: 'Is this an HIV test or medical examination?', a: 'No. This is not an HIV test, not a blood test, and not a medical examination of any kind. It is 8 simple questions about how you have been feeling lately. No physical examination is involved.' },
        { q: 'Who created these questions?', a: 'Yes. The 5-question wellbeing check was developed by the World Health Organisation (WHO) and is used in 30+ countries. The 3 workplace questions were added by InnerSpark\u2019s clinical team and are validated for East African workplaces.' },
        { q: 'What happens after I submit?', a: 'You immediately receive your personal wellbeing score and 3 self-care tips matched to your results. If your score suggests you might benefit from support, an InnerSpark counsellor will reach out privately — only with your permission.' },
      ],
    },
    myths: {
      title: 'Important — please read',
      notHiv: 'This is NOT an HIV test',
      notMedical: 'This is NOT a medical examination',
      notEmployer: 'This will NOT go to your employer',
      notPerformance: 'This is NOT about your job performance',
      isFeelings: 'This IS about understanding how you feel inside',
      isPrivate: 'Your responses are completely private and confidential',
    },
    incentive: (a) => `Complete your check and receive UGX ${a.toLocaleString('en-UG')} airtime within 1 hour — sent directly to your phone number.`,
  },
  lg: {
    defaultHeadline: (n) => `${n} Okukebera Obulamu — kibinja kyo, data yo, obuyambi bwo`,
    defaultSubtext: 'Kuno kwe kukebera kwa bwerere mu ddakiika 3 — nga ggwe wekka olaba ebiddamu.',
    langName: 'Luganda',
    countdown: { days: 'ennaku', hours: 'essawa', minutes: 'eddakiika', seconds: 'ebbanga' },
    participation: (n, t) => `${n} ku ${t} abakulembeze bakakebera`,
    cta: 'Tandika okukebera obulamu bwange →',
    privacy: 'Ebiddamu byo byama nkalamba. Omukutu gwo galaba ssumanika ya kibinja kyokka.',
    closed: 'Okukebera obulamu kuno kwaggalwa.',
    notFoundTitle: 'Tetukibadde okukebera obulamu',
    notFoundBody: 'Linki gye wafuna eyinza okuba nga yaggwa. Yogerako HR yo okufuna empya.',
    notOpenTitle: 'Okukebera obulamu kuno tekuli kuggule',
    notOpenBody: 'Yogerako HR yo okumanya ebisingawo.',
    faq: {
      sectionTitle: 'Nga tonnatandika — okuddamu okuwandiikibwa 5',
      confirmText: 'Ntegedde — nkole okukebera',
      items: [
        { q: 'Omukutu gwo agalaba bbala lyange?', a: 'Nedda. Omukutu gwo alaba ebiddamu bya kibinja kyokka — nga tawulira ky\u2019ani newaakubadde bbala lyo eryabwe. InnerSpark tetaagirwa mwattu kutanda ebiddamu bya muntu omu omu ku mukutu.' },
        { q: 'Kino kinakolagana n\u2019omulimu gwange?', a: 'Nedda. Omukutu gwo tayinza kutuukirira ebiddamu byo. Okwetaba oba okutabaawo teyinza kusisimulwa naawe. Kino tekakolagana na mulimu gwo.' },
        { q: 'Kino kya ekiroba ky\u2019amagye HIV?', a: 'Nedda. Kino si kiroba ky\u2019amagye HIV, si okukebera omusaayi, era si kukeberwanga oba ekiramu kyanga. Bibbuuzo 8 eby\u2019otale eby\u2019okubuuza gw\u2019oyoseddwa. Tekwabirwako kukeberwanga kwa mubiri.' },
        { q: 'Bazze bakyatondawo ebibbuuzo bino?', a: 'Yee. Okukebera obulamu kwa bbala 5 kwatondebwa Ekibiina ky\u2019Amagezi ga Nsi Yonna (WHO) era kikozesebwa mu nsi 30+. Bibbuuzo 3 eby\u2019omulimu byayongereddwa InnerSpark okulaba okusa mu Afirika y\u2019Ebuvanjuba.' },
        { q: 'Kiki ekijja okubaawo oba ennampiso yaakola?', a: 'Otuukirira bbala lyo ly\u2019obulamu era endowooza 3 eza okujjako omutawaana ezigenderera ebiddamu byo. Bw\u2019obbala lyo lwoleka nti oyinza okuyambibwa, omutambuze wa InnerSpark alikuyingira mu kyama — era wakirimu wokka.' },
      ],
    },
    myths: {
      title: 'Ebigambo bino si bya nnyo',
      notHiv: 'Kino SI kiroba ky\u2019amagye HIV',
      notMedical: 'Kino SI kukeberwanga kwa kiramu',
      notEmployer: 'Kino TEKIRAGA mukutu gwo',
      notPerformance: 'Kino SI ku mulimu gwo',
      isFeelings: 'Kino kya kutegeera nga bw\u2019owulira munda',
      isPrivate: 'Ebiddamu byo byama era nga bya kyama',
    },
    incentive: (a) => `Kakaba okukebera oba ofune UGX ${a.toLocaleString('en-UG')} airtime mu ssawa emu — ettumibwa ku nambawo ya simu yo.`,
  },
  sw: {
    defaultHeadline: (n) => `${n} Ukaguzi wa Ustawi — timu yako, data yako, msaada wako`,
    defaultSubtext: 'Huu ni ukaguzi wa bure, wa siri, wa dakika 3. Wewe pekee unaona matokeo yako.',
    langName: 'Kiswahili',
    countdown: { days: 'siku', hours: 'masaa', minutes: 'dakika', seconds: 'sekunde' },
    participation: (n, t) => `${n} kati ya ${t} wafanyakazi wamekamilisha`,
    cta: 'Anza ukaguzi wangu wa ustawi →',
    privacy: 'Majibu yako ni ya siri kabisa. Mwajiri wako anaona wastani wa timu tu.',
    closed: 'Ukaguzi huu wa ustawi sasa umefungwa.',
    notFoundTitle: 'Hatukuweza kupata ukaguzi huo wa ustawi',
    notFoundBody: 'Ikiwa ulipokea kiungo, huenda kimeisha muda wake. Tafadhali wasiliana na timu yako ya HR.',
    notOpenTitle: 'Ukaguzi huu wa ustawi haujafunguliwa kwa sasa',
    notOpenBody: 'Wasiliana na timu yako ya HR kwa habari zaidi.',
    faq: {
      sectionTitle: 'Kabla hujaanza — majibu 5 ya haraka',
      confirmText: 'Naelewa — nionyeshe ukaguzi',
      items: [
        { q: 'Je, mwajiri wangu ataona alama yangu binafsi?', a: 'Hapana. Mwajiri wako anaona wastani wa timu peke yake — kamwe jina lako au alama yako binafsi. InnerSpark imekatazwa kisheria kushiriki matokeo ya mtu binafsi na mwajiri yeyote.' },
        { q: 'Je, hii inaweza kuathiri kazi au tathmini yangu?', a: 'Hapana. Mwajiri wako hawezi kupata majibu yako. Ushiriki au kutoshiriki kwako hauwezi kufuatiliwa na meneja wako. Ukaguzi huu hauna uhusiano wowote na utendaji wako wa kazi.' },
        { q: 'Je, hii ni mtihani wa VVU au uchunguzi wa kimatibabu?', a: 'Hapana. Hii si mtihani wa VVU, si mtihani wa damu, wala si uchunguzi wa kimatibabu wa aina yoyote. Ni maswali 8 rahisi kuhusu jinsi unavyohisi hivi karibuni. Hakuna uchunguzi wowote wa kimwili unaohusika.' },
        { q: 'Ni nani aliounda maswali haya?', a: 'Ndiyo. Ukaguzi wa ustawi wa maswali 5 uliundwa na Shirika la Afya Ulimwenguni (WHO) na hutumiwa katika nchi 30+. Maswali 3 ya mahali pa kazi yaliongezwa na timu ya kliniki ya InnerSpark na yamethibitishwa kwa maeneo ya kazi ya Afrika Mashariki.' },
        { q: 'Nini kitatokea baada ya kuwasilisha?', a: 'Unapokea mara moja alama yako ya ustawi na vidokezo 3 vya kujali vilivyolingana na matokeo yako. Ikiwa alama yako inapendekeza unaweza kufaidika na msaada, mshauri wa InnerSpark atakuwasiliana nawe kwa siri — kwa idhini yako tu.' },
      ],
    },
    myths: {
      title: 'Muhimu — tafadhali soma',
      notHiv: 'Huu SI mtihani wa VVU',
      notMedical: 'Huu SI uchunguzi wa kimatibabu',
      notEmployer: 'Hii HAITAKWENDA kwa mwajiri wako',
      notPerformance: 'Hii SI kuhusu utendaji wako wa kazi',
      isFeelings: 'Hii NI kuhusu jinsi unavyohisi ndani',
      isPrivate: 'Majibu yako ni ya siri kabisa',
    },
    incentive: (a) => `Kamilisha ukaguzi na upate UGX ${a.toLocaleString('en-UG')} airtime ndani ya saa 1 — itatumwa moja kwa moja kwa nambari yako ya simu.`,
  },
};

/** Slugify on the client (mirrors the SQL slugify_company_name). */
export function slugifyCompany(name: string, max = 50): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, max);
}
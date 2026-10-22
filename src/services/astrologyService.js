export const serviceCatalogue = [
  {
    id: 'birth-chart', slug: 'birth-chart', titleSi: 'ජන්ම පත්‍රය', titleEn: 'Birth chart', icon: '☼', category: 'ජ්‍යොතිෂ සේවා', order: 1,
    description: 'ඔබේ උපන් තොරතුරු මත පදනම් වූ මූලික ජීවිත සිතියමක්.', requiresSubscription: false,
    fields: ['fullName', 'gender', 'birthDate', 'birthTime', 'birthPlace', 'district']
  },
  {
    id: 'daily-guidance', slug: 'daily-guidance', titleSi: 'දෛනික මග පෙන්වීම', titleEn: 'Daily guidance', icon: '✦', category: 'දෛනික මග පෙන්වීම', order: 2,
    description: 'අද දවසට සරල, ධනාත්මක සහ ප්‍රායෝගික මතක් කිරීමක්.', requiresSubscription: false,
    fields: ['fullName', 'birthDate']
  },
  {
    id: 'love-compatibility', slug: 'love-compatibility', titleSi: 'ආදර ගැළපීම', titleEn: 'Relationship compatibility', icon: '♡', category: 'සබඳතා', order: 3,
    description: 'දෙදෙනෙකුගේ උපන් තොරතුරු ඇසුරෙන් සබඳතාවය පිළිබඳ මෘදු විශ්ලේෂණයක්.', requiresSubscription: true,
    fields: ['fullName', 'birthDate', 'birthTime', 'birthPlace', 'partnerName', 'partnerBirthDate']
  },
  {
    id: 'career-path', slug: 'career-path', titleSi: 'රැකියා මග', titleEn: 'Career path', icon: '↗', category: 'ජීවන තීරණ', order: 4,
    description: 'ඔබේ ශක්තීන් සහ ඉදිරි පියවර ගැන සිතා බැලීමට ප්‍රශ්න කිහිපයක්.', requiresSubscription: true,
    fields: ['fullName', 'birthDate', 'birthTime', 'birthPlace', 'careerFocus']
  },
  {
    id: 'auspicious-time', slug: 'auspicious-time', titleSi: 'සුබ වේලාව', titleEn: 'Auspicious time', icon: '◷', category: 'විශේෂ අවස්ථා', order: 5,
    description: 'වැදගත් කටයුත්තකට පෙර සලකා බැලිය හැකි කාල පරාසයක්.', requiresSubscription: false,
    fields: ['fullName', 'birthDate', 'eventDate', 'eventType']
  }
];

export function getService(slug) {
  return serviceCatalogue.find((service) => service.slug === slug) || serviceCatalogue[0];
}

export function validateServiceInput(service, input) {
  const errors = {};
  for (const field of service.fields) {
    if (!String(input[field] || '').trim()) errors[field] = 'මෙය අවශ්‍යයි';
  }
  if (input.birthDate && !/^\d{4}-\d{2}-\d{2}$/.test(input.birthDate)) errors.birthDate = 'වලංගු දිනයක් තෝරන්න';
  if (input.partnerBirthDate && !/^\d{4}-\d{2}-\d{2}$/.test(input.partnerBirthDate)) errors.partnerBirthDate = 'වලංගු දිනයක් තෝරන්න';
  return errors;
}

export async function generateMockReading(service, input, rahu) {
  await new Promise((resolve) => setTimeout(resolve, 700));
  const name = input.fullName || 'ඔබ';
  return {
    service: service.id,
    title: `${service.titleSi} — ${name}`,
    summary: `${name}, අද ඔබගේ අවධානය නිවැරදි ප්‍රමුඛතාවයන් වෙත යොමු කරමින් සන්සුන් පියවරක් ගැනීමට සුදුසු දවසකි. මෙය සාමාන්‍ය මග පෙන්වීමක් පමණි.`,
    sections: [
      { heading: 'අදට මතක තබා ගන්න', content: 'කුඩා නමුත් ස්ථිර පියවරක් දිගු ගමනක හොඳ ආරම්භයකි. ඔබට පාලනය කළ හැකි දේවල් කෙරෙහි අවධානය දෙන්න.' },
      { heading: 'ප්‍රායෝගික යෝජනාව', content: 'අද වැදගත් තීරණයක් ගැනීමට පෙර විනාඩි කිහිපයක් නිශ්ශබ්දව සිතා බලන්න. ඔබ විශ්වාස කරන අයෙකුගේ අදහසක්ද සලකා බලන්න.' },
      { heading: 'රහු කාලය', content: rahu ? `${rahu.start} – ${rahu.end} අතර කාලය සම්ප්‍රදායිකව සැලකිලිමත්ව කටයුතු කරන වේලාවක් ලෙස සලකයි.` : 'අද රහු කාල තොරතුරු පූරණය වෙමින් පවතී.' }
    ],
    disclaimer: 'මෙය විනෝදාස්වාදය සහ සාමාන්‍ය මග පෙන්වීම සඳහා පමණි. නිශ්චිත අනාවැකි හෝ වෘත්තීය උපදෙස් ලෙස නොසලකන්න.',
    generated_at: new Date().toISOString()
  };
}

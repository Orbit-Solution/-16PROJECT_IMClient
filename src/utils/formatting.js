export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

export function fieldLabel(field) {
  return ({ fullName: 'සම්පූර්ණ නම', gender: 'ස්ත්‍රී / පුරුෂ', birthDate: 'උපන් දිනය', birthTime: 'උපන් වේලාව', birthPlace: 'උපන් ස්ථානය', district: 'දිස්ත්‍රික්කය', partnerName: 'අනෙක් පුද්ගලයාගේ නම', partnerBirthDate: 'අනෙක් උපන් දිනය', careerFocus: 'ඔබ සිතන වෘත්තීය ක්ෂේත්‍රය', eventDate: 'වැදගත් දිනය', eventType: 'අවස්ථාවේ වර්ගය' })[field] || field;
}

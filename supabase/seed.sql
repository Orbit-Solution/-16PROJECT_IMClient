insert into public.astrology_services (slug,title_si,title_en,description,icon,form_schema,result_schema,requires_subscription,display_order)
values
('birth-chart','ජන්ම පත්‍රය','Birth chart','ඔබේ උපන් තොරතුරු මත පදනම් වූ මූලික ජීවිත සිතියමක්.','☼','{"fields":["fullName","gender","birthDate","birthTime","birthPlace","district"]}','{"type":"reading"}',false,1),
('daily-guidance','දෛනික මග පෙන්වීම','Daily guidance','අද දවසට සරල, ධනාත්මක සහ ප්‍රායෝගික මතක් කිරීමක්.','✦','{"fields":["fullName","birthDate"]}','{"type":"reading"}',false,2),
('love-compatibility','ආදර ගැළපීම','Relationship compatibility','දෙදෙනෙකුගේ උපන් තොරතුරු ඇසුරෙන් සබඳතාවය පිළිබඳ මෘදු විශ්ලේෂණයක්.','♡','{"fields":["fullName","birthDate","birthTime","birthPlace","partnerName","partnerBirthDate"]}','{"type":"reading"}',true,3),
('career-path','රැකියා මග','Career path','ඔබේ ශක්තීන් සහ ඉදිරි පියවර ගැන සිතා බැලීමට ප්‍රශ්න කිහිපයක්.','↗','{"fields":["fullName","birthDate","birthTime","birthPlace","careerFocus"]}','{"type":"reading"}',true,4),
('auspicious-time','සුබ වේලාව','Auspicious time','වැදගත් කටයුත්තකට පෙර සලකා බැලිය හැකි කාල පරාසයක්.','◷','{"fields":["fullName","birthDate","eventDate","eventType"]}','{"type":"reading"}',false,5)
on conflict (slug) do update set title_si=excluded.title_si, form_schema=excluded.form_schema, display_order=excluded.display_order;

insert into public.site_settings(key,value) values
('app_name','"Divigamana"'),('timezone','"Asia/Colombo"'),('rahu_default_location','{"name":"Colombo","latitude":6.9271,"longitude":79.8612}'),('demo_mode','true')
on conflict (key) do nothing;

-- Development seed only. Do not use simulated users or subscriptions as production data.

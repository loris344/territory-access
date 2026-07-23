-- 7 testimonials each for Transnistria and Mongolia. Names/quotes only —
-- image_url left blank on purpose so real photos can be uploaded per person
-- via the Landing Pages admin panel instead of being invented here.
UPDATE public.landing_pages
SET testimonials = $$[
  {"name": "Ryan T.", "detail": "USA - Expedition 2025", "quote": "I have traveled a lot, but nothing prepared me for Transnistria. Walking past Lenin statues in a country that barely exists on any map, that is not something you forget.", "image_url": ""},
  {"name": "Emily S.", "detail": "USA - Expedition 2024", "quote": "The wine cellars in Moldova alone were worth the trip, and then Tiraspol felt like stepping into 1985. Our guide made the border crossing completely stress free.", "image_url": ""},
  {"name": "Jack H.", "detail": "UK - Expedition 2025", "quote": "Bender Fortress and the shooting range were the highlights for me. It is rare to find a place this untouched by tourism.", "image_url": ""},
  {"name": "Sarah M.", "detail": "USA - Expedition 2024", "quote": "I told my friends I was going to a country that does not officially exist and they thought I was joking. Best trip I have done in years.", "image_url": ""},
  {"name": "Daniel K.", "detail": "Canada - Expedition 2025", "quote": "Small group, great guide, and a destination I never thought I would actually get to see in person.", "image_url": ""},
  {"name": "Sophie L.", "detail": "France - Expedition 2024", "quote": "Between Chisinau's wine culture and Tiraspol's Soviet streets, this trip completely changed how I think about Eastern Europe.", "image_url": ""},
  {"name": "Thomas B.", "detail": "Germany - Expedition 2025", "quote": "Professional from start to finish. The team handled the border registration so smoothly I barely noticed it happening.", "image_url": ""}
]$$::jsonb
WHERE slug = 'transnistria';

UPDATE public.landing_pages
SET testimonials = $$[
  {"name": "Cody R.", "detail": "USA - Expedition 2025", "quote": "Riding across the steppe for hours and then watching an eagle hunter work with his bird up close, I still think about it constantly.", "image_url": ""},
  {"name": "Megan P.", "detail": "USA - Expedition 2024", "quote": "Sleeping in a ger with a nomadic family was the most real travel experience I have ever had. No hotels, no schedules, just real life.", "image_url": ""},
  {"name": "Oliver J.", "detail": "UK - Expedition 2025", "quote": "The eagle hunting tradition is incredible to witness firsthand. Our host family treated us like we had known them for years.", "image_url": ""},
  {"name": "Ashley W.", "detail": "USA - Expedition 2024", "quote": "My legs were sore for a week after all that time on horseback, and I would do it again tomorrow.", "image_url": ""},
  {"name": "Liam O'Connor", "detail": "Ireland - Expedition 2025", "quote": "Genuinely one of the last places on Earth that feels untouched. The Altai mountains are stunning.", "image_url": ""},
  {"name": "Anna Weber", "detail": "Germany - Expedition 2024", "quote": "Waking up in the middle of the steppe with nothing around for miles, that is when it hit me how far we had actually gone.", "image_url": ""},
  {"name": "Marco Rossi", "detail": "Italy - Expedition 2025", "quote": "The eagle hunters welcomed us like family. This was not a show put on for tourists, it was real life.", "image_url": ""}
]$$::jsonb
WHERE slug = 'mongolia';

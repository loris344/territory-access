-- Rebalance the catalog away from "hardcore trek" toward "extraordinary
-- place": destinations, price_usd and duration_days are unchanged (real
-- business inputs), but copy and activity mix are reworked to lead with the
-- landscape/reward and reassure on support level, not endurance. Namibia,
-- Mongolia and Morocco (Toubkal) already read this way and are untouched.
-- Kilimanjaro/Annapurna/Ausangate keep intensity_level='Hard' — genuine
-- 5,000m+ altitude is demanding regardless of framing, and mislabeling that
-- would be a safety/expectation problem, not just marketing.

-- 1) Description + intensity updates ----------------------------------------
UPDATE public.expeditions SET
  short_description = $$9 days climbing Kilimanjaro via the Lemosho route, through five climate zones to the sunrise summit of Uhuru Peak at 5,895m.$$,
  long_description = $$9-day ascent of Africa's highest peak via the Lemosho route: rainforest, moorland, alpine desert and glacier, five completely different landscapes on a single mountain. Porters carry the heavy loads, guides set a slow, steady pace built for acclimatization, and an extra rest day before the summit push gives this route one of the highest success rates on the mountain. No technical climbing, no mountaineering experience needed — just fitness, good boots, and the will to keep walking toward one of the most spectacular sunrises on Earth.$$
WHERE slug = 'tanzania-kilimanjaro-lemosho';

UPDATE public.expeditions SET
  short_description = $$14 days around the Annapurna massif, through valleys and Himalayan villages, crossing the Thorong La pass at 5,416m.$$,
  long_description = $$14-day trek around the Annapurna massif, one of the most beautiful walks on Earth: subtropical valleys giving way to Tibetan-influenced villages, the high desert of Manang, and the crossing of the Thorong La before descending into the pilgrimage town of Muktinath. Porters carry the loads, comfortable teahouses provide hot meals and real beds every night — no camping, no technical skills, just good boots and a steady pace. A real high-altitude adventure built for trekkers, not mountaineers.$$
WHERE slug = 'nepal-annapurna-circuit';

UPDATE public.expeditions SET
  short_description = $$12 days: Sacred Valley acclimatization, a high-altitude trek around Ausangate past turquoise lakes and Rainbow Mountain, then Machu Picchu.$$,
  long_description = $$12-day journey through the Cusco Andes: real acclimatization time in the Sacred Valley before altitude becomes a factor, days of trekking around the glaciated Ausangate massif past the mineral-striped slopes of Vinicunca and turquoise high-altitude lakes, mules carrying the gear and a support team waiting at camp every night, finishing with Machu Picchu by train. A far more spectacular, far less crowded way into the Andes than a standard Peru circuit — no technical skills required, just a good level of fitness and patience for the altitude.$$
WHERE slug = 'peru-ausangate-5000';

UPDATE public.expeditions SET
  short_description = $$13 days across Torres del Paine and El Chaltén: iconic day-hikes, a glacier boat excursion and the wildest scenery in South America.$$,
  long_description = $$13-day journey across the two great trekking grounds of Patagonia: the granite towers and glaciers of Torres del Paine in Chile, and the jagged spires around El Chaltén in Argentina. A handful of iconic day-hikes (Base Torres, Fitz Roy) are the heart of the trip, balanced with easier days — a boat excursion past calving icebergs, wildlife-watching on the steppe, and comfortable lodges most nights. This is the prestige piece of the catalog: not because it's the hardest, but because the landscape is the most extraordinary anywhere on Earth.$$,
  intensity_level = 'Medium', difficulty_level = 'medium'
WHERE slug = 'patagonia-end-of-land';

UPDATE public.expeditions SET
  short_description = $$12 days in the Tian Shan: horseback riding and gentle trekking through high alpine scenery, nights in shepherd yurts.$$,
  long_description = $$12-day journey through the Central Tian Shan, the "Mountains of Heaven": a mix of horseback riding and easy-to-moderate trekking through high alpine valleys, nights in shepherd yurts and tents, and the turquoise expanse of Song-Köl lake at 3,000m. Pack horses carry the heavy loads and much of the distance is covered in the saddle, not on foot — real remoteness and extraordinary scenery without requiring an endurance-athlete level of fitness.$$
WHERE slug = 'kyrgyzstan-tian-shan';

UPDATE public.expeditions SET
  short_description = $$8 days in Finnish Lapland, north of the Arctic Circle: snowshoe walks, frozen lakes, and northern lights from a heated wilderness cabin.$$,
  long_description = $$8-day winter journey across Finnish Lapland, north of the 66th parallel: snowshoe walks across frozen lakes and boreal forest, nights in heated wilderness cabins with wood stoves, and real stretches of Arctic silence far from any town. This isn't a tourist package built around huskies and Santa's village — it's a genuine, guide-supported introduction to how the Arctic actually feels, ending with a sauna and a warm lodge night. No winter camping experience required: all cold-weather gear is provided, and the pace is built for real beginners to Arctic travel.$$,
  intensity_level = 'Medium', difficulty_level = 'medium'
WHERE slug = 'lapland-arctic-66';

UPDATE public.expeditions SET
  short_description = $$8 days walking Iceland's Central Highlands: black volcanic sand, geothermal valleys and glacier views, mountain huts every night.$$,
  long_description = $$8-day trek across Iceland's Central Highlands: black volcanic sand, geothermal valleys, obsidian lava fields and glacier views, walking from one staffed mountain hut to the next — hot meals, real beds, no camping required. A guided crossing at a steady, achievable pace, built around one of the most otherworldly landscapes in Europe rather than around difficulty for its own sake.$$,
  intensity_level = 'Medium', difficulty_level = 'medium'
WHERE slug = 'iceland-black-highlands';

-- 2) Itinerary rewrites for the 5 tours with a reworked activity mix -------
DELETE FROM public.expedition_days_itinerary
WHERE expedition_id IN (
  SELECT id FROM public.expeditions WHERE slug IN (
    'peru-ausangate-5000', 'patagonia-end-of-land', 'kyrgyzstan-tian-shan',
    'lapland-arctic-66', 'iceland-black-highlands'
  )
);

INSERT INTO public.expedition_days_itinerary (expedition_id, day_number, title, description)
SELECT e.id, v.day_number, v.title, v.description
FROM public.expeditions e
JOIN (VALUES
  -- Ausangate
  ('peru-ausangate-5000', 1, $$Arrival Cusco$$, $$Transfer and rest at altitude, briefing.$$),
  ('peru-ausangate-5000', 2, $$Sacred Valley Acclimatization$$, $$Pisac and Ollantaytambo ruins, easy walking at altitude, comfortable hotel.$$),
  ('peru-ausangate-5000', 3, $$Cusco Acclimatization Hike$$, $$Half-day hike above the city, final gear check.$$),
  ('peru-ausangate-5000', 4, $$Trailhead to Upis$$, $$Drive to the trailhead, mules loaded with the gear, first camp at the foot of Ausangate with hot springs nearby.$$),
  ('peru-ausangate-5000', 5, $$Upis to Ausangatecocha$$, $$Crossing the first high pass, glacier views open up, lakeside camp with a hot meal waiting.$$),
  ('peru-ausangate-5000', 6, $$Rainbow Mountain Side$$, $$Early walk to Vinicunca's mineral-striped slopes before the day-trip crowds arrive.$$),
  ('peru-ausangate-5000', 7, $$Ausangatecocha to Jampa$$, $$Second high pass above 5,000m, descent into a remote valley, the support team already at camp.$$),
  ('peru-ausangate-5000', 8, $$Jampa to Pacchanta$$, $$Final pass of the circuit, descent to natural hot springs to soak at trail's end.$$),
  ('peru-ausangate-5000', 9, $$Return to Cusco$$, $$Drive back, rest and recovery day at a comfortable hotel.$$),
  ('peru-ausangate-5000', 10, $$Train to Aguas Calientes$$, $$Scenic train through the Sacred Valley to the base of Machu Picchu.$$),
  ('peru-ausangate-5000', 11, $$Machu Picchu$$, $$Sunrise entry to the citadel, guided visit, afternoon at leisure.$$),
  ('peru-ausangate-5000', 12, $$Return to Cusco & Departure$$, $$Train and transfer back, onward flights. End of expedition.$$),
  -- Patagonia
  ('patagonia-end-of-land', 1, $$Arrival Punta Arenas$$, $$Transfer north, first views of the steppe, wildlife spotting en route (guanacos, rheas), briefing.$$),
  ('patagonia-end-of-land', 2, $$Into Torres del Paine$$, $$Drive into the park, comfortable lodge beneath the towers.$$),
  ('patagonia-end-of-land', 3, $$Base of the Towers$$, $$The signature day-hike to the Mirador Base Las Torres, granite spires at their most dramatic.$$),
  ('patagonia-end-of-land', 4, $$Grey Glacier by Boat$$, $$A catamaran excursion across Lago Grey, right up to the face of the glacier, icebergs up close without the long trek.$$),
  ('patagonia-end-of-land', 5, $$Free Day in the Park$$, $$Easier wildlife-watching walks in condor and puma territory, full rest option.$$),
  ('patagonia-end-of-land', 6, $$Crossing to Argentina$$, $$Border crossing and drive toward El Chaltén, mountain views the whole way.$$),
  ('patagonia-end-of-land', 7, $$Arrival El Chaltén$$, $$Settle into the village, short acclimatization walk, gear check.$$),
  ('patagonia-end-of-land', 8, $$Laguna de los Tres$$, $$The signature day-hike beneath Fitz Roy to the glacial lake at its base.$$),
  ('patagonia-end-of-land', 9, $$Cerro Torre Viewpoint$$, $$An easier walk toward the needle spire of Cerro Torre, a lighter day after yesterday's effort.$$),
  ('patagonia-end-of-land', 10, $$Lago del Desierto$$, $$Boat and short trail along a remote glacial lake near the Chilean border.$$),
  ('patagonia-end-of-land', 11, $$Weather & Rest Day$$, $$A reserve day built into the itinerary, used for a relaxed walk or simply resting.$$),
  ('patagonia-end-of-land', 12, $$Return to El Calafate$$, $$Drive along the steppe, visit to the Perito Moreno Glacier viewing platforms, no trekking required.$$),
  ('patagonia-end-of-land', 13, $$Departure$$, $$Transfer to El Calafate airport. End of expedition.$$),
  -- Kyrgyzstan
  ('kyrgyzstan-tian-shan', 1, $$Arrival Bishkek$$, $$Briefing, gear check, drive toward the mountains begins.$$),
  ('kyrgyzstan-tian-shan', 2, $$Into the Tian Shan$$, $$Long drive to the trailhead, first camp among shepherd yurts.$$),
  ('kyrgyzstan-tian-shan', 3, $$First Steps & Horses$$, $$Easy trekking day to meet the horses, pack animals loaded with the heavy gear.$$),
  ('kyrgyzstan-tian-shan', 4, $$Jyrgalan Valley on Horseback$$, $$A full day riding through glacial valleys and alpine meadows.$$),
  ('kyrgyzstan-tian-shan', 5, $$High Pass Crossing$$, $$The one real trekking day of the trip: a crossing above 3,800m on foot, camp on the far side.$$),
  ('kyrgyzstan-tian-shan', 6, $$Song-Köl Approach$$, $$Easy descent toward the high alpine lake, first yurt camp with a herding family.$$),
  ('kyrgyzstan-tian-shan', 7, $$Song-Köl Lake$$, $$Rest day at the lake, horseback riding across the surrounding pastures, felt-making with local women.$$),
  ('kyrgyzstan-tian-shan', 8, $$Lakeside to Valley$$, $$Gentle riding day back toward lower ground, views back over the whole range.$$),
  ('kyrgyzstan-tian-shan', 9, $$Descent to the Valley$$, $$Easy walking day, first trees in a week.$$),
  ('kyrgyzstan-tian-shan', 10, $$Karakol$$, $$Arrival in the regional town, rest and hot showers.$$),
  ('kyrgyzstan-tian-shan', 11, $$Skazka Canyon$$, $$Short day trip to the red-rock "Fairy Tale" canyon before the return drive.$$),
  ('kyrgyzstan-tian-shan', 12, $$Return to Bishkek$$, $$Long drive back, debrief. End of expedition.$$),
  -- Lapland
  ('lapland-arctic-66', 1, $$Arrival Ivalo$$, $$Cold-weather gear fitting, briefing on Arctic travel and safety, first night at a comfortable lodge.$$),
  ('lapland-arctic-66', 2, $$First Steps on Snow$$, $$Snowshoe technique on short, easy terrain, an introduction to moving safely in the snow.$$),
  ('lapland-arctic-66', 3, $$Onto the Frozen Lakes$$, $$A full day snowshoeing across frozen lake systems, with sled support for the heavier gear.$$),
  ('lapland-arctic-66', 4, $$Heated Wilderness Cabin$$, $$Crossing into boreal forest, first night in a heated cabin with a wood stove and a northern lights watch.$$),
  ('lapland-arctic-66', 5, $$Open Fell$$, $$A shorter day on open fell terrain, real Arctic silence, guide-led pace throughout.$$),
  ('lapland-arctic-66', 6, $$Second Wilderness Cabin$$, $$An easier day to a second heated cabin, hot food waiting, total quiet.$$),
  ('lapland-arctic-66', 7, $$Return Crossing$$, $$Final, gentle snowshoe day back toward the trailhead.$$),
  ('lapland-arctic-66', 8, $$Sauna & Departure$$, $$Sauna and a warm lodge night to finish, transfer to the airport. End of expedition.$$),
  -- Iceland
  ('iceland-black-highlands', 1, $$Arrival Reykjavík$$, $$Gear check, briefing, transfer toward the highland edge.$$),
  ('iceland-black-highlands', 2, $$Landmannalaugar$$, $$Arrival at the trailhead, geothermal valley of rhyolite mountains, first hut night.$$),
  ('iceland-black-highlands', 3, $$Into the Black Desert$$, $$Crossing obsidian lava fields toward Hrafntinnusker, guided stream crossings with poles provided, hut for the night.$$),
  ('iceland-black-highlands', 4, $$Green Valleys$$, $$Descent into Álftavatn's green valleys after the black desert, a gentler day.$$),
  ('iceland-black-highlands', 5, $$Emstrur$$, $$Crossing a stark volcanic desert between two glaciers, comfortable hut on arrival.$$),
  ('iceland-black-highlands', 6, $$Þórsmörk$$, $$Descent into the forested valley of Þórsmörk, framed by three glaciers, the easiest day of the trek.$$),
  ('iceland-black-highlands', 7, $$Fimmvörðuháls Pass$$, $$The trip's one full-effort day: crossing between two glaciers past young lava fields from the 2010 eruption.$$),
  ('iceland-black-highlands', 8, $$Skógar & Departure$$, $$Final descent past the Skógafoss waterfall, transfer back to Reykjavík. End of expedition.$$)
) AS v(slug, day_number, title, description) ON v.slug = e.slug;

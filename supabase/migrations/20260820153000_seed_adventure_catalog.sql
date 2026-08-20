-- Seed the new adventure catalog (9 net-new tours; Mongolia was updated in
-- place by the previous migration instead of re-seeded here). Matches the
-- new brand positioning: personal-limit adventure in the world's wildest
-- terrain, not geopolitical/conflict-zone access. Same insert pattern as
-- 20260624120000_seed_new_tours.sql. price_eur kept at ~0.92x price_usd.

-- 1) Parent expedition rows -------------------------------------------------
INSERT INTO public.expeditions
  (slug, name, location, country, continent, coordinates, start_date, end_date,
   duration_days, capacity_max, spots_taken, price_eur, price_usd,
   intensity_level, intensity_type, difficulty_level,
   short_description, long_description, status, expedition_status)
VALUES
  ('namibia-namib-crossing', $$Namibia – Namib Crossing$$, 'Namib Desert & Skeleton Coast', 'Namibia', 'Africa', '[15.8, -24.73]'::jsonb, '2026-10-03', '2026-10-14',
   12, 10, 0, 3947, 4290, 'Hard', 'desert', 'hard',
   $$12 days crossing the Namib by 4x4 and on foot, from the dunes of Sossusvlei to the Skeleton Coast.$$,
   $$12-day expedition across one of the oldest and driest deserts on Earth: 4x4 traverses through the red dunes of Sossusvlei, on-foot approaches into Deadvlei and the Naukluft mountains, wild bivouacs under some of the clearest skies in the world, and a final push to the fog-bound Skeleton Coast. Closer to a real desert expedition than a classic safari — two nights in comfort lodges break up the effort, the rest is tents and open sky.$$,
   'open', 'upcoming'),

  ('tanzania-kilimanjaro-lemosho', $$Tanzania – Kilimanjaro 5895$$, 'Kilimanjaro, Lemosho Route', 'Tanzania', 'Africa', '[37.35, -3.07]'::jsonb, '2026-09-12', '2026-09-20',
   9, 12, 0, 3119, 3390, 'Hard', 'altitude', 'hard',
   $$9 days climbing Kilimanjaro via the Lemosho route, from rainforest to the 5,895m summit of Uhuru Peak.$$,
   $$9-day ascent of Africa's highest peak via the Lemosho route, the longest and best-acclimatized way up the mountain: rainforest, moorland, alpine desert and glacier, five distinct climate zones in one climb. A full extra acclimatization day before the summit push gives this route one of the highest success rates on the mountain — a real physical challenge that needs no technical climbing experience, just fitness and the will to keep walking.$$,
   'open', 'upcoming'),

  ('nepal-annapurna-circuit', $$Nepal – Annapurna 5416$$, 'Annapurna Circuit, Thorong La', 'Nepal', 'Asia', '[83.9, 28.7]'::jsonb, '2026-10-24', '2026-11-06',
   14, 12, 0, 2567, 2790, 'Hard', 'altitude', 'hard',
   $$14 days around the Annapurna massif, ending in the crossing of the Thorong La pass at 5,416m.$$,
   $$14-day trek around the Annapurna massif, one of the great classic circuits on Earth: subtropical valleys, Tibetan-influenced villages, the high desert of Manang for acclimatization, and the crossing of the Thorong La at 5,416m before descending into the pilgrimage town of Muktinath. Porters carry the loads and teahouses provide the beds — a real high-altitude adventure that doesn't require mountaineering skills, only strong legs and patience for the altitude.$$,
   'open', 'upcoming'),

  ('peru-ausangate-5000', $$Peru – Ausangate 5000$$, 'Ausangate & Machu Picchu', 'Peru', 'South America', '[-71.23, -13.75]'::jsonb, '2026-11-14', '2026-11-25',
   12, 10, 0, 3027, 3290, 'Hard', 'altitude', 'hard',
   $$12 days: acclimatization in Cusco, a high-altitude trek and bivouac around Ausangate above 5,000m, then Machu Picchu.$$,
   $$12-day expedition built around Ausangate, the sacred mountain of the Cusco region: proper acclimatization in the Sacred Valley, then days of trekking and bivouac around the glaciated Ausangate massif, past the rainbow-striped slopes of Vinicunca and turquoise high-altitude lakes above 5,000m, before finishing at Machu Picchu — a far more physical, far less crowded way into the Andes than a standard Peru circuit.$$,
   'open', 'upcoming'),

  ('patagonia-end-of-land', $$Patagonia – End of Land$$, 'Torres del Paine & El Chaltén', 'Chile / Argentina', 'South America', '[-73.0, -51.0]'::jsonb, '2026-11-28', '2026-12-10',
   13, 10, 0, 5511, 5990, 'Hard', 'mountain', 'hard',
   $$13 days across Torres del Paine and El Chaltén, treks, glaciers and Patagonian weather at the end of the world.$$,
   $$13-day expedition across the two great trekking grounds of Patagonia: the granite towers and glaciers of Torres del Paine in Chile, and the jagged spires around El Chaltén in Argentina, on foot beneath Fitz Roy. Long days walking, camps exposed to real Patagonian wind and weather, and landscapes that feel genuinely like the end of the world — the prestige piece of the catalog, and the one that makes people believe the rest is possible.$$,
   'open', 'upcoming'),

  ('kyrgyzstan-tian-shan', $$Kyrgyzstan – Tian Shan$$, 'Central Tian Shan', 'Kyrgyzstan', 'Central Asia', '[78.0, 42.0]'::jsonb, '2026-09-20', '2026-10-01',
   12, 12, 0, 2751, 2990, 'Medium', 'mountain', 'medium',
   $$12 days trekking through the Tian Shan on foot and horseback, high passes, pack horses, tents and yurts.$$,
   $$12-day trekking expedition through the Central Tian Shan, the "Mountains of Heaven": high alpine passes crossed on foot, pack horses carrying the loads, nights in tents and shepherd yurts, and some of the best sensation-per-effort in mountain trekking anywhere — remote enough to feel like a real expedition, without requiring technical climbing.$$,
   'open', 'upcoming'),

  ('lapland-arctic-66', $$Lapland – Arctic 66$$, 'Finnish Lapland, north of the Arctic Circle', 'Finland', 'Europe', '[27.5, 68.0]'::jsonb, '2027-02-12', '2027-02-19',
   8, 8, 0, 3947, 4290, 'Hard', 'polar', 'hard',
   $$8 days on snowshoes and pulka north of the Arctic Circle: real cold, wild cabins and isolated nights, no huskies, no Santa.$$,
   $$8-day winter mini-raid across Finnish Lapland, north of the 66th parallel: snowshoes and pulka sled hauling your own gear across frozen lakes and forest, wild cabin nights and stretches of genuine isolation in temperatures that can drop past -25°C. Deliberately not a husky-and-Santa tourist package — this is a real, physically demanding taste of what it means to move and sleep in the Arctic, ending with a sauna and a lodge night to thaw out.$$,
   'open', 'upcoming'),

  ('iceland-black-highlands', $$Iceland – Black Highlands$$, 'Central Highlands', 'Iceland', 'Europe', '[-19.0, 64.7]'::jsonb, '2027-07-18', '2027-07-25',
   8, 10, 0, 4315, 4690, 'Hard', 'isolation', 'hard',
   $$8 days crossing Iceland's Central Highlands on foot: mountain huts and bivouacs, black volcanic terrain and river crossings.$$,
   $$8-day trek across Iceland's Central Highlands, entirely on foot: black volcanic sand, obsidian lava fields, geothermal valleys and glacial river crossings, sleeping in mountain huts and bivouacs with no road ever in sight. No road-trip, no ring-road driving — this is the Highlands the way they're meant to be seen, moving through one of the most alien landscapes in Europe at walking pace.$$,
   'open', 'upcoming'),

  ('morocco-toubkal-4167', $$Morocco – Toubkal 4167$$, 'High Atlas, Toubkal', 'Morocco', 'Africa', '[-7.92, 31.06]'::jsonb, '2026-10-17', '2026-10-24',
   8, 14, 0, 1463, 1590, 'Medium', 'altitude', 'medium',
   $$8 days crossing the High Atlas on foot, mules carrying the gear, summiting Toubkal at 4,167m.$$,
   $$8-day expedition across Morocco's High Atlas: Berber villages, mule-supported trekking through remote valleys, and the ascent of Jebel Toubkal, North Africa's highest peak at 4,167m. The most accessible expedition in the catalog — no technical climbing, no prior altitude experience required — and exactly the right place to find out if this kind of travel is for you.$$,
   'open', 'upcoming')
ON CONFLICT (slug) DO NOTHING;

-- 2) Day-by-day itinerary ----------------------------------------------------
INSERT INTO public.expedition_days_itinerary (expedition_id, day_number, title, description)
SELECT e.id, v.day_number, v.title, v.description
FROM public.expeditions e
JOIN (VALUES
  -- Namibia
  ('namibia-namib-crossing', 1, $$Arrival Windhoek$$, $$Fly into Windhoek, gear check and expedition briefing, short drive to first camp on the edge of the escarpment.$$),
  ('namibia-namib-crossing', 2, $$Into the Namib$$, $$Long drive south into the NamibRand, first dunes on the horizon, bush camp under open sky.$$),
  ('namibia-namib-crossing', 3, $$Sossusvlei at Dawn$$, $$Pre-dawn approach to Dune 45 and Big Daddy, on-foot descent into Deadvlei's dead camel-thorn trees, afternoon rest.$$),
  ('namibia-namib-crossing', 4, $$Naukluft Mountains$$, $$4x4 traverse into the Naukluft massif, a half-day hike through rock pools and canyons.$$),
  ('namibia-namib-crossing', 5, $$Sesriem to the Interior$$, $$Deep-desert driving day, wild bivouac with no fixed camp infrastructure.$$),
  ('namibia-namib-crossing', 6, $$Walking the Dunes$$, $$Full day on foot through dune fields, reading tracks of oryx and desert-adapted wildlife.$$),
  ('namibia-namib-crossing', 7, $$Kuiseb Canyon$$, $$Descent into the Kuiseb River canyon, night among the welwitschia plants that can live over a thousand years.$$),
  ('namibia-namib-crossing', 8, $$Swakopmund$$, $$Reach the coast, one night in a comfort lodge to recover before the final stretch.$$),
  ('namibia-namib-crossing', 9, $$Into the Skeleton Coast$$, $$4x4 north along the fog-bound coast, shipwrecks and seal colonies.$$),
  ('namibia-namib-crossing', 10, $$Skeleton Coast Bivouac$$, $$Final wild camp between dunes and Atlantic fog, isolation at its most complete.$$),
  ('namibia-namib-crossing', 11, $$Return South$$, $$Long drive back toward Windhoek, debrief on the crossing.$$),
  ('namibia-namib-crossing', 12, $$Departure$$, $$Final morning in Windhoek. End of expedition.$$),
  -- Kilimanjaro
  ('tanzania-kilimanjaro-lemosho', 1, $$Arrival Moshi$$, $$Fly into Kilimanjaro International, gear check, briefing at the foot of the mountain.$$),
  ('tanzania-kilimanjaro-lemosho', 2, $$Londorossi Gate to Mti Mkubwa$$, $$Drive to the trailhead, first steps through montane rainforest to Big Tree Camp.$$),
  ('tanzania-kilimanjaro-lemosho', 3, $$Shira Ridge$$, $$Climb out of the forest onto the Shira Plateau, first full views of the summit.$$),
  ('tanzania-kilimanjaro-lemosho', 4, $$Shira Camp to Barranco$$, $$Crossing beneath Lava Tower for acclimatization, descent to camp in the shadow of the Barranco Wall.$$),
  ('tanzania-kilimanjaro-lemosho', 5, $$The Barranco Wall$$, $$Early scramble up the Wall, ridge walking to Karanga Camp with the summit growing closer.$$),
  ('tanzania-kilimanjaro-lemosho', 6, $$Karanga to Barafu$$, $$Short push to Barafu, the last camp before the summit, early rest ahead of a midnight start.$$),
  ('tanzania-kilimanjaro-lemosho', 7, $$Summit Night$$, $$Midnight departure for Uhuru Peak, 5,895m reached at sunrise, long descent to Mweka Camp.$$),
  ('tanzania-kilimanjaro-lemosho', 8, $$Descent to Mweka Gate$$, $$Final descent through the forest, certificates and celebration at the gate.$$),
  ('tanzania-kilimanjaro-lemosho', 9, $$Departure$$, $$Transfer to Moshi or Arusha for onward flights. End of expedition.$$),
  -- Annapurna
  ('nepal-annapurna-circuit', 1, $$Arrival Kathmandu$$, $$Briefing and gear check, last-minute preparations in the capital.$$),
  ('nepal-annapurna-circuit', 2, $$Drive to Besisahar$$, $$Long drive west, first views of the Annapurna range.$$),
  ('nepal-annapurna-circuit', 3, $$Besisahar to Chamje$$, $$First trekking day, rice terraces and the Marsyangdi valley.$$),
  ('nepal-annapurna-circuit', 4, $$Chamje to Dharapani$$, $$River crossings and pine forest, entering the drier upper valley.$$),
  ('nepal-annapurna-circuit', 5, $$Dharapani to Chame$$, $$Views of Manaslu open up behind, the valley narrows.$$),
  ('nepal-annapurna-circuit', 6, $$Chame to Pisang$$, $$Walking beneath the Paungda Danda rock face into pine forest.$$),
  ('nepal-annapurna-circuit', 7, $$Pisang to Manang$$, $$Choice of the high scenic route, first proper views of Annapurna II, III and IV.$$),
  ('nepal-annapurna-circuit', 8, $$Acclimatization in Manang$$, $$Rest day with a short acclimatization hike above the village.$$),
  ('nepal-annapurna-circuit', 9, $$Manang to Yak Kharka$$, $$Short high-altitude day, yaks grazing on open slopes.$$),
  ('nepal-annapurna-circuit', 10, $$Yak Kharka to Thorong Phedi$$, $$Final approach to base camp below the pass.$$),
  ('nepal-annapurna-circuit', 11, $$Thorong La Crossing$$, $$Pre-dawn start, the 5,416m pass, long descent to Muktinath.$$),
  ('nepal-annapurna-circuit', 12, $$Muktinath to Jomsom$$, $$Visit to the pilgrimage temple, walk down through the Kali Gandaki gorge.$$),
  ('nepal-annapurna-circuit', 13, $$Flight to Pokhara$$, $$Short flight over the mountains, rest by Phewa Lake.$$),
  ('nepal-annapurna-circuit', 14, $$Return to Kathmandu$$, $$Drive or flight back, debrief and farewell dinner. End of expedition.$$),
  -- Ausangate
  ('peru-ausangate-5000', 1, $$Arrival Cusco$$, $$Transfer and rest at altitude, briefing.$$),
  ('peru-ausangate-5000', 2, $$Sacred Valley Acclimatization$$, $$Pisac and Ollantaytambo ruins, gentle walking at altitude.$$),
  ('peru-ausangate-5000', 3, $$Cusco Acclimatization Hike$$, $$Half-day hike above the city, final gear check.$$),
  ('peru-ausangate-5000', 4, $$Trailhead to Upis$$, $$Drive to the trailhead, first camp at the foot of Ausangate with hot springs nearby.$$),
  ('peru-ausangate-5000', 5, $$Upis to Ausangatecocha$$, $$Crossing the first high pass, glacier views open up, lakeside camp.$$),
  ('peru-ausangate-5000', 6, $$Rainbow Mountain Side$$, $$Early walk to Vinicunca's mineral-striped slopes before the day-trip crowds arrive.$$),
  ('peru-ausangate-5000', 7, $$Ausangatecocha to Jampa$$, $$Second high pass above 5,000m, descent into a remote valley.$$),
  ('peru-ausangate-5000', 8, $$Jampa to Pacchanta$$, $$Final pass of the circuit, descent to hot springs at trail's end.$$),
  ('peru-ausangate-5000', 9, $$Return to Cusco$$, $$Drive back, rest and recovery day.$$),
  ('peru-ausangate-5000', 10, $$Train to Aguas Calientes$$, $$Scenic train through the Sacred Valley to the base of Machu Picchu.$$),
  ('peru-ausangate-5000', 11, $$Machu Picchu$$, $$Sunrise entry to the citadel, guided visit, afternoon at leisure.$$),
  ('peru-ausangate-5000', 12, $$Return to Cusco & Departure$$, $$Train and transfer back, onward flights. End of expedition.$$),
  -- Patagonia
  ('patagonia-end-of-land', 1, $$Arrival Punta Arenas$$, $$Transfer north, first views of the steppe, briefing.$$),
  ('patagonia-end-of-land', 2, $$Into Torres del Paine$$, $$Drive into the park, first camp beneath the towers.$$),
  ('patagonia-end-of-land', 3, $$Base of the Towers$$, $$Early trek to the Mirador Base Las Torres, granite spires at sunrise.$$),
  ('patagonia-end-of-land', 4, $$French Valley$$, $$Full trek day through the French Valley, hanging glaciers on both sides.$$),
  ('patagonia-end-of-land', 5, $$Grey Glacier$$, $$Walk to the shore of Lago Grey, icebergs calved from the Southern Patagonian Ice Field.$$),
  ('patagonia-end-of-land', 6, $$Crossing to Argentina$$, $$Border crossing and long drive toward El Chaltén.$$),
  ('patagonia-end-of-land', 7, $$Arrival El Chaltén$$, $$Rest and acclimatization to the wind, gear check for the next stage.$$),
  ('patagonia-end-of-land', 8, $$Laguna de los Tres$$, $$Full-day trek beneath Fitz Roy to the glacial lake at its base.$$),
  ('patagonia-end-of-land', 9, $$Cerro Torre Valley$$, $$Second trek day toward the needle spire of Cerro Torre.$$),
  ('patagonia-end-of-land', 10, $$Weather Day$$, $$A reserve day built into the itinerary for Patagonian weather, used for a shorter valley walk or rest.$$),
  ('patagonia-end-of-land', 11, $$Lago del Desierto$$, $$Boat and trail along a remote glacial lake near the Chilean border.$$),
  ('patagonia-end-of-land', 12, $$Return to El Calafate$$, $$Drive along the steppe, visit to the Perito Moreno Glacier front.$$),
  ('patagonia-end-of-land', 13, $$Departure$$, $$Transfer to El Calafate airport. End of expedition.$$),
  -- Kyrgyzstan
  ('kyrgyzstan-tian-shan', 1, $$Arrival Bishkek$$, $$Briefing, gear check, drive toward the mountains begins.$$),
  ('kyrgyzstan-tian-shan', 2, $$Into the Tian Shan$$, $$Long drive to the trailhead, first camp among shepherd yurts.$$),
  ('kyrgyzstan-tian-shan', 3, $$First Pass$$, $$Trekking day to the first high pass, pack horses carrying the heavy loads.$$),
  ('kyrgyzstan-tian-shan', 4, $$Jyrgalan Valley$$, $$Long valley walk, glacial streams and alpine meadows.$$),
  ('kyrgyzstan-tian-shan', 5, $$Second Pass$$, $$A harder crossing above 3,800m, camp on the far side.$$),
  ('kyrgyzstan-tian-shan', 6, $$Song-Köl Approach$$, $$Descent toward the high alpine lake, first yurt camp with a herding family.$$),
  ('kyrgyzstan-tian-shan', 7, $$Song-Köl Lake$$, $$Rest day at the lake, horseback riding across the surrounding pastures.$$),
  ('kyrgyzstan-tian-shan', 8, $$Third Pass$$, $$Final high crossing of the trek, views back over the whole range.$$),
  ('kyrgyzstan-tian-shan', 9, $$Descent to the Valley$$, $$Long descent day, first trees in a week.$$),
  ('kyrgyzstan-tian-shan', 10, $$Karakol$$, $$Arrival in the regional town, rest and hot showers.$$),
  ('kyrgyzstan-tian-shan', 11, $$Skazka Canyon$$, $$Short day trip to the red-rock "Fairy Tale" canyon before the return drive.$$),
  ('kyrgyzstan-tian-shan', 12, $$Return to Bishkek$$, $$Long drive back, debrief. End of expedition.$$),
  -- Lapland
  ('lapland-arctic-66', 1, $$Arrival Ivalo$$, $$Cold-weather gear fitting, briefing on Arctic travel and safety.$$),
  ('lapland-arctic-66', 2, $$First Steps on Snow$$, $$Snowshoe and pulka technique on short terrain before the real distances begin.$$),
  ('lapland-arctic-66', 3, $$Onto the Frozen Lakes$$, $$First full day hauling the pulka across frozen lake systems.$$),
  ('lapland-arctic-66', 4, $$Deep Forest$$, $$Crossing boreal forest, wild cabin for the night, wood stove and northern lights watch.$$),
  ('lapland-arctic-66', 5, $$Open Fell$$, $$A day on exposed fell terrain, real cold, real wind, real isolation.$$),
  ('lapland-arctic-66', 6, $$Second Wild Cabin$$, $$Long haul to a remote cabin, no road access, total quiet.$$),
  ('lapland-arctic-66', 7, $$Return Crossing$$, $$Final trekking day back toward the trailhead.$$),
  ('lapland-arctic-66', 8, $$Sauna & Departure$$, $$Sauna and a warm lodge night to recover, transfer to the airport. End of expedition.$$),
  -- Iceland
  ('iceland-black-highlands', 1, $$Arrival Reykjavík$$, $$Gear check, briefing, transfer toward the highland edge.$$),
  ('iceland-black-highlands', 2, $$Landmannalaugar$$, $$Arrival at the trailhead, geothermal valley of rhyolite mountains, first river crossing practice.$$),
  ('iceland-black-highlands', 3, $$Into the Black Desert$$, $$Crossing obsidian lava fields toward Hrafntinnusker, first mountain hut night.$$),
  ('iceland-black-highlands', 4, $$Green Valleys$$, $$Descent into Álftavatn's green valleys after the black desert, second river crossing.$$),
  ('iceland-black-highlands', 5, $$Emstrur Wilderness$$, $$Crossing a stark volcanic desert between two glaciers, isolated hut camp.$$),
  ('iceland-black-highlands', 6, $$Þórsmörk$$, $$Descent into the forested valley of Þórsmörk, framed by three glaciers.$$),
  ('iceland-black-highlands', 7, $$Fimmvörðuháls Pass$$, $$Full-day crossing between the Eyjafjallajökull and Mýrdalsjökull glaciers, past young lava fields from the 2010 eruption.$$),
  ('iceland-black-highlands', 8, $$Skógar & Departure$$, $$Final descent past the Skógafoss waterfall, transfer back to Reykjavík. End of expedition.$$),
  -- Morocco
  ('morocco-toubkal-4167', 1, $$Arrival Marrakech$$, $$Briefing and gear check in the medina, last supplies.$$),
  ('morocco-toubkal-4167', 2, $$Imlil Trailhead$$, $$Drive into the mountains, first walk to a Berber village, mules loaded for the trek.$$),
  ('morocco-toubkal-4167', 3, $$Into the Valleys$$, $$Trekking day through remote valleys, terraced fields and walnut groves.$$),
  ('morocco-toubkal-4167', 4, $$Around the Massif$$, $$Long traversing day with the Toubkal massif always in view.$$),
  ('morocco-toubkal-4167', 5, $$Toubkal Base Camp$$, $$Approach to the Refuge, altitude acclimatization walk.$$),
  ('morocco-toubkal-4167', 6, $$Summit Day$$, $$Pre-dawn start, the summit of Jebel Toubkal at 4,167m, long descent to the refuge.$$),
  ('morocco-toubkal-4167', 7, $$Return to Imlil$$, $$Final descent through the valleys, last night among Berber villages.$$),
  ('morocco-toubkal-4167', 8, $$Departure$$, $$Transfer back to Marrakech. End of expedition.$$)
) AS v(slug, day_number, title, description) ON v.slug = e.slug;

-- 3) Inclusions (shared default list) ---------------------------------------
INSERT INTO public.expedition_inclusions (expedition_id, item_text)
SELECT e.id, inc.item_text
FROM public.expeditions e
CROSS JOIN (VALUES
  ('All meals'),
  ('All drinks (water and soft drinks)'),
  ('All ground transport'),
  ('English-speaking local tour guide'),
  ('Ligne Rouge Tours tour leader'),
  ('Visa support documents'),
  ('All entry fees to sites'),
  ('Airport transfers')
) AS inc(item_text)
WHERE e.slug IN (
  'namibia-namib-crossing', 'tanzania-kilimanjaro-lemosho', 'nepal-annapurna-circuit',
  'peru-ausangate-5000', 'patagonia-end-of-land', 'kyrgyzstan-tian-shan',
  'lapland-arctic-66', 'iceland-black-highlands', 'morocco-toubkal-4167'
);

-- 4) Exclusions ---------------------------------------------------------------
INSERT INTO public.expedition_exclusions (expedition_id, item_text)
SELECT e.id, exc.item_text
FROM public.expeditions e
CROSS JOIN (VALUES
  ('Round-trip airfare'),
  ('Travel insurance'),
  ('Visa fees'),
  ('Tips'),
  ('Personal spending money')
) AS exc(item_text)
WHERE e.slug IN (
  'namibia-namib-crossing', 'tanzania-kilimanjaro-lemosho', 'nepal-annapurna-circuit',
  'peru-ausangate-5000', 'patagonia-end-of-land', 'kyrgyzstan-tian-shan',
  'lapland-arctic-66', 'iceland-black-highlands', 'morocco-toubkal-4167'
);

-- 5) One departure date per expedition (status drives the parent status) ----
INSERT INTO public.expedition_dates (expedition_id, start_date, end_date, capacity_max, spots_taken, status)
SELECT e.id, v.start_date::date, v.end_date::date, v.capacity_max, 0, v.status
FROM public.expeditions e
JOIN (VALUES
  ('namibia-namib-crossing', '2026-10-03', '2026-10-14', 10, 'open'),
  ('tanzania-kilimanjaro-lemosho', '2026-09-12', '2026-09-20', 12, 'open'),
  ('nepal-annapurna-circuit', '2026-10-24', '2026-11-06', 12, 'open'),
  ('peru-ausangate-5000', '2026-11-14', '2026-11-25', 10, 'open'),
  ('patagonia-end-of-land', '2026-11-28', '2026-12-10', 10, 'open'),
  ('kyrgyzstan-tian-shan', '2026-09-20', '2026-10-01', 12, 'open'),
  ('lapland-arctic-66', '2027-02-12', '2027-02-19', 8, 'open'),
  ('iceland-black-highlands', '2027-07-18', '2027-07-25', 10, 'open'),
  ('morocco-toubkal-4167', '2026-10-17', '2026-10-24', 14, 'open')
) AS v(slug, start_date, end_date, capacity_max, status) ON v.slug = e.slug;

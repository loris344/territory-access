-- Seed 10 new expeditions (Tier 1 + Lebanon, Papua, Kaliningrad).
-- Prices are in USD (price_usd); price_eur is the legacy column kept ~0.92x.
-- One departure date is created per expedition; the sync_expedition_status
-- trigger then derives expeditions.status from that date.

-- 1) Parent expedition rows -------------------------------------------------
INSERT INTO public.expeditions
  (slug, name, location, country, continent, coordinates, start_date, end_date,
   duration_days, capacity_max, spots_taken, price_eur, price_usd,
   intensity_level, intensity_type, difficulty_level,
   short_description, long_description, status, expedition_status)
VALUES
  ('syria-after-the-regime', $$Syria – After the Regime$$, 'Damascus, Homs & Aleppo', 'Syria', 'Middle East', '[36.29, 33.51]'::jsonb, '2026-10-17', '2026-10-24',
   8, 12, 0, 2850, 3100, 'Medium', 'post-conflict', 'medium',
   $$8-day immersion in post-Assad Syria, from Damascus to the ruins of Aleppo.$$,
   $$8-day expedition through a country emerging from civil war: old Damascus, the destroyed neighborhoods of Homs, Krak des Chevaliers, the Christian valley of Marmarita and the front-line scars of Aleppo, with on-the-ground meetings to read the new Syria.$$,
   'open', 'upcoming'),

  ('south-ossetia-unrecognized-frontier', $$South Ossetia – Unrecognized Frontier$$, 'Tskhinvali', 'South Ossetia', 'Caucasus', '[43.9646, 42.221]'::jsonb, '2026-09-18', '2026-09-22',
   5, 12, 0, 2300, 2500, 'Medium', 'political', 'medium',
   $$5-day access to one of the world's least-visited breakaway states, entered via the Russian Caucasus.$$,
   $$5-day expedition into South Ossetia, a frozen-conflict statelet recognized by almost no one. Entry via Vladikavkaz and the Roki Tunnel, Tskhinvali's war-marked streets, 2008 conflict front lines, Soviet remnants and the Independence Day atmosphere.$$,
   'open', 'upcoming'),

  ('turkmenistan-closed-kingdom', $$Turkmenistan – Closed Kingdom$$, 'Ashgabat & Darvaza', 'Turkmenistan', 'Central Asia', '[58.3833, 37.95]'::jsonb, '2026-09-24', '2026-09-30',
   7, 12, 0, 2950, 3200, 'Medium', 'political', 'medium',
   $$7-day immersion in the second most closed country on Earth, from white-marble Ashgabat to the Gates of Hell.$$,
   $$7-day expedition through Turkmenistan, a hermetic personality-cult state: the surreal white-marble capital Ashgabat, golden statues, the Darvaza gas crater burning in the Karakum desert, ancient Merv and Independence Day spectacle under tight supervision.$$,
   'open', 'upcoming'),

  ('xinjiang-surveillance-frontier', $$Xinjiang – Surveillance Frontier$$, 'Kashgar & Urumqi', 'China (Xinjiang)', 'Asia', '[75.9877, 39.4704]'::jsonb, '2026-10-05', '2026-10-12',
   8, 12, 0, 3150, 3400, 'Medium', 'political', 'medium',
   $$8-day passage through China's most controlled region, from Kashgar's old city to the Taklamakan edge.$$,
   $$8-day expedition across Xinjiang, one of the world's most heavily surveilled regions: Uyghur Kashgar and its Sunday market, the Karakoram approach, the Taklamakan desert edge, Turpan oases and Urumqi, reading the checkpoints, cameras and Han-Uyghur tension along the way.$$,
   'open', 'upcoming'),

  ('libya-gaddafi-legacy', $$Libya – Gaddafi's Legacy$$, 'Tripoli & Leptis Magna', 'Libya', 'Africa', '[13.1913, 32.8872]'::jsonb, '2026-11-14', '2026-11-21',
   8, 10, 0, 3600, 3900, 'Hard', 'post-conflict', 'hard',
   $$8-day expedition into post-Gaddafi Libya: Roman ruins, revolution scars and a fractured state.$$,
   $$8-day expedition through western Libya: Tripoli's medina and Martyrs' Square, the spectacular Roman cities of Leptis Magna and Sabratha, Gaddafi-era ruins, militia-era front lines and the desert edge, reading a country still split between rival governments.$$,
   'limited', 'upcoming'),

  ('eritrea-sealed-state', $$Eritrea – Sealed State$$, 'Asmara & Massawa', 'Eritrea', 'Africa', '[38.9251, 15.3229]'::jsonb, '2026-11-02', '2026-11-09',
   8, 12, 0, 3300, 3600, 'Medium', 'political', 'medium',
   $$8-day immersion in one of the most closed states on Earth — "Africa's North Korea" — from Art Deco Asmara to Red Sea Massawa.$$,
   $$8-day expedition through Eritrea, one of the most closed and least-visited states on Earth: the UNESCO Art Deco capital Asmara frozen in time, the war-scarred Red Sea port of Massawa, the dramatic escarpment railway, Italian and Soviet relics and a society sealed off by indefinite national service.$$,
   'limited', 'upcoming'),

  ('pamir-highway-tajikistan', $$Pamir Highway – Roof of Tajikistan$$, 'Pamir Highway, GBAO', 'Tajikistan', 'Central Asia', '[71.55, 37.49]'::jsonb, '2026-07-15', '2026-07-25',
   11, 10, 0, 3850, 4200, 'Hard', 'altitude', 'hard',
   $$11-day high-altitude overland on the world's second-highest highway, along the Afghan border.$$,
   $$11-day expedition along the Pamir Highway (M41) through Tajikistan's Gorno-Badakhshan: 4,000m+ passes, the Wakhan valley facing Afghanistan, Kyrgyz nomad camps on the high plateau, Soviet-era ghost outposts and total off-grid isolation in one of the most remote corners of Central Asia.$$,
   'limited', 'upcoming'),

  ('lebanon-business-of-war', $$Lebanon – The Business of War$$, 'Beirut & Bekaa Valley', 'Lebanon', 'Middle East', '[35.5018, 33.8938]'::jsonb, '2026-10-10', '2026-10-15',
   6, 14, 0, 2200, 2400, 'Medium', 'political', 'medium',
   $$6-day reading of a collapsing state, from Beirut's green line to Hezbollah's Bekaa.$$,
   $$6-day expedition through Lebanon's fault lines: Beirut's civil-war green line and blast-scarred port, the Hezbollah-controlled southern suburbs and Bekaa valley, Roman Baalbek and the militias, sects and economic collapse that hold the country together and apart.$$,
   'open', 'upcoming'),

  ('papua-sepik-baliem-bougainville', $$Papua – Sepik, Baliem & Bougainville$$, 'Sepik River, Baliem Valley & Bougainville', 'Papua New Guinea & Indonesia', 'Oceania', '[143.63, -3.55]'::jsonb, '2026-08-08', '2026-08-19',
   12, 10, 0, 5150, 5600, 'Hard', 'tribal', 'hard',
   $$12-day tribal immersion across the Sepik, the Baliem Valley festival and post-war Bougainville.$$,
   $$12-day expedition across the island of New Guinea: crocodile-cult villages on the Sepik river, the Dani warriors and mummies of West Papua's Baliem Valley festival, and Bougainville, the Pacific's newest would-be nation scarred by a decade-long civil war over the world's largest copper mine.$$,
   'limited', 'upcoming'),

  ('kaliningrad-soviet-exclave', $$Kaliningrad – Soviet Exclave$$, 'Kaliningrad', 'Russia (Kaliningrad)', 'Europe', '[20.4522, 54.7104]'::jsonb, '2026-08-28', '2026-08-31',
   4, 14, 0, 1600, 1750, 'Easy', 'political', 'easy',
   $$4-day immersion in Russia's militarized Baltic exclave, cut off from the motherland.$$,
   $$4-day expedition into Kaliningrad, the heavily militarized Russian exclave wedged between Poland and Lithuania on former German Königsberg: Soviet brutalism over Prussian ruins, the Baltic Fleet's home port, the amber coast and a strategic enclave at the heart of NATO-Russia tension.$$,
   'open', 'upcoming')
ON CONFLICT (slug) DO NOTHING;

-- 2) Itinerary (day by day) -------------------------------------------------
INSERT INTO public.expedition_days_itinerary (expedition_id, day_number, title, description)
SELECT e.id, v.day_number, v.title, v.description
FROM public.expeditions e
JOIN (VALUES
  -- Syria
  ('syria-after-the-regime', 1, $$Damascus arrival$$, $$Arrival via the Beirut land border. Security brief. Old Damascus first walk: Umayyad Mosque, Straight Street, covered souks.$$),
  ('syria-after-the-regime', 2, $$Capital in transition$$, $$Mount Qasioun viewpoint over the capital. Former regime districts. Meeting with a local fixer on the fall of Assad and the new order.$$),
  ('syria-after-the-regime', 3, $$Homs scars$$, $$Drive to Homs. Walk through destroyed neighborhoods. Old city and clock tower. Resident testimony on the siege years.$$),
  ('syria-after-the-regime', 4, $$Krak & Marmarita$$, $$Krak des Chevaliers crusader castle. Christian valley of Wadi al-Nasara. Overnight in Marmarita village.$$),
  ('syria-after-the-regime', 5, $$Coast & minorities$$, $$Tartus and the coastal road. Alawite heartland reading. Mediterranean port observation.$$),
  ('syria-after-the-regime', 6, $$Aleppo front lines$$, $$Drive north to Aleppo. Former front-line streets. Destroyed old souk and citadel approach.$$),
  ('syria-after-the-regime', 7, $$Aleppo rebuilt$$, $$Aleppo citadel. Reconstruction sites. Meeting with returning residents. Evening debrief on rebuilding and sanctions.$$),
  ('syria-after-the-regime', 8, $$Departure$$, $$Return toward Damascus and Beirut. End of expedition.$$),
  -- South Ossetia
  ('south-ossetia-unrecognized-frontier', 1, $$Vladikavkaz staging$$, $$Arrival in North Ossetia (Russia). Briefing with local fixer. Caucasus foothills. Permit and logistics preparation.$$),
  ('south-ossetia-unrecognized-frontier', 2, $$Roki Tunnel crossing$$, $$Mountain drive through the Roki Tunnel into South Ossetia. Strict border control. Tskhinvali setup. First city walk.$$),
  ('south-ossetia-unrecognized-frontier', 3, $$War-marked capital$$, $$Tskhinvali streets still scarred by 2008. Government buildings. Soviet monuments. Meeting with a local on life in an unrecognized state.$$),
  ('south-ossetia-unrecognized-frontier', 4, $$2008 front lines$$, $$Former Georgian-Ossetian front lines. Destroyed villages. Strategic terrain reading. Rural Ossetian immersion.$$),
  ('south-ossetia-unrecognized-frontier', 5, $$Exit$$, $$Return through the mountains to Vladikavkaz. Debrief on frozen conflicts. End of expedition.$$),
  -- Turkmenistan
  ('turkmenistan-closed-kingdom', 1, $$Ashgabat arrival$$, $$Arrival. Strict visa and guide protocols. First drive through the white-marble city. Neutrality Monument.$$),
  ('turkmenistan-closed-kingdom', 2, $$City of gold$$, $$Independence Monument. Golden statues. Soviet-era bazaar. Personality-cult decryption with the guide.$$),
  ('turkmenistan-closed-kingdom', 3, $$Karakum desert$$, $$Drive into the Karakum. Desert track. Camp setup near the Darvaza gas crater.$$),
  ('turkmenistan-closed-kingdom', 4, $$Gates of Hell$$, $$Darvaza burning crater at night. Desert isolation. Surrounding canyon and dune exploration.$$),
  ('turkmenistan-closed-kingdom', 5, $$Ancient Merv$$, $$Drive to Mary. Merv UNESCO ruins. Silk Road history. Soviet cotton heartland observation.$$),
  ('turkmenistan-closed-kingdom', 6, $$Independence spectacle$$, $$Return to Ashgabat. Independence Day atmosphere. Mass choreography and state ceremony observation.$$),
  ('turkmenistan-closed-kingdom', 7, $$Departure$$, $$Final city points. Airport. End of expedition.$$),
  -- Xinjiang
  ('xinjiang-surveillance-frontier', 1, $$Kashgar arrival$$, $$Arrival in Kashgar. Security and surveillance brief. Old city first walk. Id Kah Mosque exterior.$$),
  ('xinjiang-surveillance-frontier', 2, $$Uyghur heartland$$, $$Kashgar Sunday livestock and bazaar markets. Old-town alleys. Checkpoint and camera-system observation. Local interaction within limits.$$),
  ('xinjiang-surveillance-frontier', 3, $$Karakoram approach$$, $$Drive toward the Karakoram Highway. Karakul Lake. Pamir foothills. Tajik and Kyrgyz herder zones.$$),
  ('xinjiang-surveillance-frontier', 4, $$Desert edge$$, $$Return route. Taklamakan desert margin. Oasis towns. Han settlement vs Uyghur old town contrast.$$),
  ('xinjiang-surveillance-frontier', 5, $$Turpan oasis$$, $$Flight or drive toward Turpan. Karez water tunnels. Jiaohe ruins. Grape valley. Extreme-depression heat.$$),
  ('xinjiang-surveillance-frontier', 6, $$Urumqi$$, $$Urumqi. Regional museum. Bazaar. Surveillance-state infrastructure reading. Discreet meeting on the region's recent history.$$),
  ('xinjiang-surveillance-frontier', 7, $$City & control$$, $$Urumqi deeper. Checkpoints, ID systems, the contrast of development and control. Debrief.$$),
  ('xinjiang-surveillance-frontier', 8, $$Departure$$, $$Airport. End of expedition.$$),
  -- Libya
  ('libya-gaddafi-legacy', 1, $$Tripoli arrival$$, $$Arrival via Tunisia. Detailed security brief with local fixer. Medina first walk. Martyrs' (Green) Square.$$),
  ('libya-gaddafi-legacy', 2, $$Capital & revolution$$, $$Gaddafi's destroyed Bab al-Azizia compound. Revolution sites. Old city souks. Meeting with a local on the 2011 uprising.$$),
  ('libya-gaddafi-legacy', 3, $$Leptis Magna$$, $$Drive east. Leptis Magna, one of the best-preserved Roman cities on Earth. Near-empty ruins. Coastal overnight.$$),
  ('libya-gaddafi-legacy', 4, $$Sabratha & coast$$, $$Sabratha Roman theatre on the Mediterranean. Coastal road. Militia-era front-line observation. Tripoli return.$$),
  ('libya-gaddafi-legacy', 5, $$Desert gateway$$, $$Drive toward the Gharyan mountains and the desert margin. Berber underground houses. Front-line and checkpoint reading.$$),
  ('libya-gaddafi-legacy', 6, $$Fractured state$$, $$Rival-government and militia control decryption. Rebuilt and ruined districts. Local economy and oil-state observation.$$),
  ('libya-gaddafi-legacy', 7, $$Tripoli deep$$, $$Final Tripoli immersion. Port. Debrief on Libya's split sovereignty.$$),
  ('libya-gaddafi-legacy', 8, $$Departure$$, $$End of expedition.$$),
  -- Eritrea
  ('eritrea-sealed-state', 1, $$Asmara arrival$$, $$Arrival. Permit and photo-restriction brief. Asmara's Art Deco core. Fiat Tagliero, cinemas and cafés frozen in the 1930s.$$),
  ('eritrea-sealed-state', 2, $$Frozen capital$$, $$Tank graveyard. Medebar recycling market. Italian colonial architecture. Meeting on life under indefinite conscription.$$),
  ('eritrea-sealed-state', 3, $$Escarpment descent$$, $$Dramatic mountain road (or steam railway) down the escarpment toward the coast. Landscape transition.$$),
  ('eritrea-sealed-state', 4, $$Massawa Red Sea$$, $$Massawa old town and its war-shattered Ottoman and Egyptian buildings. Port observation. Red Sea geopolitics reading.$$),
  ('eritrea-sealed-state', 5, $$Coast & isolation$$, $$Red Sea coast. Optional Dahlak archipelago boat. Fishing economy. Isolated coastal immersion.$$),
  ('eritrea-sealed-state', 6, $$Highlands & relics$$, $$Return to the highlands. Soviet and Italian military relics. Rural village immersion. Coffee ceremony with locals.$$),
  ('eritrea-sealed-state', 7, $$Asmara deep$$, $$Asmara final day: markets, churches, mosque. Debrief on isolation and the permit state.$$),
  ('eritrea-sealed-state', 8, $$Departure$$, $$Airport. End of expedition.$$),
  -- Pamir Highway
  ('pamir-highway-tajikistan', 1, $$Dushanbe arrival$$, $$Arrival in Dushanbe. GBAO permit check. Briefing. Soviet capital first walk.$$),
  ('pamir-highway-tajikistan', 2, $$Into the mountains$$, $$Long drive east. Gorge roads along the Panj river. First Afghan-border views. Kalaikhum overnight.$$),
  ('pamir-highway-tajikistan', 3, $$Panj river & Afghan border$$, $$Full day along the Afghanistan border. Villages on both banks. Khorog, GBAO's capital.$$),
  ('pamir-highway-tajikistan', 4, $$Wakhan valley$$, $$Turn into the Wakhan corridor. Yamchun fortress. Bibi Fatima hot springs. Hindu Kush panorama across the river.$$),
  ('pamir-highway-tajikistan', 5, $$Wakhan deep$$, $$Wakhi villages. Petroglyphs. Langar. Afghan Wakhan and Pakistani ranges on the horizon. High homestay.$$),
  ('pamir-highway-tajikistan', 6, $$Onto the plateau$$, $$Climb to the Pamir plateau. Khargush pass. Approach to the high-altitude lakes. Thin air, raw terrain.$$),
  ('pamir-highway-tajikistan', 7, $$High lakes$$, $$Bulunkul and Yashilkul lakes. Coldest-inhabited-village stop. Kyrgyz herder interaction. Off-grid camp.$$),
  ('pamir-highway-tajikistan', 8, $$Murghab$$, $$Murghab, the highest town in the former USSR. Container bazaar. Soviet outpost decay. Acclimatization.$$),
  ('pamir-highway-tajikistan', 9, $$Ak-Baital pass$$, $$Cross Ak-Baital (4,655m), the highway's highest pass. Karakul, a meteorite-crater lake at altitude.$$),
  ('pamir-highway-tajikistan', 10, $$Toward the Kyrgyz border$$, $$Final Pamir stretch. Kyzylart pass. Border zone. Descent begins.$$),
  ('pamir-highway-tajikistan', 11, $$Exit$$, $$Cross to Osh (Kyrgyzstan) or return. Debrief. End of expedition.$$),
  -- Lebanon
  ('lebanon-business-of-war', 1, $$Beirut arrival$$, $$Arrival. Security and sect-geography brief. Downtown, Martyrs' Square, the 2020 port-blast site.$$),
  ('lebanon-business-of-war', 2, $$Green line & memory$$, $$Civil-war green line. Holiday Inn battle ruin. National Museum. Meeting with a journalist on the confessional system.$$),
  ('lebanon-business-of-war', 3, $$Southern suburbs$$, $$Dahieh, Hezbollah's stronghold. Political-poster landscape. Controlled local meeting. Sectarian-economy reading.$$),
  ('lebanon-business-of-war', 4, $$Bekaa & Baalbek$$, $$Drive over the mountains to the Bekaa valley. Baalbek's colossal Roman temples. Hezbollah heartland observation. Hashish-economy context.$$),
  ('lebanon-business-of-war', 5, $$South toward the border$$, $$Drive south (security permitting) toward the Israeli border zone. Tyre and Sidon. Palestinian-camp context. Front-line geography.$$),
  ('lebanon-business-of-war', 6, $$Departure$$, $$Beirut return. Debrief on state collapse and resilience. End of expedition.$$),
  -- Papua
  ('papua-sepik-baliem-bougainville', 1, $$Port Moresby arrival$$, $$Arrival in Port Moresby (PNG). Security brief. Logistics and domestic-flight preparation.$$),
  ('papua-sepik-baliem-bougainville', 2, $$Into the Sepik$$, $$Flight to Wewak. Road and river transfer to the Sepik. First river village. Stilt houses.$$),
  ('papua-sepik-baliem-bougainville', 3, $$Crocodile cult$$, $$Sepik river by motorized canoe. Spirit houses (haus tambaran). Crocodile-scarification culture. Village overnight.$$),
  ('papua-sepik-baliem-bougainville', 4, $$River deep$$, $$Remote Sepik villages. Carving and mask culture. No infrastructure. Canoe progression and bivouac.$$),
  ('papua-sepik-baliem-bougainville', 5, $$Sepik to highlands$$, $$River exit. Flight toward the central highlands. Altitude and climate shift.$$),
  ('papua-sepik-baliem-bougainville', 6, $$Cross to West Papua$$, $$Transfer into Indonesian West Papua via regional hubs. Wamena, gateway to the Baliem Valley.$$),
  ('papua-sepik-baliem-bougainville', 7, $$Baliem Valley$$, $$Dani tribal villages. Smoked mummies. Highland gardens. Festival-preparation atmosphere.$$),
  ('papua-sepik-baliem-bougainville', 8, $$Baliem festival$$, $$Baliem Valley Festival: mock tribal battles, pig feasts, traditional dress. Full immersion day.$$),
  ('papua-sepik-baliem-bougainville', 9, $$Highland trek$$, $$Trek between Dani and Yali villages. Suspension bridges. Salt wells. Homestay in a honai hut.$$),
  ('papua-sepik-baliem-bougainville', 10, $$Toward Bougainville$$, $$Long transfer back toward PNG and on to Bougainville (Buka).$$),
  ('papua-sepik-baliem-bougainville', 11, $$Bougainville$$, $$Buka and Arawa. Panguna mine ruins. Civil-war wreckage. Meeting on the independence referendum and reconstruction.$$),
  ('papua-sepik-baliem-bougainville', 12, $$Departure$$, $$Return flight. End of expedition.$$),
  -- Kaliningrad
  ('kaliningrad-soviet-exclave', 1, $$Kaliningrad arrival$$, $$Arrival into the exclave. Briefing on its strategic isolation. House of Soviets brutalist hulk over old Königsberg. Cathedral and Kant's tomb.$$),
  ('kaliningrad-soviet-exclave', 2, $$Königsberg under concrete$$, $$Prussian remnants beneath the Soviet city. WWII fortifications and city gates. Amber Museum. Meeting on exclave identity.$$),
  ('kaliningrad-soviet-exclave', 3, $$Baltic coast & fleet$$, $$Drive to the coast. Baltic Fleet city of Baltiysk (military-zone edge). Curonian Spit dunes. Amber-mining coast.$$),
  ('kaliningrad-soviet-exclave', 4, $$Departure$$, $$Final city points. Exit toward Poland or Lithuania. Debrief on Russia's western outpost. End of expedition.$$)
) AS v(slug, day_number, title, description) ON v.slug = e.slug;

-- 3) Inclusions (default list, applied to every new expedition) -------------
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
  'syria-after-the-regime', 'south-ossetia-unrecognized-frontier', 'turkmenistan-closed-kingdom',
  'xinjiang-surveillance-frontier', 'libya-gaddafi-legacy', 'eritrea-sealed-state',
  'pamir-highway-tajikistan', 'lebanon-business-of-war', 'papua-sepik-baliem-bougainville',
  'kaliningrad-soviet-exclave'
);

-- 4) Exclusions -------------------------------------------------------------
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
  'syria-after-the-regime', 'south-ossetia-unrecognized-frontier', 'turkmenistan-closed-kingdom',
  'xinjiang-surveillance-frontier', 'libya-gaddafi-legacy', 'eritrea-sealed-state',
  'pamir-highway-tajikistan', 'lebanon-business-of-war', 'papua-sepik-baliem-bougainville',
  'kaliningrad-soviet-exclave'
);

-- 5) One departure date per expedition (status drives the parent status) ----
INSERT INTO public.expedition_dates (expedition_id, start_date, end_date, capacity_max, spots_taken, status)
SELECT e.id, v.start_date::date, v.end_date::date, v.capacity_max, 0, v.status
FROM public.expeditions e
JOIN (VALUES
  ('syria-after-the-regime', '2026-10-17', '2026-10-24', 12, 'open'),
  ('south-ossetia-unrecognized-frontier', '2026-09-18', '2026-09-22', 12, 'open'),
  ('turkmenistan-closed-kingdom', '2026-09-24', '2026-09-30', 12, 'open'),
  ('xinjiang-surveillance-frontier', '2026-10-05', '2026-10-12', 12, 'open'),
  ('libya-gaddafi-legacy', '2026-11-14', '2026-11-21', 10, 'limited'),
  ('eritrea-sealed-state', '2026-11-02', '2026-11-09', 12, 'limited'),
  ('pamir-highway-tajikistan', '2026-07-15', '2026-07-25', 10, 'limited'),
  ('lebanon-business-of-war', '2026-10-10', '2026-10-15', 14, 'open'),
  ('papua-sepik-baliem-bougainville', '2026-08-08', '2026-08-19', 10, 'limited'),
  ('kaliningrad-soviet-exclave', '2026-08-28', '2026-08-31', 14, 'open')
) AS v(slug, start_date, end_date, capacity_max, status) ON v.slug = e.slug;

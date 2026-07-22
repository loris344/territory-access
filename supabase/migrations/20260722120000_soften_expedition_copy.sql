-- Rewrite expedition names/descriptions/itineraries away from danger and
-- conflict framing, toward the place, culture, and experience. Mirrors
-- src/data/expeditions.ts. Slugs, dates, prices, coordinates, status and
-- inclusions/exclusions are untouched. No em dashes anywhere in the new copy.

-- 1) Expedition names + descriptions -----------------------------------------
UPDATE public.expeditions AS e
SET name = v.name,
    short_description = v.short_description,
    long_description = v.long_description
FROM (VALUES
  ('socotra-extreme-isolation', $$Socotra – Island at the Edge of the World$$,
   $$9 days exploring one of the most otherworldly landscapes on Earth.$$,
   $$9 days across Socotra: the Dixam plateau, ancient dragon's blood forests, hidden canyons, the dunes of Hayf and Zahek, wild coastlines, sea caves, and nights spent completely off the grid under an untouched sky.$$),

  ('svalbard-arctic-survival', $$Svalbard – Life at the Top of the World$$,
   $$7 days deep in the Arctic, learning to move and live on the ice.$$,
   $$7 days in the high Arctic: a snowmobile approach to the glaciers, a polar camp, ice navigation, the ghost towns of former mining outposts, and hands-on cold-weather skills taught by people who live this environment year-round.$$),

  ('darien-jungle-friction', $$Darién – Deep Jungle Crossing$$,
   $$7 days immersed in one of the last great rainforests of the Americas.$$,
   $$7 days in the Darién jungle: river travel by canoe, trekking through primary forest, river crossings, remote bivouacs, and a real test of endurance in one of the most untouched wildernesses left on the continent.$$),

  ('north-korea-total-system-immersion', $$North Korea – Inside a Closed World$$,
   $$7 days of rare, closely guided access to one of the most secluded countries on Earth.$$,
   $$7 days inside North Korea: the monuments of Pyongyang, the Kaesong countryside, guided visits to schools, factories and cultural sites, and an unmatched look at daily life in a society almost entirely closed to outsiders.$$),

  ('bosnia-ghost-frontlines', $$Sarajevo – A City That Remembers$$,
   $$5 days learning the recent history of Sarajevo, told by the people who lived it.$$,
   $$5 days in and around Sarajevo: the tunnel that kept the city alive, neighborhoods still marked by history, mountain viewpoints, and conversations with a local guide who lived through it firsthand: a rare, human way to understand a city's past.$$),

  ('chechnya-authority-reconstruction', $$Chechnya – Grozny Rebuilt$$,
   $$6 days discovering a rebuilt capital and the Caucasus mountains around it.$$,
   $$6 days between Grozny and the Caucasus: the city's striking modern architecture, conversations with local analysts and journalists, mountain roads, traditional villages, and an introduction to the region's distinctive culture of discipline and hospitality.$$),

  ('transnistria-soviet-ghost-state', $$Transnistria – A Step Back in Time$$,
   $$4 days exploring a country most people don't know exists.$$,
   $$4 days in Tiraspol and Bender: Soviet-era streets frozen in time, the historic Bender Fortress, a visit to a local distillery, and a guided shooting range session, a fascinating look at how an unrecognized state actually functions day to day.$$),

  ('abkhazia-suspended-republic', $$Abkhazia – The Black Sea's Hidden Coast$$,
   $$6 days along a beautiful, little-visited stretch of the Caucasus coast.$$,
   $$6 days in Abkhazia: Sukhumi's faded seafront, mountain treks in the Caucasus, conversations with locals and journalists, and the region's own layered history, told firsthand by the people who live it.$$),

  ('afghanistan-wakhan-corridor', $$Afghanistan – The Wakhan Corridor$$,
   $$10 days trekking through one of the most remote valleys on Earth.$$,
   $$10 days on foot and horseback through the Wakhan Corridor: nomadic Kyrgyz and Wakhi communities, high mountain passes, total self-sufficiency, and a genuine window into one of the last truly remote places left on the map.$$),

  ('indian-kashmir-line-of-control', $$Kashmir – Life in the Himalaya$$,
   $$7 days trekking and living alongside communities in the Kashmiri highlands.$$,
   $$7 days in Srinagar and the surrounding mountains: a houseboat stay on Dal Lake, the old city, high-altitude treks, and time spent with farming families to understand daily life in one of the most beautiful and complex regions of the Himalaya.$$),

  ('altai-mongolia-eagle-hunters', $$Altai Mongolia – Among the Eagle Hunters$$,
   $$8 days living alongside Kazakh eagle hunters in the Mongolian steppe.$$,
   $$8 days in the Altai: long days on horseback, nights in a family ger, and real time spent with Kazakh eagle hunters learning a tradition passed down for generations, one of the most authentic nomadic experiences left in Central Asia.$$),

  ('iraqi-kurdistan-peshmerga-lines', $$Iraqi Kurdistan – Between Mountains and Memory$$,
   $$7 days discovering the history, mountains, and resilience of the Kurdistan region.$$,
   $$7 days from Erbil's ancient citadel to the mountains along the border: rebuilt communities, meetings with local guides and former Peshmerga fighters, and a firsthand look at a region rebuilding itself after decades of hardship.$$),

  ('iran-lut-desert', $$Iran – Into the Lut Desert$$,
   $$7 days in one of the most extreme and beautiful deserts on the planet.$$,
   $$7 days in the Dasht-e Lut: 4x4 travel across the dunes, the dramatic Kaluts rock formations, full off-grid camping, and nights under one of the clearest, most star-filled skies you'll ever see.$$),

  ('somaliland-unrecognized-territory', $$Somaliland – The Horn of Africa's Best-Kept Secret$$,
   $$8 days discovering a self-governing land most travelers have never heard of.$$,
   $$8 days in Somaliland: the camel markets of Hargeisa, the ancient rock art of Laas Geel, the port town of Berbera, and rural communities across the interior: a rare, welcoming introduction to one of Africa's least-visited regions.$$),

  ('syria-after-the-regime', $$Syria – A Country Rediscovering Itself$$,
   $$8 days from Damascus to Aleppo, meeting a country in the middle of writing its next chapter.$$,
   $$8 days across Syria: the old city and souks of Damascus, the Crusader castle of Krak des Chevaliers, the Christian valley of Marmarita, the Mediterranean coast, and Aleppo, with local encounters along the way to understand a country in transition.$$),

  ('south-ossetia-unrecognized-frontier', $$South Ossetia – A Hidden Corner of the Caucasus$$,
   $$5 days accessing one of the least-visited places in the world, through the Russian Caucasus.$$,
   $$5 days in South Ossetia: the mountain crossing through the Roki Tunnel, the streets of Tskhinvali, Soviet-era architecture, rural villages, and conversations with locals about daily life in one of the world's most obscure territories.$$),

  ('turkmenistan-closed-kingdom', $$Turkmenistan – The Marble City$$,
   $$7 days in one of the most surreal and tightly guided countries on Earth.$$,
   $$7 days across Turkmenistan: the white-marble capital Ashgabat, golden monuments, the blazing Darvaza gas crater in the Karakum desert, the ancient Silk Road ruins of Merv, and a rare look at a country almost no outsiders get to see.$$),

  ('xinjiang-surveillance-frontier', $$Xinjiang – Along the Silk Road$$,
   $$8 days from Kashgar's old city to the edge of the Taklamakan desert.$$,
   $$8 days across Xinjiang: Kashgar's famous Sunday markets, the high passes toward the Karakoram, the oasis towns of the Taklamakan's edge, and Turpan's ancient irrigation tunnels, on a journey along one of the great historic Silk Road routes.$$),

  ('libya-gaddafi-legacy', $$Libya – Roman Ruins on the Mediterranean$$,
   $$8 days discovering some of the best-preserved Roman ruins on Earth, almost entirely to yourselves.$$,
   $$8 days in western Libya: Tripoli's old medina, the spectacular Roman cities of Leptis Magna and Sabratha standing empty on the Mediterranean coast, and conversations with locals about a country working to rebuild itself.$$),

  ('eritrea-sealed-state', $$Eritrea – Asmara, Frozen in Time$$,
   $$8 days in one of the world's most beautifully preserved and least-visited capitals.$$,
   $$8 days across Eritrea: Asmara's Art Deco streets frozen in the 1930s, the dramatic escarpment railway down to the coast, the Red Sea port of Massawa, and rural highland communities along the way.$$),

  ('pamir-highway-tajikistan', $$Pamir Highway – Roof of the World$$,
   $$11 days along one of the highest and most spectacular roads on Earth.$$,
   $$11 days on the Pamir Highway: 4,000m+ mountain passes, the Wakhan valley, nights with Kyrgyz nomads on the high plateau, and total immersion in one of the most remote and beautiful corners of Central Asia.$$),

  ('lebanon-business-of-war', $$Lebanon – Beirut and the Bekaa Valley$$,
   $$6 days discovering a country of striking contrasts, resilience, and hospitality.$$,
   $$6 days across Lebanon: Beirut's layered history and vibrant streets, the Roman temples of Baalbek, the Bekaa valley's vineyards and traditions, and conversations with locals about a country that keeps reinventing itself.$$),

  ('papua-sepik-baliem-bougainville', $$Papua – Sepik, Baliem & Bougainville$$,
   $$12 days of tribal culture, festival, and island life across the world's second-largest island.$$,
   $$12 days across New Guinea: river villages on the Sepik, the Dani communities and festival of the Baliem Valley, and the island of Bougainville, one of the richest, most culturally diverse journeys on Earth.$$),

  ('kaliningrad-soviet-exclave', $$Kaliningrad – The Amber Coast$$,
   $$4 days in a fascinating Baltic enclave with a unique layered history.$$,
   $$4 days in Kaliningrad: the striking architecture layered over old Königsberg, the Amber Museum, and the dune-lined Curonian Spit on the Baltic coast: a compact, fascinating introduction to a truly unique corner of Europe.$$),

  ('virunga-militarized-gorilla-trek', $$Virunga – Among the Mountain Gorillas$$,
   $$6 days trekking to habituated mountain gorillas in one of Africa's oldest national parks.$$,
   $$6 days in Virunga: the active Nyiragongo volcano and its lava lake, a guided trek to a mountain gorilla family, and time with the park rangers who've dedicated their lives to protecting this extraordinary place.$$),

  ('mauritania-lost-cities-sahara', $$Mauritania – Lost Cities of the Sahara$$,
   $$8 days riding the Sahara's legendary iron ore train and exploring its ancient caravan cities.$$,
   $$8 days across the Mauritanian Sahara: a ride on one of the world's longest trains, the medieval libraries of Chinguetti, the ghost city of Ouadane, palm oases, and nights camped beneath a truly untouched desert sky.$$)
) AS v(slug, name, short_description, long_description)
WHERE e.slug = v.slug;

-- 2) Day-by-day itinerary -----------------------------------------------------
UPDATE public.expedition_days_itinerary AS d
SET title = v.title,
    description = v.description
FROM public.expeditions e
JOIN (VALUES
  -- Socotra
  ('socotra-extreme-isolation', 1, $$Arrival in Socotra$$, $$Flight to Socotra. Arrival orientation and camp setup near Hadibo.$$),
  ('socotra-extreme-isolation', 2, $$Dixam Plateau$$, $$Trek up to the Dixam plateau, through forests of dragon's blood trees. Wild camp overnight.$$),
  ('socotra-extreme-isolation', 3, $$Canyon Descent$$, $$A day of canyon walking past natural pools and limestone formations.$$),
  ('socotra-extreme-isolation', 4, $$Dunes of Hayf$$, $$Crossing the dunes toward the coast. Beach camp for the night.$$),
  ('socotra-extreme-isolation', 5, $$Zahek Sand Dunes$$, $$A full day exploring one of the island's most remote dune systems, completely off the grid.$$),
  ('socotra-extreme-isolation', 6, $$Wild Coastline$$, $$Trekking along isolated beaches and sea caves.$$),
  ('socotra-extreme-isolation', 7, $$Interior Mountains$$, $$Crossing the mountains, spotting Socotra's unique endemic plant life. High camp.$$),
  ('socotra-extreme-isolation', 8, $$Final Days$$, $$One last remote stretch before heading back toward Hadibo.$$),
  ('socotra-extreme-isolation', 9, $$Departure$$, $$Flight out.$$),
  -- Svalbard
  ('svalbard-arctic-survival', 1, $$Arrival in Longyearbyen$$, $$Arctic orientation, cold-weather gear check, and a briefing on how to move safely on the ice.$$),
  ('svalbard-arctic-survival', 2, $$Snowmobile Approach$$, $$Snowmobile convoy toward the glacier. Camp set up under the midnight sun or polar night.$$),
  ('svalbard-arctic-survival', 3, $$Ice Navigation$$, $$A day on the glacier, learning to read ice formations and move safely around crevasses.$$),
  ('svalbard-arctic-survival', 4, $$Abandoned Mining Towns$$, $$Exploring the ghost towns left behind by Soviet-era mining operations.$$),
  ('svalbard-arctic-survival', 5, $$Living on the Ice$$, $$Hands-on cold-weather skills and a real taste of what it takes to live out here.$$),
  ('svalbard-arctic-survival', 6, $$The Way Back$$, $$Snowmobile return, keeping an eye out for arctic wildlife along the way. Final night camped on the ice.$$),
  ('svalbard-arctic-survival', 7, $$Departure$$, $$End of expedition.$$),
  -- Darien
  ('darien-jungle-friction', 1, $$Panama City Briefing$$, $$Trip orientation, gear check, and an introduction to the days ahead.$$),
  ('darien-jungle-friction', 2, $$Into the Darién$$, $$River travel to the edge of the rainforest. First night camped in the jungle.$$),
  ('darien-jungle-friction', 3, $$Primary Forest Trek$$, $$A full day of jungle trekking and river crossings: real physical effort in real humidity.$$),
  ('darien-jungle-friction', 4, $$Deep in the Jungle$$, $$A remote camp, wildlife spotting, and navigating by compass through dense forest.$$),
  ('darien-jungle-friction', 5, $$By Canoe$$, $$Traveling by dugout canoe and meeting an indigenous community along the river.$$),
  ('darien-jungle-friction', 6, $$Heading Back$$, $$Return trek through secondary forest. Final night in camp.$$),
  ('darien-jungle-friction', 7, $$Departure$$, $$Back to Panama City. End of expedition.$$),
  -- North Korea
  ('north-korea-total-system-immersion', 1, $$Entering via Beijing$$, $$Train journey into North Korea. First impressions of Pyongyang on arrival.$$),
  ('north-korea-total-system-immersion', 2, $$Pyongyang's Monuments$$, $$The Juche Tower, Mansudae Grand Monument, and Kim Il-sung Square, with a guided walk through the capital.$$),
  ('north-korea-total-system-immersion', 3, $$Everyday Life$$, $$Visits to schools, factories, and cultural centers, with the chance to talk with people living here.$$),
  ('north-korea-total-system-immersion', 4, $$Kaesong & the DMZ$$, $$A drive to Kaesong and a visit to the Joint Security Area at the border.$$),
  ('north-korea-total-system-immersion', 5, $$The Countryside$$, $$A visit to a rural cooperative farm and a look at daily life outside the capital.$$),
  ('north-korea-total-system-immersion', 6, $$Pyongyang in Depth$$, $$The metro system, a museum on the country's history, and an evening of mass games if the schedule allows.$$),
  ('north-korea-total-system-immersion', 7, $$Departure$$, $$Train back to Beijing. End of expedition.$$),
  -- Bosnia
  ('bosnia-ghost-frontlines', 1, $$Arrival in Sarajevo$$, $$A walk through the city center and an introduction to its history, past and present.$$),
  ('bosnia-ghost-frontlines', 2, $$Memory & the City$$, $$A visit to the wartime tunnel and neighborhoods still marked by history, with a local guide who shares that story firsthand.$$),
  ('bosnia-ghost-frontlines', 3, $$Mountain Views$$, $$A climb to the hills above the city for sweeping views and a look at the surrounding landscape.$$),
  ('bosnia-ghost-frontlines', 4, $$Beyond the City$$, $$A rural village, a memorial site, and a conversation about how the region has rebuilt itself since.$$),
  ('bosnia-ghost-frontlines', 5, $$Final Reflections$$, $$A closing conversation on memory and history. End of expedition.$$),
  -- Chechnya
  ('chechnya-authority-reconstruction', 1, $$Arrival in Grozny$$, $$Orientation with a local guide and an evening walk through the city's striking modern skyline.$$),
  ('chechnya-authority-reconstruction', 2, $$Landmarks & Symbols$$, $$The Heart of Chechnya Mosque, the city's administrative center, and a conversation with a local analyst about how the region is run today.$$),
  ('chechnya-authority-reconstruction', 3, $$History & Landscape$$, $$Neighborhoods rebuilt after the wars, a conversation with a local journalist, and a scenic mountain drive.$$),
  ('chechnya-authority-reconstruction', 4, $$Into the Caucasus$$, $$A mountain road, a guided high-altitude trek, and lunch with a family in a traditional village.$$),
  ('chechnya-authority-reconstruction', 5, $$A Culture of Discipline$$, $$A visit to a well-known wrestling and MMA training center, with the chance to train alongside local athletes.$$),
  ('chechnya-authority-reconstruction', 6, $$Departure$$, $$Final debrief and departure. End of expedition.$$),
  -- Transnistria
  ('transnistria-soviet-ghost-state', 1, $$Crossing the Border$$, $$An easy land crossing into Transnistria and a walk through Tiraspol, past Soviet statues and government buildings frozen in time.$$),
  ('transnistria-soviet-ghost-state', 2, $$Bender Fortress$$, $$A visit to the historic Bender Fortress with a local historian, and the story of how this small territory came to be.$$),
  ('transnistria-soviet-ghost-state', 3, $$Local Life$$, $$A visit to a historic distillery or local factory, followed by a guided session at a licensed shooting range.$$),
  ('transnistria-soviet-ghost-state', 4, $$Departure$$, $$Back to Moldova, with a final conversation on how this unusual, unrecognized state actually works day to day.$$),
  -- Abkhazia
  ('abkhazia-suspended-republic', 1, $$Crossing the Border$$, $$A guided crossing into Abkhazia and a first walk along Sukhumi's atmospheric, faded seafront.$$),
  ('abkhazia-suspended-republic', 2, $$The Capital$$, $$A look at the government quarter and the old parliament building, plus a conversation with a local journalist about the region today.$$),
  ('abkhazia-suspended-republic', 3, $$Into the Caucasus$$, $$A mountain drive, a guided high-altitude trek, and lunch with a family in a remote village.$$),
  ('abkhazia-suspended-republic', 4, $$History & Memory$$, $$A visit to sites connected to the region's past and a conversation with someone who lived through it: history told firsthand.$$),
  ('abkhazia-suspended-republic', 5, $$Coast & Ruins$$, $$Abandoned Soviet-era resorts along the coast, followed by a swim in the Black Sea.$$),
  ('abkhazia-suspended-republic', 6, $$Departure$$, $$Return across the border. Final thoughts on a fascinating, little-known corner of the world.$$),
  -- Afghanistan
  ('afghanistan-wakhan-corridor', 1, $$Arrival & Preparation$$, $$Meeting the local team, final gear and logistics check for horses and porters.$$),
  ('afghanistan-wakhan-corridor', 2, $$Into the Corridor$$, $$A guided crossing into the Wakhan, and the first camp in a place with no tourist infrastructure at all.$$),
  ('afghanistan-wakhan-corridor', 3, $$Trekking the Valley$$, $$A 5-7 hour walk through Wakhi villages, spending the night at camp or in a simple local home.$$),
  ('afghanistan-wakhan-corridor', 4, $$Deep in the Valley$$, $$A day of rugged trekking and real interaction with the people who call this valley home, far from any phone signal.$$),
  ('afghanistan-wakhan-corridor', 5, $$The High Plateau$$, $$Traveling by Kyrgyz horse to a remote high-altitude camp, with dramatic swings in temperature.$$),
  ('afghanistan-wakhan-corridor', 6, $$A Day with Nomads$$, $$Joining in daily tasks and pastoral life, with conversations through a translator.$$),
  ('afghanistan-wakhan-corridor', 7, $$The Roof of the World$$, $$Views toward the mountain ranges bordering China and Tajikistan from a high camp.$$),
  ('afghanistan-wakhan-corridor', 8, $$Heading Back$$, $$Descending the valley, with an overnight stop in a village.$$),
  ('afghanistan-wakhan-corridor', 9, $$Leaving the Corridor$$, $$Return to the border area. Final overnight before departure.$$),
  ('afghanistan-wakhan-corridor', 10, $$Departure$$, $$Back to the international zone. End of expedition.$$),
  -- Kashmir
  ('indian-kashmir-line-of-control', 1, $$Arrival in Srinagar$$, $$A warm welcome, a houseboat stay on Dal Lake, and a first walk through the old city.$$),
  ('indian-kashmir-line-of-control', 2, $$Exploring Srinagar$$, $$A guided walk through the historic center and a conversation with a local analyst about the region.$$),
  ('indian-kashmir-line-of-control', 3, $$Toward the Mountains$$, $$A scenic mountain drive to a village setup, with views over the wider valley.$$),
  ('indian-kashmir-line-of-control', 4, $$Mountain Trek$$, $$A 5-6 hour trek through stunning high-altitude terrain, at a comfortable pace.$$),
  ('indian-kashmir-line-of-control', 5, $$Everyday Life in the Valley$$, $$Time with local farming families, learning about daily life and the local economy.$$),
  ('indian-kashmir-line-of-control', 6, $$Back to Srinagar$$, $$A scenic mountain drive back, with free time to explore and reflect.$$),
  ('indian-kashmir-line-of-control', 7, $$Departure$$, $$Airport transfer. End of expedition.$$),
  -- Mongolia
  ('altai-mongolia-eagle-hunters', 1, $$Arrival in Ulaanbaatar$$, $$Trip briefing and a domestic flight to Bayan-Ölgii.$$),
  ('altai-mongolia-eagle-hunters', 2, $$Into the Steppe$$, $$A long 4x4 drive to a remote nomadic camp and a warm welcome from a Kazakh family.$$),
  ('altai-mongolia-eagle-hunters', 3, $$Meeting the Eagles$$, $$An introduction to eagle hunting traditions, first horseback rides, and a hunting demonstration.$$),
  ('altai-mongolia-eagle-hunters', 4, $$Life on Horseback$$, $$Hours in the saddle across open terrain, helping set up and break down camp along the way.$$),
  ('altai-mongolia-eagle-hunters', 5, $$Nomadic Life$$, $$Joining in daily tasks such as gathering wood and water and traditional cooking, and a night in a ger.$$),
  ('altai-mongolia-eagle-hunters', 6, $$The Hunt$$, $$Watching the partnership between rider and eagle in action, with a debrief on the day.$$),
  ('altai-mongolia-eagle-hunters', 7, $$Heading Back$$, $$4x4 return with an overnight stop in a regional town.$$),
  ('altai-mongolia-eagle-hunters', 8, $$Return to Ulaanbaatar & Departure$$, $$Return flight home. End of expedition.$$),
  -- Iraqi Kurdistan
  ('iraqi-kurdistan-peshmerga-lines', 1, $$Arrival in Erbil$$, $$A warm welcome and a first visit to Erbil's ancient citadel.$$),
  ('iraqi-kurdistan-peshmerga-lines', 2, $$Rebuilding$$, $$A visit to a village that's rebuilt itself in recent years, and conversations with residents and local NGOs about that process.$$),
  ('iraqi-kurdistan-peshmerga-lines', 3, $$Into the Mountains$$, $$A 4-6 hour trek through dramatic border terrain, with a lunch stop along the way.$$),
  ('iraqi-kurdistan-peshmerga-lines', 4, $$Local Perspectives$$, $$A conversation with a former Peshmerga fighter about the region's recent history, and a session at a local shooting range.$$),
  ('iraqi-kurdistan-peshmerga-lines', 5, $$The Yazidi Community$$, $$A visit to a Yazidi community to hear firsthand how they're rebuilding after immense hardship.$$),
  ('iraqi-kurdistan-peshmerga-lines', 6, $$Into the Backcountry$$, $$A trek along a remote mountain track and a night camped outdoors.$$),
  ('iraqi-kurdistan-peshmerga-lines', 7, $$Return to Erbil & Departure$$, $$End of expedition.$$),
  -- Iran
  ('iran-lut-desert', 1, $$Arrival in Kerman$$, $$Trip briefing and final equipment check before heading into the desert.$$),
  ('iran-lut-desert', 2, $$Into the Lut Desert$$, $$4x4 travel across sand and gravel tracks to a first camp with zero infrastructure around.$$),
  ('iran-lut-desert', 3, $$The Hottest Place on Earth$$, $$Crossing dunes in one of the hottest recorded places on the planet, with a guided ridge walk and careful hydration.$$),
  ('iran-lut-desert', 4, $$The Kaluts$$, $$Exploring the desert's dramatic rock formations, one of the most photogenic landscapes you'll ever see.$$),
  ('iran-lut-desert', 5, $$Under the Stars$$, $$A full day of desert travel and a wild camp for the night, under a truly untouched sky.$$),
  ('iran-lut-desert', 6, $$Back Toward Civilization$$, $$Exiting the desert for an overnight stay at a desert eco-lodge.$$),
  ('iran-lut-desert', 7, $$Departure$$, $$End of expedition.$$),
  -- Somaliland
  ('somaliland-unrecognized-territory', 1, $$Arrival in Hargeisa$$, $$Orientation and a first walk through the capital.$$),
  ('somaliland-unrecognized-territory', 2, $$The Camel Market$$, $$An early start at one of the region's great livestock markets, meeting traders and seeing the local economy up close.$$),
  ('somaliland-unrecognized-territory', 3, $$To Laas Geel$$, $$A 4x4 journey to see some of Africa's best-preserved ancient rock art, in a truly remote setting.$$),
  ('somaliland-unrecognized-territory', 4, $$Berbera$$, $$A desert drive to the coast, taking in this historic Red Sea port town.$$),
  ('somaliland-unrecognized-territory', 5, $$Into the Countryside$$, $$A rural crossing and time spent with a local community, staying in simple accommodation.$$),
  ('somaliland-unrecognized-territory', 6, $$Highland Trek$$, $$A walk through dry hill country, learning about the pastoral way of life here.$$),
  ('somaliland-unrecognized-territory', 7, $$Back to Hargeisa$$, $$Free time to explore, with a closing conversation on this fascinating, self-governing land.$$),
  ('somaliland-unrecognized-territory', 8, $$Departure$$, $$End of expedition.$$),
  -- Syria
  ('syria-after-the-regime', 1, $$Arrival in Damascus$$, $$Overland via Beirut, then a first walk through the old city: the Umayyad Mosque, Straight Street, and the covered souks.$$),
  ('syria-after-the-regime', 2, $$A Capital in Transition$$, $$Views over the city from Mount Qasioun, and a conversation with a local guide about the recent changes here.$$),
  ('syria-after-the-regime', 3, $$Homs$$, $$A drive to Homs, a walk through the old city and clock tower, and conversations with residents about rebuilding their community.$$),
  ('syria-after-the-regime', 4, $$Krak & Marmarita$$, $$The Crusader castle of Krak des Chevaliers and an overnight in the peaceful Christian valley of Marmarita.$$),
  ('syria-after-the-regime', 5, $$The Coast$$, $$Tartus and Syria's Mediterranean coastline, with a look at the region's diverse communities.$$),
  ('syria-after-the-regime', 6, $$North to Aleppo$$, $$A drive north, with a first look at the historic old city and its citadel.$$),
  ('syria-after-the-regime', 7, $$Aleppo Reborn$$, $$The Aleppo citadel, the ongoing reconstruction, and conversations with residents who've returned to rebuild.$$),
  ('syria-after-the-regime', 8, $$Departure$$, $$Return toward Damascus and Beirut. End of expedition.$$),
  -- South Ossetia
  ('south-ossetia-unrecognized-frontier', 1, $$Arrival in Vladikavkaz$$, $$Orientation in North Ossetia and final permit and logistics preparation.$$),
  ('south-ossetia-unrecognized-frontier', 2, $$Through the Roki Tunnel$$, $$A dramatic mountain drive into South Ossetia, followed by a first walk through Tskhinvali.$$),
  ('south-ossetia-unrecognized-frontier', 3, $$The Capital$$, $$Tskhinvali's streets, government buildings, and Soviet-era monuments, with a conversation with a local about life here.$$),
  ('south-ossetia-unrecognized-frontier', 4, $$The Countryside$$, $$A drive through rural Ossetia, learning the region's history and meeting the people who call it home.$$),
  ('south-ossetia-unrecognized-frontier', 5, $$Departure$$, $$Return through the mountains to Vladikavkaz. End of expedition.$$),
  -- Turkmenistan
  ('turkmenistan-closed-kingdom', 1, $$Arrival in Ashgabat$$, $$A first drive through the surreal white-marble capital, including the Neutrality Monument.$$),
  ('turkmenistan-closed-kingdom', 2, $$City of Gold$$, $$The Independence Monument, golden statues, and a Soviet-era bazaar, with your guide explaining how this remarkable city came to be.$$),
  ('turkmenistan-closed-kingdom', 3, $$Into the Karakum$$, $$A drive into the desert to camp near the Darvaza gas crater.$$),
  ('turkmenistan-closed-kingdom', 4, $$The Gates of Hell$$, $$The burning Darvaza crater at night, followed by exploring the surrounding dunes and canyons.$$),
  ('turkmenistan-closed-kingdom', 5, $$Ancient Merv$$, $$A drive to Mary and the ancient Silk Road ruins of Merv, a UNESCO World Heritage site.$$),
  ('turkmenistan-closed-kingdom', 6, $$A Rare Spectacle$$, $$Back to Ashgabat, with the chance to witness the atmosphere and ceremony of Independence Day if the dates align.$$),
  ('turkmenistan-closed-kingdom', 7, $$Departure$$, $$Final stops in the city before flying out.$$),
  -- Xinjiang
  ('xinjiang-surveillance-frontier', 1, $$Arrival in Kashgar$$, $$A first walk through the old city and a look at the exterior of the Id Kah Mosque.$$),
  ('xinjiang-surveillance-frontier', 2, $$Kashgar's Markets$$, $$The famous Sunday livestock and bazaar markets, and a wander through the old-town alleys.$$),
  ('xinjiang-surveillance-frontier', 3, $$Toward the Karakoram$$, $$A drive along the Karakoram Highway, past Karakul Lake and into Tajik and Kyrgyz herding country.$$),
  ('xinjiang-surveillance-frontier', 4, $$The Desert's Edge$$, $$A return route along the margins of the Taklamakan desert, through oasis towns along the way.$$),
  ('xinjiang-surveillance-frontier', 5, $$Turpan Oasis$$, $$The ancient Karez water tunnels, the ruins of Jiaohe, and Turpan's grape valley, in one of the hottest, lowest places on Earth.$$),
  ('xinjiang-surveillance-frontier', 6, $$Urumqi$$, $$A regional museum, the city's bazaar, and a conversation on the region's recent history.$$),
  ('xinjiang-surveillance-frontier', 7, $$Exploring Urumqi$$, $$A deeper look at the city and the contrasts of a rapidly developing region.$$),
  ('xinjiang-surveillance-frontier', 8, $$Departure$$, $$Airport. End of expedition.$$),
  -- Libya
  ('libya-gaddafi-legacy', 1, $$Arrival in Tripoli$$, $$Overland via Tunisia, then a first walk through the medina and Martyrs' Square.$$),
  ('libya-gaddafi-legacy', 2, $$The Capital's Story$$, $$A look at sites connected to the 2011 uprising and the old city's souks, with a conversation with a local about that history.$$),
  ('libya-gaddafi-legacy', 3, $$Leptis Magna$$, $$A drive east to one of the best-preserved Roman cities on Earth, with nearly empty ruins on the Mediterranean coast.$$),
  ('libya-gaddafi-legacy', 4, $$Sabratha$$, $$The Roman theatre at Sabratha, right on the sea, followed by a scenic coastal drive back to Tripoli.$$),
  ('libya-gaddafi-legacy', 5, $$Toward the Desert$$, $$A drive to the Gharyan mountains, including a visit to traditional Berber underground homes.$$),
  ('libya-gaddafi-legacy', 6, $$Understanding Libya Today$$, $$A closer look at how the country is rebuilding, and a conversation about daily life and the local economy.$$),
  ('libya-gaddafi-legacy', 7, $$Tripoli in Depth$$, $$A final immersion in the city and its port, with a closing conversation on the country's path forward.$$),
  ('libya-gaddafi-legacy', 8, $$Departure$$, $$End of expedition.$$),
  -- Eritrea
  ('eritrea-sealed-state', 1, $$Arrival in Asmara$$, $$Orientation and a first walk through Asmara's beautifully preserved Art Deco core: cinemas and cafés frozen in the 1930s.$$),
  ('eritrea-sealed-state', 2, $$The Capital, Frozen in Time$$, $$The Medebar recycling market and the city's striking Italian colonial architecture, with a conversation on daily life here.$$),
  ('eritrea-sealed-state', 3, $$Down the Escarpment$$, $$A dramatic mountain road (or historic steam railway) down toward the coast, with the landscape transforming along the way.$$),
  ('eritrea-sealed-state', 4, $$Massawa$$, $$The old Ottoman and Egyptian architecture of this historic Red Sea port town.$$),
  ('eritrea-sealed-state', 5, $$The Coast$$, $$Time on the Red Sea coast, with an optional boat trip to the Dahlak archipelago and a look at the local fishing economy.$$),
  ('eritrea-sealed-state', 6, $$Back to the Highlands$$, $$A rural village visit and a traditional coffee ceremony with locals.$$),
  ('eritrea-sealed-state', 7, $$Asmara, One Last Time$$, $$A final day exploring the city's markets, churches, and mosque.$$),
  ('eritrea-sealed-state', 8, $$Departure$$, $$Airport. End of expedition.$$),
  -- Pamir Highway
  ('pamir-highway-tajikistan', 1, $$Arrival in Dushanbe$$, $$Permit check, trip briefing, and a first walk through the capital.$$),
  ('pamir-highway-tajikistan', 2, $$Into the Mountains$$, $$A long, scenic drive east along the Panj river gorge, with early views across into Afghanistan. Overnight in Kalaikhum.$$),
  ('pamir-highway-tajikistan', 3, $$Along the Panj$$, $$A full day following the river, with villages visible on both banks, ending in Khorog, the region's capital.$$),
  ('pamir-highway-tajikistan', 4, $$The Wakhan Valley$$, $$Yamchun fortress, the Bibi Fatima hot springs, and sweeping views of the Hindu Kush across the river.$$),
  ('pamir-highway-tajikistan', 5, $$Deeper into the Wakhan$$, $$Wakhi villages, ancient petroglyphs, and a high-altitude homestay with views toward Afghanistan and Pakistan.$$),
  ('pamir-highway-tajikistan', 6, $$Onto the Plateau$$, $$A climb over the Khargush pass toward the high-altitude lakes, thin air and raw, dramatic terrain.$$),
  ('pamir-highway-tajikistan', 7, $$The High Lakes$$, $$Bulunkul and Yashilkul lakes, a stop in one of the coldest inhabited villages on Earth, and time with local Kyrgyz herders.$$),
  ('pamir-highway-tajikistan', 8, $$Murghab$$, $$The highest town in the former USSR, its container bazaar, and a day to acclimatize.$$),
  ('pamir-highway-tajikistan', 9, $$Ak-Baital Pass$$, $$Crossing the highway's highest point (4,655m) and a stop at Karakul, a lake formed inside a meteorite crater.$$),
  ('pamir-highway-tajikistan', 10, $$Toward Kyrgyzstan$$, $$The final stretch of the Pamir Highway over the Kyzylart pass, beginning the descent.$$),
  ('pamir-highway-tajikistan', 11, $$Departure$$, $$Onward to Osh, Kyrgyzstan, or back home. End of expedition.$$),
  -- Lebanon
  ('lebanon-business-of-war', 1, $$Arrival in Beirut$$, $$A walk through downtown and Martyrs' Square, with an introduction to the city's layered history.$$),
  ('lebanon-business-of-war', 2, $$History & Memory$$, $$The National Museum and a conversation with a local journalist about how Lebanon's communities coexist.$$),
  ('lebanon-business-of-war', 3, $$Beirut's Neighborhoods$$, $$A wider look at the city's diverse districts and daily life across its many communities.$$),
  ('lebanon-business-of-war', 4, $$The Bekaa Valley & Baalbek$$, $$A scenic drive over the mountains to see the colossal Roman temples of Baalbek, among the largest in the world.$$),
  ('lebanon-business-of-war', 5, $$The South Coast$$, $$A visit to the historic port towns of Tyre and Sidon, two of the oldest continuously inhabited cities on Earth.$$),
  ('lebanon-business-of-war', 6, $$Departure$$, $$Return to Beirut. End of expedition.$$),
  -- Papua
  ('papua-sepik-baliem-bougainville', 1, $$Arrival in Port Moresby$$, $$Trip briefing and preparation for the journey ahead.$$),
  ('papua-sepik-baliem-bougainville', 2, $$Into the Sepik$$, $$A flight to Wewak, then a road and river transfer to the first riverside village of stilt houses.$$),
  ('papua-sepik-baliem-bougainville', 3, $$River Traditions$$, $$Traveling the Sepik by motorized canoe, visiting spirit houses, and learning about the river's rich carving traditions. Village overnight.$$),
  ('papua-sepik-baliem-bougainville', 4, $$Deeper on the River$$, $$Remote Sepik villages known for their mask and carving culture, reached entirely by canoe.$$),
  ('papua-sepik-baliem-bougainville', 5, $$To the Highlands$$, $$Leaving the river for a flight into the central highlands, with a dramatic shift in altitude and climate.$$),
  ('papua-sepik-baliem-bougainville', 6, $$Crossing to West Papua$$, $$Onward to Wamena, gateway to the Baliem Valley.$$),
  ('papua-sepik-baliem-bougainville', 7, $$The Baliem Valley$$, $$Dani villages, ancestral smoked mummies, and highland gardens, ahead of the valley's famous festival.$$),
  ('papua-sepik-baliem-bougainville', 8, $$The Baliem Festival$$, $$A full day at the Baliem Valley Festival: traditional dress, mock battles, and shared feasts.$$),
  ('papua-sepik-baliem-bougainville', 9, $$Highland Trek$$, $$Trekking between Dani and Yali villages over suspension bridges, with a homestay in a traditional honai hut.$$),
  ('papua-sepik-baliem-bougainville', 10, $$Onward to Bougainville$$, $$A long transfer back through PNG to the island of Bougainville.$$),
  ('papua-sepik-baliem-bougainville', 11, $$Bougainville$$, $$Buka and Arawa, the Panguna mine, and a conversation on the island's path to independence and recovery.$$),
  ('papua-sepik-baliem-bougainville', 12, $$Departure$$, $$Return flight home. End of expedition.$$),
  -- Kaliningrad
  ('kaliningrad-soviet-exclave', 1, $$Arrival in Kaliningrad$$, $$A first look at the city's striking mix of Soviet and Prussian architecture, including the cathedral and Kant's tomb.$$),
  ('kaliningrad-soviet-exclave', 2, $$Layers of History$$, $$The Amber Museum and the remaining traces of old Königsberg beneath the modern city, with a conversation on this region's unique identity.$$),
  ('kaliningrad-soviet-exclave', 3, $$The Baltic Coast$$, $$A drive to the coast and the dramatic dunes of the Curonian Spit, one of Europe's most striking coastal landscapes.$$),
  ('kaliningrad-soviet-exclave', 4, $$Departure$$, $$Final stops in the city before heading toward Poland or Lithuania. End of expedition.$$),
  -- Virunga
  ('virunga-militarized-gorilla-trek', 1, $$Arrival in Goma$$, $$A first look at this lakeside city on Lake Kivu and a briefing with the park's team.$$),
  ('virunga-militarized-gorilla-trek', 2, $$Nyiragongo$$, $$A climb up the active Nyiragongo volcano, with an overnight in shelters above the world's largest lava lake.$$),
  ('virunga-militarized-gorilla-trek', 3, $$Toward the Gorillas$$, $$Descending the volcano and transferring to the Mikeno sector, accompanied by the park's rangers.$$),
  ('virunga-militarized-gorilla-trek', 4, $$Meeting the Gorillas$$, $$A full-day trek through the jungle to spend an hour with a habituated mountain gorilla family, one of the most extraordinary wildlife encounters on Earth.$$),
  ('virunga-militarized-gorilla-trek', 5, $$The Rangers' Story$$, $$A visit to the memorial honoring the rangers who've given their lives protecting this park, and a conversation about the work of conservation here.$$),
  ('virunga-militarized-gorilla-trek', 6, $$Departure$$, $$Return to Goma. End of expedition.$$),
  -- Mauritania
  ('mauritania-lost-cities-sahara', 1, $$Arrival in Nouakchott$$, $$A first walk through the capital, including the lively Atlantic fish market.$$),
  ('mauritania-lost-cities-sahara', 2, $$The Iron Ore Train$$, $$A ride on one of the world's longest trains, crossing the desert at dusk aboard the open ore wagons: a raw, unforgettable experience.$$),
  ('mauritania-lost-cities-sahara', 3, $$Adrar & Atar$$, $$Arrival in the Adrar region and the oasis town of Atar, with a briefing on the area's caravan history.$$),
  ('mauritania-lost-cities-sahara', 4, $$Chinguetti$$, $$The ancient caravan city and seventh holy city of Islam, with its medieval manuscript libraries slowly being reclaimed by the sand.$$),
  ('mauritania-lost-cities-sahara', 5, $$Ouadane$$, $$A UNESCO-listed ghost town of stone, half-swallowed by the desert, best seen at sunset.$$),
  ('mauritania-lost-cities-sahara', 6, $$Dunes & Solitude$$, $$Crossing the dunes by camel and spending a night camped under a truly untouched desert sky.$$),
  ('mauritania-lost-cities-sahara', 7, $$Terjit$$, $$A lush palm oasis and natural springs, before the drive back toward Atar and Nouakchott.$$),
  ('mauritania-lost-cities-sahara', 8, $$Departure$$, $$End of expedition.$$)
) AS v(slug, day_number, title, description) ON v.slug = e.slug
WHERE d.expedition_id = e.id AND d.day_number = v.day_number;

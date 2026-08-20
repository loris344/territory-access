export interface ExpeditionDay {
  day_number: number;
  title: string;
  description: string;
  latitude?: number;
  longitude?: number;
  image_url?: string;
}

export interface Testimonial {
  name: string;
  detail: string;
  quote: string;
  image_url: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ExpeditionDate {
  id: string;
  start_date: string;
  end_date: string;
  capacity_max: number;
  spots_taken: number;
  status: "open" | "limited" | "closed" | "cancelled" | "postponed";
}

export interface Expedition {
  id: string;
  name: string;
  slug: string;
  location: string;
  country: string;
  continent: string;
  coordinates: [number, number]; // [longitude, latitude]
  start_date: string;
  end_date: string;
  duration_days: number;
  capacity_max: number;
  spots_taken: number;
  price_usd: number;
  intensity_level: string;
  intensity_type: string;
  difficulty_level: string;
  short_description: string;
  long_description: string;
  storytelling?: string;
  status: "open" | "limited" | "closed" | "cancelled" | "postponed";
  cancellation_reason?: string;
  expedition_status: string;
  hero_image_url?: string;
  hero_image_position?: string;
  travelers_count?: number;
  deposit_required?: boolean;
  deposit_amount_usd?: number;
  testimonials?: Testimonial[];
  faqs?: FAQItem[];
  itinerary: ExpeditionDay[];
  inclusions: string[];
  exclusions: string[];
  dates?: ExpeditionDate[];
}

const defaultInclusions = ["All meals", "All drinks (water and soft drinks)", "All ground transport", "English-speaking local tour guide", "Ligne Rouge Tours tour leader", "Visa support documents", "All entry fees to sites", "Airport transfers"];
const defaultExclusions = ["Round-trip airfare", "Travel insurance", "Visa fees", "Tips", "Personal spending money"];

export const expeditions: Expedition[] = [
  {
    id: "1",
    name: "Namibia – Namib Crossing",
    slug: "namibia-namib-crossing",
    location: "Namib Desert & Skeleton Coast",
    country: "Namibia",
    continent: "Africa",
    coordinates: [15.8, -24.73],
    start_date: "2026-10-03",
    end_date: "2026-10-14",
    duration_days: 12,
    capacity_max: 10,
    spots_taken: 0,
    price_usd: 4290,
    intensity_level: "Hard",
    intensity_type: "desert",
    difficulty_level: "hard",
    short_description: "12 days crossing the Namib by 4x4 and on foot, from the dunes of Sossusvlei to the Skeleton Coast.",
    long_description: "12-day expedition across one of the oldest and driest deserts on Earth: 4x4 traverses through the red dunes of Sossusvlei, on-foot approaches into Deadvlei and the Naukluft mountains, wild bivouacs under some of the clearest skies in the world, and a final push to the fog-bound Skeleton Coast. Closer to a real desert expedition than a classic safari — two nights in comfort lodges break up the effort, the rest is tents and open sky.",
    status: "open",
    expedition_status: "upcoming",
    itinerary: [
      { day_number: 1, title: "Arrival Windhoek", description: "Fly into Windhoek, gear check and expedition briefing, short drive to first camp on the edge of the escarpment." },
      { day_number: 2, title: "Into the Namib", description: "Long drive south into the NamibRand, first dunes on the horizon, bush camp under open sky." },
      { day_number: 3, title: "Sossusvlei at Dawn", description: "Pre-dawn approach to Dune 45 and Big Daddy, on-foot descent into Deadvlei's dead camel-thorn trees, afternoon rest." },
      { day_number: 4, title: "Naukluft Mountains", description: "4x4 traverse into the Naukluft massif, a half-day hike through rock pools and canyons." },
      { day_number: 5, title: "Sesriem to the Interior", description: "Deep-desert driving day, wild bivouac with no fixed camp infrastructure." },
      { day_number: 6, title: "Walking the Dunes", description: "Full day on foot through dune fields, reading tracks of oryx and desert-adapted wildlife." },
      { day_number: 7, title: "Kuiseb Canyon", description: "Descent into the Kuiseb River canyon, night among the welwitschia plants that can live over a thousand years." },
      { day_number: 8, title: "Swakopmund", description: "Reach the coast, one night in a comfort lodge to recover before the final stretch." },
      { day_number: 9, title: "Into the Skeleton Coast", description: "4x4 north along the fog-bound coast, shipwrecks and seal colonies." },
      { day_number: 10, title: "Skeleton Coast Bivouac", description: "Final wild camp between dunes and Atlantic fog, isolation at its most complete." },
      { day_number: 11, title: "Return South", description: "Long drive back toward Windhoek, debrief on the crossing." },
      { day_number: 12, title: "Departure", description: "Final morning in Windhoek. End of expedition." },
    ],
    inclusions: defaultInclusions,
    exclusions: defaultExclusions,
  },
  {
    id: "2",
    name: "Tanzania – Kilimanjaro 5895",
    slug: "tanzania-kilimanjaro-lemosho",
    location: "Kilimanjaro, Lemosho Route",
    country: "Tanzania",
    continent: "Africa",
    coordinates: [37.35, -3.07],
    start_date: "2026-09-12",
    end_date: "2026-09-20",
    duration_days: 9,
    capacity_max: 12,
    spots_taken: 0,
    price_usd: 3390,
    intensity_level: "Hard",
    intensity_type: "altitude",
    difficulty_level: "hard",
    short_description: "9 days climbing Kilimanjaro via the Lemosho route, through five climate zones to the sunrise summit of Uhuru Peak at 5,895m.",
    long_description: "9-day ascent of Africa's highest peak via the Lemosho route: rainforest, moorland, alpine desert and glacier, five completely different landscapes on a single mountain. Porters carry the heavy loads, guides set a slow, steady pace built for acclimatization, and an extra rest day before the summit push gives this route one of the highest success rates on the mountain. No technical climbing, no mountaineering experience needed — just fitness, good boots, and the will to keep walking toward one of the most spectacular sunrises on Earth.",
    status: "open",
    expedition_status: "upcoming",
    itinerary: [
      { day_number: 1, title: "Arrival Moshi", description: "Fly into Kilimanjaro International, gear check, briefing at the foot of the mountain." },
      { day_number: 2, title: "Londorossi Gate to Mti Mkubwa", description: "Drive to the trailhead, first steps through montane rainforest to Big Tree Camp." },
      { day_number: 3, title: "Shira Ridge", description: "Climb out of the forest onto the Shira Plateau, first full views of the summit." },
      { day_number: 4, title: "Shira Camp to Barranco", description: "Crossing beneath Lava Tower for acclimatization, descent to camp in the shadow of the Barranco Wall." },
      { day_number: 5, title: "The Barranco Wall", description: "Early scramble up the Wall, ridge walking to Karanga Camp with the summit growing closer." },
      { day_number: 6, title: "Karanga to Barafu", description: "Short push to Barafu, the last camp before the summit, early rest ahead of a midnight start." },
      { day_number: 7, title: "Summit Night", description: "Midnight departure for Uhuru Peak, 5,895m reached at sunrise, long descent to Mweka Camp." },
      { day_number: 8, title: "Descent to Mweka Gate", description: "Final descent through the forest, certificates and celebration at the gate." },
      { day_number: 9, title: "Departure", description: "Transfer to Moshi or Arusha for onward flights. End of expedition." },
    ],
    inclusions: defaultInclusions,
    exclusions: defaultExclusions,
  },
  {
    id: "3",
    name: "Nepal – Annapurna 5416",
    slug: "nepal-annapurna-circuit",
    location: "Annapurna Circuit, Thorong La",
    country: "Nepal",
    continent: "Asia",
    coordinates: [83.9, 28.7],
    start_date: "2026-10-24",
    end_date: "2026-11-06",
    duration_days: 14,
    capacity_max: 12,
    spots_taken: 0,
    price_usd: 2790,
    intensity_level: "Hard",
    intensity_type: "altitude",
    difficulty_level: "hard",
    short_description: "14 days around the Annapurna massif, through valleys and Himalayan villages, crossing the Thorong La pass at 5,416m.",
    long_description: "14-day trek around the Annapurna massif, one of the most beautiful walks on Earth: subtropical valleys giving way to Tibetan-influenced villages, the high desert of Manang, and the crossing of the Thorong La before descending into the pilgrimage town of Muktinath. Porters carry the loads, comfortable teahouses provide hot meals and real beds every night — no camping, no technical skills, just good boots and a steady pace. A real high-altitude adventure built for trekkers, not mountaineers.",
    status: "open",
    expedition_status: "upcoming",
    itinerary: [
      { day_number: 1, title: "Arrival Kathmandu", description: "Briefing and gear check, last-minute preparations in the capital." },
      { day_number: 2, title: "Drive to Besisahar", description: "Long drive west, first views of the Annapurna range." },
      { day_number: 3, title: "Besisahar to Chamje", description: "First trekking day, rice terraces and the Marsyangdi valley." },
      { day_number: 4, title: "Chamje to Dharapani", description: "River crossings and pine forest, entering the drier upper valley." },
      { day_number: 5, title: "Dharapani to Chame", description: "Views of Manaslu open up behind, the valley narrows." },
      { day_number: 6, title: "Chame to Pisang", description: "Walking beneath the Paungda Danda rock face into pine forest." },
      { day_number: 7, title: "Pisang to Manang", description: "Choice of the high scenic route, first proper views of Annapurna II, III and IV." },
      { day_number: 8, title: "Acclimatization in Manang", description: "Rest day with a short acclimatization hike above the village." },
      { day_number: 9, title: "Manang to Yak Kharka", description: "Short high-altitude day, yaks grazing on open slopes." },
      { day_number: 10, title: "Yak Kharka to Thorong Phedi", description: "Final approach to base camp below the pass." },
      { day_number: 11, title: "Thorong La Crossing", description: "Pre-dawn start, the 5,416m pass, long descent to Muktinath." },
      { day_number: 12, title: "Muktinath to Jomsom", description: "Visit to the pilgrimage temple, walk down through the Kali Gandaki gorge." },
      { day_number: 13, title: "Flight to Pokhara", description: "Short flight over the mountains, rest by Phewa Lake." },
      { day_number: 14, title: "Return to Kathmandu", description: "Drive or flight back, debrief and farewell dinner. End of expedition." },
    ],
    inclusions: defaultInclusions,
    exclusions: defaultExclusions,
  },
  {
    id: "4",
    name: "Peru – Ausangate 5000",
    slug: "peru-ausangate-5000",
    location: "Ausangate & Machu Picchu",
    country: "Peru",
    continent: "South America",
    coordinates: [-71.23, -13.75],
    start_date: "2026-11-14",
    end_date: "2026-11-25",
    duration_days: 12,
    capacity_max: 10,
    spots_taken: 0,
    price_usd: 3290,
    intensity_level: "Hard",
    intensity_type: "altitude",
    difficulty_level: "hard",
    short_description: "12 days: Sacred Valley acclimatization, a high-altitude trek around Ausangate past turquoise lakes and Rainbow Mountain, then Machu Picchu.",
    long_description: "12-day journey through the Cusco Andes: real acclimatization time in the Sacred Valley before altitude becomes a factor, days of trekking around the glaciated Ausangate massif past the mineral-striped slopes of Vinicunca and turquoise high-altitude lakes, mules carrying the gear and a support team waiting at camp every night, finishing with Machu Picchu by train. A far more spectacular, far less crowded way into the Andes than a standard Peru circuit — no technical skills required, just a good level of fitness and patience for the altitude.",
    status: "open",
    expedition_status: "upcoming",
    itinerary: [
      { day_number: 1, title: "Arrival Cusco", description: "Transfer and rest at altitude, briefing." },
      { day_number: 2, title: "Sacred Valley Acclimatization", description: "Pisac and Ollantaytambo ruins, easy walking at altitude, comfortable hotel." },
      { day_number: 3, title: "Cusco Acclimatization Hike", description: "Half-day hike above the city, final gear check." },
      { day_number: 4, title: "Trailhead to Upis", description: "Drive to the trailhead, mules loaded with the gear, first camp at the foot of Ausangate with hot springs nearby." },
      { day_number: 5, title: "Upis to Ausangatecocha", description: "Crossing the first high pass, glacier views open up, lakeside camp with a hot meal waiting." },
      { day_number: 6, title: "Rainbow Mountain Side", description: "Early walk to Vinicunca's mineral-striped slopes before the day-trip crowds arrive." },
      { day_number: 7, title: "Ausangatecocha to Jampa", description: "Second high pass above 5,000m, descent into a remote valley, the support team already at camp." },
      { day_number: 8, title: "Jampa to Pacchanta", description: "Final pass of the circuit, descent to natural hot springs to soak at trail's end." },
      { day_number: 9, title: "Return to Cusco", description: "Drive back, rest and recovery day at a comfortable hotel." },
      { day_number: 10, title: "Train to Aguas Calientes", description: "Scenic train through the Sacred Valley to the base of Machu Picchu." },
      { day_number: 11, title: "Machu Picchu", description: "Sunrise entry to the citadel, guided visit, afternoon at leisure." },
      { day_number: 12, title: "Return to Cusco & Departure", description: "Train and transfer back, onward flights. End of expedition." },
    ],
    inclusions: defaultInclusions,
    exclusions: defaultExclusions,
  },
  {
    id: "5",
    name: "Patagonia – End of Land",
    slug: "patagonia-end-of-land",
    location: "Torres del Paine & El Chaltén",
    country: "Chile / Argentina",
    continent: "South America",
    coordinates: [-73.0, -51.0],
    start_date: "2026-11-28",
    end_date: "2026-12-10",
    duration_days: 13,
    capacity_max: 10,
    spots_taken: 0,
    price_usd: 5990,
    intensity_level: "Medium",
    intensity_type: "mountain",
    difficulty_level: "medium",
    short_description: "13 days across Torres del Paine and El Chaltén: iconic day-hikes, a glacier boat excursion and the wildest scenery in South America.",
    long_description: "13-day journey across the two great trekking grounds of Patagonia: the granite towers and glaciers of Torres del Paine in Chile, and the jagged spires around El Chaltén in Argentina. A handful of iconic day-hikes (Base Torres, Fitz Roy) are the heart of the trip, balanced with easier days — a boat excursion past calving icebergs, wildlife-watching on the steppe, and comfortable lodges most nights. This is the prestige piece of the catalog: not because it's the hardest, but because the landscape is the most extraordinary anywhere on Earth.",
    status: "open",
    expedition_status: "upcoming",
    itinerary: [
      { day_number: 1, title: "Arrival Punta Arenas", description: "Transfer north, first views of the steppe, wildlife spotting en route (guanacos, rheas), briefing." },
      { day_number: 2, title: "Into Torres del Paine", description: "Drive into the park, comfortable lodge beneath the towers." },
      { day_number: 3, title: "Base of the Towers", description: "The signature day-hike to the Mirador Base Las Torres, granite spires at their most dramatic." },
      { day_number: 4, title: "Grey Glacier by Boat", description: "A catamaran excursion across Lago Grey, right up to the face of the glacier, icebergs up close without the long trek." },
      { day_number: 5, title: "Free Day in the Park", description: "Easier wildlife-watching walks in condor and puma territory, full rest option." },
      { day_number: 6, title: "Crossing to Argentina", description: "Border crossing and drive toward El Chaltén, mountain views the whole way." },
      { day_number: 7, title: "Arrival El Chaltén", description: "Settle into the village, short acclimatization walk, gear check." },
      { day_number: 8, title: "Laguna de los Tres", description: "The signature day-hike beneath Fitz Roy to the glacial lake at its base." },
      { day_number: 9, title: "Cerro Torre Viewpoint", description: "An easier walk toward the needle spire of Cerro Torre, a lighter day after yesterday's effort." },
      { day_number: 10, title: "Lago del Desierto", description: "Boat and short trail along a remote glacial lake near the Chilean border." },
      { day_number: 11, title: "Weather & Rest Day", description: "A reserve day built into the itinerary, used for a relaxed walk or simply resting." },
      { day_number: 12, title: "Return to El Calafate", description: "Drive along the steppe, visit to the Perito Moreno Glacier viewing platforms, no trekking required." },
      { day_number: 13, title: "Departure", description: "Transfer to El Calafate airport. End of expedition." },
    ],
    inclusions: defaultInclusions,
    exclusions: defaultExclusions,
  },
  {
    id: "6",
    name: "Mongolia – No Roads",
    slug: "altai-mongolia-eagle-hunters",
    location: "Gobi Desert & Central Steppe",
    country: "Mongolia",
    continent: "Central Asia",
    coordinates: [103.5, 43.5],
    start_date: "2026-09-06",
    end_date: "2026-09-17",
    duration_days: 12,
    capacity_max: 10,
    spots_taken: 0,
    price_usd: 3190,
    intensity_level: "Hard",
    intensity_type: "nomadic",
    difficulty_level: "hard",
    short_description: "12 days off-road through the Gobi and the steppe, by 4x4, horse and on foot, sleeping in gers and isolated camps.",
    long_description: "12-day expedition through the Gobi Desert and the central steppe with no fixed roads to follow: long 4x4 days navigating by landmark, stretches on horseback across open grassland, nights in family gers and isolated camps under some of the clearest night skies on Earth. The near-total absence of tourism infrastructure here is exactly the point — this is Mongolia the way herders still live it, not a circuit built for buses.",
    status: "open",
    expedition_status: "upcoming",
    itinerary: [
      { day_number: 1, title: "Arrival Ulaanbaatar", description: "Briefing, gear check, last supplies before leaving the paved road behind." },
      { day_number: 2, title: "Into the Steppe", description: "Long drive south, first ger camp with a nomadic family." },
      { day_number: 3, title: "Baga Gazriin Chuluu", description: "Granite rock formations and hidden temple ruins, off-road navigation practice." },
      { day_number: 4, title: "Deeper into the Gobi", description: "Full driving day with no fixed track, reading the land like the drivers do." },
      { day_number: 5, title: "Yolyn Am Canyon", description: "Walk into a canyon that holds ice well into summer, surrounded by desert." },
      { day_number: 6, title: "Flaming Cliffs", description: "Sunset at the Bayanzag cliffs, where the first dinosaur eggs were ever found." },
      { day_number: 7, title: "Khongoryn Els", description: "Arrival at the singing dunes, on-foot climb to the ridge at sunset." },
      { day_number: 8, title: "Horseback on the Steppe", description: "A full day on horseback across open grassland with a local family." },
      { day_number: 9, title: "Nomadic Life", description: "Helping with herding and daily camp life, a night entirely off any track." },
      { day_number: 10, title: "Orkhon Valley", description: "Long drive north into greener country, waterfalls and ancient burial mounds." },
      { day_number: 11, title: "Kharkhorin", description: "The ruins of the old Mongol capital, monastery visit." },
      { day_number: 12, title: "Return to Ulaanbaatar", description: "Final drive back, debrief. End of expedition." },
    ],
    inclusions: defaultInclusions,
    exclusions: defaultExclusions,
  },
  {
    id: "7",
    name: "Transnistria – A Soviet Time Capsule",
    slug: "transnistria-soviet-ghost-state",
    location: "Chisinau & Tiraspol",
    country: "Moldova & Transnistria",
    continent: "Europe",
    coordinates: [29.7587, 46.8481],
    start_date: "2026-08-14",
    end_date: "2026-08-18",
    duration_days: 5,
    capacity_max: 14,
    spots_taken: 0,
    price_usd: 1160,
    intensity_level: "Easy",
    intensity_type: "political",
    difficulty_level: "easy",
    short_description: "5 days between Chisinau and a Soviet-era time capsule most people don't know exists.",
    long_description: "5 days across Moldova and Transnistria: Chisinau's Soviet-tinged capital and underground wine cellars, then Tiraspol and Bender's Soviet-era streets frozen in time, the historic Bender Fortress, a local distillery, and a guided shooting range session, a fascinating look at how an unrecognized state actually functions day to day.",
    status: "open",
    expedition_status: "upcoming",
    itinerary: [
      { day_number: 1, title: "Arrival in Chisinau", description: "A first walk through Moldova's Soviet-tinged capital: wide boulevards, local markets, and a first taste of the country's food and wine." },
      { day_number: 2, title: "Underground Wine Cellars", description: "A day trip to one of Moldova's famous underground wine cities, dug decades ago and stretching for kilometers, followed by free time back in Chisinau." },
      { day_number: 3, title: "Crossing into Transnistria", description: "A land crossing into Transnistria, with registration handled by our local fixer, and a first walk through Tiraspol, past Soviet statues and government buildings frozen in time." },
      { day_number: 4, title: "Bender & Local Life", description: "The historic Bender Fortress with a local historian, followed by a visit to a local distillery and a guided session at a licensed shooting range." },
      { day_number: 5, title: "Departure", description: "Back to Chisinau for departure, with a final conversation on how this unusual, unrecognized state actually works day to day." },
    ],
    inclusions: defaultInclusions,
    exclusions: defaultExclusions,
  },
  {
    id: "8",
    name: "Kyrgyzstan – Tian Shan",
    slug: "kyrgyzstan-tian-shan",
    location: "Central Tian Shan",
    country: "Kyrgyzstan",
    continent: "Central Asia",
    coordinates: [78.0, 42.0],
    start_date: "2026-09-20",
    end_date: "2026-10-01",
    duration_days: 12,
    capacity_max: 12,
    spots_taken: 0,
    price_usd: 2990,
    intensity_level: "Medium",
    intensity_type: "mountain",
    difficulty_level: "medium",
    short_description: "12 days in the Tian Shan: horseback riding and gentle trekking through high alpine scenery, nights in shepherd yurts.",
    long_description: "12-day journey through the Central Tian Shan, the \"Mountains of Heaven\": a mix of horseback riding and easy-to-moderate trekking through high alpine valleys, nights in shepherd yurts and tents, and the turquoise expanse of Song-Köl lake at 3,000m. Pack horses carry the heavy loads and much of the distance is covered in the saddle, not on foot — real remoteness and extraordinary scenery without requiring an endurance-athlete level of fitness.",
    status: "open",
    expedition_status: "upcoming",
    itinerary: [
      { day_number: 1, title: "Arrival Bishkek", description: "Briefing, gear check, drive toward the mountains begins." },
      { day_number: 2, title: "Into the Tian Shan", description: "Long drive to the trailhead, first camp among shepherd yurts." },
      { day_number: 3, title: "First Steps & Horses", description: "Easy trekking day to meet the horses, pack animals loaded with the heavy gear." },
      { day_number: 4, title: "Jyrgalan Valley on Horseback", description: "A full day riding through glacial valleys and alpine meadows." },
      { day_number: 5, title: "High Pass Crossing", description: "The one real trekking day of the trip: a crossing above 3,800m on foot, camp on the far side." },
      { day_number: 6, title: "Song-Köl Approach", description: "Easy descent toward the high alpine lake, first yurt camp with a herding family." },
      { day_number: 7, title: "Song-Köl Lake", description: "Rest day at the lake, horseback riding across the surrounding pastures, felt-making with local women." },
      { day_number: 8, title: "Lakeside to Valley", description: "Gentle riding day back toward lower ground, views back over the whole range." },
      { day_number: 9, title: "Descent to the Valley", description: "Easy walking day, first trees in a week." },
      { day_number: 10, title: "Karakol", description: "Arrival in the regional town, rest and hot showers." },
      { day_number: 11, title: "Skazka Canyon", description: "Short day trip to the red-rock \"Fairy Tale\" canyon before the return drive." },
      { day_number: 12, title: "Return to Bishkek", description: "Long drive back, debrief. End of expedition." },
    ],
    inclusions: defaultInclusions,
    exclusions: defaultExclusions,
  },
  {
    id: "9",
    name: "Lapland – Arctic 66",
    slug: "lapland-arctic-66",
    location: "Finnish Lapland, north of the Arctic Circle",
    country: "Finland",
    continent: "Europe",
    coordinates: [27.5, 68.0],
    start_date: "2027-02-12",
    end_date: "2027-02-19",
    duration_days: 8,
    capacity_max: 8,
    spots_taken: 0,
    price_usd: 4290,
    intensity_level: "Medium",
    intensity_type: "polar",
    difficulty_level: "medium",
    short_description: "8 days in Finnish Lapland, north of the Arctic Circle: snowshoe walks, frozen lakes, and northern lights from a heated wilderness cabin.",
    long_description: "8-day winter journey across Finnish Lapland, north of the 66th parallel: snowshoe walks across frozen lakes and boreal forest, nights in heated wilderness cabins with wood stoves, and real stretches of Arctic silence far from any town. This isn't a tourist package built around huskies and Santa's village — it's a genuine, guide-supported introduction to how the Arctic actually feels, ending with a sauna and a warm lodge night. No winter camping experience required: all cold-weather gear is provided, and the pace is built for real beginners to Arctic travel.",
    status: "open",
    expedition_status: "upcoming",
    itinerary: [
      { day_number: 1, title: "Arrival Ivalo", description: "Cold-weather gear fitting, briefing on Arctic travel and safety, first night at a comfortable lodge." },
      { day_number: 2, title: "First Steps on Snow", description: "Snowshoe technique on short, easy terrain, an introduction to moving safely in the snow." },
      { day_number: 3, title: "Onto the Frozen Lakes", description: "A full day snowshoeing across frozen lake systems, with sled support for the heavier gear." },
      { day_number: 4, title: "Heated Wilderness Cabin", description: "Crossing into boreal forest, first night in a heated cabin with a wood stove and a northern lights watch." },
      { day_number: 5, title: "Open Fell", description: "A shorter day on open fell terrain, real Arctic silence, guide-led pace throughout." },
      { day_number: 6, title: "Second Wilderness Cabin", description: "An easier day to a second heated cabin, hot food waiting, total quiet." },
      { day_number: 7, title: "Return Crossing", description: "Final, gentle snowshoe day back toward the trailhead." },
      { day_number: 8, title: "Sauna & Departure", description: "Sauna and a warm lodge night to recover, transfer to the airport. End of expedition." },
    ],
    inclusions: defaultInclusions,
    exclusions: defaultExclusions,
  },
  {
    id: "10",
    name: "Iceland – Black Highlands",
    slug: "iceland-black-highlands",
    location: "Central Highlands",
    country: "Iceland",
    continent: "Europe",
    coordinates: [-19.0, 64.7],
    start_date: "2027-07-18",
    end_date: "2027-07-25",
    duration_days: 8,
    capacity_max: 10,
    spots_taken: 0,
    price_usd: 4690,
    intensity_level: "Medium",
    intensity_type: "isolation",
    difficulty_level: "medium",
    short_description: "8 days walking Iceland's Central Highlands: black volcanic sand, geothermal valleys and glacier views, mountain huts every night.",
    long_description: "8-day trek across Iceland's Central Highlands: black volcanic sand, geothermal valleys, obsidian lava fields and glacier views, walking from one staffed mountain hut to the next — hot meals, real beds, no camping required. A guided crossing at a steady, achievable pace, built around one of the most otherworldly landscapes in Europe rather than around difficulty for its own sake.",
    status: "open",
    expedition_status: "upcoming",
    itinerary: [
      { day_number: 1, title: "Arrival Reykjavík", description: "Gear check, briefing, transfer toward the highland edge." },
      { day_number: 2, title: "Landmannalaugar", description: "Arrival at the trailhead, geothermal valley of rhyolite mountains, first hut night." },
      { day_number: 3, title: "Into the Black Desert", description: "Crossing obsidian lava fields toward Hrafntinnusker, guided stream crossings with poles provided, hut for the night." },
      { day_number: 4, title: "Green Valleys", description: "Descent into Álftavatn's green valleys after the black desert, a gentler day." },
      { day_number: 5, title: "Emstrur", description: "Crossing a stark volcanic desert between two glaciers, comfortable hut on arrival." },
      { day_number: 6, title: "Þórsmörk", description: "Descent into the forested valley of Þórsmörk, framed by three glaciers, the easiest day of the trek." },
      { day_number: 7, title: "Fimmvörðuháls Pass", description: "The trip's one full-effort day: crossing between two glaciers past young lava fields from the 2010 eruption." },
      { day_number: 8, title: "Skógar & Departure", description: "Final descent past the Skógafoss waterfall, transfer back to Reykjavík. End of expedition." },
    ],
    inclusions: defaultInclusions,
    exclusions: defaultExclusions,
  },
  {
    id: "11",
    name: "Morocco – Toubkal 4167",
    slug: "morocco-toubkal-4167",
    location: "High Atlas, Toubkal",
    country: "Morocco",
    continent: "Africa",
    coordinates: [-7.92, 31.06],
    start_date: "2026-10-17",
    end_date: "2026-10-24",
    duration_days: 8,
    capacity_max: 14,
    spots_taken: 0,
    price_usd: 1590,
    intensity_level: "Medium",
    intensity_type: "altitude",
    difficulty_level: "medium",
    short_description: "8 days crossing the High Atlas on foot, mules carrying the gear, summiting Toubkal at 4,167m.",
    long_description: "8-day expedition across Morocco's High Atlas: Berber villages, mule-supported trekking through remote valleys, and the ascent of Jebel Toubkal, North Africa's highest peak at 4,167m. The most accessible expedition in the catalog — no technical climbing, no prior altitude experience required — and exactly the right place to find out if this kind of travel is for you.",
    status: "open",
    expedition_status: "upcoming",
    itinerary: [
      { day_number: 1, title: "Arrival Marrakech", description: "Briefing and gear check in the medina, last supplies." },
      { day_number: 2, title: "Imlil Trailhead", description: "Drive into the mountains, first walk to a Berber village, mules loaded for the trek." },
      { day_number: 3, title: "Into the Valleys", description: "Trekking day through remote valleys, terraced fields and walnut groves." },
      { day_number: 4, title: "Around the Massif", description: "Long traversing day with the Toubkal massif always in view." },
      { day_number: 5, title: "Toubkal Base Camp", description: "Approach to the Refuge, altitude acclimatization walk." },
      { day_number: 6, title: "Summit Day", description: "Pre-dawn start, the summit of Jebel Toubkal at 4,167m, long descent to the refuge." },
      { day_number: 7, title: "Return to Imlil", description: "Final descent through the valleys, last night among Berber villages." },
      { day_number: 8, title: "Departure", description: "Transfer back to Marrakech. End of expedition." },
    ],
    inclusions: defaultInclusions,
    exclusions: defaultExclusions,
  },
];

export function getExpeditionBySlug(slug: string): Expedition | undefined {
  return expeditions.find((e) => e.slug === slug);
}

export function getActiveExpeditions(): Expedition[] {
  return expeditions.filter((e) => e.status !== "closed");
}

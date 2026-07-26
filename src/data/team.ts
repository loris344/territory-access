export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  email: string;
}

export const teamMembers: TeamMember[] = [
  {
    name: "Loris",
    role: "Founder & Expedition Leader",
    bio: "Passionate about extreme travel and geopolitics. Has explored over 38 countries including conflict zones, disputed territories, and restricted-access regions before founding Ligne Rouge Tours.",
    image: "/assets/founder.webp",
    email: "loris@lignerougetours.com",
  },
  {
    name: "Gaëtan",
    role: "Operations & Logistics Coordinator",
    bio: "Handles the operational backbone of every expedition, from route planning to on-ground logistics across complex territories.",
    image: "/assets/gaetan.webp",
    email: "gaetan@lignerougetours.com",
  },
  {
    name: "Aymeric",
    role: "Field Operations Analyst",
    bio: "Specializes in risk assessment and field intelligence. Ensures every expedition meets strict security standards before departure.",
    image: "/assets/aymeric.jpg",
    email: "aymeric@lignerougetours.com",
  },
  {
    name: "Rayane",
    role: "Expedition Guide & Fixer Liaison",
    bio: "Coordinates with local fixers and guides across North Africa and the Middle East. Expert in navigating culturally sensitive environments.",
    image: "/assets/rayane.webp",
    email: "rayane@lignerougetours.com",
  },
  {
    name: "Vitaly",
    role: "Strategic Partnerships & Development",
    bio: "Builds relationships with local operators and institutional partners to open access to restricted and emerging destinations.",
    image: "/assets/vitaly.webp",
    email: "vitaly@lignerougetours.com",
  },
  {
    name: "Rym",
    role: "Marketing & Brand Strategy",
    bio: "Shapes the brand's visual identity and narrative. Drives awareness through content strategy and digital campaigns.",
    image: "/assets/rym.webp",
    email: "rym@lignerougetours.com",
  },
  {
    name: "Léa",
    role: "Communications & Community Manager",
    bio: "Manages client relations, social media presence, and community engagement. The first point of contact for aspiring expedition members.",
    image: "/assets/lea.webp",
    email: "lea@lignerougetours.com",
  },
];

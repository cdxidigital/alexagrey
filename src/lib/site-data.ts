import imageManifest from "./image-manifest.json";

export const profile = {
  name: "Alexa Grey",
  location: "Perth, WA",
  account: "Independent",
  updated: "Recently updated",
  category: "Escort for Disabled & Men",
  tagline: "A cheeky Aussie brunette with hypnotic green eyes",
};

export const media = {
  heroImage: imageManifest.hero,
  aboutImage: imageManifest.hero,
  heroVideos: ["/media/clip-1.mp4", "/media/clip-2.mp4", "/media/clip-3.mp4"],
  gallery: [
    ...imageManifest.images.map((src) => ({ type: "image" as const, src })),
    { type: "video" as const, src: "/media/clip-2.mp4" },
    { type: "video" as const, src: "/media/clip-1.mp4" },
    { type: "video" as const, src: "/media/clip-3.mp4" },
  ],
};

export const facts = [
  { label: "Age", value: "23" },
  { label: "Height", value: "5' 1\" · 155cm" },
  { label: "Body", value: "Petite" },
  { label: "Bust", value: "C cup" },
  { label: "Hair", value: "Straight Brunette" },
  { label: "Eyes", value: "Green" },
  { label: "Dress", value: "Size 8" },
  { label: "Ethnicity", value: "Caucasian" },
  { label: "Sexuality", value: "Heterosexual" },
  { label: "Language", value: "English" },
  { label: "Gender", value: "Female" },
  { label: "Location", value: "Perth, WA" },
];

export const aboutParagraphs = [
  "A cheeky Aussie brunette with hypnotic green eyes and a petite 5’ frame, perfectly balanced with curves in all the right places. Soft lips, tempting energy, and a playful spark that loves to blur the line between sweet and sinful.",
  "I’m the kind of woman who can make you laugh one minute and lose your train of thought the next. Flirty, confident, and just the right amount of trouble. I turn casual chats into irresistible temptation and leave you wondering what might happen next.",
  "My GFE style is warm, relaxed, and deliciously intimate. Think slow touches, genuine connection, and that addictive feeling of being completely seen and wanted.",
  "But when the mood shifts, my adventurous side takes over. PSE is where I truly shine — exploring chemistry, teasing boundaries, and creating moments that feel spontaneous, electric, and unforgettable.",
  "If you’re craving a woman who’s equal parts charm and chaos, softness and spark… come say hi. Let’s see how much trouble we can get into together.",
];

export const pseIncludes = [
  "Toys",
  "Spanking",
  "Deepthroating",
  "Rimming on me",
  "COB",
  "Gagging",
  "Role play",
  "Sloppy BBBJ",
  "MSOG",
  "Costumes",
  "Hair pulling",
  "Light anal play",
  "Rough sex — any position",
];

export const services = [
  "Affectionate cuddling",
  "Affectionate kissing",
  "Anal play",
  "Anal play – On me",
  "Bondage",
  "Brazilian",
  "Body Slide",
  "CBJ",
  "COB",
  "COF",
  "Costumes",
  "Costumes and role play",
  "DATY",
  "DFK",
  "Dinner companion",
  "Doggy style",
  "Erotic sensual massage",
  "Facial",
  "Fetish",
  "Filming",
  "Foot fetish",
  "Full oil massage",
  "Gagging",
  "GFE",
  "Greek",
  "GS – On you",
  "Happy ending",
  "HJ",
  "Kissing",
  "Light bondage",
  "Light spanking",
  "Maid",
  "Massage",
  "Masturbation",
  "MILF",
  "MSOG",
  "Multiple positions",
  "Mutual French (oral)",
  "Nurse",
  "Overnight stays",
  "Photography",
  "PSE",
  "PSE – With filming",
  "Rimming – On me",
  "Role play",
  "School girl",
  "Sex toys",
  "Sexy lingerie",
  "Sexy shower for 2",
  "Social escort",
  "Spanking – On me",
  "Squirting",
  "Strap on – on me",
  "Strip tease",
  "Cuddling and Touching",
  "Dirty Talk",
  "Full Body Massage",
  "Mutual Masturbation",
  "Overnight",
  "Passionate Kissing",
  "Teasing",
  "Toys",
  "Escort",
  "Full Service",
  "Sissy Play",
  "Slave / Sub play",
  "Ball Busting",
  "Intimidation on You",
  "Submissive",
  "Relief",
];

export const weeklyHours: { day: string; hours: string }[] = [
  { day: "Sunday", hours: "4:00 PM – till late" },
  { day: "Monday", hours: "12:00 PM – till late" },
  { day: "Tuesday", hours: "4:00 PM – till late" },
  { day: "Wednesday", hours: "4:00 PM – till late" },
  { day: "Thursday", hours: "5:00 PM – till late" },
  { day: "Friday", hours: "Available 24 hours" },
  { day: "Saturday", hours: "Available 24 hours" },
];

export const rates = [
  { duration: "30 minutes", price: "$500" },
  { duration: "1 hour", price: "$800" },
  { duration: "2 hours", price: "$1,500" },
];

export const extras = [
  { name: "COB", price: "$50" },
  { name: "BBBJ", price: "$100" },
  { name: "PSE", price: "$200" },
  { name: "Anal", price: "$400" },
];

export const durationOptions = [
  "30 minutes — $500",
  "1 hour — $800",
  "2 hours — $1,500",
  "Overnight — enquire",
];

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Gallery", href: "#gallery" },
  { label: "Services", href: "#services" },
  { label: "Rates", href: "#rates" },
  { label: "Availability", href: "#availability" },
];

export function scrollToId(id: string) {
  const el = document.querySelector(id);
  el?.scrollIntoView({ behavior: "smooth" });
}

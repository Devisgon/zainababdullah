import data from "@/content/markets.json";
export const markets = data;
export const marketAreas = markets.map((m) => ({
  "@type": "Country",
  name: m.name,
  identifier: m.code,
}));

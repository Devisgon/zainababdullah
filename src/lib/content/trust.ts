import media from "@/content/media.json";
import reviews from "@/content/reviews.json";
import work from "@/content/work.json";
import { site } from "./site";
export type PortraitAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sample?: boolean;
  objectPosition?: string;
};
export type ClientReview = {
  id: string;
  quote: string;
  clientName: string;
  clientRole?: string;
  platform: "Upwork" | "Fiverr" | "Direct";
  rating?: number;
  sourceUrl?: string;
  service?: string;
  date?: string;
};
export type WorkProject = {
  slug: string;
  title: string;
  category: "Paid media" | "Content marketing" | "Business analysis";
  service: string;
  summary: string;
  challenge: string;
  approach: string;
  deliverables: string[];
  outcome?: string;
  image?: PortraitAsset;
  permissionNote?: string;
};
export const portraits: {
  primary: PortraitAsset | null;
  secondary: PortraitAsset | null;
} = media;
export const clientReviews = reviews as ClientReview[];
export const workProjects = work as WorkProject[];
export const socialProfiles = site.socialProfiles as {
  name: "LinkedIn" | "Facebook" | "Instagram" | "X";
  url: string | null;
}[];

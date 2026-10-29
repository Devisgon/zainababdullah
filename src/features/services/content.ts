import data from "@/content/services.json";
export type Service = {
  slug: string;
  name: string;
  number: string;
  short: string;
  title: string;
  description: string;
  tags: string[];
  fit: string;
  seoTitle: string;
  intro: string;
  deliverables: string[][];
  questions: string[][];
};
export const services: Service[] = data;

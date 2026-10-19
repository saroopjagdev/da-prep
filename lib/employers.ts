// Seed list only. Names come from public degree apprenticeship listings and employer pages found while researching.
// Processes change every year: always confirm stages, dates and requirements on the employer's own page.

import type { SectorId } from "@/lib/sectors";

export type Employer = {
  name: string;
  sector: string;
  sectors: SectorId[];
  link?: string;
  note?: string;
};

export const EMPLOYERS: Employer[] = [
  {
    name: "Rolls-Royce",
    sector: "Engineering",
    sectors: ["engineering"],
    link: "https://careers.rolls-royce.com/en/students-and-graduates/united-kingdom/apprenticeships-and-school-leavers",
    note: "Publishes its application process for higher apprenticeships.",
  },
  {
    name: "Arup",
    sector: "Engineering and construction",
    sectors: ["engineering", "construction"],
    link: "https://www.arup.com/careers/early-careers/apprenticeships/",
  },
  {
    name: "Airbus",
    sector: "Engineering and aerospace",
    sectors: ["engineering"],
  },
  {
    name: "Lloyds Banking Group",
    sector: "Banking and finance",
    sectors: ["finance"],
    link: "https://amazingapprenticeships.com/vacancies/employer/lloyds-banking-group/application-tips",
  },
  { name: "BMW Group", sector: "Business and administration", sectors: ["business", "engineering"] },
  { name: "JLR", sector: "Business and engineering", sectors: ["business", "engineering"] },
  { name: "Babcock", sector: "Business and engineering", sectors: ["business", "engineering"] },
  { name: "IBM", sector: "Digital and technology", sectors: ["digital"] },
  { name: "Cisco", sector: "Digital and technology", sectors: ["digital"] },
  { name: "Experian", sector: "Digital and technology", sectors: ["digital"] },
  { name: "AtkinsRéalis", sector: "Engineering", sectors: ["engineering", "construction"] },
  { name: "Severn Trent", sector: "Engineering and utilities", sectors: ["engineering", "construction"] },
  { name: "Kier", sector: "Construction", sectors: ["construction"] },
  { name: "Bellway Homes", sector: "Construction", sectors: ["construction"] },
  { name: "Barratt Redrow", sector: "Construction", sectors: ["construction"] },
  { name: "Metropolitan Police", sector: "Protective services", sectors: ["public"] },
];

export const FIND_APPRENTICESHIP_URL = "https://www.findapprenticeship.service.gov.uk";

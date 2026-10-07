// Employers known to run UK apprenticeship programmes for the 2027 intake, with the programme names they use.
//
// This is a research backlog and a directory, not a source of dates. It lists WHO runs programmes (names are public
// facts, drawn from public listings and employer pages). It deliberately holds no opening or closing dates, stages or
// assessment providers: those are added to lib/opportunities.ts and lib/firms/* only after reading the employer's own
// page, with a source and a check date. Until then an employer shows as "not confirmed".

import type { SectorId } from "@/lib/sectors";

export type Listed = { name: string; sectors: SectorId[]; programmes: string[] };

const S: Record<string, SectorId> = { f: "finance", d: "digital", e: "engineering", c: "construction", p: "public", b: "business" };

// name | sector letters | programme names separated by ;
const RAW = `
S&W|f|School Leaver Programme 2027
Grant Thornton|fd|School Leaver Programme (Autumn 2027); Digital School Leaver Programme (Autumn 2027)
Deloitte|f|2027 BrightStart Higher Apprenticeship
Forvis Mazars|f|School Leaver 2027
Dains Accountants|f|2027 Trainee
HSBC|fd|Degree Apprenticeship Programme 2027
BDO|f|2027 School Leaver Apprenticeship Programme
Goldman Sachs|fd|2027 Apprentice Programme; 2027 Engineering Apprentice Programme
HaysMac|f|School Leaver Apprentice, September 2027
KPMG|f|Apprenticeships - Autumn 2027
WTW|f|2027 Apprenticeship Programme
Saffery|f|School Leaver Trainee - September 2027
MHA|f|Junior Apprenticeship - 2027
Moore Kingston Smith|f|Audit Apprenticeship - 2027
PwC|fd|Flying Start Degree Programme
RSM UK|fd|School Leaver Programme - 2027; Audit Data Analytics School Leaver 2027
Cooper Parry|f|Audit School/College Leaver, 2027
M+A Partners|f|School Leaver Trainee 2027
MUFG|f|2027 Apprenticeship Programme
Mizuho|fd|Investment Banking Operations Apprentice (Level 3); Apprenticeship (Level 4)
J.P. Morgan|fd|Financial Services Professional Apprenticeship; Technology Degree Apprenticeship 2027
Barnett Waddingham|f|Pension Administrator - Apprentice
University Schools Trust|f|Finance Apprentice
Armstrong Watson|f|Trainee Accountant/Tax Adviser
Bank of America|f|Global Payment Solutions Apprentice 2027; Global Markets Apprenticeship 2027
MBDA|ef|Finance Level 4 Higher Apprenticeship 2027
Azets|f|Audit Trainee, September 2027
Balfour Beatty|cf|Finance Apprentice (Level 6)
VWFS|f|Treasury Apprentice
Tradeweb|f|Apprenticeship - EMEA Client Operations
Lloyds Banking Group|fd|Degree Apprenticeship
PKF Francis Clark|f|Trainee & Apprenticeship - School & College Leaver
EY|fd|Apprenticeship Programme 2027; Degree Apprenticeship - September 2027
DPC|f|Tax Apprentice
HW Fisher|f|AAT Apprentice
UBS|f|2027 Apprenticeship Program
BNY Mellon|f|EMEA 2026 Apprenticeship Program
Boeing|ef|Finance Apprenticeship Programme - September 2027
Howden|f|Apprenticeship 2027
Allianz Insurance|f|Apprenticeship Programme 2027
Lockton|f|Insurance Apprentice
Aon|f|Apprenticeship Programme 2027
TrinityBridge|f|Wealth Planning School Leaver Programme
Morgan Stanley|fd|2027 Apprenticeship Program; Graduate Degree Apprenticeships
bp|ef|2026 Apprenticeship Programme
St James's Place|f|Apprenticeship Programme
Accenture|df|Degree Apprenticeship 2027
Frontier Economics|fb|2027 Economic Apprentice Analyst
State Street|f|Corporate Audit Data Analytics Apprentice
Britannia Global Markets|f|Apprentice Metals Broker
Amazon|df|Finance Apprentice; Data Analyst Apprentice
Sky|f|Finance Apprenticeship
Bank of England|f|Degree Apprenticeship; Level 4 Apprenticeships and Degree Apprenticeships
CBRE|cf|2027 Apprenticeship Scheme
Deutsche Bank|fd|Apprenticeship Programme 2027; 2027 TDI Apprenticeship Programme
Man Group|f|Investment Services Apprentice
Menzies|f|AAT Trainee Apprenticeship
Government Economic Service|pf|Degree Level Apprenticeship
Warner Bros. Discovery|f|Finance Apprentice, ITVP
Commerzbank|f|2027 Sponsored Degree Programme
Wilmington Trust|f|GCM Apprentice
E.ON|ef|Degree Apprenticeship
Liberty Mutual|f|School Leaver Programme 2027
Markel|f|Apprenticeship Programme
Visa|fb|Business Management (Chartered Manager) Degree Apprenticeship
Moat Homes|f|Finance Apprentice
Shawbrook|f|Risk Analyst Degree Apprentice; Thrive Apprentice
Capco|f|Graduate Analyst - Investment Banking
Johnston Carmichael|f|Accounting Apprenticeship
Schroders|f|2027 Apprenticeship Programme
BlackRock|f|2027 Apprenticeship Programme
Savills|cf|Apprentice
Standard Chartered|f|Financial Markets Apprenticeship 2027
Interpath Advisory|f|Apprentice Analyst
Zurich Insurance|f|2027 Apprenticeship Programme
RWE|ef|Level 4 Business Analyst Apprenticeship 2027; Engineering Technician Apprenticeship 2027
TUI|f|2027 Finance Apprenticeship Programme
BNP Paribas|f|Apprenticeship Program 2027
M&G|f|2027 Apprentice
London Stock Exchange Group|f|Apprenticeship Business Analyst - Level 4
Legal & General|f|Apprenticeship Programme 2027
Peel Hunt|f|Trainee Trading Programme 2027
Santander|f|Corporate and Commercial Banking Apprenticeship
JLR|ef|Level 7 Finance Apprenticeship
Citi|f|Investment Operations Apprentice | L4 Investment Operations
Blick Rothenberg|f|Accountancy Apprenticeship (AAT) - London, September 2027
Insight Investment|f|Investment Operations Specialist Apprenticeship
Julius Baer|f|Client Service Executive Apprentice
Nationwide|f|L3 Apprenticeship
Aviva Investors|f|Aviva Investors Traineeship Programme 2027
Financial Conduct Authority|fp|Level 4 Apprenticeship
Goodman Jones|f|CFAB School Leaver Accounting Apprenticeship
Fidelity International|f|2027 Apprenticeship Programme
NatWest Markets|fd|Degree Level Apprenticeships; IT Support Apprentice
AVEVA|df|Finance Apprentice - UK
Arbuthnot Latham|f|Apprenticeship 2027 - Commercial Banking Executive
BAE Systems|ef|Advanced/Degree Apprentice Finance
AWE|e|Level 6 Degree Apprenticeships 2027
BMW|ef|Level 3 Accounting Apprenticeship
Babcock International|ef|Finance Apprenticeship
Bloomberg|fd|2027 Bloomberg Apprenticeship
Cushman & Wakefield|cf|Real Estate Apprenticeship Programme - 2027
Evelyn Partners|f|School Leaver Programme
IBM|df|Apprenticeship - 2027 Start
Isio|f|Apprenticeship - 2027 Intake
MFS|f|2027 Apprentice UK
Nomura|f|Apprenticeship Programme
PKF Smith Cooper|f|Audit Associate - Apprenticeship
Rolls-Royce|ef|Finance Professional Degree Apprenticeship
Rothschild & Co.|f|2027 Wealth Management Apprenticeship Programme
SEI|f|Investment Operations Apprentice
StoneX|f|Apprenticeship Programme - Operations
Tesco|f|Finance Apprenticeship
Tokio Marine HCC|f|2027 Apprenticeship Programme
UK Atomic Energy Authority|ef|L2 Finance Apprentice 2027; Engineering Technician Apprenticeship 2027
Barclays|fd|2027 Degree Apprentice Programme; 2027 Technology Apprenticeship Programme
Bishop Fleming|f|School Leaver Trainee Accountant 2027
Neptune North|d|2027 Digital and Technology Solutions Degree Apprenticeship
Dole|d|Apprentice Software Developer
American Express|d|Technology Software Engineering Apprenticeship
Airbus|ed|Computing Engineering Degree Apprenticeship
BBC|d|Data Scientist Apprenticeship - Level 6
BT|d|2027 Apprenticeship
Capgemini|d|Digital and Technology Solutions Degree Apprenticeship 2027
Google|d|Software Development Apprenticeship, Engineering
Laing O'Rourke|cd|Degree Apprenticeships 2027; Professional Apprenticeship Programme 2027
Leonardo|ed|Apprenticeships Programme 2027
Siemens|ed|Degree Apprentice (Level 6)
Unilever|ed|Apprenticeship 2027; Engineering & Manufacturing Apprenticeship 2027
Vodafone|de|Network Engineering Apprentice Programme (Level 6) 2027
Martin-Baker|e|Apprentice Scheme 2027
Fluor|e|Engineering Degree Apprenticeship 2027
INEOS|e|INEOS Modern Apprenticeship 2027
Shell|e|Shell UK Apprenticeship Programme 2027
Ford Motor Company|e|Ford Apprenticeship 2027
McLaren Racing|e|McLaren Apprenticeship 2027
Triumph Motorcycles|e|Triumph Apprenticeship 2027
Amey|ec|Amey Apprenticeship 2027
BAM|c|BAM Apprenticeship 2027
BUUK Infrastructure|ec|BUUK Apprentices Programme 2027
Barratt Developments|c|Barratt Developments Apprenticeship 2027
Buro Happold|ec|Apprenticeship Scheme 2027
Cala Group|c|Degree Apprenticeship 2027
Carter Synergy|e|Refrigeration Engineer Apprentice
Cundall|ec|Apprenticeship Scheme 2027
Hoare Lea|ec|Apprenticeship Scheme 2027
Holcim|ec|Engineering Apprenticeship 2027
JN Bentley|c|JN Bentley Apprenticeship 2027
Mitie|c|Mitie Apprenticeship 2027
Multiplex|c|Degree Apprenticeship Programme 2027
Persimmon Homes|c|Persimmon Aspire 2027
Ridge|c|Elevate Degree Apprenticeship 2027
Robertson Group|c|Graduate and Degree Apprenticeships 2027
STRABAG UK and ZUBLIN|ec|Civil Engineering Degree Apprenticeship 2027
Structa|ec|Trainee Technician Apprenticeship Programme 2027
Tarmac|ec|Apprenticeship Programme 2027
Taylor Wimpey|c|Taylor Wimpey Apprenticeship 2027
Vistry Group|c|Vistry Apprenticeship 2027
National Crime Agency|pd|Civil Service Fast Track Apprentice Scheme (Digital and Technology stream)
PA Consulting Group|db|Digital Software Apprenticeship
TUV SUD|e|TUV SUD Advanced Apprenticeship Training Programme
Binnies|ec|Level 6 Degree Apprenticeship
Cadent Gas|e|Cadent Apprenticeship 2027
Clarke Energy|e|Clarke Energy Apprenticeship 2027
Drax Group|e|Drax Apprenticeship 2027
EDF|e|Engineering Degree Apprenticeship 2027
EQUANS|e|EQUANS Apprenticeship 2027
GE Vernova|e|Engineering Apprentice 2027
SSE|e|Apprentice and Trainee Engineering Programme 2027
ScottishPower|e|Engineering Graduate Apprenticeship 2027
Thames Water|e|Utilities Engineering Technician Apprenticeship 2027
United Utilities|e|Degree Apprenticeship Programme 2027
Yorkshire Water|e|Engineering Apprenticeship 2027
AECOM|ec|ADVANCE Programme 2027
Arup|ec|Degree Apprenticeship Programme
McAdam Design|ec|Work+ Apprenticeship Scheme 2027
SYSTRA|ec|STEM Engineering Apprenticeships 2027
Soil Engineering|ec|British Drilling Association (BDA) Apprenticeship
WSP|ec|Degree Apprenticeship Programme 2027
BSH Home Appliances|e|BSH Engineer Apprenticeship 2027
Bosch|e|Cecil Duckworth Apprenticeship Scheme 2027
Caterpillar|e|Manufacturing Engineering Degree Apprenticeship 2027
Dyson|e|Dyson Institute of Engineering and Technology 2027
JCB|e|JCB Apprenticeship 2027
Procter & Gamble|e|Electronic Engineering Degree Apprenticeship 2027
Rotork|e|Rotork Apprenticeship 2027
Tata Steel|e|Tata Steel Apprenticeship 2027
Science & Technology Facilities Council|ep|Advanced Engineering Apprenticeship 2027
Siemens Healthineers|e|Technical Excellence Engineering Apprenticeship 2027
WMG, University of Warwick|e|Applied Professional Engineering Degree Apprenticeship 2027
`;

export const LISTED: Listed[] = RAW.trim()
  .split("\n")
  .map((line) => {
    const [name, letters, programmes] = line.split("|");
    return {
      name: name.trim(),
      sectors: [...new Set([...letters.trim()].map((c) => S[c]))],
      programmes: programmes.split(";").map((p) => p.trim()).filter(Boolean),
    };
  });

/** Lower-case name without punctuation or filler words, for matching a listed employer to a researched profile. */
export const normName = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\b(uk|ltd|plc|group|global|international|company|the|co)\b/g, "")
    .replace(/\s+/g, "");

/** A web search for the employer's own apprenticeship careers page. We do not guess careers-page links. */
export const vacancySearchUrl = (name: string) => `https://www.google.com/search?q=${encodeURIComponent(`${name} apprenticeships careers 2027`)}`;

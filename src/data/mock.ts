export type ItemType = "lost" | "found";

export type MockItem = {
  id: string;
  reference: string;
  type: ItemType;
  name: string;
  category: string;
  brand?: string;
  colour?: string;
  description: string;
  location: string;
  date: string;
  status: "active" | "matched" | "under_verification" | "recovered";
  reporter: string;
  matchScore?: number;
};

export const categories = [
  "Electronics",
  "ID & Documents",
  "Bags",
  "Keys",
  "Clothing",
  "Books",
  "Accessories",
  "Other",
];

export const locations = [
  "Balme Library",
  "N Block",
  "JQB Lecture Halls",
  "Legon Hall",
  "Commonwealth Hall",
  "Volta Hall",
  "Night Market",
  "Sports Stadium",
  "Business School",
];

export const items: MockItem[] = [
  {
    id: "1",
    reference: "LF-2026-000118",
    type: "found",
    name: "Black Student ID Card",
    category: "ID & Documents",
    colour: "Black",
    description:
      "Found a University of Ghana student ID card on a reading desk. Held safely pending verification.",
    location: "Balme Library",
    date: "2026-08-15",
    status: "active",
    reporter: "Verified University User",
    matchScore: 92,
  },
  {
    id: "2",
    reference: "LF-2026-000117",
    type: "lost",
    name: "HP Laptop Charger",
    category: "Electronics",
    brand: "HP",
    colour: "Black",
    description:
      "Left my laptop charger in a lecture hall after an afternoon class. Cable has a small band around it.",
    location: "JQB Lecture Halls",
    date: "2026-08-14",
    status: "matched",
    reporter: "Ama D.",
    matchScore: 78,
  },
  {
    id: "3",
    reference: "LF-2026-000116",
    type: "found",
    name: "Blue Backpack",
    category: "Bags",
    colour: "Blue",
    description: "Blue backpack found near the shuttle stop. Contents recorded privately.",
    location: "Night Market",
    date: "2026-08-13",
    status: "under_verification",
    reporter: "Verified University User",
  },
  {
    id: "4",
    reference: "LF-2026-000115",
    type: "lost",
    name: "Silver Wristwatch",
    category: "Accessories",
    colour: "Silver",
    description: "Lost during a football match at the stadium. Has a distinctive strap.",
    location: "Sports Stadium",
    date: "2026-08-11",
    status: "active",
    reporter: "Kofi A.",
  },
  {
    id: "5",
    reference: "LF-2026-000114",
    type: "found",
    name: "Bunch of Keys",
    category: "Keys",
    description: "Three keys on a ring with a small tag, found in a hall corridor.",
    location: "Legon Hall",
    date: "2026-08-10",
    status: "recovered",
    reporter: "Verified University User",
  },
  {
    id: "6",
    reference: "LF-2026-000113",
    type: "lost",
    name: "Samsung Galaxy A34",
    category: "Electronics",
    brand: "Samsung",
    colour: "Graphite",
    description: "Phone misplaced between the library and N Block. Screen has a protector.",
    location: "N Block",
    date: "2026-08-09",
    status: "active",
    reporter: "Nana Y.",
    matchScore: 64,
  },
];

export const statusLabels: Record<MockItem["status"], string> = {
  active: "Active",
  matched: "Potential match",
  under_verification: "Under verification",
  recovered: "Recovered",
};

export const stats = [
  { label: "Items reported", value: "1,284" },
  { label: "Successfully returned", value: "913" },
  { label: "Active listings", value: "146" },
  { label: "Return rate", value: "71%" },
];

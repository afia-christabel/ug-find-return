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

export type VerificationQuestion = {
  id: string;
  question: string;
};

export const verificationQuestions: VerificationQuestion[] = [
  { id: "q1", question: "Describe any unique mark, sticker or damage on the item." },
  { id: "q2", question: "What colour is the item and are there any secondary colours?" },
  { id: "q3", question: "List anything that was inside or attached to the item." },
  { id: "q4", question: "If applicable, give the serial number or IMEI (or the last 4 digits)." },
];

export type ClaimRecord = {
  id: string;
  reference: string;
  itemName: string;
  submitted: string;
  status: "under_review" | "verification_pending" | "approved" | "rejected";
  handoverCode?: string;
};

export const myClaims: ClaimRecord[] = [
  {
    id: "c1",
    reference: "CLM-2026-000042",
    itemName: "Black Student ID Card",
    submitted: "2026-08-16",
    status: "approved",
    handoverCode: "UG-LF-48213",
  },
  {
    id: "c2",
    reference: "CLM-2026-000039",
    itemName: "Blue Backpack",
    submitted: "2026-08-14",
    status: "under_review",
  },
];

export const claimStatusLabels: Record<ClaimRecord["status"], string> = {
  under_review: "Under review",
  verification_pending: "Awaiting your answers",
  approved: "Approved — collect item",
  rejected: "Not approved",
};

export type NotificationRecord = {
  id: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  kind: "match" | "claim" | "handover" | "admin";
};

export const notifications: NotificationRecord[] = [
  {
    id: "n1",
    kind: "match",
    title: "Possible match found (92%)",
    body: "A found Student ID Card at Balme Library closely matches your lost report.",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: "n2",
    kind: "claim",
    title: "Claim CLM-2026-000042 approved",
    body: "Collect your item at the Balme Library help desk with code UG-LF-48213.",
    time: "Yesterday",
    unread: true,
  },
  {
    id: "n3",
    kind: "handover",
    title: "Handover scheduled",
    body: "Your handover is scheduled for Thursday, 10:00 at the Student Affairs office.",
    time: "2 days ago",
    unread: false,
  },
  {
    id: "n4",
    kind: "admin",
    title: "Report received",
    body: "Thanks for flagging a suspicious claim — a moderator is reviewing it.",
    time: "4 days ago",
    unread: false,
  },
];

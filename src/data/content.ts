export interface BenefitItem {
  id: string;
  iconName: "Truck" | "PackageCheck" | "ShieldCheck" | "Headphones";
  title: string;
  description: string;
}

export const benefitsData: BenefitItem[] = [
  {
    id: "free-shipping",
    iconName: "Truck",
    title: "FREE SHIPPING",
    description: "On orders above PKR 5,000",
  },
  {
    id: "easy-returns",
    iconName: "PackageCheck",
    title: "EASY RETURNS",
    description: "Hassle-free shopping",
  },
  {
    id: "secure-payments",
    iconName: "ShieldCheck",
    title: "SECURE PAYMENTS",
    description: "Your data is always safe",
  },
  {
    id: "customer-support",
    iconName: "Headphones",
    title: "CUSTOMER SUPPORT",
    description: "We're here to help",
  },
];

export interface InstagramPost {
  id: string;
  image: string;
  likes: string;
  comments: string;
  alt: string;
}

export const instagramData: InstagramPost[] = [
  {
    id: "ig-1",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
    likes: "2.4k",
    comments: "84",
    alt: "AOUJ signature raw silk tunic in warm ivory",
  },
  {
    id: "ig-2",
    image: "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=80&w=600&auto=format&fit=crop",
    likes: "3.1k",
    comments: "112",
    alt: "Little smiles in our Girls Festive Pret",
  },
  {
    id: "ig-3",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop",
    likes: "1.8k",
    comments: "56",
    alt: "Intricate gold threadwork on organic woven lawn",
  },
  {
    id: "ig-4",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
    likes: "2.9k",
    comments: "98",
    alt: "Quiet afternoon reflections in The Everyday Edit",
  },
  {
    id: "ig-5",
    image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=600&auto=format&fit=crop",
    likes: "4.2k",
    comments: "145",
    alt: "Charming florals for children from AOUJ Junior",
  },
  {
    id: "ig-6",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=600&auto=format&fit=crop",
    likes: "2.1k",
    comments: "72",
    alt: "The Atelier edit: Pure linens and embroidered coordinates",
  },
];

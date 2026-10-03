export interface NavSubItem {
  name: string;
  href: string;
  badge?: string;
}

export interface NavColumn {
  title: string;
  items: NavSubItem[];
}

export interface NavFeatured {
  title: string;
  subtitle: string;
  image: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
  megaMenu?: {
    columns: NavColumn[];
    featured?: NavFeatured;
  };
}

export const navigationData: NavItem[] = [
  {
    label: "Women",
    href: "#women",
    hasDropdown: true,
    megaMenu: {
      columns: [
        {
          title: "Apparel",
          items: [
            { name: "New Arrivals", href: "#new-arrivals", badge: "NEW" },
            { name: "Embroidered Pret", href: "#" },
            { name: "Co-Ord Sets", href: "#" },
            { name: "2 & 3 Piece Suits", href: "#" },
            { name: "Kurti & Tunics", href: "#" },
            { name: "Luxury Lawn", href: "#" },
            { name: "Formal & Festive", href: "#" },
          ],
        },
        {
          title: "Silhouettes",
          items: [
            { name: "Straight Cut", href: "#" },
            { name: "Flared Anarkalis", href: "#" },
            { name: "Contemporary Wraps", href: "#" },
            { name: "Culottes & Trousers", href: "#" },
            { name: "Dupattas & Shawls", href: "#" },
          ],
        },
      ],
      featured: {
        title: "The Festive Edit",
        subtitle: "Hand-embroidered silks and festive organza",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
        href: "#the-everyday-edit",
      },
    },
  },
  {
    label: "Kids",
    href: "#kids",
    hasDropdown: true,
    megaMenu: {
      columns: [
        {
          title: "Girls Collection",
          items: [
            { name: "New Arrivals", href: "#", badge: "NEW" },
            { name: "Floral Frocks", href: "#" },
            { name: "Festive Ghararas", href: "#" },
            { name: "2 Piece Pret Sets", href: "#" },
            { name: "Comfort Cotton Kurtis", href: "#" },
          ],
        },
        {
          title: "Boys Collection",
          items: [
            { name: "Kurta Pajama Sets", href: "#" },
            { name: "Embroidered Waistcoats", href: "#" },
            { name: "Casual Linen Tunics", href: "#" },
            { name: "Festive Occasion Wear", href: "#" },
          ],
        },
      ],
      featured: {
        title: "Little Petals Collection",
        subtitle: "Gentle fabrics for cherished memories",
        image: "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=80&w=800&auto=format&fit=crop",
        href: "#kids-collection",
      },
    },
  },
  {
    label: "New In",
    href: "#new-arrivals",
    hasDropdown: false,
  },
  {
    label: "Collections",
    href: "#collections",
    hasDropdown: true,
    megaMenu: {
      columns: [
        {
          title: "Signature Edits",
          items: [
            { name: "The Everyday Edit", href: "#the-everyday-edit" },
            { name: "Earthy Neutrals 2026", href: "#" },
            { name: "Heritage Chikankari", href: "#" },
            { name: "Artisanal Silk Archive", href: "#" },
          ],
        },
        {
          title: "Occasions",
          items: [
            { name: "Weekend Brunch Pret", href: "#" },
            { name: "Evening Soiree", href: "#" },
            { name: "Intimate Weddings", href: "#" },
            { name: "Resort & Travel", href: "#" },
          ],
        },
      ],
      featured: {
        title: "The Everyday Edit",
        subtitle: "Effortless silhouettes for every moment",
        image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
        href: "#the-everyday-edit",
      },
    },
  },
  {
    label: "Sale",
    href: "#sale",
    hasDropdown: false,
  },
];

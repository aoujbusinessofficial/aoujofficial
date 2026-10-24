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
    href: "/products?category=women",
    hasDropdown: true,
    megaMenu: {
      columns: [
        {
          title: "Apparel",
          items: [
            { name: "All Women's", href: "/products?category=women" },
            { name: "Embroidered Pret", href: "/products?category=women" },
            { name: "Luxury Lawn Suits", href: "/products?category=women" },
            { name: "2 & 3 Piece Suits", href: "/products?category=women" },
            { name: "Co-Ord Sets", href: "/products?category=women" },
            { name: "Kurtis & Tunics", href: "/products?category=women" },
          ],
        },
        {
          title: "Silhouettes & Fit",
          items: [
            { name: "Standard Sizes (XS - XL)", href: "/products?category=women" },
            { name: "Custom Tailored Fit", href: "/products?category=women" },
            { name: "Dupattas & Shawls", href: "/products?category=women" },
            { name: "Trousers & Culottes", href: "/products?category=women" },
          ],
        },
      ],
      featured: {
        title: "The Festive Edit",
        subtitle: "Hand-embroidered silks and festive organza",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
        href: "/products?category=women",
      },
    },
  },
  {
    label: "Girls",
    href: "/products?category=girls",
    hasDropdown: true,
    megaMenu: {
      columns: [
        {
          title: "Shop By Age",
          items: [
            { name: "1 - 2 Years", href: "/products?category=girls" },
            { name: "2 - 3 Years", href: "/products?category=girls" },
            { name: "3 - 4 Years", href: "/products?category=girls" },
            { name: "4 - 5 Years", href: "/products?category=girls" },
            { name: "6 - 10 Years", href: "/products?category=girls" },
            { name: "Custom Made For Kids", href: "/products?category=girls" },
          ],
        },
        {
          title: "Silhouettes",
          items: [
            { name: "Floral Frocks", href: "/products?category=girls" },
            { name: "Festive Ghararas", href: "/products?category=girls" },
            { name: "2 Piece Pret Sets", href: "/products?category=girls" },
            { name: "Pure Cotton Kurtis", href: "/products?category=girls" },
          ],
        },
      ],
      featured: {
        title: "Little Petals Collection",
        subtitle: "Gentle breathable fabrics for cherished memories",
        image: "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=80&w=800&auto=format&fit=crop",
        href: "/products?category=girls",
      },
    },
  },
  {
    label: "Family",
    href: "/products?category=family",
    hasDropdown: true,
    megaMenu: {
      columns: [
        {
          title: "Matching Edits",
          items: [
            { name: "Mother & Daughter Matching", href: "/products?category=family" },
            { name: "Family Festive Coordinates", href: "/products?category=family" },
            { name: "Sibling Matching Sets", href: "/products?category=family" },
            { name: "Custom Family Ensembles", href: "/products?category=family" },
          ],
        },
        {
          title: "Occasions",
          items: [
            { name: "Eid Family Celebrations", href: "/products?category=family" },
            { name: "Intimate Weddings", href: "/products?category=family" },
            { name: "Portrait & Keepsake Wear", href: "/products?category=family" },
          ],
        },
      ],
      featured: {
        title: "Family Heirloom Edit",
        subtitle: "Celebrate togetherness in matching luxury",
        image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800&auto=format&fit=crop",
        href: "/products?category=family",
      },
    },
  },
  {
    label: "Collections",
    href: "/products",
    hasDropdown: true,
    megaMenu: {
      columns: [
        {
          title: "Signature Edits",
          items: [
            { name: "View All Products", href: "/products" },
            { name: "The Everyday Edit", href: "/products" },
            { name: "Earthy Neutrals 2026", href: "/products" },
            { name: "Heritage Chikankari", href: "/products" },
          ],
        },
        {
          title: "By Season",
          items: [
            { name: "Spring / Summer Pret", href: "/products" },
            { name: "Luxury Festive Organza", href: "/products" },
            { name: "Artisanal Lawn Edition", href: "/products" },
          ],
        },
      ],
      featured: {
        title: "The Everyday Edit",
        subtitle: "Effortless silhouettes for every moment",
        image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
        href: "/products",
      },
    },
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

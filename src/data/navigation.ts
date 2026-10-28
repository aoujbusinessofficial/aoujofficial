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
  },
  {
    label: "Girls",
    href: "/products?category=girls",
  },
  {
    label: "Family",
    href: "/products?category=family",
  },
  {
    label: "Collections",
    href: "/products",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

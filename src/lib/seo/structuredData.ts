export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "@id": "https://www.aoujofficial.com/#organization",
    name: "AOUJ Atelier",
    legalName: "AOUJ Haute Couture & Heirloom Atelier",
    url: "https://www.aoujofficial.com",
    logo: "https://www.aoujofficial.com/images/aouj-logo-gold.svg",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200",
    description:
      "AOUJ Atelier is a Pakistani luxury fashion house offering handcrafted embroidered pret, artisanal lawn suits, festive formal wear, and coordinated mother-daughter heirloom edits.",
    telephone: "+92-342-6300002",
    email: "aoujbusinessofficial@gmail.com",
    priceRange: "PKR 3,500 - PKR 45,000",
    currenciesAccepted: "PKR",
    paymentAccepted: "Cash, Cash on Delivery, Bank Transfer",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Atelier Headquarters",
      addressLocality: "Gujrat",
      addressRegion: "Punjab",
      addressCountry: "PK",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "32.5731",
      longitude: "74.0750",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "10:00",
        closes: "19:00",
      },
    ],
    sameAs: [
      "https://www.instagram.com/aoujofficial/",
      "https://www.facebook.com/profile.php?id=61595821802707",
      "https://www.tiktok.com/@aoujofficial",
    ],
  };
}

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.aoujofficial.com/#website",
    url: "https://www.aoujofficial.com",
    name: "AOUJ Official",
    alternateName: ["AOUJ", "Aouj Official", "AOUJ Atelier"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://www.aoujofficial.com/products?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function getProductSchema(product: {
  id: string;
  name: string;
  description?: string;
  fabric?: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description:
      product.description ||
      `Artisanal Pakistani handcrafted luxury ${product.name} tailored from ${product.fabric || "pure fabric"}. Available with nationwide delivery from AOUJ Atelier.`,
    sku: `AOUJ-${product.id.slice(0, 8)}`,
    brand: {
      "@type": "Brand",
      name: "AOUJ",
    },
    category: `Clothing > Women's Clothing > Pakistani Ethnic Wear > ${product.category}`,
    offers: {
      "@type": "Offer",
      url: `https://www.aoujofficial.com/products/${product.id}`,
      priceCurrency: "PKR",
      price: product.price,
      priceValidUntil: "2027-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "AOUJ Atelier",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: 350,
          currency: "PKR",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "PK",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 15,
            maxValue: 25,
            unitCode: "d",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 2,
            maxValue: 5,
            unitCode: "d",
          },
        },
      },
    },
  };
}

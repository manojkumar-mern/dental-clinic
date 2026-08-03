import { SITE_CONFIG } from "@/constants";

export function constructMetadata({
  title,
  description = SITE_CONFIG.description,
  ogImage = SITE_CONFIG.ogImage,
  noIndex = false,
} = {}) {
  const fullTitle = title 
    ? `${title} | ${SITE_CONFIG.name}`
    : SITE_CONFIG.name;

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${SITE_CONFIG.name} Preview`,
        },
      ],
      type: "website",
      siteName: SITE_CONFIG.name,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
      creator: SITE_CONFIG.twitterHandle,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
    metadataBase: new URL(SITE_CONFIG.url),
  };
}

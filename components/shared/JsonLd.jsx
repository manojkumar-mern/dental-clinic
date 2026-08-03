import React from "react";

export function JsonLd({ schema }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Pre-defined builder for Medical/Dental Clinic Business Schema
export function constructClinicSchema(options) {
  return {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "name": options.name,
    "description": options.description,
    "url": options.url,
    "telephone": options.telephone,
    "email": options.email,
    "logo": options.logo,
    "image": options.logo,
    "address": {
      "@type": "PostalAddress",
      ...options.address,
    },
    ...(options.geo && {
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": options.geo.latitude,
        "longitude": options.geo.longitude,
      },
    }),
    ...(options.openingHours && {
      "openingHoursSpecification": options.openingHours.map((hoursStr) => {
        const parts = hoursStr.split(" ");
        const days = parts[0].split("-");
        const times = parts[1].split("-");
        return {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": days.map((d) => {
            const map = {
              Mo: "Monday",
              Tu: "Tuesday",
              We: "Wednesday",
              Th: "Thursday",
              Fr: "Friday",
              Sa: "Saturday",
              Su: "Sunday",
            };
            return map[d] || d;
          }),
          "opens": times[0],
          "closes": times[1],
        };
      }),
    }),
  };
}

import Script from 'next/script';

const WaterlandsWaterbodiesScript = () => {
  return (
    <Script
      id="schema-script"
      type="application/ld+json"
      strategy="lazyOnload"
      dangerouslySetInnerHTML={{
        __html: `
        {
          "@context": "https://schema.org/",
          "@type": "Dataset",
          "name": "Wetlands",
          "description": "This dataset estimates large-scale wetland distributions and important wetland complexes, including areas of marsh, fen, peatland, and water.",
          "url": "https://resourcewatch.org/data/explore/Wetlands-and-Waterbodies",
          "alternateName": "Global Lakes and Wetlands Database: Lakes and Wetlands Grid (Level 3)",
          "creator": {
            "@type": "Organization",
            "name": "McGill University (McGill) and World Wildlife Fund (WWF)"
          },
          "citation": "Lehner, B. and Döll, P. 2004. Development and validation of a global database of lakes, reservoirs and wetlands. Journal of Hydrology 296/1-4: 1-22. Accessed through Resource Watch, (date). www.resourcewatch.org.",
          "keywords": "Rivers, Land Cover, Wetlands, Ecosystems, Habitats, Surface Water, Land Use, SDG",
          "license": "http://www.wwfus.org/science/data.cfm",
          "spatialCoverage": "Global",
          "isAccessibleForFree": true,
          "temporalCoverage": "2004"
        }
    `,
      }}
    />
  );
};

export default WaterlandsWaterbodiesScript;

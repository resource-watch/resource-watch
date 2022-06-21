import Script from 'next/script';

const TreesInMosaicLandscapesScript = () => {
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
          "name": "Trees in Mosaic Landscapes",
          "description": "The trees in mosaic landscapes (TML) data maps tree extent at the ten-meter scale and enables accurate monitoring of trees in urban areas, agricultural lands, and in open canopy and dry forest ecosystems. The data extent covers 1.4 billion hectares of mosaic landscapes in Latin America and Africa.",
          "url": "https://resourcewatch.org/data/explore/Trees-in-Mosaic-Landscapes",
          "alternateName": "Trees in Mosaic Landscapes",
          "creator": {
            "@type": "Organization",
            "name": "World Resources Institute (WRI)",
            "url": "https://www.wri.org/"
          },
          "citation": "Brandt, J. & Ertel., J. 2021. The extent of trees in mosaic landscapes. Working Paper",
          "keywords": "Forest Cover, Forest Loss, Deforestation, SDG, Climate Change, Biodiversity, Land Use",
          "license": "https://creativecommons.org/licenses/by/4.0/",
          "isAccessibleForFree": true,
          "temporalCoverage": "2020",
          "spatialCoverage": "The current processing extent covers 1.4 billion hectares across Latin America and Africa."
        }
    `,
      }}
    />
  );
};

export default TreesInMosaicLandscapesScript;

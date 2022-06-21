import Script from 'next/script';

const MaterialExtractionTradeUseScript = () => {
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
          "name": "Global Material Flows",
          "description": "The Global Material Flows Database holds a variety of datasets on material extraction and consumption. The dataset displayed on Resource Watch shows global material consumption and extraction of nonmetallic minerals, biomass, fossil fuels, and metal ores on a national scale.
          "url": "https://resourcewatch.org/data/explore/Material-Extraction-Trade-and-Use",
          "alternateName": "Global Material Flows Database",
          "creator": {
            "@type": "Organization",
            "name": "United Nations Environment Programme International Resource Panel (UNEP IRP)"
          },
          "citation": "UN Environment. 2018. Global Material Flows Database. Accessed through Resource Watch, (date). www.resourcewatch.org.",
          "keywords": "Fuel, Material footprint, Energy, Commercial Activity, Material flow, Minerals, Fossil Fuel, Fuel, Commodity",
          "license": "https://www.resourcepanel.org/global-material-flows-database",
          "spatialCoverage": "Global",
          "isAccessibleForFree": true,
          "temporalCoverage": "1970-2017"
        }
    `,
      }}
    />
  );
};

export default MaterialExtractionTradeUseScript;

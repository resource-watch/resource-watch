import Script from 'next/script';

const PopulationExposedUnhealthyLevelsPMScript = () => {
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
          "name": "Air Quality: Population Exposed to Unhealthy Levels of Fine Particulate Matter (PM2.5)",
          "description": "The Population Exposed to Unhealthy Levels of Fine Particulate Matter (PM2.5) dataset shows the percentage of a country's population living in places with unhealthy levels of PM2.5 in the air.",
          "url": "https://resourcewatch.org/data/explore/Population-Exposed-to-Unhealthy-Levels-of-PM-25",
          "alternateName": "PM2.5 air pollution, population exposed to levels exceeding WHO guideline value (% of total)",
          "creator": {
            "@type": "Organization",
            "name": "World Bank, Group Global Burden of Disease, United Nations World Health Organization (WHO)"
          },
          "citation": "Brauer, M. et al., for the Global Burden of Disease Study. PM2.5 Air Pollution, Population Exposed to Levels Exceeding WHO Guideline Value (% of Total). Accessed through Resource Watch, (date). www.resourcewatch.org.",
          "keywords": "Health, SDG, Pollution, Emissions, Air Quality, Sustainable cities",
          "license": "http://data.worldbank.org/summary-terms-of-use",
          "spatialCoverage": "Global",
          "temporalCoverage": "1990-present",
          "isAccessibleForFree": true,
          "variableMeasured": "Percentage of a country's population who live in areas with unhealthy air"
        }
    `,
      }}
    />
  );
};

export default PopulationExposedUnhealthyLevelsPMScript;

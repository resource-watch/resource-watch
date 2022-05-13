import Script from 'next/script';

const GiniIndexScript = () => {
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
          "name": "Gini Index",
          "description": "The Gini index measures economic inequality in a country. Specifically, it is the extent to which the distribution of income (or, in some cases, consumption expenditure) deviates from a perfectly equal distribution among individuals or households within an economy. ",
          "url": "https://resourcewatch.org/data/explore/GINI-Index",
          "alternateName": "Gini index (World Bank estimate)",
          "creator": {
            "@type": "Organization",
            "name": "World Bank Group",
            "url": "https://www.worldbank.org/"
          },
          "citation": "World Bank Group. \"World Development Indicators: Gini Index.\" Retrieved from http://data.worldbank.org/indicator/SI.POV.GINI. Accessed through Resource Watch, (date). www.resourcewatch.org.",
          "keywords": "Inequality, Economic, Gini Coefficient, Income Distribution",
          "license": "https://creativecommons.org/licenses/by/4.0/",
          "isAccessibleForFree": true,
          "temporalCoverage": "1967-present",
          "spatialCoverage": "Global"
        }
    `,
      }}
    />
  );
};

export default GiniIndexScript;

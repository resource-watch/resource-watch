import Script from 'next/script';

const GriddedInfantMortalityScript = () => {
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
          "name": "Subnational Infant Mortality",
          "description": "This dataset includes estimated infant mortality rates (IMR) for 234 countries and territories at a spatial resolution of 30 arc-seconds (about one kilometer at the equator) for the year 2015.",
          "url": "https://resourcewatch.org/data/explore/soc-003-2015-Gridded-Infant-Mortality",
          "alternateName": "Global Sub-national Gridded IMR 2015",
          "creator": {
            "@type": "Organization",
            "name": "Center for International Earth Science Information Network (CIESIN) and National Aeronautics and Space Administration Socioeconomic Data and Applications Center (NASA SEDAC)"
          },
          "citation": "Center for International Earth Science Information Network (CIESIN), Columbia University. 2018. Global Subnational Infant Mortality Rates, Version 2. Palisades, NY: NASA Socioeconomic Data and Applications Center (SEDAC). https://doi.org/10.7927/H4PN93JJ. Accessed 2 January 2020.  Center for International Earth Science Information Network (CIESIN), Columbia University. 2018. Documentation for the Global Subnational Infant Mortality Rates, Version 2. Palisades, NY: NASA Socioeconomic Data and Applications Center (SEDAC). https://doi.org/10.7927/H44J0C25. Accessed 2 January 2020.",
          "keywords": "Health, Mortality, SDG, Poverty, Economic, Society",
          "license": "https://creativecommons.org/licenses/by/4.0/",
          "spatialCoverage": "Global",
          "temporalCoverage": "2015",
          "isAccessibleForFree": true,
          "variableMeasured": "number of children who die before their first birthday for every 1,000 live births"
        }
    `,
      }}
    />
  );
};

export default GriddedInfantMortalityScript;

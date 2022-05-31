import Script from 'next/script';

const GenderGapIndexScript = () => {
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
          "name": "Gender Gap Index",
          "description": "The Gender Gap Index quantifies the gaps between women and men in four key areas: health, education, economy, and politics. Data is available from 149 countries for select years between 2010-2021. Scores are based on the level of access women have to resources and opportunities relative to men.",
          "url": "https://resourcewatch.org/data/explore/Gender-Gap-Index-2",
          "alternateName": "Global Gender Gap 2021",
          "creator": {
            "@type": "Organization",
            "name": "World Economic Forum (WEF)",
            "url": "https://www.weforum.org/"
          },
          "citation": "World Economic Forum. 2021. The Global Gender Gap Report 2021. https://www.weforum.org/reports/global-gender-gap-report-2021. Accessed through Resource Watch, (date). www.resourcewatch.org.",
          "keywords": "Society, Inequality, Gender Index, Development",
          "license": "https://www.weforum.org/about/terms-of-use",
          "version": "2021 Gender Gap Index",
          "isAccessibleForFree": true,
          "temporalCoverage": "2010, 2015, 2016, 2017, 2018, 2020, 2021",
          "spatialCoverage": "Global"
        }
    `,
      }}
    />
  );
};

export default GenderGapIndexScript;

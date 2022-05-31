import Script from 'next/script';

const GenderInequalityIndexScript = () => {
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
          "name": "Gender Inequality Index",
          "description": "The Gender Inequality Index (GII), released by the UN Development Programme (UNDP), is an inequality index for 159 countries from 1995 to 2015.",
          "url": "https://resourcewatch.org/data/explore/soc025-Gender-Inequality-Index",
          "alternateName": "Gender Inequality Index (GII)",
          "creator": {
            "@type": "Organization",
            "name": "United Nations Development Programme (UNDP)",
            "url": "http://hdr.undp.org/"
          },
          "citation": "United Nations Development Programme. 2015. \"Gender Inequality Index.\" The Human Development Report. Retrieved from http://hdr.undp.org/en/content/gender-inequality-index-gii. Accessed through Resource Watch, (date). www.resourcewatch.org.",
          "keywords": "Society, Inequality, Gender Index, Development",
          "license": "http://hdr.undp.org/en/content/copyright-and-terms-use",
          "isAccessibleForFree": true,
          "temporalCoverage": "1995 - 2015",
          "spatialCoverage": "Global"
        }
    `,
      }}
    />
  );
};

export default GenderInequalityIndexScript;

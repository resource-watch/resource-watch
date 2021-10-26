import {
  useSelector,
} from 'react-redux';
import PropTypes from 'prop-types';

// components
import ChartWidget from 'components/widgets/types/chart';
import MapWidget from 'components/widgets/types/map';

// utils
import {
  getRWAdapter,
} from 'utils/widget-editor';

/* eslint-disable max-len */
const ConditionSection = ({ onShareWidget }) => {
  const RWAdapter = useSelector((state) => getRWAdapter(state));

  return (
    <div id="coral-reef-condition" className="section">
      <div className="subsection">
        <h1><strong>Coral Reef Condition</strong></h1>
        <div className="row">
          <div className="column small-12 medium-6">
            <p>
              <span>Estimates of the extent of damage to the world’s coral reefs vary, but most present a grim outlook for these magnificent ecosystems. Globally, it is likely that </span>
              <a href="https://www.cell.com/one-earth/fulltext/S2590-3322(21)00474-7#%20" rel="noopener noreferrer" target="_blank"><strong>over half of the world’s reefs have already been severely damaged or lost</strong></a>
              <strong> because of climate change, pollution, and human activities.</strong>
              <span> Hard coral cover has declined significantly in some regions, and there has been a shift toward coral species less able to support diverse coral reef habitats.</span>
            </p>
            <p>
              <span>A recent study by the </span>
              <a href="https://gcrmn.net" rel="noopener noreferrer" target="_blank">Global Coral Reef Monitoring Network (GCRMN</a>
              <span>)</span>
              <span> </span>
              <span>takes a detailed look at change in live hard coral cover and algal cover over time.</span>
              <span> </span>
              <a href="https://gcrmn.net/2020-report/" rel="noopener noreferrer" target="_blank"><em>Status of Coral Reefs of the World: 2020</em></a>
              <span> is based on data collected by more than 300 scientists over the past 40 years, from nearly 35,000</span>
              <span> coral reef surveys at over 12,000 sites, though for many sites data are only available for a single year.&nbsp;The report finds that large-scale coral bleaching events caused by ocean warming are the greatest disturbance to the world’s coral reefs, but also identifies examples of coral recovery between disturbances. It recommends reducing local pressures on reefs in order to maintain their resilience, while global threats posed by climate change are addressed. (Results are available for ten regions within </span>
              <a href="https://gcrmn.net/2020-report/" rel="noopener noreferrer" target="_blank">the report</a>
              <span>.)</span>
              {' '}
              <span>The figures below reflect global trends for live, hard coral cover and algal cover. </span>
            </p>
          </div>
          <div className="image-container column small-12 medium-6">
            <div>
              <img src="https://s3.amazonaws.com/wri-api-backups/resourcewatch/staging/temporary_content_images/images/000/000/365/original/dano_pendygrasse_roatan_cordeliabanks_crop.jpg?1611604063&amp;temp_id=365" alt="dano-pendygrasse" />
            </div>
            <div className="image-caption">
              <em>
                Photo: Daniel Stephen Pendygrasse
              </em>
            </div>
          </div>
        </div>
      </div>
      <div className="subsection row">
        <div className="column small-12 medium-6">
          <h2><strong>Live Hard Coral Cover</strong></h2>
          <p><span>Prior to 1998, the global average cover of live hard coral was high (&gt;30% of area) and stable, although the sparsity of data prior to 1998 increases uncertainty around this estimate. The first mass coral bleaching event in 1998 killed approximately 8% of the world’s coral. Between 2002 and 2009, the average global cover of hard coral recovered to pre-1998 levels, but between 2009 and 2018, there was a progressive loss amounting to 14% of the coral from the world’s reefs. This decline was primarily due to recurring large-scale coral bleaching events, with a frequency that prevented coral cover from recovering in many areas. While the influences of smaller scale disturbances and threats, such as coral disease, crown-of-thorns starfish outbreaks, tropical storms, overfishing, sediment, and pollution have undoubtedly played a role in the decline of coral reefs, their specific contributions were not assessed. </span></p>
        </div>
        <div className="column small-12 medium-6">
          <h2><strong>Algal Cover</strong></h2>
          <p><span>Prior to 2010, the global estimated average cover of algae was low (approximately 16% of area) and relatively stable. Since 2010, algae cover has increased by about 20%, mirroring the decrease in hard coral cover. Prior to 1998, there was, on average, over twice as much coral on the world’s reefs as algae, but that ratio has decreased to closer to 1.5. Transition from coral to algae dominance in a reef community reduces the complex 3-dimensional habitat that is essential to support high biodiversity and important ecosystem services—fisheries habitat and the rugged coral structure which is critical to reducing wave energy and protecting shorelines.&nbsp;</span></p>
        </div>
      </div>
      <div className="subsection row">
        <div className="column small-12 medium-6">
          <ChartWidget
            widgetId="f231410c-8836-4734-96e4-0a878a975765"
            adapter={RWAdapter}
            onToggleShare={onShareWidget}
          />
        </div>
        <div className="column small-12 medium-6">
          <ChartWidget
            widgetId="3297d38c-15f6-464d-abb6-a5b58c68606a"
            adapter={RWAdapter}
            onToggleShare={onShareWidget}
          />
        </div>
      </div>
      <div className="subsection">
        <p className="caption"><em>Modeled cover of live hard coral (left) and algae (right) for the world. The solid line represents the predicted marginal mean while the ribbons represent 80% (lighter shade) and 95% (darker shade) confidence intervals.</em></p>
      </div>
      <div className="subsection">
        <h2><strong>Outlook</strong></h2>
        <p>
          <span>Coral reefs are likely to continue to decline due to the combined pressures of warming and acidifying seas, coupled with the more local pressures of overfishing, destructive fishing, direct physical damage, sedimentation, pollution, and disease. Even if the most ambitious global temperature target of the Paris Agreement is met (limiting warming to 1.5°C), </span>
          <a href="https://www.ipcc.ch/sr15/" rel="noopener noreferrer" target="_blank">reefs are projected to decline by 70-90%</a>
          <span>. But coral reefs have proven to be resilient and can recover if conditions permit. While the world works to limit global warming, it is critical that local pressures be limited – to increase resilience and the prospect of coral recovery.&nbsp;</span>
        </p>
      </div>
      <div className="subsection row">
        <div className="image-container column small-12 medium-6">
          <div>
            <img src="https://s3.amazonaws.com/wri-api-backups/resourcewatch/staging/temporary_content_images/images/000/000/379/original/Richard_ling_coral_garden.jpg?1611946008&amp;temp_id=379" alt="Richard_ling_coral garden.jpg" />
          </div>
          <div className="image-caption">
            <em>
              A Blue Sea Star (Linckia laevigata) resting on hard Acropora coral at Lighthouse, Ribbon Reefs, Great Barrier Reef
            </em>
            <br />
            <em>
              Photo: Richard Ling
            </em>
          </div>
        </div>
        <div className="column small-12 medium-6">
          <h2><strong>Select Global and Regional Reports</strong></h2>
          <p><strong><u>Global Report</u></strong></p>
          <ul className="bullet-list">
            <li>
              <a href="https://gcrmn.net/2020-report/" rel="noopener noreferrer" target="_blank"><em>Status of Coral Reefs of the World: 2020</em></a>
              <em> </em>
              <span>from the </span>
              <a href="https://gcrmn.net" rel="noopener noreferrer" target="_blank">Global Coral Reef Monitoring Network (GCRMN</a>
              <span>)</span>
            </li>
          </ul>
          <p><strong><u>Regional Reports</u></strong></p>
          <ul className="bullet-list">
            <li>
              <a href="https://www.aims.gov.au/reef-monitoring/gbr-condition-summary-2019-2020" rel="noopener noreferrer" target="_blank"><strong>Australia</strong></a>
              <span> (2019/2020)&nbsp;</span>
            </li>
            <li>
              <a href="https://ifrecor.fr/2021/08/15/2020-letat-de-sante-des-recifs-coralliens-herbiers-marins-et-mangroves-des-outre-mer-francais-un-bilan-mitige/" rel="noopener noreferrer" target="_blank"><strong>French Territories</strong></a>
              <strong> </strong>
              <span>(2020) – Guadeloupe, Martinique, Iles du Nord, Mayotte, Iles Eparses, Réunion, Nouvelle-Calédonie, Polynésie Française, Wallis et Futuna, and Clipperton (</span>
              <a href="http://www.ifrecor-doc.fr/files/original/6c2c8c211206f5857e58dffdd4b12b5c.pdf" rel="noopener noreferrer" target="_blank">summary in English</a>
              <span>)</span>
            </li>
            <li>
              <a href="https://www.healthyreefs.org/cms/report-cards/" rel="noopener noreferrer" target="_blank"><strong>Mesoamerican Reef</strong></a>
              <strong> </strong>
              <span>(2020) – Mexico, Belize, Guatemala, Honduras</span>
            </li>
            <li>
              <strong>US States and Territories </strong>
              <span>(2020) – </span>
              <a href="https://repository.library.noaa.gov/view/noaa/27295" rel="noopener noreferrer" target="_blank"><strong>US summary report</strong></a>
              <strong>,</strong>
              <span> and </span>
              <a href="https://www.coris.noaa.gov/monitoring/status_report/" rel="noopener noreferrer" target="_blank">individual state and territory reports</a>
              <span> (Florida, Puerto Rico, US Virgin Islands, Flower Garden Banks, American Samoa, Northern Mariana Islands, Guam, and Hawaii)</span>
            </li>
            <li>
              <span>Multiple country reports from the </span>
              <a href="https://www.livingoceansfoundation.org/global-reef-expedition/global-reef-expedition-final-reports/" rel="noopener noreferrer" target="_blank"><strong>Global Reef Expedition</strong></a>
              <span>(The Bahamas, St. Kitts and Nevis, Jamaica, Navassa, Columbia, Galapagos, Fiji, French Polynesia, Tonga, Cook Islands, New Caledonia, Solomon Islands, and Palau)&nbsp;</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="subsection">
        <h2><strong>Coral Disease</strong></h2>
        <p>
          <span>Coral diseases could be considered a threat to coral reefs, but they are also </span>
          an
          <span> indicator of reef </span>
          condition,
          <span> as a diseased reef is damaged and vulnerable. Diseases are a natural feature in any ecosystem and are present in background populations of most species. Both in terms of prevalence and geographic distribution, </span>
          <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6790777/" rel="noopener noreferrer" target="_blank"><strong>coral diseases have increased over the last 40 years</strong></a>
          <strong>. Corals have become more susceptible to disease as a result of degraded water quality and </strong>
          <a href="https://researchonline.jcu.edu.au/2705/" rel="noopener noreferrer" target="_blank">
            <strong>climate change,</strong>
            {' '}
            which may cause some pathogens to become more virulent and may reduce a coral’s resilience.
          </a>
          {' '}
          <span>There is strong evidence that </span>
          <a href="https://journals.plos.org/plosbiology/article?id=10.1371/journal.pbio.0050124" rel="noopener noreferrer" target="_blank">disease outbreaks have followed coral bleaching events</a>
          <span>.</span>
        </p>
      </div>
      <div className="subsection row">
        <div className="column image-container small-12 medium-6">
          <img src="https://s3.amazonaws.com/wri-api-backups/resourcewatch/staging/temporary_content_images/images/000/000/375/original/Stony_Coral_Tissue_Loss_Disease_Florida__TNC_reduced.jpg?1611618027&amp;temp_id=375" alt="tnc_stony-coral-tissue-loss-disease" />
          <div className="image-caption">
            <em>
              Stony Coral Tissue Loss Disease in Florida

            </em>
            <br />
            <em>Photo: The Nature Conservancy   </em>
          </div>
        </div>
        <div className="column small-12 medium-6">
          <p>
            <em>Although many scientists and organizations monitor coral reefs and capture information on coral disease, no global database on disease has been updated since 2010. This is a significant gap in our understanding of coral threats, condition, and trends. A concerted effort is needed to address this gap. There are, however, local and regional efforts to track specific disease outbreaks, such as this dashboard on the </em>
            <a href="https://www.agrra.org/coral-disease-outbreak/#sctld-dashboard" rel="noopener noreferrer" target="_blank"><em>Stony coral tissue loss disease (SCTLD)&nbsp;in the Caribbean</em></a>
            <em>.</em>
          </p>
        </div>
      </div>
    </div>
  );
};

ConditionSection.propTypes = {
  onShareWidget: PropTypes.func.isRequired,
};

export default ConditionSection;

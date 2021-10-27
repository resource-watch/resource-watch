import PropTypes from 'prop-types';
import {
  useSelector,
} from 'react-redux';

// components
import MapWidget from 'components/widgets/types/map';
import ChartWidget from 'components/widgets/types/chart';

// utils
import {
  getRWAdapter,
} from 'utils/widget-editor';

/* eslint-disable max-len */
const GlobalThreatsClimateChangeSection = ({ onShareWidget }) => {
  const RWAdapter = useSelector((state) => getRWAdapter(state));

  return (
    <div id="global-threats-climate-change" className="section">
      <h1><strong>Global Threats/Climate Change</strong></h1>
      <div className="row subsection">
        <div className="column small-12 medium-6">
          <h2><strong>Warming Seas</strong></h2>
          <p>
            <span>Rising concentrations of greenhouse gases in the atmosphere have led to warming of the atmosphere and, as a result, an increase in sea surface temperatures (SST). </span>
            <strong>Prolonged episodes of elevated temperature are prompting coral bleaching, the stress response </strong>
            <strong>whereby corals lose their colorful symbiotic algae, exposing their white skeletons. Corals die if the heat stress is extreme and/or prolonged.</strong>
            <span>&nbsp;We examine past, current, and future ocean warming.</span>
          </p>
        </div>
        <div className="image-container column small-12 medium-6">
          <img src="https://s3.amazonaws.com/wri-api-backups/resourcewatch/staging/temporary_content_images/images/000/000/364/original/UNCROPPED__CoralBleaching_TheOceanAgency_66_reduced.jpg?1611603731&amp;temp_id=364" alt="coralbleaching_uncropped" />
          <div className="image-caption">
            <em>Bleached staghorn coral (foreground)</em>
            <br />
            <em>
              Photo: The Ocean Agency - Coral Reef Image Bank
            </em>
          </div>
        </div>
        <div className="subsection">
          <h2>Past Warming and Bleaching</h2>
          <p>
            Mass coral bleaching has occurred around the globe, increasing in frequency and severity as sea temperatures have risen over time.&nbsp;Extreme bleaching events often kill corals outright, while less extreme events can weaken corals, reducing growth and reproduction, and leaving them vulnerable to disease. The time between heat stress events is critical for coral recovery. In addition, areas with low levels of local threats tend to be more resilient.
            {' '}
            <strong>Between 1985 and 2018, 87.4% of the world’s reefs experienced bleaching level heat stress, while 42.5% underwent severe heat stress.</strong>
          </p>
          <MapWidget
            widgetId="641d5218-be38-4a9a-ba6c-a2c38f084b65"
            onToggleShare={onShareWidget}
            style={{
              height: 550,
              borderRadius: 4,
            }}
          />
        </div>
        <div className="subsection">
          <h2>Current SST and Bleaching Risk</h2>
          <p>
            <strong>Bleaching-level conditions occur when the SST exceeds the normal high temperature (for the hottest month) for an extended period (usually several weeks).</strong>
            {' '}
            This combines deviation from the normal high and duration.
            <span> </span>
            The U.S. National Oceanic and Atmospheric Administration (NOAA)
            {' '}
            <a href="https://coralreefwatch.noaa.gov/" rel="noopener noreferrer" target="_blank">Coral Reef Watch (CRW)</a>
            <span> </span>
            program has developed a daily global 5km resolution product to monitor thermal stress on coral reefs and alert coral reef managers to impending threats.
          </p>
          <MapWidget
            widgetId="9ea5466d-47f3-4f80-b3bf-d7a54be5d3ba"
            onToggleShare={onShareWidget}
            style={{
              height: 600,
              borderRadius: 4,
            }}
          />
        </div>
        <div className="subsection">
          <h2>Projections of SST and Bleaching Risk</h2>
          <p>
            As greenhouse gas emissions continue to rise, the atmosphere and ocean will continue to warm. Projections suggest that
            {' '}
            <a href="https://wedocs.unep.org/bitstream/handle/20.500.11822/22048/Coral_Bleaching_Futures.pdf?sequence=1&amp;isAllowed=y" rel="noopener noreferrer" target="_blank"><strong>severe bleaching will occur with increasing frequency in the decades ahead, and virtually all reefs will experience severe bleaching annually by the end of the century</strong></a>
            <strong>.</strong>
&nbsp;The time between bleaching events is critical for coral recovery. When
            {' '}
            <a href="https://coralreefwatch.noaa.gov/climate/projections/downscaled_bleaching_4km/index.php" rel="noopener noreferrer" target="_blank">bleaching exceeds twice per decade corals are less likely to recover</a>
            , resulting in increased mortality and reduced structural complexity. These changes will become more sever when bleaching events begin to occur annually. Hence, the continued emission of greenhouse gases gives rise to a dire outlook for coral reefs.
          </p>
          <ChartWidget
            widgetId="465f7f93-2fde-4fae-938d-e038d72ed631"
            adapter={RWAdapter}
            onToggleShare={onShareWidget}
          />
        </div>
        <div className="subsection">
          <h2><strong>Tropical Cyclones</strong></h2>
          <p>
            <span>Patterns of tropical storms vary considerably around the world, with low occurrence near the equator and higher occurrence near the edges of the tropics. </span>
            <strong>Warming ocean temperatures are increasing the frequency of the strongest cyclones, which generate extreme waves that can damage coral reef communities, even </strong>
            <a href="https://onlinelibrary.wiley.com/doi/abs/10.1111/gcb.15136" rel="noopener noreferrer" target="_blank"><strong>up to several hundred kilometers from storm tracks</strong></a>
            <strong>.</strong>
            <span> Recovery from damage can take up to a decade and can be hindered by other pressures on the reef.</span>
          </p>
          <MapWidget
            widgetId="ccd01d39-e5b4-49e5-bcdb-43a10dde0fcd"
            onToggleShare={onShareWidget}
            style={{
              height: 550,
              borderRadius: 4,
            }}
          />
        </div>
        <div className="subsection">
          <h2><strong>Ocean Acidification</strong></h2>
          <p>
            <strong>Increasing CO</strong>
            <sub><strong>2 </strong></sub>
            <strong>in sea water is </strong>
            <strong>slowly causing the world’s oceans to become more acidic and is </strong>
            <strong>decreasing the availability of aragonite, the form of calcium carbonate that corals use to build their skeletons.</strong>
            {' '}
            <a href="https://tos.org/oceanography/assets/docs/22-4_kleypas.pdf" rel="noopener noreferrer" target="_blank">This slows coral growth</a>
            {' '}
            and results in less dense, weaker coral structures, making them more prone to erosion and damage.
            <span>&nbsp;</span>
            <a href="https://sos.noaa.gov/datasets/ocean-acidification-saturation-state/" rel="noopener noreferrer" target="_blank">Aragonite saturation levels have fallen dramatically within the past century</a>
            <span> </span>
            and will continue to decline due to increasing CO
            <sub>2</sub>
            .
          </p>
          <p>
            <em>The map below presents projections of suitability of areas for coral reefs (from 2010 until the end of the century) based on </em>
            <a href="https://coralreefwatch.noaa.gov/climate/projections/piccc_oa_and_bleaching/index.php" rel="noopener noreferrer" target="_blank"><em>projections of aragonite saturation</em></a>
            <em> from NOAA Coral Reef Watch. </em>
            <strong><em>Users can adjust the displayed year using the slider below the legend.</em></strong>
            <em>&nbsp;This mapping assumes that an </em>
            <a href="https://www.researchgate.net/publication/225129616_Future_coral_reef_habitat_marginality_Temporal_and_spatial_effects_of_climate_change_in_the_Pacific_basin" rel="noopener noreferrer" target="_blank"><em>aragonite saturation level</em></a>
            <em> of 4.0 or greater is favorable for coral growth; above 3.5 is adequate; while a level of 3.0 or less is considered very poor for supporting coral reefs.&nbsp;</em>
          </p>
          <ChartWidget
            widgetId="bde6ab7a-6022-413e-8af6-451ef0de19ac"
            adapter={RWAdapter}
            onToggleShare={onShareWidget}
          />
        </div>
      </div>
    </div>
  );
};

GlobalThreatsClimateChangeSection.propTypes = {
  onShareWidget: PropTypes.func.isRequired,
};

export default GlobalThreatsClimateChangeSection;

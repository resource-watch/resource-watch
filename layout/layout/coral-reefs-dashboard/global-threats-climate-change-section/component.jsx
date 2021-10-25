import PropTypes from 'prop-types';

// components
import MapWidget from 'components/widgets/types/map';

/* eslint-disable max-len */
const GlobalThreatsClimateChangeSection = ({ onShareWidget }) => (
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
        <div>
          <img src="https://s3.amazonaws.com/wri-api-backups/resourcewatch/staging/temporary_content_images/images/000/000/364/original/UNCROPPED__CoralBleaching_TheOceanAgency_66_reduced.jpg?1611603731&amp;temp_id=364" alt="coralbleaching_uncropped" />
        </div>
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
      </div>
    </div>
  </div>
);

GlobalThreatsClimateChangeSection.propTypes = {
  onShareWidget: PropTypes.func.isRequired,
};

export default GlobalThreatsClimateChangeSection;

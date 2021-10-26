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
    </div>
  );
};

ConditionSection.propTypes = {
  onShareWidget: PropTypes.func.isRequired,
};

export default ConditionSection;

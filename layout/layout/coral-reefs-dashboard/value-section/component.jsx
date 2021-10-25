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
const ValueSection = ({ onShareWidget }) => {
  const RWAdapter = useSelector((state) => getRWAdapter(state));

  return (
    <div id="value" className="section">
      <div className="subsection">
        <h1><strong>Reefs are Valuable</strong></h1>
        <p>
          <span>Coral reefs are one of the most biologically rich and productive ecosystems on earth. Spread across the tropics, </span>
          <strong>an estimated 1 billion people benefit either directly or indirectly from the many ecosystem services coral reefs provide.</strong>
          <span> These services include providing a source of food and livelihood, reducing wave energy and protecting shorelines, attracting tourism, providing a source of inspiration and cultural value, and offering tremendous potential for bio-pharmaceuticals through the rich biological diversity found on coral reefs.</span>
        </p>
        <div className="row">
          <div className="column small-12 medium-6">
            <ChartWidget
              widgetId="d3be43cc-8bf8-42f8-bc95-97530da07c84"
              adapter={RWAdapter}
              onToggleShare={onShareWidget}
            />
          </div>
          <div className="column small-12 medium-6">
            <em>Worldwide, approximately 1 billion people live within 100 km of reefs, many of whom are likely to derive some benefits from the ecosystem services reefs provide. More than 330 million people reside in the direct vicinity of coral reefs (within 30 km of reefs and less than 10 km from the coast), where livelihoods are most likely to depend on reefs and related resources. This number of people dependent on coral reefs is estimated to have increased by 20 percent over the last decade.</em>
          </div>
        </div>
      </div>
      <div className="subsection">
        <h2><strong>Tourism</strong></h2>
        <p>
          <span>Coral reefs are an important magnet for both domestic and international tourism in over 100 countries and territories, generating jobs, revenue and foreign exchange. They provide on-reef recreation, such as diving and snorkeling, but also generate white sandy beaches and calm waters favored by tourists. Poorly managed tourism, however, c</span>
          an damage coral reefs. Prior to the abrupt decline in visitation due to COVID-19,
          <strong>coral reefs attracted an estimated</strong>
          <strong> </strong>
          <a href="https://www.sciencedirect.com/science/article/pii/S0308597X17300635" rel="noopener noreferrer" target="_blank"><strong>70 million visitors annually, with an associated expenditure of US$36 billion</strong></a>
          <strong>.</strong>
        </p>
        <MapWidget
          widgetId="568c0830-d6d3-46f1-84c1-11580a00979b"
          onToggleShare={onShareWidget}
          style={{
            height: 600,
            borderRadius: 4,
          }}
        />
      </div>
      <div className="subsection">
        <h2><strong>Fisheries</strong></h2>
        <p>
          <strong>Coral reef-associated fisheries provide an important source of protein and livelihood across the tropics for an estimated </strong>
          <a href="https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0065397" rel="noopener noreferrer" target="_blank"><strong>6 million reef fishers</strong></a>
          <strong>,</strong>
          <span> </span>
          many of whom are artisanal (small-scale and traditional subsistence fishers).
          <span> </span>
          The value of these
          <span>landings was estimated to be over </span>
          <a href="https://files.wri.org/s3fs-public/pdf/reefs_at_risk_revisited.pdf" rel="noopener noreferrer" target="_blank">US$6.8 billion in 2011</a>
          .
          <span> </span>
          Women represent about
          <a href="https://oceanpanel.org/sites/default/files/2020-09/20_HLP_ES_COVID_Blue_Recovery%20v4.pdf" rel="noopener noreferrer" target="_blank">50% of the workforce in the seafood sector and 80–90% in the post-harvest sector</a>
          of small-scale fisheries.
        </p>
        <MapWidget
          widgetId="884165f3-40a8-4d19-9c12-1e368b5a1b87"
          onToggleShare={onShareWidget}
          style={{
            height: 500,
            borderRadius: 4,
          }}
        />
      </div>
      <div className="subsection">
        <h2><strong>Shoreline Protection</strong></h2>
        <p>
          <span>Beyond their biological value, the physical structures of coral reefs reduce wave energy, wave heights, and associated erosion and storm damage. </span>
          <strong>Reefs protect an estimated </strong>
          <a href="https://files.wri.org/s3fs-public/pdf/reefs_at_risk_revisited.pdf" rel="noopener noreferrer" target="_blank"><strong>150,000 km of shoreline in more than 100 countries and territories</strong></a>
          <strong>.</strong>
          <span>&nbsp;</span>
          <span>On average, coral reefs </span>
          <a href="https://www.nature.com/articles/s41467-018-04568-z" rel="noopener noreferrer" target="_blank">reduce the annual expected damages from storms globally by more than US$4 billion</a>
          <span>.&nbsp;The protection provided by coral reefs will become even more important as sea level rises and coastal population and assets continue to grow.</span>
        </p>
        <div className="row">
          <div className="image-container column small-12 medium-6">
            <div>
              {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
              <img className="cw-wysiwyg-image" src="https://s3.amazonaws.com/wri-api-backups/resourcewatch/staging/temporary_content_images/images/000/000/351/original/lindfield_coral-wave.png?1608159333&temp_id=351" alt="Photo by Steve Lindfield" />
            </div>
            <div>
              <em>
                Photo: Steve Lindfield
              </em>
            </div>
          </div>
          <div className="column small-12 medium-6">
            <p>
              <em>Coral reefs’ ability to attenuate wave energy is greater for lower intensity, frequent storms (with smaller waves), but reefs also provide important protection during more extreme storm events—for both people and property. A recent </em>
              <a href="https://www.nature.com/articles/s41467-018-04568-z" rel="noopener noreferrer" target="_blank"><em>global analysis of the average annual benefits (avoided damages) due to the presence of coral reefs</em></a>
              <em> </em>
              <em>evaluated the effect of a 1-m loss in reef height on the resulting flooding for multiple storm events (10, 25, 50, 100-yr return periods) and combined these to arrive at average annual avoided damages of US$4 billion. This is likely an underestimate of the value of protection provided by coral reefs.</em>
            </p>
          </div>
        </div>
        <MapWidget
          widgetId="5e05ed6c-d14c-4ab4-8816-ca11f0f1e2da"
          onToggleShare={onShareWidget}
          style={{
            height: 500,
            borderRadius: 4,
            margin: '20px 0px',
          }}
        />
      </div>
    </div>
  );
};

ValueSection.propTypes = {
  onShareWidget: PropTypes.func.isRequired,
};

export default ValueSection;

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
const ReefsAreThreatenedSection = ({ onShareWidget }) => {
  const RWAdapter = useSelector((state) => getRWAdapter(state));

  return (
    <div id="reefs-are-threatened" className="section">
      <h1><strong>Reefs are Threatened</strong></h1>
      <p>
        <strong>Coral reefs face a wide and intensifying array of threats—from both local and global sources.</strong>
        <span> The local threats include impacts from overfishing and destructive fishing (with explosives or poisons), coastal development, sewage discharge, poorly managed tourism, plastic and other pollution, agricultural runoff, and shipping (a source of invasive species, pollution, and physical damage). The global threats of warming and acidifying seas are driven by greenhouse gas emissions, and the dissolving of CO</span>
        <sub>2</sub>
        <span> in ocean </span>
        waters.
        <strong>This combination of threats has already resulted in the </strong>
        <a href="https://www.wri.org/publication/reefs-risk-revisited" rel="noopener noreferrer" target="_blank"><strong>degradation and, in some cases, loss of more than half of the world’s coral reefs</strong></a>
        <strong>.</strong>
        <span> Degradation is typified by reduced areas of living coral, increased algal cover, coral disease, reduced species diversity, and lower fish abundance. These changes will reduce the value of coral reefs for fisheries, tourism, shoreline protection, and other values, impacting dependent coastal communities.</span>
      </p>
      <div className="subsection">
        <h2><strong>Local Threats</strong></h2>
        <h2 className="subsection">Overfishing</h2>
        <p>
          <strong>Overexploitation of reefs—both for markets and for local consumption, </strong>
          <a href="https://files.wri.org/s3fs-public/pdf/reefs_at_risk_revisited.pdf" rel="noopener noreferrer" target="_blank"><strong>affects more than half of the world’s coral reefs</strong></a>
          <strong>.</strong>
          <span> This threat includes both the overfishing of </span>
          <a href="https://www.icriforum.org/wp-content/uploads/2020/05/ICRI%20Live%20Reef%20Food%20Fish%20Report-44p-double_0.pdf" rel="noopener noreferrer" target="_blank">high value target species for the live reef food fish trade</a>
          <span> (e.g. groupers, snappers, sharks, sea cucumbers, and lobsters), as well as fishing for smaller, often herbivorous fish, for local consumption. The use of destructive techniques (explosives and poisons) and reef gleaning (gathering and collecting seafood at low tide) can also directly damage coral reefs.&nbsp;</span>
          Heavily fished reefs are prone to algal overgrowth, without herbivorous fish to graze the algae as it grows.
          {' '}
          <a href="https://www.sciencedirect.com/science/article/pii/S0960982207008822" rel="noopener noreferrer" target="_blank">Such overfished reefs appear to be generally less resilient to stressors</a>
          <span> </span>
          and may be more vulnerable to disease and slower to recover from other human impacts.&nbsp;
          <span>Although well-managed, small-scale coastal fisheries can be a sustainable resource, growing human populations, more efficient fishing methods, and increasing demands from tourism and international markets have significantly </span>
          increased pressure on vulnerable fish stocks.
        </p>
        <p>
          <em>The following map shows overfishing threat to coral reefs by default, but users can also view layers reflecting threats from coastal development, watershed-based pollution, marine-based pollution, and an integration of these local threats. All data are from </em>
          <a href="https://www.wri.org/publication/reefs-risk-revisited" rel="noopener noreferrer" target="_blank"><em>Reefs at Risk Revisited</em></a>
          <em>,</em>
          <em> published in 2011. </em>
          <a href="https://wriorg.s3.amazonaws.com/s3fs-public/technical_notes.pdf" rel="noopener noreferrer" target="_blank"><em>These data</em></a>
          <em>, though dated, are still the best available global mapping of local threats to coral reefs. The coral reef conservation community should consider a collaboration to revise and improve these threat maps—either region-by-region or globally.</em>
        </p>
      </div>
    </div>
  );
};

ReefsAreThreatenedSection.propTypes = {
  onShareWidget: PropTypes.func.isRequired,
};

export default ReefsAreThreatenedSection;

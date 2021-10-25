import PropTypes from 'prop-types';

// components
import MapWidget from 'components/widgets/types/map';

/* eslint-disable max-len */
const ReefsAreThreatenedSection = ({ onShareWidget }) => (
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
    <div className="subsection">
      <h2>Coastal Development</h2>
      <div className="row section">
        <div className="column small-12 medium-6">
          <p>
            <span>Development of human settlements, industry, aquaculture, and infrastructure in the coastal zone can impact coral reefs—either directly through physical damage from dredging or land filling, or indirectly through increased runoff of sediment and pollution. Elevated nutrient levels in sewage encourage blooms of plankton that block light and encourage growth of seaweeds that compete for space on the reef, while the bacteria promote coral disease. </span>
            <a href="http://www.unesco.org/new/en/natural-sciences/environment/water/wwap/wwdr/2017-wastewater-the-untapped-resource/" rel="noopener noreferrer" target="_blank"><strong>Many countries with coral reefs have little to no sewage treatment</strong></a>
            <strong>, with an estimated </strong>
            <a href="https://www.unwater.org/water-facts/quality-and-wastewater/" rel="noopener noreferrer" target="_blank"><strong>80 percent of discharged wastewater inadequately treated</strong></a>
            <strong>.</strong>
            <span>&nbsp;</span>
            <span>In addition, the removal of coastal vegetation such as mangroves takes away a critical sediment and pollutant trap. Poorly managed tourism also threatens coral reefs.</span>
          </p>
        </div>
        <div className="image-container column small-12 medium-6">
          <div>
            <img src="https://s3.amazonaws.com/wri-api-backups/resourcewatch/staging/temporary_content_images/images/000/000/378/original/COastal_Development_crop_Steve_Lindfield_V3.jpg?1611945275&amp;temp_id=378" alt="COastal_Development_crop_Steve_Lindfield_V3.jpg" />
          </div>
          <div>
            <em>
              Photo: Steve Lindfield
            </em>
          </div>
        </div>
      </div>
    </div>
    <div className="subsection">
      <h2>Watershed-based Pollution</h2>
      <p>
        <strong>Pollution from inland activities includes erosion due to land clearing, sewage from tourists and residents, and runoff of livestock waste, fertilizers, and pesticides from agricultural lands.</strong>
        <span> These all can be transported by rivers to the sea where they impact</span>
        {' '}
        <span>coastal waters and coral reefs—sometimes extending more than 100km from river mouths. In high quantities, sediments can smother, weaken, and kill corals, while in lower quantities, they reduce sunlight reaching corals, slowing coral growth.&nbsp;Excessive levels of nutrients (nitrogen and phosphorus) in shallow coastal waters can encourage blooms of phytoplankton, which reduce light reaching the corals, can cause growth of algae and seaweeds which can overgrow corals. Mangroves and seagrass habitats can help trap sediments and remove nutrients.</span>
      </p>
      <MapWidget
        widgetId="23c14c5d-5ef2-4e2b-a1ef-38e0b1f0e0e1"
        onToggleShare={onShareWidget}
        style={{
          height: 600,
          borderRadius: 4,
        }}
      />
    </div>
    <div className="subsection">
      <h2>Marine-based pollution and damage</h2>
      <p>
        <strong>Commercial, recreational, and passenger vessels bring with them a host of potential threats to coral, including contaminated bilge water, fuel leakages, raw sewage, solid waste, and invasive species,</strong>
        <span> which can promote coral disease and alter ecological balance by displacing native species. Vessels cause physical damage through groundings, anchors, and oil spills. Cruise ships are a significant source of pollution in many areas. The widespread accumulation of plastics in the ocean is also an important (and growing) threat to coral reefs and marine life in general.&nbsp;</span>
      </p>
      <MapWidget
        widgetId="bf40f48f-23af-4311-a583-269408650ed3"
        onToggleShare={onShareWidget}
        style={{
          height: 600,
          borderRadius: 4,
        }}
      />
    </div>
  </div>
);

ReefsAreThreatenedSection.propTypes = {
  onShareWidget: PropTypes.func.isRequired,
};

export default ReefsAreThreatenedSection;

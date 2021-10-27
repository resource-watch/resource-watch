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
const ManagementResilienceSection = ({ onShareWidget }) => {
  const RWAdapter = useSelector((state) => getRWAdapter(state));

  return (
    <div id="management-resilience-and-other-mitigating-factors" className="section">
      <h1><strong>Management, Resilience and Other Mitigating Factors</strong></h1>
      <p>
        <span>Though threats to reefs are near-ubiquitous, the degree of threat is variable world-wide and coral reefs show varied levels of resilience, or the ability to recover from perturbations. </span>
        <strong>Coral reef resilience is influenced by natural factors but can also be enhanced by the reduction and removal of local threats through management interventions.</strong>
        <span> Some reefs are in geographically advantaged locations, such as with high levels of ocean circulation or large amounts of coral larvae available to aid recovery. Management of coastal and marine areas can also reduce threats to reefs by restricting activities that harm reefs, which </span>
        <a href="https://reefresilience.org/resilience/resilience-based-management/" rel="noopener noreferrer" target="_blank">can help increase resilience of coral reefs in warming and acidifying oceans</a>
        <span>.</span>
      </p>
      <div className="subsection row">
        <div className="image-container column small-12 medium-6">
          <img src="https://s3.amazonaws.com/wri-api-backups/resourcewatch/staging/temporary_content_images/images/000/000/367/original/Coral_resilience___Jayne_Jenkins_Ocral_Reef_image_bank_62_reduced.jpg?1611615951&amp;temp_id=367" alt="jayne-jenkins" />
          <div className="image-caption">
            <em>
              Photo: Jayne Jenkins
            </em>
          </div>
        </div>
        <div className="column small-12 medium-6">
          <p>
            <em>Coral reef resilience refers to a reef ecosystem's ability to recover from a disturbance and restore towards a coral-rich and diverse state, as opposed to shifting to an algal-dominated state or a single coral morphology. </em>
            <a href="https://reefresilience.org/understanding-coral-reef-resilience/" rel="noopener noreferrer" target="_blank"><strong><em>Reefs with broad size and age range, high biodiversity, healthy herbivorous fish populations, low local threats, little coral disease, and a history of surviving past thermal stress events tend to be more resilient</em></strong></a>
            <strong><em>.</em></strong>
          </p>
        </div>
      </div>
      <div className="subsection">
        <h2><strong>Adjacent Habitats</strong></h2>
        <p>
          <strong>Coral reefs, mangroves, and seagrass areas are interconnected habitats which thrive adjacent to each other and provide nurseries and habitat for fish.</strong>
          <span> Coral reefs reduce wave energy and create calmer conditions which suit mangroves and seagrass, while the plants filter pollutants and sediment, creating cleaner water favored by reefs. Unfortunately, both mangrove and seagrass habitats have suffered widespread losses—often for coastal development or aquaculture.</span>
        </p>
      </div>
      <div className="subsection row">
        <div className="column small-12 medium-4 image-container">
          <img src="https://s3.amazonaws.com/wri-api-backups/resourcewatch/staging/temporary_content_images/images/000/000/380/original/Burke_BZ_Mangrove_tall.jpg?1611946408&amp;temp_id=380" alt="Burke_BZ_Mangrove_tall.jpg" />
          <div className="image-caption">
            <em>
              Mangrove in Belize
            </em>
            <br />
            <em>
              Photo: Lauretta Burke
            </em>
          </div>
        </div>
        <div className="column small-12 medium-4">
          <p>
            <a href="https://www.globalmangrovewatch.org/?map=eyJiYXNlbWFwIjoibGlnaHQiLCJ2aWV3cG9ydCI6eyJsYXRpdHVkZSI6MjAuMDAwMDAwMDAwMDAwMDA0LCJsb25naXR1ZGUiOjAsInpvb20iOjIsImJlYXJpbmciOjAsInBpdGNoIjowfX0%3D&amp;widgets=eyJoaWdobGlnaHRlZF9wbGFjZXMiOnsiaXNDb2xsYXBzZWQiOnRydWUsImlzQWN0aXZlIjpmYWxzZX0sIm1hbmdyb3ZlX2V4dGVudCI6eyJpc0NvbGxhcHNlZCI6dHJ1ZSwiaXNBY3RpdmUiOnRydWV9LCJtYW5ncm92ZV9jb3ZlcmFnZSI6eyJpc0NvbGxhcHNlZCI6dHJ1ZSwiaXNBY3RpdmUiOmZhbHNlfSwibWFuZ3JvdmVfbmV0X2NoYW5nZSI6eyJpc0NvbGxhcHNlZCI6ZmFsc2UsImlzQWN0aXZlIjpmYWxzZX0sIm1hbmdyb3ZlX2FsZXJ0cyI6eyJpc0NvbGxhcHNlZCI6dHJ1ZSwiaXNBY3RpdmUiOmZhbHNlfSwibWFuZ3JvdmVfYmx1ZV9jYXJib24iOnsiaXNDb2xsYXBzZWQiOnRydWUsImlzQWN0aXZlIjpmYWxzZX0sIm1hbmdyb3ZlX2hlaWdodCI6eyJpc0NvbGxhcHNlZCI6dHJ1ZSwiaXNBY3RpdmUiOmZhbHNlfSwibWFuZ3JvdmVfYmlvbWFzcyI6eyJpc0NvbGxhcHNlZCI6dHJ1ZSwiaXNBY3RpdmUiOmZhbHNlfSwiY29uc2VydmF0aW9uX2hvdHNwb3RzIjp7ImlzQ29sbGFwc2VkIjp0cnVlLCJpc0FjdGl2ZSI6ZmFsc2V9LCJtYW5ncm92ZV9hY3Rpdml0eSI6eyJpc0NvbGxhcHNlZCI6dHJ1ZSwiaXNBY3RpdmUiOmZhbHNlfX0%3D" rel="noopener noreferrer" target="_blank"><em>The extent of mangroves in&nbsp;the world&nbsp;has&nbsp;decreased&nbsp;by&nbsp;more than 6,000 km²&nbsp;between 1996 and 2016</em></a>
            <em>.</em>
          </p>
          <p>
            <em>Seagrasses have been disappearing at a rate of </em>
            <a href="https://www.pnas.org/content/106/30/12377#:~:text=Our%20comprehensive%20global%20assessment%20of,were%20initially%20recorded%20in%201879." rel="noopener noreferrer" target="_blank"><em>110 km2/yr&nbsp;since 1980</em></a>
            <em> and </em>
            <a href="https://www.pnas.org/content/106/30/12377#:~:text=Our%20comprehensive%20global%20assessment%20of,were%20initially%20recorded%20in%201879." rel="noopener noreferrer" target="_blank"><em>29% of the known areal extent has disappeared</em></a>
            <em> </em>
            <em>since seagrass areas were initially recorded in 1879.</em>
          </p>
        </div>
        <div className="column small-12 medium-4 image-container">
          <img src="https://s3.amazonaws.com/wri-api-backups/resourcewatch/staging/temporary_content_images/images/000/000/381/original/Seagrass_-_TNC_-_Benjamin_Jones__Project_Seagrass.jpg?1611946529&amp;temp_id=381" alt="Seagrass - TNC - Benjamin Jones, Project Seagrass.jpg" />
          <div className="image-caption">
            <em>
              Seagrass meadow
            </em>
            <br />
            <em>
              Photo: Benjamin Jones, TNC
            </em>
          </div>
        </div>
      </div>
      <div className="subsection">
        <h2><strong>Coral Connectivity</strong></h2>
        <p>
          <strong>Corals spawn larvae which drift in ocean currents and are important for seeding new reef locations and helping to restore damaged or recovering areas.</strong>
          <span> Reefs with large or multiple “upstream” sources of larvae and close proximity to the sources are considered to have high “</span>
          <a href="https://reefresilience.org/resilient-mpa-design/connectivity/" rel="noopener noreferrer" target="_blank">connectivity</a>
          <span>”.</span>
        </p>
        <MapWidget
          widgetId="12181796-06c1-48b8-b56d-9c086556faa2"
          onToggleShare={onShareWidget}
          style={{
            height: 550,
            borderRadius: 4,
          }}
        />
      </div>
      <div className="subsection">
        <h2><strong>Marine Protected Areas</strong></h2>
        <p>
          <a href="https://www.protectedplanet.net/en/thematic-areas/marine-protected-areas" rel="noopener noreferrer" target="_blank">Marine Protected Areas (MPAs)</a>
          <span> are an important tool for controlling activities and associated pressures inside legally defined zones—typically for protection of economic resources, biodiversity conservation or species protection. MPAs can come in many forms including strictly controlled marine reserves, wildlife refuges, research areas, multiple-use areas, and locally managed marine areas, among others. When all types of MPAs are considered,</span>
          <strong> </strong>
          <a href="https://habitats.oceanplus.org/#coralreef" rel="noopener noreferrer" target="_blank"><strong>42 percent of the world’s reefs are located inside designated MPAs</strong></a>
          <strong>. </strong>
          <strong>Only a minority of MPAs are highly protected marine reserves, which prohibit fishing, or include such zones.</strong>
          <span> Based on available information, an estimated </span>
          <strong>ten percent of coral reefs are within mapped "no take" areas</strong>
          <span>.</span>
        </p>
      </div>
      <div className="subsection row">
        <div className="column small-12 medium-6">
          <p>
            <em>The map above shows MPAs as recorded in the World Database of Protected Areas, which is maintained by Protected Planet. MPAs can range from strictly controlled marine reserves which prohibit extractive activities, through to “paper parks” which lack a management plan, regulations, or means of enforcement. MPAs can include limitations on development, fishing practices, fishing seasons and catch limits, moorings, and removal of marine life. </em>
            <strong><em>The effectiveness of protection afforded by MPAs varies considerably, depending on the management objectives, level of restrictions on extractive activities, adequacy of resources for enforcement of regulations, and maturity of the MPA, among other factors.</em></strong>
          </p>
          <p>
            <em>There are excellent ongoing efforts to compile </em>
            <a href="https://www.protectedplanet.net/en/thematic-areas/marine-protected-areas" rel="noopener noreferrer" target="_blank"><em>up-to-date information on MPAs</em></a>
            <em>, including the type of MPA, year of establishment, </em>
            <a href="https://www.protectedplanet.net/en/thematic-areas/protected-areas-management-effectiveness-pame" rel="noopener noreferrer" target="_blank"><em>existence of a management plan</em></a>
            <em>, and the </em>
            <a href="https://mpatlas.org/" rel="noopener noreferrer" target="_blank"><em>extent of fully or highly protected (no take) areas</em></a>
            <em>. Statistics on MPAs and protection will constantly evolve, as MPAs are established or expanded and management plans and zoning advance.&nbsp;</em>
          </p>
        </div>
        <div className="column small-12 medium-6 image-container">
          <img src="https://s3.amazonaws.com/wri-api-backups/resourcewatch/staging/temporary_content_images/images/000/000/371/original/For_MPAs_FromAbove_Gaby_Barathieu_03_reduced.jpg?1611616842&amp;temp_id=371" alt="gaby-barathieu" />
          <div className="image-caption">
            <em>
              Islands in Mayotte
            </em>
            <br />
            <em>
              Photo: Gaby Barathieu
            </em>
          </div>
        </div>
        <div className="subsection">
          <ChartWidget
            widgetId="be3cf170-33e1-427e-813e-cbdb95c52c88"
            adapter={RWAdapter}
            onToggleShare={onShareWidget}
          />
        </div>
        <div className="subsection">
          <h2><strong>Signs of Hope</strong></h2>
          <p>
            Coral reefs are important and valuable but are threatened and in decline in many locations around the globe.
            {' '}
            <strong>There are, however, signs of hope including healthy, resilient, and recovering reefs in many locations.</strong>
          </p>
        </div>
        <div className="subsection row">
          <div className="column image-container small-12 medium-6">
            <img src="https://s3.amazonaws.com/wri-api-backups/resourcewatch/staging/temporary_content_images/images/000/000/386/original/CoralReefImageBank_MattCurnock_Schools_04_reduced.jpg?1611949722&amp;temp_id=386" alt="CoralReefImageBank_MattCurnock_Pacific_02_reduced.jpg" />
            <div className="image-caption">
              <em>
                Photo: Matt Curnock - Coral Reef Image Bank
              </em>
            </div>
          </div>
          <div className="column small-12 medium-6">
            <p>
              An analysis of “
              <a href="https://www.nature.com/articles/nature18607" rel="noopener noreferrer" target="_blank"><strong>Bright Spots</strong></a>
              ” identified 15 areas where reefs were found to be healthier and coral reef fisheries more productive than expected given local environmental and socioeconomic conditions. These areas were characterized by strong sociocultural institutions (such as customary tenure), high levels of engagement in local management, high dependence on marine resources, and beneficial environmental conditions such as proximity to deep-water refuges. (The contrasting “dark spot” areas were characterized by intensive capture and storage technology and a recent history of environmental shocks.) The bright spots analysis approach can be used to inform the types of investments and governance structures that can help to sustain coral reefs (e.g. participatory management and improved property rights).
            </p>
          </div>
        </div>
        <div className="subsection row">
          <div className="column small-12 medium-6">
            <p>
              <strong>“</strong>
              <a href="https://mission-blue.org/hope-spots/" rel="noopener noreferrer" target="_blank"><strong>Hope Spots</strong></a>
              <strong>”</strong>
              <span> are places that are scientifically identified as critical to the health of the ocean, in an effort coordinated by </span>
              <a href="https://mission-blue.org/" rel="noopener noreferrer" target="_blank">Mission Blue</a>
              <span>. Some Hope Spots are already formally protected, while others still need defined protection. The areas vary in size, and are often included due to one or more of several characteristics: a special abundance or diversity of species; unusual, rare, threatened or endemic species; importance as a migration corridor or spawning ground; significant historical, cultural or spiritual value; or particular economic importance to the community. Hope Spots are championed by local conservationists, with communications, expeditions, and scientific advisory support from Mission Blue.</span>
            </p>
          </div>
          <div className="column image-container small-12 medium-6">
            <img src="https://s3.amazonaws.com/wri-api-backups/resourcewatch/staging/temporary_content_images/images/000/000/387/original/IYORBank_AnimalsandtheReef_GregoryPiper_18_reduced.jpg?1611949791&amp;temp_id=387" alt="IYORBank_AnimalsandtheReef_GregoryPiper_18_reduced.jpg" />
            {' '}
            <div className="image-caption">
              <em>
                Photo: Gregory Pipe - Coral Reef Image Bank
              </em>
            </div>
          </div>
        </div>
        <div className="subsection row">
          <div className="column image-container small-12 medium-6">
            <img src="https://s3.amazonaws.com/wri-api-backups/resourcewatch/staging/temporary_content_images/images/000/000/388/original/CoralReefImageBank_MattCurnock_Pacific_02_reduced.jpg?1611949843&amp;temp_id=388" alt="CoralReefImageBank_MattCurnock_Pacific_02_reduced.jpg" />
            {' '}
            <div className="image-caption">
              <em>
                Photo: Matt Curnock - Coral Reef Image Bank

              </em>
            </div>
          </div>
          <div className="column small-12 medium-6">
            <p>
              <span>Although coral reefs are threatened by many factors, climate change is a dominant and rapidly growing threat. The </span>
              <a href="https://www.50reefs.org/" rel="noopener noreferrer" target="_blank"><strong>50 Reefs initiative</strong></a>
              <span> used modern portfolio theory in an </span>
              <a href="https://conbio.onlinelibrary.wiley.com/doi/full/10.1111/conl.12587" rel="noopener noreferrer" target="_blank">analysis</a>
              <span> to identify coral reef locations globally that, in the absence of other impacts, are likely to have a heightened chance of surviving projected climate changes relative to other reefs. These locations constitute important opportunities for novel conservation investments to secure less vulnerable yet well‐connected coral reefs that may, in turn, help to repopulate degraded areas in the event that the climate has stabilized.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

ManagementResilienceSection.propTypes = {
  onShareWidget: PropTypes.func.isRequired,
};

export default ManagementResilienceSection;

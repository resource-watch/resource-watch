import { useState, useEffect } from 'react';
import Sticky from 'react-stickynode';
import {
  Link as ScrollLink,
} from 'react-scroll';
import {
  useSelector,
} from 'react-redux';

// components
import ChartWidget from 'components/widgets/types/chart';

// services
import { fetchWidget } from 'services/widget';

// utils
import {
  getRWAdapter,
} from 'utils/widget-editor';

// constants
import { TABS, WIDGET_IDS } from './constants';

/* eslint-disable max-len */
export default function LayoutCoralReefsDashboard() {
  const [widgets, setWidgets] = useState({});

  const RWAdapter = useSelector((state) => getRWAdapter(state));

  useEffect(() => {
    Promise.all(WIDGET_IDS.map((wID) => fetchWidget(wID)))
      .then((values) => {
        const newWidgets = {};
        values.forEach((res, index) => { newWidgets[WIDGET_IDS[index]] = res; });
        setWidgets(newWidgets);
      });
  }, []);

  return (
    <div className="coral-reefs-dashboard">
      {/* ----------------------- TABLE OF CONTENTS ------------ */}
      <div id="table-of-contents" className="row section">
        <div className="image-container column small-12 medium-6">
          <div>
            <img className="cw-wysiwyg-image" src="https://s3.amazonaws.com/wri-api-backups/resourcewatch/staging/temporary_content_images/images/000/000/377/original/IYORBank_UpClose_TheOceanAgency_03_cropped.jpg?1611936687&amp;temp_id=377" alt="IYORBank_UpClose_TheOceanAgency_03_cropped.jpg" />
          </div>
          <div>
            <em>
              Photo: Steve Lindfield - Coral Reef Image Bank
            </em>
          </div>
        </div>
        <div className="column small-12 medium-6">
          <h1>Table of Contents</h1>
          <ul>
            <li>
              <ScrollLink
                activeClass="-active"
                to="value"
                spy
                smooth
                offset={-25}
                isDynamic
              >
                <strong>Coral reef dependence and values</strong>
              </ScrollLink>
              <span> - tourism, fisheries, and shoreline protection</span>
            </li>
            <li>
              <ScrollLink
                activeClass="-active"
                to="reefs-are-threatened"
                spy
                smooth
                offset={-25}
                isDynamic
              >
                <strong>Local threats to coral reefs</strong>
              </ScrollLink>
              <span> - overfishing, coastal development, watershed-based pollution, and marine-based pollution</span>
            </li>
            <li>
              <ScrollLink
                activeClass="-active"
                to="global-threats-climate-change"
                spy
                smooth
                offset={-25}
                isDynamic
              >
                <strong>Global threats to coral reefs - </strong>
              </ScrollLink>
              <span>warming seas and coral bleaching (past, current and future warming), tropical cyclones, and ocean acidification</span>
            </li>
            <li>
              <ScrollLink
                activeClass="-active"
                to="coral-reef-condition"
                spy
                smooth
                offset={-25}
                isDynamic
              >
                <strong>Coral reef condition </strong>
              </ScrollLink>
              <span>– summary of trends on coral reefs</span>
            </li>
            <li>
              <ScrollLink
                activeClass="-active"
                to="management-resilience-and-other-mitigating-factors"
                spy
                smooth
                offset={-25}
                isDynamic
              >
                <strong>Management, resilience, and other mitigating factors </strong>
              </ScrollLink>
              <span>– adjacent habitats (mangroves and sea grass), coral connectivity, marine protected areas, and signs of hope</span>
            </li>
            <li>
              <ScrollLink
                activeClass="-active"
                to="social-and-economic-vulnerability"
                spy
                smooth
                offset={-25}
                isDynamic
              >
                <strong>Social and economic vulnerability to coral degradation and loss </strong>
              </ScrollLink>
              <span>– national level summaries</span>
            </li>
            <li>
              <ScrollLink
                activeClass="-active"
                to="conclusion"
                spy
                smooth
                offset={-25}
                isDynamic
              >
                <strong>Conclusion</strong>
              </ScrollLink>
            </li>
            <li>
              <ScrollLink
                activeClass="-active"
                to="key-resources"
                spy
                smooth
                offset={-25}
                isDynamic
              >
                <strong>Key resources</strong>
              </ScrollLink>
              <span>– for further information on science and management, protected areas, status and trends, government and policy, ecosystem values, and how individuals can aid coral reefs</span>
            </li>
          </ul>
        </div>
      </div>
      <Sticky
        bottomBoundary="#dashboard-content"
        innerZ={10}
        className="sticky-dashboard-content-bar"
      >
        <div
          style={{
            width: '100%',
            backgroundColor: '#f4f6f7',
          }}
        >
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <ul className="dashboard-anchors-list">
                  {TABS.map(({ label, value }) => (
                    <li className="dashboard-anchors-list-item">
                      <ScrollLink
                        activeClass="-active"
                        to={value}
                        spy
                        smooth
                        offset={-25}
                        isDynamic
                      >
                        {label}
                      </ScrollLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Sticky>
      <div id="dashboard-content">
        <div id="value" className="section">
          <h1>Reefs are Valuable</h1>
          <p>
            <span>Coral reefs are one of the most biologically rich and productive ecosystems on earth. Spread across the tropics, </span>
            <strong>an estimated 1 billion people benefit either directly or indirectly from the many ecosystem services coral reefs provide.</strong>
            <span> These services include providing a source of food and livelihood, reducing wave energy and protecting shorelines, attracting tourism, providing a source of inspiration and cultural value, and offering tremendous potential for bio-pharmaceuticals through the rich biological diversity found on coral reefs.</span>
          </p>
          <div className="row">
            <div className="column small-12 medium-6">
              <ChartWidget widgetId="d3be43cc-8bf8-42f8-bc95-97530da07c84" adapter={RWAdapter} />
            </div>
            <div className="column small-12 medium-6">
              <em>Worldwide, approximately 1 billion people live within 100 km of reefs, many of whom are likely to derive some benefits from the ecosystem services reefs provide. More than 330 million people reside in the direct vicinity of coral reefs (within 30 km of reefs and less than 10 km from the coast), where livelihoods are most likely to depend on reefs and related resources. This number of people dependent on coral reefs is estimated to have increased by 20 percent over the last decade.</em>
            </div>
          </div>
        </div>
        <div id="reefs-are-threatened" className="section">
          <h1>Reefs are Threatened</h1>
        </div>
        <div id="global-threats-climate-change" className="section">
          <h1>Global Threats/Climate Change</h1>
        </div>
        <div id="coral-reef-condition" className="section">
          <h1>Coral Reef Condition</h1>
        </div>
        <div id="management-resilience-and-other-mitigating-factors" className="section">
          <h1>Management, Resilience and Other Mitigating Factors</h1>
        </div>
        <div id="social-and-economic-vulnerability" className="section">
          <h1>Social and Economic Vulnerability</h1>
        </div>
        <div id="conclusion" className="section">
          <h1>Conclusion</h1>
        </div>
        <div id="key-resources" className="section">
          <h1>Key Resources</h1>
        </div>
      </div>
    </div>
  );
}

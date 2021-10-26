import { useState, useCallback } from 'react';
import Sticky from 'react-stickynode';
import {
  Link as ScrollLink,
} from 'react-scroll';
import dynamic from 'next/dynamic';

// constants
import { TABS } from './constants';

// sections
import ValueSection from './value-section';
import ReefsAreThreatenedSection from './reefs-are-threatened-section';
import KeyResourcesSection from './key-resources-section';
import GlobalThreatsClimateChange from './global-threats-climate-change-section';
import ConditionSection from './condition-section';

const WidgetShareModal = dynamic(() => import('../../../components/widgets/share-modal'), { ssr: false });

/* eslint-disable max-len */
export default function LayoutCoralReefsDashboard() {
  const [widgetToShare, setWidgetToShare] = useState(null);

  const handleShareWidget = useCallback((_widget) => {
    setWidgetToShare(_widget);
  }, []);

  const handleCloseShareWidget = useCallback(() => {
    setWidgetToShare(null);
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
          <h1><strong>Table of Contents</strong></h1>
          <ul className="bullet-list">
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
        <ValueSection onShareWidget={handleShareWidget} />
        <ReefsAreThreatenedSection onShareWidget={handleShareWidget} />
        <GlobalThreatsClimateChange onShareWidget={handleShareWidget} />
        <ConditionSection onShareWidget={handleShareWidget} />
        <div id="management-resilience-and-other-mitigating-factors" className="section">
          <h1>Management, Resilience and Other Mitigating Factors</h1>
        </div>
        <div id="social-and-economic-vulnerability" className="section">
          <h1>Social and Economic Vulnerability</h1>
        </div>
        <div id="conclusion" className="section">
          <h1>Conclusion</h1>
        </div>
        <KeyResourcesSection />
        {(!!widgetToShare) && (
        <WidgetShareModal
          isVisible
          widget={widgetToShare}
          onClose={handleCloseShareWidget}
        />
        )}
      </div>
    </div>
  );
}

import React from 'react';

// Components
import CardApp from 'components/app/common/CardApp';
import Banner from 'components/app/common/Banner';

// Next components
import { Link } from 'routes';

function ContributeData() {
  const cards = [
    {
      id: 'request-data',
      title: 'Request data',
      description: 'Know of a data set that you’d like to see on Resource Watch or have a specific area of interest you’d like us to cover?',
      link: {
        route: 'https://docs.google.com/forms/d/e/1FAIpQLSfXsPGQxM6p8KloU920t5Tfhx9FYFOq8-Rjml07UDH9EvsI1w/viewform?usp=sf_link',
        label: 'Request data',
        external: true
      }
    },
    {
      id: 'submit-data',
      title: 'Submit data for Resource Watch',
      description: 'Have a data set that you’d like to submit to see on Resource Watch?',
      link: {
        route: 'https://docs.google.com/forms/d/e/1FAIpQLSfbVoP6rAfMtxepShok8l7idQdr4KbOV4gK8ZA7_mwGx46kHA/viewform?usp=sf_link',
        label: 'Submit a dataset',
        external: true
      }
    }
  ];

  return (
    <div>
      <aside className="l-postcontent">
        <div className="l-container">
          <div className="row">
            <div className="column small-12">
              <div className="c-terms">
                <h3>Guiding principles</h3>
                <p>
                  We seek to develop and acquire data that cover a diverse range of
                  themes for a wide audience that are:
                </p>
                <ul>
                  <li>
                    <strong>Open:</strong> Data that can be freely used, reused, and redistributed
                  </li>
                  <li>
                    <strong>Relevant:</strong> Data that help answer questions to address urgent, global challenges
                  </li>
                  <li>
                    <strong>Reliable:</strong> Peer-reviewed or official government data produced by transparent, established methodologies
                  </li>
                  <li>
                    <strong>Timely:</strong> Most up-to-date, and complete information available
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="column small-12">
              <p>
                Before submitting a dataset, please make sure to browse our
                catalog and review our <Link route="get_involved_detail" params={{ id:"data-policy" }}><a>data policy</a></Link> and submission guidelines.
              </p>
            </div>
          </div>

          <div className="l-section">
            <div className="row">
              {cards.map(card => (
                <div key={card.id} className="column small-12 medium-6 large-6 c-card-column">
                  <CardApp
                    title={card.title}
                    className="-compact"
                    description={card.description}
                    link={{ ...card.link }}
                    buttonType="primary"
                    />
                </div>
              ))}

            </div>
          </div>
        </div>
      </aside>
      <aside className="l-postcontent">
        <div className="l-container">
          <div className="row align-center">
            <div className="column small-12">
              <Banner className="-text-center" bgImage="/static/images/pages/app/bg-banner-planetPulse.jpg">
                <p className="-claim">
                  View near-real-time data <br />
                  on the Planet
                </p>
                <Link to="pulse">
                  <a className="c-button -alt -primary">Launch Planet Pulse</a>
                </Link>
              </Banner>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

ContributeData.propTypes = {};
ContributeData.defaultProps = {};

export default ContributeData;

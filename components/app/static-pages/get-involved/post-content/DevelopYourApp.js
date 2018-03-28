import React from 'react';
import { Link } from 'routes';

// Components
import CardApp from 'components/app/common/CardApp';
import Banner from 'components/app/common/Banner';

function DevelopYourApp() {
  const cards = [
    {
      id: 'api-documentation',
      title: 'API documentation',
      description: 'Pull data from Resource Watch into your application, and learn how the Resource Watch platform works.',
      link: {
        route: 'https://api.resourcewatch.org',
        label: 'Read the docs',
        external: true
      }
    },
    {
      id: 'fork-code',
      title: 'Fork our source code',
      description: 'Build on our open source code for your next project, or contribute to the development of Resource Watch.',
      link: {
        route: 'https://github.com/resource-watch/',
        label: 'Visit our Github',
        external: true
      }
    },
    {
      id: 'submit-app',
      title: 'Submit an app',
      description: 'Share your map or app with the Resource Watch community. Please review our app review [guidelines] before submission.',
      link: {
        route: 'https://docs.google.com/forms/d/e/1FAIpQLSfZ79GW0jF7BL_-mUjHOgXEUN3U2p95FgiOp-_ZaqqwTfI7Gg/viewform?usp=sf_link',
        label: 'Submit your app',
        external: true
      }
    }
  ];

  return (
    <div>
      <aside className="l-postcontent">
        <div className="l-container">
          <div className="row">
            {cards.map(card => (
              <div key={card.id} className="column small-12 medium-6 large-4 c-card-column">
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
          {/* Temporary link to App Review Policy */}
          <Link route="get_involved_detail" params={{ id: 'app-review-policy' }}>
            <a>App Review Policy</a>
          </Link>
        </div>
      </aside>
      <aside className="l-postcontent">
        <div className="l-container">
          <div className="row align-center">
            <div className="column small-12">
              <Banner className="-text-center" bgImage="/static/images/backgrounds/bg-partner-maryland.jpg">
                <p className="-claim">
                  Explore maps and apps curated <br />
                  by the Resource Watch community of this team?
                </p>
                <Link route="get_involved_detail" params={{ id: 'apps' }}>
                  <a className="c-button -primary -alt">
                    App gallery
                  </a>
                </Link>
              </Banner>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

DevelopYourApp.propTypes = {};
DevelopYourApp.defaultProps = {};

export default DevelopYourApp;

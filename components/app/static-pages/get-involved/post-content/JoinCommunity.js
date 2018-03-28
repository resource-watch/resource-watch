import React from 'react';
import { Link } from 'routes';

// Components
import CardApp from 'components/app/common/CardApp';

function JoinCommunity() {
  const cards = [
    {
      id: 'contact-us',
      title: '',
      description: 'Reach out with comments, questions, or suggestions.',
      link: {
        route: 'about_contact-us',
        label: 'Contact us',
        external: true
      }
    },
    {
      id: 'twitter',
      title: '',
      description: 'Follow us on twitter and join in the conversation.',
      link: {
        route: 'https://twitter.com/resource_watch',
        label: '@resource_watch',
        external: true
      }
    },
    {
      id: 'subscribe',
      title: '',
      description: 'Sign up for our newsletter to receive highlights and updates.',
      link: {
        route: '',
        label: 'Subscribe to our Newsletter',
        external: true
      }
    },
    {
      id: 'partner',
      title: '',
      description: 'Thinking of a partnership? Let’s see what we can do together.',
      link: {
        route: 'https://docs.google.com/forms/d/e/1FAIpQLSdr-dUO07dUNas6XYhq_Hmy_lsRQRtW6U6tsp0Ie4jx7dyFJA/viewform?usp=sf_link',
        label: 'Apply to be a partner',
        external: true
      }
    }
  ];

  return (
    <aside className="l-postcontent">
      <div className="l-container">
        <div className="l-section">
          <div className="row align-center">
            <div className="column small-12">
              <p>
                Have questions about Resource Watch or suggestions for how improve the
                platform? How about an idea for a bold new data partnership? We want to
                hear from you. Join us in the movement to build a more sustainable
                future.
              </p>
            </div>
          </div>
        </div>
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
        {/* Temporary link to Partner Application Guidelines */}
        <Link route="get_involved_detail" params={{ id: 'partner-application-guidelines' }}>
          <a>Partner Application Guidelines</a>
        </Link>
      </div>
    </aside>
  );
}

JoinCommunity.propTypes = {};
JoinCommunity.defaultProps = {};

export default JoinCommunity;

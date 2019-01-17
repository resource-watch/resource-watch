import React, { PureComponent } from 'react';
import { Link } from 'routes';

// components
import CardApp from 'components/app/common/CardApp';
import Banner from 'components/app/common/Banner';

class JoinCommunity extends PureComponent {
  render() {
    const cards = [
      {
        id: 'contact-us',
        title: '',
        description: 'Reach out with comments, questions, or suggestions.',
        link: {
          route: '/about/contact-us',
          label: 'Contact us',
          external: false
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
        id: 'newsletter',
        title: '',
        description: 'Sign up for our newsletter to receive highlights and updates.',
        buttonType: null,
        link: {
          route: '/about/newsletter',
          label: 'Subscribe'
        }
      }
    ];

    return (
      <div>
        <aside className="l-postcontent">
          <div className="l-container">
            <div className="row">
              {cards.map(card => (
                <div key={card.id} className="column small-12 medium-4 large-4 c-card-column">
                  <CardApp
                    title={card.title}
                    className="-compact"
                    description={card.description}
                    link={{ ...card.link }}
                    buttonType={card.id === 'newsletter' ? null : 'primary'}
                  />
                </div>
              ))}
            </div>
          </div>
        </aside>

        <aside>
          <div className="l-container">
            <div className="row align-center">
              <div className="column small-12">
                <Banner className="-text-center" bgImage="/static/images/backgrounds/bg-partner-maryland.jpg">
                  <p className="-claim">
                    Let&rsquo;s build a more sustainable<br /> world together.
                  </p>
                  <Link to="about_partners">
                    <a className="c-btn -primary -alt">Partners</a>
                  </Link>
                </Banner>
              </div>
            </div>
          </div>
        </aside>
      </div>
    );
  }
}

export default JoinCommunity;

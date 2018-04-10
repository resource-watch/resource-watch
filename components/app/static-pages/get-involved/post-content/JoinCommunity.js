import React from 'react';
import { Link } from 'routes';

// Components
import CardApp from 'components/app/common/CardApp';
import Banner from 'components/app/common/Banner';

class JoinCommunity extends React.Component {
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
    }
  ];

  constructor(props) {
    super(props);

    this.state = {
      showNewsletterModal: false
    };
  }

  handleToggleShareModal = (bool) => {
    this.setState({ showNewsletterModal: bool });
  }

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
                  buttonType="primary"
                  />
              </div>
            ))}
            <div className="c-card-app -compact" >
              <div className="card-container">
                <div className="card-content">
                  Sign up for our newsletter to receive highlights and updates.
                </div>
                <div className="card-footer">
                  <button
                    className="c-button"
                    onClick={() => this.handleToggleShareModal(true)}
                    >
                    Subscribe to our newsletter
                    <Modal
                      isOpen={this.state.showNewsletterModal}
                      className="-medium"
                      onRequestClose={() => this.handleToggleShareModal(false)}
                      >
                      <NewsletterModal />
                    </Modal>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <aside>
        <div className="l-container">
          <div className="row align-center">
            <div className="column small-12">
              <Banner className="-text-center" bgImage={'/static/images/backgrounds/bg-partner-maryland.jpg'}>
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

JoinCommunity.propTypes = {};
JoinCommunity.defaultProps = {};

export default JoinCommunity;

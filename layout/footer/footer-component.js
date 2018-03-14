import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';

// Components
import CompoundMenu from 'components/ui/CompoundMenu';
import Carousel from 'components/ui/Carousel';
import Icon from 'components/ui/Icon';

// Modal
import Modal from 'components/modal/modal-component';
import NewsletterModal from 'components/modal/newsletter-modal';

const data = [
  { name: 'Data', route: 'explore' },
  { name: 'Explore Datasets', route: 'explore' },
  { name: 'Planet Pulse', anchor: '/data/pulse' }
];

const topics = [
  { name: 'Topics', route: 'topics' },
  { name: 'Biodiversity', route: 'topics_detail', params: { id: 'biodiversity' } },
  { name: 'Cities', route: 'topics_detail', params: { id: 'cities' } },
  { name: 'Climate', route: 'topics_detail', params: { id: 'climate' } },
  { name: 'Commerce', route: 'topics_detail', params: { id: 'commerce' } },
  { name: 'Energy', route: 'topics_detail', params: { id: 'energy' } },
  { name: 'Food and Agriculture', route: 'topics_detail', params: { id: 'food-and-agriculture' } },
  { name: 'Forests', route: 'topics_detail', params: { id: 'forests' } },
  { name: 'Water', route: 'topics_detail', params: { id: 'water' } }
];

const about = [
  { name: 'About', route: 'about' },
  { name: 'Partners', route: 'about_partners' },
  { name: 'FAQs', route: 'about_faqs' },
  { name: 'Terms of Service', route: 'terms-of-service' },
  { name: 'Privacy', route: 'privacy-policy' }
];

const blog = [
  { name: 'Blog', route: 'insights' },
  { name: 'Recent Signals', route: 'insights' },
  { name: 'Highlighted Signals', route: 'insights' }
];

const getInvolved = [
  { name: 'Get Involved', route: 'get_involved' },
  { name: 'Submit a Story', route: 'get_involved_detail', params: { id: 'submit-an-insight' } },
  { name: 'Contribute Data', route: 'get_involved_detail', params: { id: 'contribute-data' } },
  { name: 'Join the Community', route: 'get_involved_detail', params: { id: 'join-community' } },
  { name: 'App Gallery', route: 'get_involved_detail', params: { id: 'apps' } }
];

class Footer extends React.Component {
  static propTypes = {
    fetchPartners: PropTypes.func,
    footer: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      showNewsletterModal: false
    };
  }

  componentDidMount() {
    this.props.fetchPartners();
  }

  getPartners() {
    const { footer } = this.props;

    return footer.partners.list.map(p => (
      <div key={p.id} className="item">
        <Link route="partner" params={{ id: p.id }}>
          <a>
            <img className="-img" src={`${process.env.STATIC_SERVER_URL}${p.logo.thumb}`} alt={p.name} />
          </a>
        </Link>
      </div>
    ));
  }

  handleToggleShareModal = (bool) => {
    this.setState({ showNewsletterModal: bool });
  }

  render() {
    const { footer } = this.props;
    const menuData = [data, topics, blog, about, getInvolved];

    return (
      <footer className="l-footer">
        <div className="footer-main">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <img
                  className="footer-logo"
                  height={21}
                  width={129}
                  src="/static/images/logo-embed.png"
                  alt="Resource Watch"
                />
              </div>
            </div>
          </div>
          <CompoundMenu items={menuData} />
        </div>

        <div className="footer-social">
          <ul>
            <li>
              <button
                className="c-button -secondary join-us-button"
                onClick={() => this.handleToggleShareModal(true)}
              >
                Subscribe to our Newsletter
                <Modal
                  isOpen={this.state.showNewsletterModal}
                  className="-medium"
                  onRequestClose={() => this.handleToggleShareModal(false)}
                >
                  <NewsletterModal />
                </Modal>
              </button>
            </li>
            <li>
              <a href="https://twitter.com/resource_watch" target="_blank" rel="noopener noreferrer">
                <Icon name="icon-twitter" />
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/ResourceWatch/" target="_blank" rel="noopener noreferrer">
                <Icon name="icon-facebook" />
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-intro">
          <div className="title">
            <Link route="about_partners"><a>Partners</a></Link>
          </div>

          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <div className="c-partners-slider">
                  {footer.partners.list.length ? <Carousel items={this.getPartners()} /> : ''}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-lower">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <div className="footer-container">
                  <div className="footer-item">
                    <a href="http://www.wri.org/" target="_blank" rel="noreferrer noopener">
                      <img src="/static/images/wri-logo.svg" alt="WRI logo" />
                    </a>
                  </div>
                  <div className="footer-item">
                    <p className="-bold">World Resources Institute</p>
                    <p>10 G Street NE Suite 800, Washington, DC 20002, USA</p>
                    <p>Phone +1 (202) 729-7600    |    Fax: +1 (202) 720 7610</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;

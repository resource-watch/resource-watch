import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';

// Components
import CompoundMenu from 'components/ui/CompoundMenu';
import Carousel from 'components/ui/Carousel';
import Icon from 'components/ui/Icon';

class Footer extends React.Component {
  static propTypes = {
    header: PropTypes.object.isRequired,
    footer: PropTypes.object.isRequired,
    fetchPartners: PropTypes.func.isRequired
  };

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

  render() {
    const { footer } = this.props;
    const menuData = footer.items
      .filter(i => i.id !== 'search' && i.id !== 'myrw')
      .map((i) => {
        const parent = [i];
        const { children = [] } = i;
        return [...parent, ...children];
      });

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
          <div className="l-container">
            <div className="row">
              <div className="column small-12">

                <ul>
                  <li>
                    <Link route="newsletter" >
                      <a
                        className="c-button -primary join-us-button"
                      >
                        Subscribe to our newsletter
                      </a>
                    </Link>
                  </li>
                  <li>
                    <a
                      className="c-button -secondary"
                      href="https://twitter.com/resource_watch"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon name="icon-twitter" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
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

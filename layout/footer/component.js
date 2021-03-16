import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';

// components
import CompoundMenu from 'components/ui/CompoundMenu';
import Carousel from 'components/ui/Carousel';
import Icon from 'components/ui/icon';

class Footer extends PureComponent {
  static propTypes = {
    partners: PropTypes.array.isRequired,
    menu: PropTypes.array.isRequired,
  };

  renderPartners() {
    const { partners } = this.props;

    return partners.map((_partner) => (
      <div
        key={_partner.id}
        className="item"
      >
        <Link
          route="partner"
          params={{ id: _partner.id }}
        >
          <a>
            <img
              className="-img"
              src={`${_partner.logo.thumb}`}
              alt={_partner.name}
            />
          </a>
        </Link>
      </div>
    ));
  }

  render() {
    const { partners, menu } = this.props;

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
          <CompoundMenu items={menu} />
        </div>

        <div className="footer-social">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <ul>
                  <li>
                    <Link route="newsletter">
                      <a className="c-button -primary join-us-button">
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
                  {partners.length && typeof window !== 'undefined'
                    ? <Carousel items={this.renderPartners()} /> : ''}
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
                    <a
                      href="http://www.wri.org/"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <img
                        src="/static/images/wri-logo.svg"
                        alt="WRI logo"
                      />
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

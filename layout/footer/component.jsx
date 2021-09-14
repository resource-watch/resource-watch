import Link from 'next/link';

// components
import Icon from 'components/ui/icon';
import FooterLinks from './footer-links';
import PartnersCarousel from './partners-carousel';

export default function Footer() {
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
        <FooterLinks />
      </div>

      <div className="footer-social">
        <div className="l-container">
          <div className="row">
            <div className="column small-12">
              <ul>
                <li>
                  <Link
                    href="/about/newsletter"
                  >
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
          <Link
            href="/about/partners"
          >
            <a>Partners</a>
          </Link>
        </div>

        <div className="l-container">
          <div className="row">
            <div className="column small-12">
              <div className="c-partners-slider">
                <PartnersCarousel />
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

/* eslint max-len: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import renderHTML from 'react-render-html';

// Components
import { Link } from 'routes';
import Layout from 'layout/layout/layout-app';
import Banner from 'components/app/common/Banner';
import CardStatic from 'components/app/common/CardStatic';


class GetInvolvedComponent extends React.PureComponent {
  static propTypes = {
    getInvolvedIndex: PropTypes.object,
    user: PropTypes.object,
    url: PropTypes.string
  };

  render() {
    const {
      getInvolvedIndex,
      user,
      url
    } = this.props;

    const { staticData: data, cards } = getInvolvedIndex;

    const styles = {};

    if (!data) return null;

    if (data && data.photo) {
      styles.backgroundImage = `url(${process.env.STATIC_SERVER_URL}${data.photo.cover})`;
    }

    const cardsStatic = cards.map(c =>
      (
        <div
          key={c.id}
          className="column small-12 medium-6"
        >
          <CardStatic
            className={`-alt ${c.className}`}
            background={c.background}
            clickable={false}
          >
            <div>
              <h2>{c.title}</h2>
              <p>{c.intro}</p>
            </div>
            <div className="buttons -align-left">
              {c.buttons.map(b => (
                <Link key={b.route + b.params.id} route={b.route} params={b.params}>
                  <a className={`c-button ${b.className}`}>{b.text}</a>
                </Link>
            ))}
            </div>
          </CardStatic>
        </div>
      ));

    return (
      <Layout
        title="Get Involved"
        description="Get Involved description"
        className="l-static p-get-involved"
        url={url}
        user={user}
      >
        <section className="l-content">
          <header className="l-content-header">
            <div className="cover" style={styles}>
              <div className="row">
                <div className="column small-12">
                  <div className="content">
                    <h1>{data.title}</h1>
                    <p>{data.summary}</p>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <div className="l-content-body">

            { data.content ?
              (
                <div className="l-container">
                  <article>
                    <div className="row align-center">
                      <div className="column small-12 medium-8">
                        {renderHTML(data.content || '')}
                      </div>
                    </div>
                  </article>
                </div>
              )
            : null }

            <div className="l-container">
              <div className="row">
                {cardsStatic}
              </div>
            </div>
          </div>
        </section>

        <aside className="l-postcontent">
          <div className="l-container">
            <div className="row align-center">
              <div className="column small-12">
                <Banner className="-text-center" bgImage="/static/images/backgrounds/partners-02@2x.jpg">
                  <p className="-claim">
                    Questions, comments, or feedback? <br />
                    Help us improve Resource Watch.
                  </p>
                  <Link to="about_contact-us">
                    <a className="c-button -alt -primary">Contact us</a>
                  </Link>
                </Banner>
              </div>
            </div>
          </div>
        </aside>

      </Layout>
    );
  }
}

export default GetInvolvedComponent;

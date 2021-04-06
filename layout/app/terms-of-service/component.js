import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import renderHTML from 'react-render-html';

// components
import Layout from 'layout/layout/layout-app';

class LayoutTermsOfService extends PureComponent {
  static propTypes = { data: PropTypes.object.isRequired }

  render() {
    const { data } = this.props;
    const styles = { ...(data && data.photo) && { backgroundImage: `url(${data.photo.cover})` } };

    if (!data) return null;

    return (
      <Layout
        title="Terms of service"
        // TO-DO: fill description
        description="Terms of service description"
        className="l-static"
      >
        <section className="l-content">
          <header className="l-content-header">
            <div
              className="cover"
              style={styles}
            >
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
            {!!data.content
              && (
              <div className="l-container">
                <article>
                  <div className="row align-center">
                    <div className="column small-12 medium-8">
                      <div className="c-terms">
                        {renderHTML(data.content)}
                      </div>
                    </div>
                  </div>
                </article>
              </div>
              )}
          </div>
        </section>
      </Layout>
    );
  }
}

export default LayoutTermsOfService;

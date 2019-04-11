import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import renderHTML from 'react-render-html';

// components
import Layout from 'layout/layout/layout-app';

class LayoutPolicy extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
    hostname: PropTypes.string.isRequired
  }

  static defaultProps = { data: null }

  render() {
    const { data, hostname } = this.props;
    const styles = {};

    // TO-DO: do a proper redirect in server, remove this.
    if (!data) return null;

    if (data && data.photo) {
      styles.backgroundImage = `url(${process.env.STATIC_SERVER_URL}${data.photo.cover})`;
    }

    return (
      <Layout
        title="Privacy policy"
        // TO-DO: fill description
        description="Privacy policy description"
        className="l-static"
        hostname={hostname}
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
            {!!data.content &&
              <div className="l-container">
                <article>
                  <div className="row align-center">
                    <div className="column small-12 medium-8">
                      <div className="c-terms">
                        {renderHTML(data.content || '')}
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            }
          </div>
        </section>
      </Layout>
    );
  }
}

export default LayoutPolicy;

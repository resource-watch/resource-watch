import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'routes';
import { connect } from 'react-redux';
import { getTools, setFilters } from 'redactions/admin/tools';

import CardApp from 'components/app/common/CardApp';
import Banner from 'components/app/common/Banner';

class Apps extends React.Component {
  static propTypes = {
    tools: PropTypes.object.isRequired,
    getTools: PropTypes.func.isRequired,
    setFilters: PropTypes.func.isRequired
  };

  static defaultProps = {
    tools: {
      list: []
    }
  };

  componentDidMount() {
    this.props.setFilters([]);
    this.props.getTools();
  }

  render() {
    return (
      <div>
        <div className="l-section">
          <div className="l-container">
            <div className="row">
            {this.props.tools.list.map(app => (
              <div key={app.id} className="column small-12 medium-4 c-card-column">
                <CardApp
                  background={app.thumbnail.medium}
                  title={app.title}
                  description={app.summary}
                  link={{
                    label: 'Go to site',
                    route: app.url,
                    external: true
                  }}
                />
              </div>
            ))}
            </div>
          </div>
        </div>
        <aside className="l-postcontent">
          <div className="l-container">
            <div className="row align-center">
              <div className="column small-12">
                <Banner className="-text-center" bgImage="/static/images/pages/app/bg-banner-planetPulse.jpg">
                  <p className="-claim">
                    View near-real-time data <br />
                    on the Planet
                  </p>
                  <Link to="pulse">
                    <a className="c-button -alt -primary">Launch Planet Pulse</a>
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

export default connect(
  state => ({
    tools: state.tools
  }),
  { getTools, setFilters }
)(Apps);

import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { getTools, setFilters } from 'redactions/admin/tools';

import CardApp from 'components/app/common/CardApp';

class Apps extends React.Component {
  componentDidMount() {
    this.props.setFilters([]);
    this.props.getTools();
  }

  render() {
    return (
      <div className="l-section">
        <div className="l-container">
          <div className="row">
            {this.props.tools.list.map(app => (
              <div key={app.id} className="column small-12 medium-4 c-card-column">
                <CardApp
                  background={app.thumbnail.original}
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
    );
  }
}

Apps.propTypes = {
  tools: PropTypes.object.isRequired,
  getTools: PropTypes.func.isRequired,
  setFilters: PropTypes.func.isRequired
};
Apps.defaultProps = {
  tools: {
    list: []
  }
};

export default connect(
  state => ({
    tools: state.tools.tools
  }),
  { getTools, setFilters }
)(Apps);

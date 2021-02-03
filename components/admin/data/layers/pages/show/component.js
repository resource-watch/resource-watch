import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import LayersForm from 'components/admin/data/layers/form/LayersForm';

class LayersShow extends PureComponent {
  static propTypes = {
    dataset: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
  }

  handleSubmit = () => { window.scrollTo(0, 0); }

  render() {
    const {
      dataset,
      user: { token },
    } = this.props;

    return (
      <div className="c-layers-show">
        {token
          && (
          <LayersForm
            id={dataset}
            application={[process.env.APPLICATIONS]}
            authorization={token}
            onSubmit={this.handleSubmit}
          />
          )}
      </div>
    );
  }
}

export default LayersShow;

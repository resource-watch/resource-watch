import React from 'react';
import PropTypes from 'prop-types';

// Utils
import { substitution } from 'utils/utils';

// Next components
import { Link } from 'routes';

class EditAction extends React.Component {

  getParsedParams() {
    const { data, action } = this.props;

    return JSON.parse(substitution(JSON.stringify(action.params), [{ key: 'id', value: data.dataset }]));
  }

  render() {
    const { action } = this.props;
    return (
      <Link
        route={action.route}
        params={this.getParsedParams(action.params)}
      >
        <a className="c-btn">Go to dataset</a>
      </Link>
    );
  }
}

EditAction.propTypes = {
  data: PropTypes.object,
  action: PropTypes.object
};

export default EditAction;

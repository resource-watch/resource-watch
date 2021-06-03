import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

// Utils
import { substitution } from 'utils/utils';

class EditAction extends React.Component {
  getParsedParams() {
    const { data, action } = this.props;

    return JSON.parse(substitution(JSON.stringify(action.params), [{ key: 'id', value: data.id }]));
  }

  render() {
    const { action } = this.props;
    const {
      tab,
      subtab,
      id,
    } = this.getParsedParams(action.params);

    return (
      <Link href={`/admin/pages/${tab}/${id}/${subtab}`}>
        <a className="c-btn">Edit</a>
      </Link>
    );
  }
}

EditAction.propTypes = {
  data: PropTypes.object,
  action: PropTypes.object,
};

export default EditAction;

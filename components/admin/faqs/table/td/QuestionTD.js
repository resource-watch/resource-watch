import React from 'react';
import PropTypes from 'prop-types';

// Next components
import { Link } from 'routes';

class QuestionTD extends React.Component {
  render() {
    const { row, value, index } = this.props;

    return (
      <td key={index} className="main">
        <Link route="admin_faqs_detail" params={{ tab: 'faqs', id: row.id }}>
          <a>{value}</a>
        </Link>
      </td>
    );
  }
}

QuestionTD.propTypes = {
  row: PropTypes.object,
  value: PropTypes.string,
  index: PropTypes.string
};

export default QuestionTD;

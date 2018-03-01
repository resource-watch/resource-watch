import React from 'react';
import PropTypes from 'prop-types';

function PreviewTD(props) {
  const { value, index } = props;

  return (
    <td key={index}>
      <a target="_blank" href={`/data/topics/${value}`}>
        {`${window.location.origin}/data/topics/${value}`}
      </a>
    </td>
  );
}

PreviewTD.propTypes = {
  value: PropTypes.bool,
  index: PropTypes.string
};

export default PreviewTD;

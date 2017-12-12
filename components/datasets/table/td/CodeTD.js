import React from 'react';
import PropTypes from 'prop-types';

function CodeTD(props) {
  const { value, index } = props;
  const metadata = value.length && value.length > 0 && value[0];
  const metadataInfo = metadata && metadata.attributes && metadata.attributes.info;
  const codeSt = metadataInfo ? metadataInfo.rwId : '';

  return (
    <td key={index} className="main">
      {codeSt}
    </td>
  );
}


CodeTD.propTypes = {
  value: PropTypes.string,
  index: PropTypes.string
};

export default CodeTD;

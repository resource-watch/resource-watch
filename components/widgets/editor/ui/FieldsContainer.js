import React from 'react';
import PropTypes from 'prop-types';
import ColumnBox from 'components/widgets/editor/ui/ColumnBox';

const FieldsContainer = (props) => {
  const { dataset, tableName, fields } = props;
  return (
    <div className="c-fields-container">
      {
        fields.map(val =>
          (
            <ColumnBox
              key={val.columnName}
              name={val.columnName}
              alias={val.alias}
              type={val.columnType}
              datasetID={dataset}
              tableName={tableName}
            />
          )
        )
      }
    </div>
  );
};

FieldsContainer.propTypes = {
  dataset: PropTypes.string.isRequired,
  tableName: PropTypes.string.isRequired,
  fields: PropTypes.array.isRequired
};

export default FieldsContainer;

import React from 'react';
import PropTypes from 'prop-types';
import ColumnBox from 'components/widgets/ColumnBox';

class FieldsContainer extends React.Component {

  render() {
    const { dataset, tableName, fields } = this.props;
    return (
      <div className="c-fields-container">
        <h5>Columns</h5>
        {
        fields.map(val =>
          val.columnType !== 'geometry' && val.columnName !== 'cartodb_id' && (
            <ColumnBox
              key={val.columnName}
              name={val.columnName}
              type={val.columnType}
              datasetID={dataset}
              tableName={tableName}
            />
          )
        )
      }
      </div>
    );
  }
}

FieldsContainer.propTypes = {
  dataset: PropTypes.string.isRequired,
  tableName: PropTypes.string.isRequired,
  fields: PropTypes.array.isRequired
};

export default FieldsContainer;

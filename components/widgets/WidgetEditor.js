import React from 'react';
import { Select } from 'react-select';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import DatasetService from 'services/DatasetService';
import ColumnBox from 'components/widgets/ColumnBox';
import FilterContainer from 'components/widgets/FilterContainer';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

@DragDropContext(HTML5Backend)
class WidgetEditor extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      fields: []
    };

    // DatasetService
    this.datasetService = new DatasetService(props.dataset, {
      apiURL: process.env.WRI_API_URL
    });

    // BINDINGS
  }

  componentDidMount() {
    this.datasetService.getFields().then((response) => {
      this.setState({ fields: response });
    }).catch((error) => {
      console.log('error', error);
    });
  }

  render() {
    const { fields } = this.state;
    return (
      <div className="c-widget-editor">
        <h2>Customize Visualization</h2>
        <div>
          <h5>Chart</h5>

        </div>
        <div className="fields">
          <h5>Columns</h5>
          {fields && fields.fields && fields.fields.map((val, i) =>
            <ColumnBox
              key={`${i}-columnbox`}
              name={val.columnName}
              type={val.columnType}
            />
          )}
        </div>
        <FilterContainer />
      </div>
    );
  }
}

WidgetEditor.propTypes = {
  dataset: React.PropTypes.string
};

export default WidgetEditor;

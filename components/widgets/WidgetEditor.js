import React from 'react';
import { Select } from 'react-select';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import DatasetService from 'services/DatasetService';
import ColumnBox from 'components/widgets/ColumnBox';

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

  componentWillMount() {
    this.datasetService.getFields().then((response) => {
      this.setState({ fields: response });
    }).catch((error) => {
      console.log('error', error);
    });
  }

  render() {
    const { fields } = this.state;
    console.log('fields', fields);
    return (
      <div className="c-widget-editor">
        <h2>Customize Visualization</h2>
        <div>
          <h5>Chart</h5>

        </div>
        <div className="fields">
          <h5>Columns</h5>
          {fields && fields.fields && fields.fields.map(val =>
            <ColumnBox name={val.columnName}/>
          )}
        </div>
      </div>
    );
  }
}

WidgetEditor.propTypes = {
  dataset: React.PropTypes.string
};

export default WidgetEditor;

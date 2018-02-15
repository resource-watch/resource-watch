import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Utils
import { getDatasetDefaultEditableWidget } from 'components/explore-detail/explore-detail-helpers';

// Components
import MediaQuery from 'react-responsive';

// Widget editor
import WidgetEditor from 'widget-editor';

// Modal
import Modal from 'components/modal/modal-component';
import SaveWidgetModal from 'components/modal/SaveWidgetModal';

// Constants
class ExploreDetailWidgetEditor extends PureComponent {
  static propTypes = {
    dataset: PropTypes.object
  }

  state = {
    showSaveModal: false
  }

  handleToggleSaveWidget = (bool) => {
    this.setState({ showSaveModal: bool });
  }

  render() {
    const { dataset } = this.props;
    const defaultEditableWidget = getDatasetDefaultEditableWidget(dataset);

    return (
      <MediaQuery minDeviceWidth={720} values={{ deviceWidth: 720 }}>
        <WidgetEditor
          datasetId={dataset.id}
          widgetId={defaultEditableWidget && defaultEditableWidget.id}
          saveButtonMode="auto"
          embedButtonMode="auto"
          titleMode="auto"
          provideWidgetConfig={(func) => { this.onGetWidgetConfig = func; }}
          onSave={() => this.handleToggleSaveWidget(true)}
        />

        <Modal
          isOpen={this.state.showSaveModal}
          className="-medium"
          onRequestClose={() => this.handleToggleSaveWidget(false)}
        >
          <SaveWidgetModal
            dataset={dataset.id}
            getWidgetConfig={this.onGetWidgetConfig}
          />
        </Modal>
      </MediaQuery>
    );
  }
}

export default ExploreDetailWidgetEditor;

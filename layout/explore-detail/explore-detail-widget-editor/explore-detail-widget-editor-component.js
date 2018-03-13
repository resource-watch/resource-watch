import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Utils
import { getDatasetDefaultEditableWidget } from 'layout/explore-detail/explore-detail-helpers';
import { breakpoints } from 'utils/responsive';

// Components
import MediaQuery from 'react-responsive';

// Widget editor
import WidgetEditor, { VegaChart } from 'widget-editor';

// Modal
import Modal from 'components/modal/modal-component';
import SaveWidgetModal from 'components/modal/SaveWidgetModal';

// Constants
class ExploreDetailWidgetEditor extends PureComponent {
  static propTypes = {
    dataset: PropTypes.object,
    responsive: PropTypes.object
  }

  state = {
    showSaveModal: false
  }

  handleToggleSaveWidget = (bool) => {
    this.setState({ showSaveModal: bool });
  }

  render() {
    const { dataset, responsive } = this.props;
    const defaultEditableWidget = getDatasetDefaultEditableWidget(dataset);

    return (
      <div className="c-explore-detail-widget-editor">
        <MediaQuery
          minDeviceWidth={breakpoints.large}
          values={{ deviceWidth: responsive.fakeWidth }}
        >
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
              onRequestClose={() => this.handleToggleSaveWidget(false)}
            />
          </Modal>
        </MediaQuery>

        {defaultEditableWidget &&
          <MediaQuery
            maxDeviceWidth={breakpoints.large - 1}
            values={{ deviceWidth: responsive.fakeWidth }}
          >
            <VegaChart
              data={defaultEditableWidget.widgetConfig}
              reloadOnResize
            />
          </MediaQuery>
        }

      </div>
    );
  }
}

export default ExploreDetailWidgetEditor;

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import { Router } from 'routes';

// Widget Editor
import WidgetEditor from '@widget-editor/widget-editor';
import RwAdapter from '@widget-editor/rw-adapter';

// components
import Modal from 'components/modal/modal-component';
import LoginModal from 'components/modal/login-modal';
import Spinner from 'components/ui/Spinner';
import ErrorBoundary from 'components/ui/error-boundary';

// Utils
import DefaultTheme from 'utils/widgets/theme';
import { logEvent } from 'utils/analytics';

// Services
import { createWidget } from 'services/widget';

function ExploreDetailVisualization(props) {
  const { widgetId, datasetId, authorization } = props;
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSaveWidget = (widget) => {
    if (!authorization) {
      setLoginModalOpen(true);
      logEvent('Explore (Detail)', 'Anonymous user clicks on Save from Widget Editor', datasetId);
    } else {
      // The widget creation endpoint expects the application property to be
      // of array type
      const newWidget = {
        ...widget.attributes,
        published: false,
        application: process.env.APPLICATIONS.split(','),
        env: process.env.API_ENV
      };

      logEvent('Explore (Detail)', 'Save Widget', datasetId);

      setLoading(true);

      createWidget(newWidget, datasetId, authorization)
        .then(() => {
          Router.pushRoute('myrw', { tab: 'widgets', subtab: 'my_widgets' });
          toastr.success('Success', 'Widget created successfully!');
        }).catch((err) => {
          setLoading(false);
          toastr.error('Error creating widget', err);
        });
    }
  };  

  return (
    <div className="c-explore-detail-visualization">
      <Spinner isLoading={loading} className="-light -relative" />
      <h3>Customize visualization</h3>
      <ErrorBoundary message="There was an error loading the visualization">
        <WidgetEditor
          datasetId={datasetId}
          {...(widgetId && { widgetId })}
          compact
          application="rw"
          onSave={onSaveWidget}
          theme={DefaultTheme}
          adapter={RwAdapter}
          authenticated
          disable={['theme-selection', 'advanced-editor', 'map']}
        />
      </ErrorBoundary>
      <Modal
        isOpen={loginModalOpen}
        onRequestClose={() => setLoginModalOpen(false)}
      >
        <LoginModal />
      </Modal>
    </div>
  );
}

ExploreDetailVisualization.propTypes = {
  widgetId: PropTypes.string,
  datasetId: PropTypes.string.isRequired,
  authorization: PropTypes.string
};

ExploreDetailVisualization.defaultProps = {
  widgetId: null,
  authorization: null
};

export default ExploreDetailVisualization;

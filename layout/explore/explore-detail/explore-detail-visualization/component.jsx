import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import { Router } from 'routes';
import WidgetEditor from '@widget-editor/widget-editor';

// components
import Modal from 'components/modal/modal-component';
import LoginModal from 'components/modal/login-modal';
import Spinner from 'components/ui/Spinner';
import ErrorBoundary from 'components/ui/error-boundary';

// hooks
import useFetchArea from 'hooks/user-areas/fetch-area';

// services
import { createWidget, createWidgetMetadata } from 'services/widget';

// constants
import {
  WIDGET_EDITOR_DEFAULT_THEME,
  WIDGET_EDITOR_DEFAULT_DISABLED_FEATURES,
  WIDGET_EDITOR_COLOUR_SCHEMES,
} from 'constants/widget-editor';

// utils
import { logEvent } from 'utils/analytics';

function ExploreDetailVisualization(props) {
  const {
    widgetId,
    datasetId,
    aoi,
    authorization,
    RWAdapter,
  } = props;
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    data: area,
  } = useFetchArea(aoi, authorization, {}, {
    enabled: !!(aoi && authorization),
  });

  const onSaveWidget = (widget) => {
    if (!authorization) {
      setLoginModalOpen(true);
      logEvent('Explore (Detail)', 'Anonymous user clicks on Save from Widget Editor', datasetId);
    } else {
      // The widget creation endpoint expects the application property to be
      // of array type

      const newWidget = {
        name: widget.name,
        description: widget.description,
        widgetConfig: widget.widgetConfig,
        published: false,
        application: process.env.NEXT_PUBLIC_APPLICATIONS.split(','),
        env: process.env.NEXT_PUBLIC_API_ENV,
      };

      logEvent('Explore (Detail)', 'Save Widget', datasetId);

      setLoading(true);

      createWidget(newWidget, datasetId, authorization)
        .then((newWidgetObject) => {
          // we need to create the metadata object for the new widget in the case
          // where the user entered a caption value for it
          createWidgetMetadata(
            newWidgetObject.id,
            newWidgetObject.dataset,
            {
              language: 'en',
              info: { caption: widget.metadata.caption },
            },
            authorization,
          )
            .then(() => {
              Router.pushRoute('myrw', { tab: 'widgets', subtab: 'my_widgets' });
              toastr.success('Success', 'Widget created successfully!');
            });
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
          {...area?.geostore && { areaIntersection: area.geostore }}
          compact
          onSave={onSaveWidget}
          theme={WIDGET_EDITOR_DEFAULT_THEME}
          adapter={RWAdapter}
          schemes={WIDGET_EDITOR_COLOUR_SCHEMES}
          authenticated
          disable={[
            ...WIDGET_EDITOR_DEFAULT_DISABLED_FEATURES,
            'advanced-editor',
          ]}
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

ExploreDetailVisualization.defaultProps = {
  widgetId: null,
  authorization: null,
  aoi: null,
};

ExploreDetailVisualization.propTypes = {
  widgetId: PropTypes.string,
  datasetId: PropTypes.string.isRequired,
  aoi: PropTypes.string,
  authorization: PropTypes.string,
  RWAdapter: PropTypes.func.isRequired,
};

export default ExploreDetailVisualization;

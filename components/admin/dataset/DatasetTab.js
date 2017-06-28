import React from 'react';
import PropTypes from 'prop-types';

// Components
import DatasetIndex from 'components/admin/dataset/pages/index';
import DatasetNew from 'components/admin/dataset/pages/new';
import DatasetShow from 'components/admin/dataset/pages/show';

export default function DatasetTab(props) {
  const { tab, subtab, id } = props;

  return (
    <div className="c-datasets-tab">
      {!id &&
        <DatasetIndex tab={tab} subtab={subtab} id={id} />
      }

      {id && id === 'new' &&
        <DatasetNew tab={tab} subtab={subtab} id={id} />
      }

      {id && id !== 'new' &&
        <DatasetShow tab={tab} subtab={subtab} id={id} />
      }
    </div>
  );
}

DatasetTab.propTypes = {
  tab: PropTypes.string,
  id: PropTypes.string,
  subtab: PropTypes.string
};

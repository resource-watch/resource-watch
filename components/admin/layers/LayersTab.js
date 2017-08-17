import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';


// Components
import LayersIndex from 'components/admin/layers/pages/index';
import LayersNew from 'components/admin/layers/pages/new';
import LayersShow from 'components/admin/layers/pages/show';

function LayersTab(props) {
  const { tab, subtab, id, user, dataset } = props;

  return (
    <div className="c-layers-tab">
      {user.token && !id &&
        <LayersIndex tab={tab} subtab={subtab} id={id} user={user} />
      }

      {user.token && id && id === 'new' &&
        <LayersNew tab={tab} subtab={subtab} id={id} user={user} dataset={dataset} />
      }

      {user.token && id && id !== 'new' &&
        <LayersShow tab={tab} subtab={subtab} id={id} user={user} />
      }
    </div>
  );
}

LayersTab.propTypes = {
  user: PropTypes.object,
  tab: PropTypes.string,
  id: PropTypes.string,
  subtab: PropTypes.string,
  dataset: PropTypes.string // Id of the dataset to be pre-selected in the New layer form
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(LayersTab);

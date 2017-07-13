import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Components
import LayersIndex from 'components/admin/layers/pages/index';
import LayersNew from 'components/admin/layers/pages/new';
import LayersShow from 'components/admin/layers/pages/show';

function LayersTab(props) {
  const { tab, subtab, id, user } = props;

  return (
    <div className="c-layers-tab">
      {user.token && !id &&
        <LayersIndex tab={tab} subtab={subtab} id={id} user={user} />
      }

      {user.token && id && id === 'new' &&
        <LayersNew tab={tab} subtab={subtab} id={id} user={user} />
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
  subtab: PropTypes.string
};

const mapStateToProps = state => ({
  user: state.user
});

export default withRedux(initStore, mapStateToProps, null)(LayersTab);

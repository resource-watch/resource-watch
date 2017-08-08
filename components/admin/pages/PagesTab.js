import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Components
import PagesIndex from 'components/admin/pages/pages/index';
import PagesNew from 'components/admin/pages/pages/new';
import PagesShow from 'components/admin/pages/pages/show';

function PagesTab(props) {
  const { tab, subtab, id, user } = props;

  return (
    <div className="c-pages-tab">
      {user.token && !id &&
        <PagesIndex tab={tab} subtab={subtab} id={id} user={user} />
      }

      {user.token && id && id === 'new' &&
        <PagesNew tab={tab} subtab={subtab} id={id} user={user} />
      }

      {user.token && id && id !== 'new' &&
        <PagesShow tab={tab} subtab={subtab} id={id} user={user} />
      }
    </div>
  );
}

PagesTab.propTypes = {
  user: PropTypes.object,
  tab: PropTypes.string,
  id: PropTypes.string,
  subtab: PropTypes.string
};

const mapStateToProps = state => ({
  user: state.user
});

export default withRedux(initStore, mapStateToProps, null)(PagesTab);

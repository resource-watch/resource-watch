import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// Components
import WidgetsIndex from 'components/app/myrw/widgets/tabs/list';
import WidgetsEdit from 'components/app/myrw/widgets/tabs/edit';
import WidgetsNew from 'components/app/myrw/widgets/tabs/new';

function WidgetsTab(props) {
  const { tab, subtab, id, user, dataset } = props;

  return (
    <div className="c-widgets-tab">
      {!id && user.token &&
        <WidgetsIndex tab={tab} subtab={subtab} id={id} />
      }

      {id && subtab === 'edit' && user.token &&
        <WidgetsEdit tab={tab} subtab={subtab} id={id} dataset={dataset} />
      }

      {id === 'new' && user.token &&
        <WidgetsNew tab={tab} subtab={subtab} dataset={dataset === 'new' ? null : dataset} />
      }
    </div>
  );
}

WidgetsTab.propTypes = {
  user: PropTypes.object,
  tab: PropTypes.string,
  id: PropTypes.string,
  subtab: PropTypes.string,
  dataset: PropTypes.string
};

const mapStateToProps = state => ({ user: state.user });

export default connect(mapStateToProps, null)(WidgetsTab);

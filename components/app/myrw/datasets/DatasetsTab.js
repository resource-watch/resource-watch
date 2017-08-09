import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';


// Components
import DatasetsIndex from 'components/app/myrw/datasets/pages/index';
import DatasetsNew from 'components/app/myrw/datasets/pages/new';
import DatasetsShow from 'components/app/myrw/datasets/pages/show';

function DatasetsTab(props) {
  const { tab, subtab, id, user } = props;

  return (
    <div className="c-datasets-tab">
      {!id && user.token &&
        <DatasetsIndex tab={tab} subtab={subtab} id={id} user={user} />
      }

      {id && id === 'new' && user.token &&
        <DatasetsNew tab={tab} subtab={subtab} id={id} user={user} />
      }

      {id && id !== 'new' && user.token &&
        <DatasetsShow tab={tab} subtab={subtab} id={id} user={user} />
      }
    </div>
  );
}

DatasetsTab.propTypes = {
  user: PropTypes.object,
  tab: PropTypes.string,
  id: PropTypes.string,
  subtab: PropTypes.string
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(DatasetsTab);

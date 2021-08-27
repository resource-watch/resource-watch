import PropTypes from 'prop-types';

// hooks
import {
  useMe,
} from 'hooks/user';

// components
import DatasetsIndex from 'components/app/myrw/datasets/pages/index';
import DatasetsNew from 'components/app/myrw/datasets/pages/new';
import DatasetsShow from 'components/app/myrw/datasets/pages/show';

function DatasetsTab(props) {
  const {
    tab, subtab, id,
  } = props;
  const {
    data: user,
  } = useMe();

  return (
    <div className="c-datasets-tab">
      {!id && user?.token
        && <DatasetsIndex tab={tab} subtab={subtab} id={id} user={user} />}

      {id && id === 'new' && user.token
        && <DatasetsNew tab={tab} subtab={subtab} id={id} user={user} />}

      {id && id !== 'new' && user.token
        && <DatasetsShow tab={tab} subtab={subtab} id={id} user={user} />}
    </div>
  );
}

DatasetsTab.defaultProps = {
  id: null,
  tab: null,
  subtab: null,
};

DatasetsTab.propTypes = {
  tab: PropTypes.string,
  id: PropTypes.string,
  subtab: PropTypes.string,
};

export default DatasetsTab;

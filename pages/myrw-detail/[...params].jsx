import {
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// actions
import { getUserAreas } from 'redactions/user';

// components
import LayoutMyRWDetail from 'layout/myrw/detail';

const MyRWDetailPage = ({
  getUserAreas: getUserAreasAction,
}) => {
  useEffect(() => { getUserAreasAction(); }, [getUserAreasAction]);

  return (<LayoutMyRWDetail />);
};

MyRWDetailPage.propTypes = {
  getUserAreas: PropTypes.func.isRequired,
};

export default connect(
  null,
  { getUserAreas },
)(MyRWDetailPage);

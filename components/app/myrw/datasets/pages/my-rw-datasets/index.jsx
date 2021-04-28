import {
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';

// actions
import {
  setFilters, setPaginationPage, setOrderDirection, getDatasetsByTab,
} from 'redactions/admin/datasets';

import MyRWDatasetsMy from './my-rw-datasets-component';

const MyRWDatasetsMyContainer = (props) => {
  const {
    setPaginationPage: setPaginationPageAction,
    setFilters: setFiltersAction,
  } = props;
  const {
    query: {
      params,
    },
  } = useRouter();

  const tab = params?.[0] || null;
  const subtab = params?.[1] || null;

  useEffect(() => {
    setPaginationPageAction(1);
    setFiltersAction([]);
  }, [setPaginationPageAction, setFiltersAction]);

  return (
    <MyRWDatasetsMy
      {...props}
      tab={tab}
      subtab={subtab}
      routes={{
        index: '/myrw',
        detail: '/myrw-detail',
      }}
    />
  );
};

MyRWDatasetsMyContainer.propTypes = {
  setFilters: PropTypes.func.isRequired,
  setPaginationPage: PropTypes.func.isRequired,
};

// class MyRWDatasetsMyContainer extends PureComponent {
//   static propTypes = {
//     subtab: PropTypes.string,
//     setFilters: PropTypes.func,
//     setPaginationPage: PropTypes.func,
//   };

//   UNSAFE_componentWillReceiveProps(nextProps) {
//     const { subtab } = this.props;

//     if (subtab !== nextProps.subtab) {
//       this.props.setPaginationPage(1);
//       this.props.setFilters([]);
//     }
//   }

//   render() {
//     return (
//       <MyRWDatasetsMy
//         {...this.props}
//         routes={{
//           index: '/myrw',
//           detail: '/myrw-detail',
//         }}
//       />
//     );
//   }
// }

const mapStateToProps = (state) => ({
  user: state.user,
  // subtab: state.routes.query.subtab,
  orderDirection: state.datasets.datasets.orderDirection,
  filters: state.datasets.datasets.filters,
  pagination: state.datasets.datasets.pagination,
  // routes: state.routes,
});

const mapDispatchToProps = {
  setFilters,
  setPaginationPage,
  setOrderDirection,
  getDatasetsByTab,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyRWDatasetsMyContainer);

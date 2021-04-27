import { connect } from 'react-redux';
import { useRouter } from 'next/router';
// component
import LayoutAdminDataDetail from './component';

const LayoutAdminDataDetailContainer = (props) => {
  const {
    query: {
      params,
    },
  } = useRouter();

  return (
    <LayoutAdminDataDetail
      {...props}
      query={{
        tab: params?.[0],
        id: params?.[1],
        subtab: params?.[2],
      }}
    />
  );
};

export default connect(
  (state) => ({
    user: state.user,
    locale: state.common.locale,
  }),
  null,
)(LayoutAdminDataDetailContainer);

// hoc
import {
  withRedux,
  withUserServerSide,
  withAdminRole,
} from 'hoc/auth';

// components
import LayoutAdminPagesDetail from 'layout/admin/pages-detail';

export default function AdminStaticPagesDetail() {
  return (<LayoutAdminPagesDetail />);
}

export const getServerSideProps = withRedux(withUserServerSide(withAdminRole()));

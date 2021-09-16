// hoc
import {
  withRedux,
  withUserServerSide,
  withAdminRole,
} from 'hoc/auth';

// components
import LayoutAdminToolsDetail from 'layout/admin/tools-detail';

export default function AdminToolsDetailPage() {
  return (<LayoutAdminToolsDetail />);
}

export const getServerSideProps = withRedux(withUserServerSide(withAdminRole()));

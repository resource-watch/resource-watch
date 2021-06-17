// hoc
import {
  withAdminRole,
} from 'hoc/auth';

// components
import LayoutAdminToolsDetail from 'layout/admin/tools-detail';

export default function AdminToolsDetailPage() {
  return (<LayoutAdminToolsDetail />);
}

export const getServerSideProps = withAdminRole();

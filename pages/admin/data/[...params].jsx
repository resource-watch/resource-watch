// hoc
import {
  withAdminRole,
} from 'hoc/auth';

// components
import LayoutAdminDataDetail from 'layout/admin/data-detail';

export default function AdminDataDetailPage() {
  return (<LayoutAdminDataDetail />);
}

export const getServerSideProps = withAdminRole();

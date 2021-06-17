// hoc
import {
  withAdminRole,
} from 'hoc/auth';

// components
import LayoutAdminPartnersDetail from 'layout/admin/partners-detail';

export default function AdminPartnersDetailPage() {
  return (<LayoutAdminPartnersDetail />);
}

export const getServerSideProps = withAdminRole();

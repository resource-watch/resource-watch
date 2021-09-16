// hoc
import {
  withRedux,
  withUserServerSide,
  withAdminRole,
} from 'hoc/auth';

// components
import LayoutAdminPartnersDetail from 'layout/admin/partners-detail';

export default function AdminPartnersDetailPage() {
  return (<LayoutAdminPartnersDetail />);
}

export const getServerSideProps = withRedux(withUserServerSide(withAdminRole()));

// hoc
import {
  withRedux,
  withUserServerSide,
  withAdminRole,
} from 'hoc/auth';

// components
import LayoutAdminFaqsDetail from 'layout/admin/faqs-detail';

export default function AdminFaqsDetailPage() {
  return (<LayoutAdminFaqsDetail />);
}

export const getServerSideProps = withRedux(withUserServerSide(withAdminRole()));

// hoc
import {
  withRedux,
  withUserServerSide,
  withAdminRole,
} from 'hoc/auth';

// components
import LayoutAdminFaqs from 'layout/admin/faqs';

export default function AdminFaqsPage() {
  return (<LayoutAdminFaqs />);
}

export const getServerSideProps = withRedux(withUserServerSide(withAdminRole()));

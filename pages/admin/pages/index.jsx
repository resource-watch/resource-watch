// hoc
import {
  withAdminRole,
} from 'hoc/auth';

// components
import LayoutAdminStaticPages from 'layout/admin/pages';

export default function AdminStaticPages() {
  return (<LayoutAdminStaticPages />);
}

export const getServerSideProps = withAdminRole();

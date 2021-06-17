// hoc
import {
  withAdminRole,
} from 'hoc/auth';

// components
import LayoutAdminData from 'layout/admin/data';

export default function AdminPage() {
  return (<LayoutAdminData />);
}

export const getServerSideProps = withAdminRole();

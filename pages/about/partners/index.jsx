// actions
import { getPartners } from 'redactions/admin/partners';

// hoc
import {
  withRedux,
  withUserServerSide,
} from 'hoc/auth';

// components
import LayoutPartners from 'layout/app/partners';

export default function PartnersPage() {
  return (<LayoutPartners />);
}

export const getServerSideProps = withRedux(withUserServerSide(async ({ store }) => {
  const { dispatch, getState } = store;
  const { partners: { published } } = getState();

  if (!published.list.length) {
    await dispatch(getPartners({ env: process.env.NEXT_PUBLIC_ENVS_SHOW }));
  }

  return ({
    props: ({}),
  });
}));

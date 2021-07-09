// actions
import { getPartner, getDatasetsByPartner } from 'modules/partners/actions';

// hoc
import {
  withRedux,
  withUserServerSide,
} from 'hoc/auth';

// components
import LayoutPartnerDetail from 'layout/app/partner-detail';

// constants
import { PARTNERS_CONNECTIONS } from 'constants/partners';

export default function PartnerDetailPage() {
  return (<LayoutPartnerDetail />);
}
export const getServerSideProps = withRedux(withUserServerSide(async ({ query, store }) => {
  const { id } = query;
  await store.dispatch(getPartner(id));

  if (PARTNERS_CONNECTIONS[id]) {
    await store.dispatch(getDatasetsByPartner(PARTNERS_CONNECTIONS[id]));
  }

  return ({
    props: ({}),
  });
}));

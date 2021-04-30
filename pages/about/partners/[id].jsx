// actions
import { getPartner, getDatasetsByPartner } from 'modules/partners/actions';

// components
import LayoutPartnerDetail from 'layout/app/partner-detail';

// constants
import { PARTNERS_CONNECTIONS } from 'constants/partners';

export default function PartnerDetailPage() {
  return (<LayoutPartnerDetail />);
}

PartnerDetailPage.getInitialProps = async ({ store, query }) => {
  const { id } = query;
  await store.dispatch(getPartner(id));

  if (PARTNERS_CONNECTIONS[id]) {
    await store.dispatch(getDatasetsByPartner(PARTNERS_CONNECTIONS[id]));
  }

  return ({});
};

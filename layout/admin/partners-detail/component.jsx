import {
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { singular } from 'pluralize';

// components
import Layout from 'layout/layout/layout-admin';
import PartnersNew from 'components/admin/partners/pages/new';
import PartnersShow from 'components/admin/partners/pages/show';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import Title from 'components/ui/Title';

// hooks
import {
  useFetchPartner,
} from 'hooks/partners';

// utils
import { capitalizeFirstLetter } from 'utils/utils';

export default function LayoutAdminPartnersDetail({
  user,
}) {
  const {
    query: {
      params,
    },
  } = useRouter();

  const tab = params?.[0] || null;
  const id = params?.[1] || null;

  const {
    data: partner,
  } = useFetchPartner(id, {
    enabled: !!(id && id !== 'new'),
  });

  const name = useMemo(() => {
    if (id === 'new') return `New ${singular(tab)}`;
    return partner?.name || '-';
  }, [partner, id, tab]);

  return (
    <Layout
      title={name}
      // TO-DO: fill description
      description="Partners detail..."
    >
      <div className="c-page-header -admin">
        <div className="l-container -admin">
          <div className="row">
            <div className="column small-12">
              <div className="page-header-content">
                <Breadcrumbs
                  items={[{ name: capitalizeFirstLetter(tab), route: '/admin/partners' }]}
                />
                <Title className="-primary -huge page-header-title">
                  {name}
                </Title>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="c-page-section">
        <div className="l-container -admin">
          <div className="row">
            <div className="column small-12">
              {(user.token && id) && (id === 'new') && (<PartnersNew />)}
              {(user.token && id) && (id !== 'new') && (<PartnersShow />)}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

LayoutAdminPartnersDetail.propTypes = {
  user: PropTypes.shape({
    token: PropTypes.string.isRequired,
  }).isRequired,
};

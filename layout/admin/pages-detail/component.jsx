import React, {
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { singular } from 'pluralize';

// components
import Layout from 'layout/layout/layout-admin';
import PagesNew from 'components/admin/pages/pages/new';
import PagesShow from 'components/admin/pages/pages/show';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import Title from 'components/ui/Title';

// hooks
import useFetchStaticPage from 'hooks/static-pages/fetch-static-page';

// utils
import { capitalizeFirstLetter } from 'utils/utils';

export default function LayoutAdminStaticPagesDetail({
  user,
}) {
  const {
    query: {
      params,
    },
  } = useRouter();

  const {
    token,
  } = user;

  const tab = params?.[0] || null;
  const id = params?.[1] || null;

  // TO-DO: move this logic to level page (getServerSideProps)
  // once getInitialProps of _app is removed.
  const {
    data,
  } = useFetchStaticPage(
    id,
    token,
    {
      initialData: {},
      initialStale: true,
      refetchOnWindowFocus: false,
      enabled: !!(id !== 'new'),
    },
  );

  const getName = useCallback(() => {
    if (id === 'new') return `New ${singular(tab)}`;

    return data?.title || '-';
  }, [tab, id, data]);

  return (
    <Layout
      title={getName()}
      description={`${data?.summary || 'Loading...'}`}
    >
      <div className="c-page-header -admin">
        <div className="l-container -admin">
          <div className="row">
            <div className="column small-12">
              <div className="page-header-content">
                <Breadcrumbs
                  items={[{ name: capitalizeFirstLetter(tab), route: '/admin/pages' }]}
                />
                <Title className="-primary -huge page-header-title">
                  {getName()}
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
              {id === 'new' && <PagesNew />}
              {id !== 'new' && (<PagesShow />)}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

LayoutAdminStaticPagesDetail.propTypes = {
  user: PropTypes.shape({
    token: PropTypes.string.isRequired,
  }).isRequired,
};

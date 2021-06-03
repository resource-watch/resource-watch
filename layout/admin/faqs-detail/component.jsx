import {
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

// components
import Layout from 'layout/layout/layout-admin';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import Title from 'components/ui/Title';
import FaqsNew from 'components/admin/faqs/pages/new';
import FaqsShow from 'components/admin/faqs/pages/show';

// utils
import { capitalizeFirstLetter } from 'utils/utils';

export default function LayoutAdminFaqsDetail({
  user,
}) {
  const {
    query: {
      params,
    },
  } = useRouter();

  const tab = params?.[0] || null;
  const id = params?.[1] || null;
  const subtab = params?.[2] || null;

  const name = useMemo(() => {
    if (id === 'new') return 'New FAQ';
    if (subtab === 'edit') return 'Edit FAQ';

    return '-';
  }, [id, subtab]);

  return (
    <Layout
      title={name}
      // TO-DO: fill description
      description="Faqs detail..."
    >
      <div className="c-page-header -admin">
        <div className="l-container -admin">
          <div className="row">
            <div className="column small-12">
              <div className="page-header-content">
                <Breadcrumbs
                  items={[{ name: capitalizeFirstLetter(tab), route: '/admin/faqs' }]}
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
              {user.token && id && id === 'new' && (<FaqsNew />)}
              {user.token && id && id !== 'new' && (<FaqsShow />)}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

LayoutAdminFaqsDetail.propTypes = {
  user: PropTypes.shape({
    token: PropTypes.string.isRequired,
  }).isRequired,
};

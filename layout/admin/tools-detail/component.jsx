import {
  useMemo,
} from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { singular } from 'pluralize';

// components
import Layout from 'layout/layout/layout-admin';
import ToolsNew from 'components/admin/tools/pages/new';
import ToolsShow from 'components/admin/tools/pages/show';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import Title from 'components/ui/Title';

// hooks
import {
  useFetchTool,
} from 'hooks/tools';
// utils
import { capitalizeFirstLetter } from 'utils/utils';

export default function LayoutAdminToolsDetail({
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
    data: tool,
  } = useFetchTool(
    id,
    user.token,
    {},
    {
      enabled: !!(id && id !== 'new'),
    },
  );

  const name = useMemo(() => {
    if (id === 'new') return `New ${singular(tab)}`;
    return tool?.title || '-';
  }, [tool, id, tab]);

  return (
    <Layout
      title={name}
      // TO-DO: fill description
      description="Tools detail..."
    >
      <div className="c-page-header -admin">
        <div className="l-container -admin">
          <div className="row">
            <div className="column small-12">
              <div className="page-header-content">
                <Breadcrumbs
                  items={[{ name: capitalizeFirstLetter(tab), route: 'admin_tools', params: { tab } }]}
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
              {(user.token && id) && (id === 'new') && (<ToolsNew />)}
              {(user.token && id) && (id !== 'new') && (<ToolsShow />)}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

LayoutAdminToolsDetail.propTypes = {
  user: PropTypes.shape({
    token: PropTypes.string.isRequired,
  }).isRequired,
};

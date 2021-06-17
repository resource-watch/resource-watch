import {
  useState,
  useEffect,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toastr } from 'react-redux-toastr';
import { singular } from 'pluralize';

// components
import Layout from 'layout/layout/layout-app';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import AreasTabs from 'components/app/myrw/areas';
import DatasetsTab from 'components/app/myrw/datasets/DatasetsTab';
import WidgetsTab from 'components/app/myrw/widgets/WidgetsTab';
import DashboardsTab from 'components/app/myrw/dashboards/DashboardsTab';
import CollectionsTab from 'components/app/myrw/collections';
import Title from 'components/ui/Title';

// hooks
import {
  useMe,
} from 'hooks/user';

// services
import { fetchDashboard } from 'services/dashboard';
import { fetchDataset } from 'services/dataset';
import { fetchWidget } from 'services/widget';
import { fetchArea } from 'services/areas';

// utils
import { capitalizeFirstLetter, listSeperator } from 'utils/utils';
import { getLabel } from 'utils/datasets/dataset-helpers';

// constants
import { MYRW_DETAIL_SUB_TABS } from './constants';

export default function LayoutMyRWDetail({
  locale,
  alerts,
}) {
  const {
    query: {
      params,
    },
  } = useRouter();
  const {
    data: user,
  } = useMe();
  const [data, setData] = useState(null);

  const tab = params?.[0] || null;
  const id = params?.[1] || null;
  const subtab = params?.[2] || null;

  useEffect(() => {
    if (id === 'new') return;

    if (tab === 'dashboards') {
      fetchDashboard(id)
        .then((_data) => { setData(_data); })
        .catch((err) => { toastr.error('Error', err.message); });
    }

    // Fetch the dataset / layer / widget depending on the tab
    if (tab !== 'areas' && tab !== 'dashboards' && tab !== 'collections') {
      let service = fetchDataset;
      if (tab === 'widgets') {
        service = fetchWidget;
      }
      service(id, { language: locale })
        .then((_data) => { setData(_data); })
        .catch((err) => { toastr.error('Error', err); });
    } else {
      if (tab === 'dashboards' || tab === 'collections') return;

      fetchArea(id,
        {
          application: process.env.NEXT_PUBLIC_APPLICATIONS,
          env: process.env.NEXT_PUBLIC_API_ENV,
        },
        { Authorization: user?.token })
        .then((_data) => { setData(_data); })
        .catch((err) => { toastr.error('Error', err); });
    }
  }, [tab, id, subtab, locale, user]);

  const name = useMemo(() => {
    if (id && subtab !== 'alerts') return id === 'new' ? `New ${singular(tab)}` : 'Edit';
    if (data && data.name) return data.name;
    if (data && data.attributes && data.attributes.name) return data.attributes.name;

    return '-';
  }, [data, tab, id, subtab]);

  const alertsLinks = useMemo(() => {
    if (id in alerts) {
      const alert = alerts[id];
      return alert.map((a, k) => (
        <span>
          <Link
            href={`/explore/${a.dataset}`}
            // route="explore"
            // params={{ dataset: a.dataset }}
          >
            <a>
              {getLabel(a.dataset)}
            </a>
          </Link>
          {listSeperator(alert, k)}
        </span>
      ));
    }
    return '';
  }, [alerts, id]);

  return (
    <Layout
      title={name}
      // TO-DO: fill description
      description="Data detail..."
    >
      <div className="c-page-header">
        <div className="l-container">
          <div className="row">
            <div className="column small-12">
              <div className="page-header-content">
                <Breadcrumbs
                  items={[{ name: capitalizeFirstLetter(tab), route: `/myrw/${tab}/${MYRW_DETAIL_SUB_TABS[tab] || ''}` }]}
                />
                <Title className="-primary -huge page-header-title">
                  {name}
                </Title>
                {(subtab === 'alerts')
                  && (
                  <div className="page-header-info">
                    Alerts for
                    {alertsLinks}
                  </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="c-page-section">
        <div className="l-container">
          <div className="row">
            <div className="column small-12">
              <div className="page-header-content">
                {(tab === 'datasets') && (<DatasetsTab tab={tab} subtab={subtab} id={id} />)}
                {(tab === 'areas') && (<AreasTabs tab={tab} subtab={subtab} id={id} />)}
                {(tab === 'widgets') && (<WidgetsTab tab={tab} subtab={subtab} id={id} dataset={id} />)}
                {(tab === 'dashboards') && (<DashboardsTab tab={tab} subtab={subtab} id={id} />)}
                {(tab === 'collections') && (<CollectionsTab tab={tab} subtab={subtab} id={id} />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

LayoutMyRWDetail.propTypes = {
  locale: PropTypes.string.isRequired,
  alerts: PropTypes.shape({}).isRequired,
};

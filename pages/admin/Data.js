import React from 'react';

// Layout
import Page from 'components/admin/layout/Page';
import Layout from 'components/admin/layout/Layout';
import Tabs from 'components/ui/Tabs';

// Tabs
import DatasetTab from 'components/admin/dataset/DatasetTab';
import WidgetTab from 'components/admin/widget/WidgetTab';

// Components
import Title from 'components/ui/Title';

// Contants
const DATA_TABS = [{
  label: 'Datasets',
  value: 'datasets',
  route: 'admin_data',
  params: { tab: 'datasets' }
}, {
  label: 'Widgets',
  value: 'widgets',
  route: 'admin_data',
  params: { tab: 'widgets' }
}, {
  label: 'Layers',
  value: 'layers',
  route: 'admin_data',
  params: { tab: 'layers' }
}, {
  label: 'Dashboards',
  value: 'dashboards',
  route: 'admin_data',
  params: { tab: 'dashboards' }
}, {
  label: 'Vocabularies',
  value: 'vocabularies',
  route: 'admin_data',
  params: { tab: 'vocabularies' }
}];

class Data extends Page {

  constructor(props) {
    super(props);

    const { url } = props;

    this.state = {
      tab: url.query.tab || 'datasets',
      id: url.query.id,
      subtab: url.query.subtab
    };
  }

  componentWillReceiveProps(nextProps) {
    const { url } = nextProps;

    this.setState({
      tab: url.query.tab || 'datasets',
      id: url.query.id,
      subtab: url.query.subtab
    });
  }

  render() {
    const { url, user } = this.props;
    const { tab, subtab, id } = this.state;

    return (
      <Layout
        title="Data"
        description="Data description..."
        user={user}
        url={url}
      >
        {/* PAGE HEADER */}
        <div className="c-page-header -admin">
          <div className="l-container">
            <div className="page-header-content -padding-b-0">
              <Title className="-primary -huge page-header-title" >
                Data
              </Title>
              <Tabs
                options={DATA_TABS}
                defaultSelected={tab}
                selected={tab}
              />
            </div>
          </div>
        </div>
        <div className="c-page-section">
          <div className="l-container">
            {tab === 'datasets' &&
              <DatasetTab tab={tab} subtab={subtab} id={id} />
            }

            {tab === 'widgets' &&
              <WidgetTab tab={tab} subtab={subtab} id={id} />
            }

            {tab === 'layers' &&
              <h2>Layers</h2>
            }

            {tab === 'dashboards' &&
              <h2>Dashboards</h2>
            }

            {tab === 'vocabularies' &&
              <h2>Vocabularies</h2>
            }
          </div>
        </div>
      </Layout>
    );
  }
}

Data.propTypes = {
  user: React.PropTypes.object,
  url: React.PropTypes.object
};


export default Data;

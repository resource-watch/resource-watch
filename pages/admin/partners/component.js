import React, { PureComponent } from 'react';

// components
import Layout from 'layout/layout/layout-admin';
import Tabs from 'components/ui/Tabs';
import PartnersTab from 'components/admin/partners/PartnersTab';
import Title from 'components/ui/Title';

// constants
const DATA_TABS = [{
  label: 'Partners',
  value: 'partners',
  route: 'admin_partners',
  params: { tab: 'partners' }
}];

class AdminPartnersPage extends PureComponent {
  constructor(props) {
    super(props);

    const { url } = props;

    this.state = {
      tab: url.query.tab || 'partners',
      id: url.query.id,
      subtab: url.query.subtab
    };
  }

  componentWillReceiveProps(nextProps) {
    const { url } = nextProps;

    this.setState({
      tab: url.query.tab || 'partners',
      id: url.query.id,
      subtab: url.query.subtab
    });
  }

  render() {
    const { tab, subtab, id } = this.state;

    return (
      <Layout
        title="Partners"
        // TO-DO: fill description
        description="Partners description..."
      >
        {/* PAGE HEADER */}
        <div className="c-page-header -admin">
          <div className="l-container -admin">
            <div className="page-header-content -with-tabs">
              <Title className="-primary -huge page-header-title" >
                Partners
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
          <div className="l-container -admin">
            {tab === 'partners' &&
              (<PartnersTab tab={tab} subtab={subtab} id={id} />)
            }
          </div>
        </div>
      </Layout>
    );
  }
}

export default AdminPartnersPage;

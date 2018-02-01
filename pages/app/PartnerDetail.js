import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { getPartnerData } from 'redactions/partnerDetail';

// Components
import Banner from 'components/app/common/Banner';
import Page from 'components/app/layout/Page';
import Layout from 'components/app/layout/Layout';

// Utils
import { PARTNERS_CONNECTIONS } from 'utils/partners/partnersConnections';

class PartnerDetail extends Page {
  /**
  * COMPONENT LIFECYCLE
  * - componentDidMount
  * - componentWillReceiveProps
  */
  componentDidMount() {
    this.props.getPartnerData(this.props.url.query.id);
  }
  componentWillReceiveProps(newProps) {
    if (this.props.url.query.id !== newProps.url.query.id) {
      this.props.getPartnerData(newProps.url.query.id);
    }
    if (this.props.data !== newProps.data) {
      const datasetIds = PARTNERS_CONNECTIONS.filter(p.partnerId === newProps.data.id).map(elem => elem.datasetId);
    }
  }

  static splitInTwoParts(str) {
    const strArray = str.split(' ');
    const midIndex = Math.floor(strArray.length / 2);
    return [
      strArray.slice(0, midIndex).join(' '),
      strArray.slice(midIndex + 1, strArray.length).join(' ')
    ];
  }

  render() {
    const { data } = this.props;
    const logoPath = data['white-logo'] ? data['white-logo'].medium : '';
    const coverPath = data.cover && data.cover.cover;
    const logo = data.website !== '' ?
      (<a href={data.website} target="_blank" rel="noopener noreferrer">
        <img src={`${process.env.STATIC_SERVER_URL}${logoPath}`} className="logo" title={data.name} alt={data.name} />
      </a>) :
      <img src={`${process.env.STATIC_SERVER_URL}${logoPath}`} className="logo" title={data.name} alt={data.name} />;
    const backgroundImage = { 'background-image': `url(${process.env.STATIC_SERVER_URL}${coverPath})` };

    return (
      <Layout
        title="Partner detail"
        description="Partner detail description"
        url={this.props.url}
        user={this.props.user}
      >
        <div className="c-page partner-detail">
          <Banner
            className="intro -text-center"
            styles={backgroundImage}
            useBackground={false}
          >
            <div className="row">
              <div className="column small-12 partner-header">
                <h4 className="title c-text -default -bold -uppercase">RESOURCE WATCH PARTNER</h4>
                <div className="logo-container">
                  {logo}
                </div>
                <div className="description">
                  <div className="row">
                    <div className="column small-12 medium-12">
                      <p className="c-text -extra-big">{data.summary}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Banner>
          {data.name &&
            <div className="l-container">
              <div className="l-section-mod related-tools">
                <div className="row">
                  <div className="column small-12 datasets-container">
                    <h3>{`Datasets by ${data.name}`}</h3>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>

        <div className="l-container learn-more">
          <div className="row align-center">
            <div className="column small-12">
              <Banner className="-text-center">
                <p className="-claim">
                  Important work,<br /> beautifully crafted
                </p>
                <a
                  className="c-btn -primary -filled"
                  href={data.website}
                  target="_blank"
                >
                  LEARN ABOUT OUR WORK
                </a>
              </Banner>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

PartnerDetail.propTypes = {
  url: PropTypes.object,
  data: PropTypes.object,
  getPartnerData: PropTypes.func
};

PartnerDetail.defaultProps = {
  data: {}
};

const mapStateToProps = state => ({
  data: state.partnerDetail.data
});

const mapDispatchToProps = {
  getPartnerData
};

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(PartnerDetail);

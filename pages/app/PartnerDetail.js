import React from 'react';
import PropTypes from 'prop-types';
import Banner from 'components/app/common/Banner';
import Page from 'components/app/layout/Page';
import Layout from 'components/app/layout/Layout';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { getPartnerData } from 'redactions/partnerDetail';

class PartnerDetail extends Page {
  componentWillMount() {
    this.props.getPartnerData(this.props.url.query.id);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.url.query.id !== newProps.url.query.id) {
      this.props.getPartnerData(newProps.url.query.id);
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
    // const description = data.summary ? this.splitInTwoParts(data.summary) : ['', ''];
    const imgPath = data['white-logo'] ? data['white-logo'].medium : '';
    const logo = data.website !== '' ?
      (<a href={data.website} target="_blank" rel="noopener noreferrer">
        <img src={`${process.env.STATIC_SERVER_URL}${imgPath}`} className="logo" title={data.name} alt={data.name} />
      </a>) :
      <img src={`${process.env.STATIC_SERVER_URL}${imgPath}`} className="logo" title={data.name} alt={data.name} />;

    return (
      <Layout
        title="Partner detail"
        description="Partner detail description"
        url={this.props.url}
        user={this.props.user}
      >
        <div className="c-page partner-detail">
          <Banner className="intro -text-center">
            <div className="row">
              <div className="column small-12">
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
        </div>

        <aside className="l-postcontent">
          <div className="l-container">
            <div className="row align-center">
              <div className="column small-12">
                <Banner className="-text-center">
                  <p className="-claim">
                    Important work,<br /> beautifully crafted
                  </p>
                  <button className="c-btn -primary -filled">
                    LEARN ABOUT OUR WORK
                  </button>
                </Banner>
              </div>
            </div>
          </div>
        </aside>
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

const mapDispatchToProps = dispatch => ({
  getPartnerData: (id) => { dispatch(getPartnerData(id)); }
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(PartnerDetail);

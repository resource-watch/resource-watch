import React from 'react';
import { Link } from 'routes';
import CompoundMenu from 'components/ui/CompoundMenu';
import Carousel from 'components/ui/Carousel';
import { getPartners } from 'redactions/partners';
import { initStore } from 'store';
import withRedux from 'next-redux-wrapper';

const data = [
  { name: 'Data', path: '#' },
  { name: 'Explore Datasets', path: '/explore' },
  { name: 'Dashboards', path: '/dashboards' },
  { name: 'Planet Pulse', path: '/planet-pulse' },
  { name: 'Explore Tools', path: '/get-involved/apps' }
];

const about = [
  { name: 'About', path: '/about' },
  { name: 'Partners', path: '/about/partners' }
];

const insights = [
  { name: 'Insights', path: '/insights' },
  { name: 'Recent insights', path: '#' },
  { name: 'Highlighted insights', path: '#' }
];

const getInvolved = [
  { name: 'Get involved', path: '/get-involved' },
  { name: 'Submit an insight', path: '/get-involved/submit-insight' },
  { name: 'Contribute data', path: '/get-involved/contribute-data' },
  { name: 'Join the community', path: '/get-involved/join-community' }
];

class Footer extends React.Component {

  componentWillMount() {
    this.props.getPartners();
  }

  setPartnersList() {
    const featured = this.props.list.filter(p => p.attributes.featured);

    return featured.map((p, i) => (
      <div key={i} className="item">
        <Link to={`/about/partners/${p.id}`}>
          <img className="-img" src={`${process.env.CMS_API_URL}${p.attributes.logo.thumb}`} alt={p.attributes.name} />
        </Link>
      </div>
    ));
  }

  render() {
    const menuData = [data, about, insights, getInvolved];
    const items = this.setPartnersList();

    return (
      <footer className="c-footer">
        <div className="footer-intro">
          <h1 className="title"><Link to="/about/partners">Partners</Link></h1>
          <div className="partners row">
            <div className="column small-12">
              {items.length ? <Carousel items={items} /> : ''}
            </div>
          </div>
        </div>

        <div className="footer-main">
          <CompoundMenu items={menuData} />
        </div>

        <div className="footer-terms">
          <div className="terms row">
            <div className="column small-12">
              <p>Terms of Service — Privacy</p>
              <p>© 2017 - Resource Watch</p>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

Footer.propTypes = {
  getPartners: React.PropTypes.func,
  list: React.PropTypes.array
};

const mapStateToProps = state => ({
  list: state.partners.list
});

const mapDispatchToProps = dispatch => ({
  getPartners: () => { dispatch(getPartners()); }
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Footer)

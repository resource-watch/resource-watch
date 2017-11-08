/* eslint max-len: 0 */
import React from 'react';
import { Link } from 'routes';
import classnames from 'classnames';
import { Autobind } from 'es-decorators';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Layout
import Page from 'components/app/layout/Page';
import Head from 'components/app/layout/head';

// Components
import Spinner from 'components/ui/Spinner';


//-----PANORAMA------------
const PANORAMAS = [
  {
    name: 'coral',
    options: [
      {
        name: 'healthy',
        label: 'Healthy',
        image: '../../static/images/splash/healthy.jpg'
      },
      {
        name: 'bleached',
        label: 'Bleached',
        image: '../../static/images/splash/bleached.jpg'
      },
      {
        name: 'dead',
        label: 'Dead',
        image: '../../static/images/splash/dead.jpg'
      }
    ]
  },

];

const HEALTHY_CORAL_IMAGE = '../../static/images/splash/healthy.jpg';
const BLEACHED_CORAL_IMAGE = '../../static/images/splash/bleached.jpg';
const DEAD_CORAL_IMAGE = '../../static/images/splash/dead.jpg';

class SplashDetail extends Page {
  // static getInitialProps({ query }) {
  //   return { query };
  // }
  constructor(props) {
    super(props);
    console.log('props', props);
    this.state = {
    };
  }

  componentDidMount() {
    super.componentDidMount();
  }

  render() {

    return (
      <div
        title="Resource Watch"
        className="page-splash"
      >
        <Head
          title="SplashDetail page"
          description="SplashDetail page description"
        />
        <div className="header">
          <Link route="home">
            <img src="../../static/images/logo.png" alt="Resource Watch" />
          </Link>
          <Link route="home">
            <a>GO TO RESOURCE WATCH</a>
          </Link>
        </div>
      </div>
    );
  }
}

// const mapStateToProps = state => ();
//
// const mapDispatchToProps = dispatch => ({
//
// });

export default withRedux(initStore, null, null)(SplashDetail);

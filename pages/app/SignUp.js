import React from 'react';
import { initStore } from 'store';
import { getStaticData } from 'redactions/static_pages';
import withRedux from 'next-redux-wrapper';
import Page from 'components/app/layout/Page';
import Layout from 'components/app/layout/Layout';

class SignUp extends Page {
  componentWillMount() {
    this.props.getStaticData('about');
  }

  render() {
    return (
      <Layout
        title="Sign Up"
        description="Sign Up description"
      >
        <div className="p-about">
          <div className="c-page">
            <section className="l-section">
              <div className="l-container">
                <div className="row collapse">
                  <h1>Sign up</h1>
                </div>
              </div>
            </section>
          </div>
        </div>
      </Layout>
    );
  }
}

SignUp.propTypes = {
  data: React.PropTypes.object,
  getStaticData: React.PropTypes.func
};

const mapStateToProps = state => ({
  data: state.staticPages.about
});

const mapDispatchToProps = dispatch => ({
  getStaticData: (slug, ref) => { dispatch(getStaticData(slug, ref)); }
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(SignUp)

import React from 'react';
import { initStore } from 'store';
import { getStaticData } from 'redactions/static_pages';
import withRedux from 'next-redux-wrapper';
import Page from 'components/app/layout/Page';

class SignUp extends React.Component {
  componentWillMount() {
    this.props.getStaticData('about');
  }

  render() {
    return (
      <Page
        title="Sign Up"
        description="Sign Up description"
        url={this.props.url}
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
      </Page>
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

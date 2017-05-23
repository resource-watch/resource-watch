import React from 'react';

class SignUp extends React.Component {
  componentWillMount() {
    // this.props.getStaticData('about');
  }

  render() {
    return (
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
    );
  }
}

SignUp.propTypes = {
  // data: React.PropTypes.object,
  // getStaticData: React.PropTypes.func
};

export default SignUp;

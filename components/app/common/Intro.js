import React from 'react';
import PropTypes from 'prop-types';
import Banner from 'components/app/common/Banner';

function Intro({ title = '', intro = '', styles = {} }) {
  const isIntroString = typeof intro === 'string';

  return (
    <div className="c-intro">
      <div className="intro-bg">
        <div className="top" />
      </div>
      <section className="l-section">
        <div className="row">
          <div className="column small-12">
            <Banner className="intro" styles={styles} />
          </div>
          <div className="column small-12 medium-8 medium-offset-2">
            <h1 className="c-text -header-big -thin -dark">{title}</h1>
            <p className="c-text -huge -italic">
              {!isIntroString ?
                intro.map((line, i) => (
                  <span key={i}>
                    {line}{(i !== intro.length - 1) && <br /> }
                  </span>)) :
                intro
              }
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

Intro.propTypes = {
  title: PropTypes.string.isRequired,
  intro: PropTypes.any,
  styles: PropTypes.object
};

export default Intro;

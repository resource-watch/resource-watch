import React from 'react';
import PropTypes from 'prop-types';
import renderHTML from 'react-render-html';
import { Link } from 'routes';

// components
import Banner from 'components/app/common/Banner';

export default function SubmitAnInsight({ content }) {
  return (
    <section className="l-content">
      <article className="l-content-body">
        <div className="l-container">
          <div className="row align-center">
            <div className="column small-12 medium-8">
              { renderHTML(content) }
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}

SubmitAnInsight.propTypes = {
  content: PropTypes.string
};

SubmitAnInsight.defaultProps = {
  content: ''
};

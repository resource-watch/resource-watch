import React from 'react';
import PropTypes from 'prop-types';
import renderHTML from 'react-render-html';


const StaticContentComponent = ({ content }) => {
  const emptyContent = '<p><br></p>';
  if (content === emptyContent) return null;

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
};

StaticContentComponent.propTypes = {
  content: PropTypes.string
};

StaticContentComponent.defaultProps = {
  content: ''
};

export default StaticContentComponent;

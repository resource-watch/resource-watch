import React from 'react';
import PropTypes from 'prop-types';
import renderHTML from 'react-render-html';


const StaticContentComponent = ({ content = '' }) => {
  const emptyContent = '<p><br></p>';
  if (content === emptyContent) return null;

  return (
    <section className="l-content">
      <article className="l-content-body">
        <div className="l-container">
          <div className="row align-center">
            <div className="column small-12 medium-8">
              <div className="c-terms">
                { renderHTML(content) }
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
};

StaticContentComponent.propTypes = { content: PropTypes.string.isRequired };

export default StaticContentComponent;

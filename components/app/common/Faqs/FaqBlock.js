import React from 'react';
import PropTypes from 'prop-types';
import renderHTML from 'react-render-html';

function FaqBlock(props) {
  const faq = props.item;

  if (!faq) {
    return null;
  }

  return (
    <article className="c-faq">
      <h3>{faq.question}</h3>
      <p>{renderHTML(faq.answer)}</p>
    </article>
  );
}

FaqBlock.propTypes = {
  item: PropTypes.object
};

export default FaqBlock;

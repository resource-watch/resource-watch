import React from 'react';
import PropTypes from 'prop-types';

function FaqBlock(props) {
  const faq = props.item;

  if (!faq) {
    return null;
  }

  return (
    <article className="c-faq">
      <h3>{faq.question}</h3>
      <p>{faq.answer}</p>
    </article>
  );
}

FaqBlock.propTypes = {
  item: PropTypes.object
};

export default FaqBlock;

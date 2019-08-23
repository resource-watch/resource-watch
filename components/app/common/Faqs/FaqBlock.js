import React from 'react';
import PropTypes from 'prop-types';
import renderHTML from 'react-render-html';
import {
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel
} from 'react-accessible-accordion';

function FaqBlock(props) {
  const faq = props.item;

  if (!faq) {
    return null;
  }

  return (
    <AccordionItem className="c-faq">
      <AccordionItemHeading>
        <AccordionItemButton>
          {faq.question}
        </AccordionItemButton>
      </AccordionItemHeading>
      <AccordionItemPanel>
        {renderHTML(faq.answer)}
      </AccordionItemPanel>
    </AccordionItem>
  );
}

FaqBlock.propTypes = { item: PropTypes.object.isRequired };

export default FaqBlock;

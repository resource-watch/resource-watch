import React from 'react';
import PropTypes from 'prop-types';

// Drag and drop
import { SortableContainer } from 'react-sortable-hoc';

// Components
import FaqsListItem from './FaqsListItem';


const FaqsList = (props) => {
  const { items } = props;

  return (
    <ul className="faqs-list">
      {items.map((faq, index) => {
        const itemConfig = {
          editAction: {
            name: 'Edit',
            params: {
              id: faq.id,
              subtab: 'edit',
              tab: 'faqs'
            },
            route: 'admin_faqs_detail'
          },
          removeAction: {
            name: 'Remove',
            params: {
              id: faq.id,
              subtab: 'remove',
              tab: 'faqs'
            },
            route: 'admin_faqs_detail'
          },
          data: {
            id: faq.id,
            order: faq.order,
            question: faq.question,
            answer: faq.answer
          }
        };

        return (
          <FaqsListItem
            {...itemConfig}
            key={`faq-item-${faq.id}`}
            index={faq.order || index}
            value={faq}
            authorization={props.authorization}
            getFaqs={props.getFaqs}
          />
        );
      })}
    </ul>
  );
};

FaqsList.propTypes = {
  getFaqs: PropTypes.func,
  items: PropTypes.array,
  authorization: PropTypes.string
};

export default SortableContainer(FaqsList);

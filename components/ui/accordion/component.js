import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import renderHTML from 'react-render-html';

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel
} from 'react-accessible-accordion';

// styles
import './styles.scss';

class AccordionComponent extends PureComponent {
  static propTypes = {
    allowZeroExpanded: PropTypes.bool,
    allowMultipleExpanded: PropTypes.bool,
    items: PropTypes.array.isRequired
  }

  static defaultProps = { allowZeroExpanded: true, allowMultipleExpanded: true };

  render() {
    const { allowMultipleExpanded, allowZeroExpanded, items } = this.props;
    return (
      <Accordion
        className="c-accordion"
        allowMultipleExpanded={allowMultipleExpanded}
        allowZeroExpanded={allowZeroExpanded}
      >
        {items.map(item => (
          <div
            className="row align-center"
            key={item.id}
          >
            <div className="column small-12 medium-8">
              <AccordionItem>
                <AccordionItemHeading>
                  <AccordionItemButton>
                    {item.title}
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>
                  {renderHTML(item.content)}
                </AccordionItemPanel>
              </AccordionItem>
            </div>
          </div>)
        )}
      </Accordion>
    );
  }
}

export default AccordionComponent;

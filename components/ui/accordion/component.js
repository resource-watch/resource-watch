import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import renderHTML from 'react-render-html';
import classnames from 'classnames';

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';

// styles
import './styles.scss';

class AccordionComponent extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    items: PropTypes.array.isRequired,
  }

  static defaultProps = { className: null };

  render() {
    const { items, className, ...accordionProps } = this.props;
    const classNameValue = classnames({
      'c-accordion': true,
      [className]: !!className,
    });
    return (
      <Accordion
        className={classNameValue}
        {...accordionProps}
      >
        {items.map((item) => (
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
          </div>
        ))}
      </Accordion>
    );
  }
}

export default AccordionComponent;

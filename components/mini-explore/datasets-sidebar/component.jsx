import {
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';

// components
import DatasetCardList from 'components/datasets/card-list';
import Icon from 'components/ui/icon';
import MiniExploreDatasetsActions from './dataset-actions';

export default function DatasetsSidebar({
  datasetGroups,
  handleAddMap,
}) {
  const expandedGroupsByDefault = useMemo(
    () => datasetGroups
      .map(({ id }) => id),
    [datasetGroups],
  );

  return (
    <div className="datasets-sidebar">
      <Accordion
        allowMultipleExpanded
        allowZeroExpanded
        preExpanded={expandedGroupsByDefault}
      >
        {datasetGroups.map(({
          id,
          title,
          datasets,
        }) => {
          const datasetCounter = `${datasets.length} dataset${(datasets.length > 1) ? 's' : ''}`;

          return (
            <AccordionItem
              key={id}
              uuid={id}
            >
              <div className="dataset-group">
                <AccordionItemHeading>
                  <AccordionItemButton>
                    <div className="group-header">
                      <div className="group-header-title">
                        <Icon
                          name="icon-arrow-right-2"
                          style={{
                            width: 10,
                            height: 10,
                          }}
                        />
                        <h4>
                          {title}
                        </h4>
                      </div>
                      <div className="number-of-datasets">
                        {datasetCounter}
                      </div>
                    </div>
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>
                  <DatasetCardList
                    numberOfPlaceholders={2}
                    list={datasets}
                    actions={(
                      <MiniExploreDatasetsActions
                        handleAddMap={handleAddMap}
                      />
                  )}
                  />
                </AccordionItemPanel>
              </div>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

DatasetsSidebar.propTypes = {
  datasetGroups: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      datasets: PropTypes.arrayOf(
        PropTypes.shape({}),
      ).isRequired,
      default: PropTypes.string,
    }),
  ).isRequired,
  handleAddMap: PropTypes.func.isRequired,
};

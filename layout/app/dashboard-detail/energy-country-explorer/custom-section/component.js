import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import classnames from 'classnames';

// Components
import WidgetBlock from 'components/wysiwyg/widget-block';

// Services
import { fetchWidget } from 'services/widget';


function Section(props) {
    const { header, description, widgets, user } = props;
    const [widgetBlocks, setWidgetBlocks] = useState(widgets.map(w => ({
        content: {
            widgetId: w
        }
    })));
    const [data, setData] = useState({});

    useEffect(() => {
        widgets.forEach(w => {
            fetchWidget(w, { includes: 'metadata' })
                .then((response) => {
                    setData({
                        ...data,
                        [w]: response
                    })
                })
                .catch(err => toastr.error(`Error loading widget ${w}`, err));
        });
    }, [widgets]);

    const widgetBlockClassName = classnames({
        'column': true,
        'small-12': true,
        'medium-6': widgets.length > 1,
        'large-4': widgets.length > 2
    });

    return (
        <div className="c-custom-section l-section">
            <div className="l-container">
                <div className="row">
                    <div className="column small-12">
                        <h2>{header}</h2>
                        <p>{description}</p>
                        <div className="row">
                            {widgetBlocks.map(block =>
                                <div className={widgetBlockClassName}>
                                    <WidgetBlock
                                        user={user}
                                        item={block}
                                        data={data}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

Section.propTypes = {
    header: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    widgets: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired
};

export default Section;
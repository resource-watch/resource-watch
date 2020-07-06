import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Renderer from '@widget-editor/renderer';

import {
    Tooltip
} from 'vizzuality-components';

// components
import TextChart from 'components/widgets/charts/TextChart';
import LoginRequired from 'components/ui/login-required';
import Icon from 'components/ui/icon';
import Title from 'components/ui/Title';
import Spinner from 'components/ui/Spinner';
import CollectionsPanel from 'components/collections-panel';
import Modal from 'components/modal/modal-component';
import ShareModal from 'components/modal/share-modal';
import ErrorBoundary from 'components/ui/error-boundary';
import RankingWidget from './ranking-widget';

// utils
import { logEvent } from 'utils/analytics';

// helpers
import { belongsToACollection } from 'components/collections-panel/collections-panel-helpers';

// Styles
import './styles.scss';

function DashboardWidgetCard(props) {
    const { user, widget, loading, explicitHeight } = props;
    const widgetConfig = widget && widget.widgetConfig;
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [infoCardOpen, setInfoCardOpen] = useState(false);
    const widgetType = widget && widget.type;
    const metadataInfo = (widget && (widget.metadata && widget.metadata.length > 0 &&
        widget.metadata[0].info)) || {};

    const widgetLinks = metadataInfo.widgetLinks || [];
    const caption = metadataInfo.caption;
    const widgetIsEmbed = widgetConfig && widgetConfig.type === 'embed';
    const widgetIsRanking = widgetConfig && widgetConfig.type === 'ranking';
    const widgetEmbedUrl = widgetIsEmbed && widgetConfig.url;
    const isInACollection = widget && belongsToACollection(user, widget);
    const isMapWidget = widgetType === 'widget' 
        && widgetConfig && widgetConfig.paramsConfig 
        && widgetConfig.paramsConfig.visualizationType === 'map';
    const starIconName = classnames({
        'icon-star-full': isInACollection,
        'icon-star-empty': !isInACollection
    });
    const modalIcon = classnames({
        'icon-cross': infoCardOpen,
        'icon-info': !infoCardOpen
    });

    const classNameValue = classnames({
        'c-dashboard-widget-card': true,
        '-embed-widget': widgetIsEmbed
    });

    const classNameWidgetContainer = classnames({
        'widget-container': true,
        '-full-height': widgetIsEmbed
    });
    
    return (
        <div className={classNameValue}>
            <header>
                <div className="header-container">
                    <Title className="-default">{widget ? widget.name : '–'}</Title>
                    <div className="buttons">
                        <ul>
                            <li>
                                <button
                                    className="c-btn -tertiary -clean"
                                    onClick={() => setShareModalOpen(true)}
                                >
                                    <Icon
                                        name="icon-share"
                                        className="-small"
                                    />
                                </button>

                                <Modal
                                    isOpen={shareModalOpen}
                                    className="-medium"
                                    onRequestClose={() => setShareModalOpen(false)}
                                >
                                    <ShareModal
                                        links={{
                                            link: typeof window !== 'undefined' && widget && `${window.location.origin}/embed/${widgetType}/${widget.id}`,
                                            embed: typeof window !== 'undefined' && widget && `${window.location.origin}/embed/${widgetType}/${widget.id}`
                                        }}
                                        analytics={{
                                            facebook: () => logEvent('Share (embed)', `Share widget: ${widget.name}`, 'Facebook'),
                                            twitter: () => logEvent('Share (embed)', `Share widget: ${widget.name}`, 'Twitter'),
                                            email: () => logEvent('Share', `Share widget: ${widget.name}`, 'Email'),
                                            copy: type => logEvent('Share (embed)', `Share widget: ${widget.name}`, `Copy ${type}`)
                                        }}
                                    />
                                </Modal>
                            </li>

                            <li>
                                <LoginRequired>
                                    <Tooltip
                                        overlay={<CollectionsPanel
                                            resource={widget}
                                            resourceType="widget"
                                        />}
                                        overlayClassName="c-rc-tooltip"
                                        overlayStyle={{ color: '#fff' }}
                                        placement="bottomLeft"
                                        trigger="click"
                                    >
                                        <button
                                            className="c-btn favourite-button"
                                            tabIndex={-1}
                                        >
                                            <Icon
                                                name={starIconName}
                                                className="-star -small"
                                            />
                                        </button>
                                    </Tooltip>
                                </LoginRequired>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    onClick={() => setInfoCardOpen(!infoCardOpen)}
                                >
                                    <Icon name={modalIcon} className="-small" />
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </header>
            <ErrorBoundary message="There was an error loading the visualization">
                <div className={classNameWidgetContainer}>
                    <Spinner isLoading={loading} className="-light -small" />
                    {widgetType === 'text' && widget &&
                        <TextChart
                            widgetConfig={widgetConfig}
                            toggleLoading={loading => onToggleLoading(loading)}
                        />
                    }

                    {widgetType === 'widget' && !widgetIsEmbed && !widgetIsRanking &&
                        <Renderer 
                            widgetConfig={widgetConfig} 
                            {...(isMapWidget && { changeBbox: widgetConfig.bbox})}
                            {...(isMapWidget && { interactionEnabled: true })}
                        />
                    }

                    {widgetIsEmbed &&
                        <iframe
                            title={widget.name}
                            src={widgetEmbedUrl}
                            width="100%"
                            height={!!explicitHeight ? `${explicitHeight}px` : '100%'}
                            frameBorder="0"
                        />
                    }

                    {widgetIsRanking &&
                        <RankingWidget widgetConfig={widgetConfig} />
                    }

                    {infoCardOpen &&
                        <div className="widget-modal">
                            {widget && !widget.description &&
                                <p>No additional information is available</p>
                            }

                            {widget && widget.description && (
                                <div>
                                    <h4>Description</h4>
                                    <p>{widget.description}</p>
                                </div>
                            )}

                            {widgetLinks.length > 0 &&
                                <div className="widget-links-container">
                                    <h4>Links</h4>
                                    <ul>
                                        {widgetLinks.map(link => (
                                            <li>
                                                <a
                                                    href={link.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {link.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            }

                            {caption &&
                                <div className="caption-container">
                                    {caption}
                                </div>
                            }
                        </div>
                    }
                </div>
            </ErrorBoundary>
        </div>
    );
};

DashboardWidgetCard.propTypes = {
    user: PropTypes.object.isRequired,
    widget: PropTypes.object.isRequired,
    loading: PropTypes.bool,
    explicitHeight: PropTypes.number
};

DashboardWidgetCard.defaultProps = {
    loading: false,
    explicitHeight: null
};

export default DashboardWidgetCard;
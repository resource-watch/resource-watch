import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';

import {
    Tooltip,
    Legend,
    LegendListItem,
    LegendItemTypes
} from 'vizzuality-components';

// components
import Map from 'components/map';
import LayerManager from 'components/map/layer-manager';
import MapControls from 'components/map/controls';
import ZoomControls from 'components/map/controls/zoom';
import TextChart from 'components/widgets/charts/TextChart';
import LoginRequired from 'components/ui/login-required';
import Icon from 'components/ui/icon';
import Title from 'components/ui/Title';
import Spinner from 'components/ui/Spinner';
import CollectionsPanel from 'components/collections-panel';
import Modal from 'components/modal/modal-component';
import ShareModal from 'components/modal/share-modal';

// utils
import { logEvent } from 'utils/analytics';

// constants
import { DEFAULT_VIEWPORT, MAPSTYLES, BASEMAPS, LABELS } from 'components/map/constants';

// helpers
import { belongsToACollection } from 'components/collections-panel/collections-panel-helpers';

// Styles
import './styles.scss';

function DashboardWidgetCard(props) {
    const { user, widget } = props;
    const [ shareModalOpen, setShareModalOpen ] = useState(false);
    const [ infoCardOpen, setInfoCardOpen ] = useState(false);
    const widgetType = null;

    console.log('widget', widget);

    const metadataInfo = (widget && (widget.metadata && widget.metadata.length > 0 &&
        widget.metadata[0].info)) || {};

    const widgetLinks = metadataInfo.widgetLinks || [];
    const widgetIsEmbed = widget && widget.widgetConfig && widget.widgetConfig.type === 'embed';
    const widgetEmbedUrl = widgetIsEmbed && widget.widgetConfig.url;
    const caption = metadataInfo && metadataInfo.caption;
    const componentClass = classnames('c-widget-block', { [`-${widgetType}`]: !!widgetType });
    const isInACollection = belongsToACollection(user, widget);
    const starIconName = classnames({
        'icon-star-full': isInACollection,
        'icon-star-empty': !isInACollection
    });
    const modalIcon = classnames({
        'icon-cross': infoCardOpen,
        'icon-info': !infoCardOpen
    });

    return (
        <div className="c-dashboard-widget-card">
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
                                            link: typeof window !== 'undefined' && `${window.location.origin}/embed/${widgetType}/${widget.id}`,
                                            embed: typeof window !== 'undefined' && `${window.location.origin}/embed/${widgetType}/${widget.id}`
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
            <div className="widget-container">
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
                    </div>
                }
            </div>
        </div>
    );
};

DashboardWidgetCard.propTypes = {
    user: PropTypes.object.isRequired,
    widget: PropTypes.object.isRequired
};

export default DashboardWidgetCard;
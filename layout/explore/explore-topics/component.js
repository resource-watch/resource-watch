import React from 'react';

// Constants
import { TOPICS } from './constants';

import './styles.scss';

function ExploreTopicsComponent(props) {

    return (
        <div className="c-explore-topics">
            <div className="row">
                <div className="column small-6">
                    {TOPICS.map(topic => (
                        <div 
                            id={topic.id} 
                            className="explore-topic-button"
                            style={{ backgroundImage: `url(${topic.backgroundURL}` }}
                        >
                            <div className="topic-title">
                                {topic.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ExploreTopicsComponent;

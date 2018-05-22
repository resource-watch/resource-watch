function Visualization() {
  this.init();
  this.createSlider();

  // We give an initial position to the handle
  this.update();
}

/**
 * Get the value of the cattle density
 * @return {number}
 */
Visualization.prototype.getCattleDensity = function() {
  if (this._cattleDensity === null || this._cattleDensity === undefined) {
    return 0;
  }

  return this._cattleDensity;
};

/**
 * Set the value of the cattle density and return the
 * new value
 * @param {number} value Value
 */
Visualization.prototype.setCattleDensity = function(value) {
  this._cattleDensity = value;
  return value;
};

/**
 * Get the value of the baseflow
 * @returns {number}
 */
Visualization.prototype.getBaseflow = function() {
  return 0.7269 + (this.getCattleDensity() * -0.16700507);
}

/**
 * Get the value of the evaporation
 * @returns {number}
 */
Visualization.prototype.getEvaporation = function() {
  return 1 - this.getFlow();
}

/**
 * Get the value of the flow
 * @returns {number}
 */
Visualization.prototype.getFlow = function() {
  return 0.40326 + (this.getCattleDensity() * -0.1303)
}

/**
 * Initialize the visualization
 */
Visualization.prototype.init = function() {
  this.svg = d3.select('#vis');
  this.width = +this.svg.attr('width');
  this.height = +this.svg.attr('height');
};

/**
 * Create the slider
 */
Visualization.prototype.createSlider = function() {
  this.scale = d3.scaleLinear()
      .domain([1, 0])
      .range([0, 260])
      .clamp(true);

  const slider = this.svg.append('g')
    .attr('class', 'slider')
    .attr('transform', 'translate(50, ' + ((this.height - this.scale.range()[1]) / 2) + ')');

  const line = slider.append('line')
    .attr('class', 'track')
    .attr('stroke-linecap', 'round')
    .attr('x1', this.scale.range()[0])
    .attr('y1', this.scale.range()[1])

  const trackOverlay = line
    .select(function() {
      return this.parentNode.appendChild(this.cloneNode(true));
    })
    .attr('class', 'track-overlay');

  this.handle = slider.insert('circle', '.track-overlay')
    .attr('class', 'handle')
    .attr('r', 9);

  trackOverlay
    .call(
      d3.drag()
        .on('start.interrupt', function() { slider.interrupt(); })
        .on('start drag', this.update.bind(this))
    );
};

/**
 * Update the cattle density according to the
 * drag event
 */
Visualization.prototype.updateCattleDensity = function() {
  if (d3.event) {
    this.setCattleDensity(this.scale.invert(d3.event.y));
  }
};

/**
 * Update the handle position based on the cattle
 * density
 */
Visualization.prototype.updateHandle = function() {
  this.handle.attr('cy', this.scale(this.getCattleDensity()));
};

/**
 * Update the state of the visualization
 */
Visualization.prototype.update = function() {
  this.updateCattleDensity();
  this.updateHandle();
};

document.addEventListener('DOMContentLoaded', function () {
  new Visualization();
});

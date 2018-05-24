/**
 * HELPER FUNCTIONS
 */

/**
 * Format a value as a percentage (rounded
 * to the nearest integer)
 * @param {number} value Value between 0 and 1
 * @returns {string}
 */
function formatAsPercentage(value) {
  return d3.format('.0%')(value);
}



/**
 * VISUALIZATION CLASS
 */

function Visualization() {
  this.init();
  this.createSlider();
  this.createBaseflowVis();
  this.createEvaporationVis();
  this.createFlowVis();

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
 * @param {number} [cattleDensity] Optional cattle density
 * @returns {number}
 */
Visualization.prototype.getBaseflow = function(cattleDensity) {
  if (cattleDensity === null || cattleDensity === undefined) {
    cattleDensity = this.getCattleDensity();
  }

  return 0.7269 + (cattleDensity * -0.16700507);
}

/**
 * Get the value of the evaporation
 * @param {number} [cattleDensity] Optional cattle density
 * @returns {number}
 */
Visualization.prototype.getEvaporation = function(cattleDensity) {
  if (cattleDensity === null || cattleDensity === undefined) {
    cattleDensity = this.getCattleDensity();
  }

  return 1 - this.getFlow(cattleDensity);
}

/**
 * Get the value of the flow
 * @param {number} [cattleDensity] Optional cattle density
 * @returns {number}
 */
Visualization.prototype.getFlow = function(cattleDensity) {
  if (cattleDensity === null || cattleDensity === undefined) {
    cattleDensity = this.getCattleDensity();
  }

  return 0.40326 + (cattleDensity * -0.1303)
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

  var slider = this.svg.append('g')
    .attr('class', 'slider')
    .attr('transform', 'translate(50, ' + ((this.height - this.scale.range()[1]) / 2) + ')');

  // Legend of the slider
  var sliderLegend = slider.append('text')
    .attr('class', 'legend')
    .attr('transform', 'translate(0, -30)')
    .attr('text-anchor', 'middle');

  sliderLegend.append('tspan')
    .attr('x', 0)
    .text('Cattle');

  sliderLegend.append('tspan')
    .attr('x', 0)
    .attr('dy', '1.2em')
    .text('density');

  var line = slider.append('line')
    .attr('class', 'track')
    .attr('stroke-linecap', 'round')
    .attr('x1', this.scale.range()[0])
    .attr('y1', this.scale.range()[1])

  // Colored progress line
  this.trackProgress = line
    .select(function() {
      return this.parentNode.appendChild(this.cloneNode(true));
    })
    .attr('class', 'track-progress')
    .attr('y2', this.scale.range()[1]);

  this.handle = slider.append('circle')
    .attr('class', 'handle')
    .attr('r', 9)
    .attr('filter', 'url(#shadow)');

  // Percentage displayed on the right side
  // of the handle
  this.handleValue = slider.append('text')
    .attr('class', 'handle-value')
    .attr('dominant-baseline', 'mathematical');

  // Overlay to detect the drag event
  var trackOverlay = line
    .select(function() {
      return this.parentNode.appendChild(this.cloneNode(true));
    })
    .attr('class', 'track-overlay');

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
 * Update the slider based on the cattle
 * density
 */
Visualization.prototype.updateSlider = function() {
  var cattleDensity = this.getCattleDensity();

  this.handle.attr('cy', this.scale(cattleDensity));
  this.trackProgress.attr('y1', this.scale(cattleDensity));
  this.handleValue
    .attr('transform', 'translate(15, ' + this.scale(cattleDensity) + ')')
    .text(formatAsPercentage(cattleDensity));
};

/**
 * Create the baseflow visual element
 */
Visualization.prototype.createBaseflowVis = function() {
  var container = this.svg.append('g')
    .attr('class', 'baseflow')
    .attr('transform', 'translate(160, 150)');

  container.append('use')
    .attr('class', 'cloud')
    .attr('href', '#cloud')
    .attr('width', 100)
    .attr('x', -70)
    .attr('y', -130);

  container.append('use')
    .attr('class', 'cloud')
    .attr('href', '#cloud')
    .attr('width', 100)
    .attr('x', 50)
    .attr('y', -110);

  container.append('use')
    .attr('href', '#rain')
    .attr('x', -45)
    .attr('y', -70);

  container.append('use')
    .attr('href', '#rain')
    .attr('x', 80)
    .attr('y', -50);

  // Cows
  this.cowsContainer = container.append('g')
    .attr('class', 'cows')
    .attr('transform', 'translate(-45, 7)');

  this.cloudsContainer = container.append('g')
    .attr('class', 'clouds')
    .attr('transform', 'translate(0, -100)');

  var arrowDown = container.append('use')
    .attr('href', '#arrow-down')
    .attr('width', 50)
    .attr('x', 0)
    .attr('y', 50);

  var arrowCurved = container.append('use')
    .attr('href', '#arrow-curved')
    .attr('width', 100)
    .attr('x', 100)
    .attr('y', 120);

  var title = container.append('text')
    .attr('class', 'title')
    .attr('transform', 'translate(0, 160)')
    .attr('text-anchor', 'start');

  title.append('tspan')
    .attr('x', 0)
    .text('Baseflow');

  this.baseflowTitleValue = title.append('tspan')
    .attr('x', 0)
    .attr('dy', '1.2em')
    .text(formatAsPercentage(this.getBaseflow()));

};

/**
 * Update the baseflow visual element
 */
Visualization.prototype.updateBaseflowVis = function() {
  this.baseflowTitleValue.text(formatAsPercentage(this.getBaseflow()));

  // Cows
  var cowCount = 0;
  if (this.getCattleDensity() >= 0.6) {
    cowCount = 3;
  } else if (this.getCattleDensity() >= 0.3) {
    cowCount = 2;
  } else if (this.getCattleDensity() > 0) {
    cowCount = 1;
  }

  var cows = this.cowsContainer.selectAll('use')
    .data(new Array(cowCount).fill(null));

  cows.enter()
    .append('use')
    .attr('href', '#cow')
    .attr('x', function (_, i) {
      return i * 25;
    })
    .attr('y', function(_, i) {
      return i * 2.5;
    })

  cows.exit()
    .remove();

  // Clouds
  var cloudsCount = 0;
  var baseflowMidPoint = [this.getBaseflow(0), this.getBaseflow(1)]
    .sort()
    .reduce(function(res, val) {
      return res + val / 2;
    }, 0);

  if (this.getBaseflow() >= baseflowMidPoint) {
    cloudsCount = 1;
  }

  var clouds = this.cloudsContainer.selectAll('use')
    .data(new Array(cloudsCount).fill(null));

  clouds.enter()
    .append('use')
    .attr('href', '#cloud')
    .attr('width', 100)
    .attr('x', 0)
    .attr('y', 0)
    .attr('fill', '#B5BEC3');

  clouds.exit()
    .remove();
};

/**
 * Create the evaporation visual element
 */
Visualization.prototype.createEvaporationVis = function() {
  var container = this.svg.append('g')
    .attr('class', 'evaporation')
    .attr('transform', 'translate(350, 150)');

  container.append('use')
    .attr('class', 'cloud')
    .attr('href', '#cloud')
    .attr('width', 100)
    .attr('x', 25)
    .attr('y', -100);


  this.arrowWavesContainer = container.append('g')
    .attr('class', 'arrow-wave')
    .attr('transform', 'translate(20, -40)');

  var title = container.append('text')
    .attr('class', 'title')
    .attr('transform', 'translate(140, 25)')
    .attr('text-anchor', 'start');

  title.append('tspan')
    .attr('x', 0)
    .text('Evaporation');

  this.evaporationTitleValue = title.append('tspan')
    .attr('x', 0)
    .attr('dy', '1.2em')
    .text(formatAsPercentage(this.getEvaporation()));

};

/**
 * Update the evaporation visual element
 */
Visualization.prototype.updateEvaporationVis = function() {
  this.evaporationTitleValue.text(formatAsPercentage(this.getEvaporation()));

  // Arrows
  var arrowsCount = 0;
  var evaporationMidPoint = [this.getEvaporation(0), this.getEvaporation(1)]
    .sort()
    .reduce(function(res, val) {
      return res + val / 2;
    }, 0);

  if (this.getEvaporation() >= evaporationMidPoint) {
    arrowsCount = 2;
  } else if (this.getEvaporation() > 0) {
    arrowsCount = 1;
  }

  var arrowWaves = this.arrowWavesContainer.selectAll('use')
    .data(new Array(arrowsCount).fill(null));

  arrowWaves.enter()
    .append('use')
    .attr('href', '#arrow-wave')
    .attr('width', 50)
    .attr('x', function (_, i) {
      if (i === 0) {
        return 0;
      }
      return 50;
    })
    .attr('y', function(_, i) {
      if (i === 0) {
        return 0;
      }
      return 50;
    })

  arrowWaves.exit()
    .remove();
};

/**
 * Create the flow visual element
 */
Visualization.prototype.createFlowVis = function() {
  var container = this.svg.append('g')
    .attr('class', 'flow')
    .attr('transform', 'translate(100, 170)');

  this.flowStartPoint = [0, 0];
  this.flowEndPoint = [550, 180];

  // Trees
  this.trees = container.append('g')
    .attr('class', 'trees')
    .attr('transform', 'translate(445, 160)')
    .selectAll('use')
    .data(new Array(3).fill(null))
    .enter()
    .append('use')
    .attr('href', '#tree')
    .attr('width', 25)
    .attr('height', 25)
    .attr('x', function (_, i) {
      return i * 30;
    })
    .attr('y', function(_, i) {
      return -15 + (i * 4);
    });

  // Ground
  var ground = container.append('path')
    .attr('class', 'ground')
    .attr('d', function () {
      return 'm' + this.flowStartPoint.join(',')
        + 'c' + ((this.flowEndPoint[0] - this.flowStartPoint[0]) / 2) + ',' + this.flowStartPoint[1]
        + ' ' + ((this.flowEndPoint[0] - this.flowStartPoint[0]) / 2) + ',' + this.flowEndPoint[1]
        + ' ' + this.flowEndPoint.join(',');
    }.bind(this));

  // Water flow at the surface of the ground
  this.waterFlow = container.append('path')
    .attr('class', 'water-flow')
    .attr('transform', 'translate(0, 2)');

  var title = container.append('text')
    .attr('class', 'title')
    .attr('transform', 'translate(480, 100)')
    .attr('text-anchor', 'start');

  title.append('tspan')
    .attr('x', 0)
    .text('Flow');

  this.flowTitleValue = title.append('tspan')
    .attr('x', 0)
    .attr('dy', '1.2em')
    .text(formatAsPercentage(this.getFlow()));

};

/**
 * Update the flow visual element
 */
Visualization.prototype.updateFlowVis = function() {
  this.flowTitleValue.text(formatAsPercentage(this.getFlow()));

  var waterFlowScale = d3.scaleLinear()
    .domain([this.getFlow(0), this.getFlow(1)].sort())
    .range([2, 15]);

  var height = waterFlowScale(this.getFlow());

  this.waterFlow.attr('d', function() {
    return 'm' + this.flowStartPoint.join(',')
      + 'c' + ((this.flowEndPoint[0] - this.flowStartPoint[0]) / 2) + ',' + this.flowStartPoint[1]
      + ' ' + ((this.flowEndPoint[0] - this.flowStartPoint[0]) / 2) + ',' + this.flowEndPoint[1]
      + ' ' + this.flowEndPoint.join(',')
      + 'v' + height
      + 'c' + ((this.flowStartPoint[0] - this.flowEndPoint[0]) / 2) + ',0'
      + ' ' + ((this.flowStartPoint[0] - this.flowEndPoint[0]) / 2) + ',' + (this.flowStartPoint[1] - this.flowEndPoint[1] - height)
      + ' ' + (-this.flowEndPoint[0]) + ',' + (-this.flowEndPoint[1] - height);
  }.bind(this))
};

/**
 * Update the state of the visualization
 */
Visualization.prototype.update = function() {
  this.updateCattleDensity();
  this.updateSlider();
  this.updateBaseflowVis();
  this.updateEvaporationVis();
  this.updateFlowVis();
};



/**
 * GLOBAL CODE
 */

document.addEventListener('DOMContentLoaded', function () {
  new Visualization();
});

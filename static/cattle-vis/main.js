document.addEventListener('DOMContentLoaded', () => {
  const svg = d3.select('#vis');
  const width = +svg.attr('width');
  const height = +svg.attr('height');

  // Slider
  const y = d3.scaleLinear()
    .domain([0, 100])
    .range([0, 200])
    .clamp(true);
  
  const slider = svg.append('g')
    .attr('class', 'slider')
    .attr('transform', 'translate(50, 150)');

  slider.append('line')
    .attr('class', 'track')
    .attr('x1', y.range()[0])
    .attr('y1', y.range()[1])
  
    // .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    //   .attr('class', 'track-inset')
      
    .select(function() {
      console.log(this.parentNode);
      return this.parentNode.appendChild(this.cloneNode(true));
     })
      .attr('class', 'track-overlay')
      .call(d3.drag()
          .on('start.interrupt', function() { slider.interrupt(); })
          .on('start drag', function() {
            console.log('start drag')
            sliderMove(y.invert(d3.event.y));
          }));
  
  const handle = slider.insert('circle', '.track-overlay')
    .attr('class', 'handle')
    .attr('r', 9);
  
  function sliderMove(w) {
    console.log(w)
    handle.attr('cy', y(w))
  }

  console.log(width, height);
});

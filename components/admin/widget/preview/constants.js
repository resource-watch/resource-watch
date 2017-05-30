export const chartConfig = [
  {
    name: 'bar',
    acceptedStatTypes: [
      ['nominal'],
      ['ordinal'],
      ['quantitative', 'nominal'],
      ['quantitative', 'temporal'],
      ['quantitative', 'ordinal']
    ]
  },
  {
    name: 'line',
    acceptedStatTypes: [
      ['quantitative', 'temporal'],
      ['quantitative', 'ordinal']
    ]
  },
  {
    name: 'pie',
    acceptedStatTypes: [
      ['nominal'],
      ['ordinal']
    ]
  },
  {
    name: 'scatter',
    acceptedStatTypes: [
      ['quantitative', 'quantitative'],
      ['nominal', 'nominal'],
      ['nominal', 'ordinal'],
      ['ordinal', 'ordinal']
    ]
  },
  {
    name: '1d_scatter',
    acceptedStatTypes: [
      ['quantitative'],
      ['temporal']
    ]
  },
  {
    name: '1d_tick',
    acceptedStatTypes: [
      ['quantitative'],
      ['temporal']
    ]
  }
];

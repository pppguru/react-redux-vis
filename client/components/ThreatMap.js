import React, {PropTypes} from 'react';
import WorldMap from 'components/maps/WorldMap';
import HorizontalBarChart from 'components/charts/HorizontalBarChart';

class ThreatMap extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    chart: PropTypes.object
  }

  render() {
    const {props} = this,
      {data, chart: {worldMap, legend1, legend2}, showDetailsTable, details} = props;

    if (!data) return null;

    return (
      <div style={{display: 'flex'}}>
        <div style={{width: '70%'}}>
          <WorldMap
            meta={worldMap.meta}
            attributes={worldMap.attributes}
            data={data}
            chart={worldMap.chart}
            showDetailsTable={showDetailsTable}
            details={details} />
        </div>
        <div style={{width: '30%'}}>
          <HorizontalBarChart
            meta={legend1.meta}
            attributes={legend1.attributes}
            data={data}
            chartOptions={legend1.chartOptions}
            chartData={legend1.chartData}
            chart={legend1.chart}
            loadAsLegend />
          <HorizontalBarChart
            meta={legend2.meta}
            attributes={legend2.attributes}
            data={data}
            chartOptions={legend2.chartOptions}
            chartData={legend2.chartData}
            chart={legend2.chart}
            loadAsLegend />
        </div>
      </div>
    );
  }
}

export default ThreatMap;

import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { State } from '$src/store/types';

import { fetchData } from '../api/traffic';
import useLineChart from '../hooks/useLineChart';
import { chartJSResource, chartStyles, commonDataSetProps } from '../misc/chart';
import { getClashAPIConfig, getSelectedChartStyleIndex } from '../store/app';
import { connect } from './StateProvider';
// import {appendLog} from "$src/store/logs";

const { useMemo } = React;

const chartWrapperStyle: React.CSSProperties = {
  // make chartjs chart responsive
  position: 'relative',
  maxWidth: 666,
};

const mapState = (s: State) => ({
  apiConfig: getClashAPIConfig(s),
  selectedChartStyleIndex: getSelectedChartStyleIndex(s),
});

export default connect(mapState)(TrafficChart);

function TrafficChart({ apiConfig, selectedChartStyleIndex, id} ) {
  const ChartMod = chartJSResource.read();
  const traffic = fetchData(apiConfig, id);

  const { t } = useTranslation();
  const data = useMemo(
    () => ({
      labels: traffic.labels,
      datasets: [
        {
          ...commonDataSetProps,
          ...chartStyles[selectedChartStyleIndex].up,
          label: t('Up'),
          data: traffic.up,
        },
        {
          ...commonDataSetProps,
          ...chartStyles[selectedChartStyleIndex].down,
          label: t('Down'),
          data: traffic.down,
        },
      ],
    }),
    [traffic, selectedChartStyleIndex, t]
  );

  useLineChart(ChartMod.Chart, id, data, traffic);
  // console.log("-----------")
  // console.log(id)
  // console.log(traffic)
  // console.log(data)

  return (
    <div style={chartWrapperStyle}>
      <canvas id={id} />
    </div>
  );
}

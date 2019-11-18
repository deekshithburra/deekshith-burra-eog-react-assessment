import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { Provider, createClient, useQuery, useMutation } from 'urql';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { LinearProgress, Theme } from "@material-ui/core";
import { IState } from '../../store';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const query = `
query($input: MeasurementQuery!) {
  getMeasurements(input: $input) {
    metric
    value
    unit
    at
  }
}
`;

const getMetrics = (state: IState) => {
  return state.metricDetails;
};

export default () => {
  return (
    <Provider value={client}>
      <MetricChart />
    </Provider>
  );
};

const MetricChart = () => {
  const dispatch = useDispatch();
  const { activeMetrics, measurements } = useSelector(getMetrics);

  const [{ fetching, data, error }] = useQuery({
    query,
    variables: {
      input: { metricName: activeMetrics[0] }
    }
  });

  useEffect(() => {
    if (error) {
      dispatch(actions.metricApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { getMeasurements } = data;
    if (getMeasurements.length > 10) {
      const dataChunk = getMeasurements.slice(getMeasurements.length - 20);
      dispatch(actions.measurementsReceived(dataChunk));
    }
  }, [dispatch, data, error]);

  if (fetching) return <LinearProgress />;

  return (
    <LineChart width={400} height={400} data={measurements}>
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <XAxis dataKey="metric" />
      <Line type="monotone" dataKey="value" stroke="#8884d8" />
      <YAxis />
      <Tooltip />
    </LineChart>
  )
};

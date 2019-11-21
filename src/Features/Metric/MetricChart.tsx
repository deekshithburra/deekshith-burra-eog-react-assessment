import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { Provider, createClient, useMutation } from 'urql';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Label, ResponsiveContainer } from 'recharts';
import { IState } from '../../store';
import moment from 'moment';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const query = `
query($input: [MeasurementQuery]) {
  getMultipleMeasurements(input: $input) {
    metric
    measurements {
      metric
      at
      value
      unit
    }
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
  const { activeMetrics, measurements, heartBeat } = useSelector(getMetrics);

  const [result, executeQuery] = useMutation(query);

  const { data, error, fetching } = result;

  useEffect(() => {
    if (!fetching) {
        const input: any = activeMetrics.map(item => {
          return {
            metricName: item,
            after: heartBeat - 1800000
          };
        })
        executeQuery({ input});
    }
  }, [activeMetrics, heartBeat, fetching, executeQuery]);

  useEffect(() => {
    if (error) {
      dispatch(actions.metricApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const newData: any = [];
    data.getMultipleMeasurements.map(item => {
      return newData.push(item.measurements.slice(0, 100));
    });
    const merged = [].concat.apply([], newData);
    merged.forEach((item: any) => {
      item[item.metric] = item.value;
    });
    dispatch(actions.measurementsReceived(merged));
  }, [dispatch, data, error]);

  const xAxisTickFormatter = (date: any) => {
    return moment.unix(date).format("hh:mm");
  };

  const colors = ["black", "red", "green", "blue", "yellow", "orange", "grey"];

  return (
    <ResponsiveContainer width="100%" maxHeight={500}>
      <LineChart width={400} height={400} data={measurements}>
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis
          dataKey="at"
          type={"date" as any}
          tickFormatter={xAxisTickFormatter}
        />
        <YAxis yAxisId="F">
          <Label
            value="F"
            offset={15}
            position="bottom"
            style={{ textAnchor: "middle" }}
          />
        </YAxis>
        <YAxis yAxisId="PSI" orientation="left">
          <Label
            value="PSI"
            offset={15}
            position="bottom"
            style={{ textAnchor: "middle" }}
          />
        </YAxis>
        <YAxis yAxisId="%" orientation="left">
          <Label
            value="%"
            offset={15}
            position="bottom"
            style={{ textAnchor: "middle" }}
          />
        </YAxis>
        {activeMetrics.map((metricName: any, index: number) => {
          let yId;
          if (
            metricName === "tubingPressure" ||
            metricName === "casingPressure"
          ) {
            yId = "PSI";
          } else if (
            metricName === "oilTemp" ||
            metricName === "flareTemp" ||
            metricName === "waterTemp"
          ) {
            yId = "F";
          } else if (metricName === "injValveOpen") {
            yId = "%";
          }
          return (
            <Line
              key={index}
              yAxisId={yId}
              type="linear"
              name={metricName}
              dataKey={metricName}
              stroke={
               colors[index]
              }
            />
          );
        }
        )}
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  )
};

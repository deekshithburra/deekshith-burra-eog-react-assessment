import { reducer as weatherReducer } from '../Features/Weather/reducer';
import { reducer as metricReducer } from '../Features/Metric/reducer';

export default {
  weather: weatherReducer,
  metricDetails: metricReducer
};

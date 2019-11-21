import { createSlice, PayloadAction } from 'redux-starter-kit';

export type ApiErrorAction = {
  error: string;
};

interface MetricInitialState {
  metrics: string[],
  activeMetrics: string[],
  measurements: any,
  heartBeat: any
}

const initialState: MetricInitialState = {
  metrics: [],
  activeMetrics: [],
  measurements: [],
  heartBeat: null
};

const slice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    metricDataRecevied: (state, action: PayloadAction<string[]>) => {
      state.metrics = action.payload;
    },
    heartBeatRecevied: (state, action: PayloadAction<any>) => {
      state.heartBeat = action.payload;
    },
    metricApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
    metricSelectionChanged: (state, action: PayloadAction<string[]>) => {
      state.activeMetrics = action.payload;
    },
    measurementsReceived: (state, action: PayloadAction<any>) => {
      state.measurements = action.payload;
    }
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;

import { createSlice, PayloadAction } from 'redux-starter-kit';

export type ApiErrorAction = {
  error: string;
};

interface MetricInitialState {
  metrics: string[],
  activeMetrics: string[],
  measurements: any
}

const initialState: MetricInitialState = {
  metrics: [],
  activeMetrics: ["flareTemp"],
  measurements: []
};

const slice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    metricDataRecevied: (state, action: PayloadAction<string[]>) => {
      state.metrics = action.payload;
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

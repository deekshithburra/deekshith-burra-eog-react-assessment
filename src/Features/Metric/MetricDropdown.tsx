import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import clsx from "clsx";
import { Provider, createClient, useQuery } from 'urql';
import { LinearProgress, Select, makeStyles, createStyles, Theme, FormControl, MenuItem, Chip, InputLabel } from "@material-ui/core";
import { IState } from '../../store';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const query = `
{
 getMetrics
}
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      width: "25rem",
      marginTop: "1rem",
      marginRight: "1rem",
      marginLeft: "auto"
    },
    noLabel: {
      marginTop: theme.spacing(3),
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 2,
    },
  }),
);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const menuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const getMetrics = (state: IState) => {
  return state.metricDetails;
};

export default () => {
  return (
    <Provider value={client}>
      <MetricDropdown />
    </Provider>
  );
};

const MetricDropdown = () => {
  const dispatch = useDispatch();
  const { metrics, activeMetrics } = useSelector(getMetrics);

  const [result] = useQuery({
    query
  });
  const { fetching, data, error } = result;
  useEffect(() => {
    if (error) {
      dispatch(actions.metricApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { getMetrics } = data;
    dispatch(actions.metricDataRecevied(getMetrics));
  }, [dispatch, data, error]);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    dispatch(actions.metricSelectionChanged(event.target.value as string[]));
  };

  const classes = useStyles();

  if (fetching) return <LinearProgress />;

  return (
    <FormControl variant="outlined" className={clsx(classes.formControl)}>
      <InputLabel htmlFor="metric">Metric</InputLabel>
      <Select
        multiple
        value={activeMetrics}
        onChange={handleChange}
        inputProps={{
          name: 'metric',
          id: 'metric',
        }}
        renderValue={(selected: any) => (
          <div className={classes.chips}>
            {(selected as string[]).map(value => (
              <Chip key={value} label={value} className={classes.chip} />
            ))}
          </div>
        )}
        MenuProps={menuProps}
      >
        {metrics.map((metric: string) => (
          <MenuItem key={metric} value={metric}
          >
            {metric}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
};

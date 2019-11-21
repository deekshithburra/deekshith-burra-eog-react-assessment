import React, { Fragment, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { createClient, Provider, useMutation } from "urql";
import { useDispatch, useSelector } from "react-redux";
import LastKnownMeasurement from "./LastKnownMeasurement";
import MetricChart from "./MetricChart";
import { actions } from "./reducer";
import MetricDropdown from "./MetricDropdown";

const client: any = createClient({
    url: "https://react.eogresources.com/graphql"
});
const query: any = `
query heartBeat {
  heartBeat
}
`;

const getMetrics: any = (state: any) => {
    return state.metricDetails;
};

const useStyles: any = makeStyles({
    cardRow: {
        display: "flex",
        flexWrap: "wrap"
    }
});

export default () => {
    return (
        <Provider value={client}>
            <MetricDashboard />
        </Provider>
    );
};

const MetricDashboard: any = () => {
    
    const dispatch: any = useDispatch();

    const classes: any = useStyles();
    const { activeMetrics } = useSelector(getMetrics);
    const [result, executeQuery] = useMutation(
        query
    );

    useEffect(() => {
        const interval = setInterval(() => {
            executeQuery();
        }, 15000);
        return () => clearInterval(interval);
    }, [executeQuery]);

    const { data, error } = result;
    useEffect(() => {
        if (error) {
            dispatch(actions.metricApiErrorReceived({ error: error.message }));
            return;
        }
        if (!data) {
            return;
        }
        dispatch(actions.heartBeatRecevied(data.heartBeat));

    }, [dispatch, data, error]);

    return (
        <Fragment>
            <MetricDropdown />
            <div className={classes.cardRow}>
                {activeMetrics.map((item: any, index: any) => <LastKnownMeasurement metricName={item} key={index} />)}
            </div>
            {activeMetrics.length > 0 ? <MetricChart /> : null}
        </Fragment>
    );
};

import React, { useEffect, useState } from "react";
import { getComponentValue, Has } from "@latticexyz/recs";
import { useEntityQuery, useComponentValue } from "@latticexyz/react";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import { useSelector } from 'react-redux';
import { RootState } from './reduxStore';
import { useMUD } from "./MUDContext";
import { reduxStore } from "./reduxStore";
import { addMessage } from "./activityLogSlice";
import  { LogMessage } from './CustomTypes';
import { persistor } from "./reduxStore";
import { formatDate } from "./utils";

const ActivityLogComponent: React.FC = () => {

    const {
        components: { MoveExecuted, Username, GameIsLive, GameStarted },
    } = useMUD();

    const [purgeComplete, setPurgeComplete] = useState(false);
    const [canShowLogs, setCanShowLogs] = useState(false);

    let messages = useSelector((state: RootState) => state.activityLog.messages);

    useEffect(() => {
        messages = reduxStore.getState().activityLog.messages;
        setCanShowLogs(true);
    } , [purgeComplete]);

    const gameStarted = useComponentValue(GameStarted, singletonEntity)?.value;

    useEffect(() => {
        if (gameStarted) {
            console.log("xxxxxxxxxxx gameStarted: ", gameStarted);
            // purge logs here
            persistor.purge().then(() => {
                console.log("persistor.purge() complete");
                messages = reduxStore.getState().activityLog.messages;
            });
        }
    } , [gameStarted]);

    let mappedLogs: any[] = [];
    let allMoveLogs = useEntityQuery([Has(MoveExecuted)]);    

    const addUniqueLogsToRedux = (_mappedLogs: LogMessage[]) => {
        let currentMessages = reduxStore.getState().activityLog.messages;
        _mappedLogs.forEach((log: LogMessage) => { 
            const logExists = currentMessages.some(existingLog => existingLog.timestamp === log.timestamp && existingLog.message === log.message);
            if (!logExists) {
                console.log("log does not exist, adding to redux: ", log);
                // This log is unique, dispatch it to the Redux store
                reduxStore.dispatch(addMessage(log));
            }
        });
    };

    useEffect(() => {
        if (gameStarted) {
            console.log("Current messages array: ", messages);
            mappedLogs = allMoveLogs.map((entity) => {
                const username = getComponentValue(Username, entity)?.value;
                const rec = getComponentValue(MoveExecuted, entity);
                const ts = rec?.timestamp;
                const numTs = Number(ts);
                const fromX = rec?.fromX;
                const fromY = rec?.fromY;
                const toX = rec?.toX;
                const toY = rec?.toY;
                const mappedLog: LogMessage = {
                    timestamp: numTs,
                    message: `${username} moved from (${fromX}, ${fromY}) to (${toX}, ${toY})`
                };
                return mappedLog;
            });
            console.log("calling addUniqueLogsToRedux with: ", mappedLogs);
            addUniqueLogsToRedux(mappedLogs);
        }
    }, [allMoveLogs]);

    return (
        <div className="activity-log" style={{ maxHeight: "200px", overflowY: "auto" }}>
        <h3>Activity Log</h3>
        <ul>
        {gameStarted && canShowLogs &&
            messages.map((logObj, index) => (
            <li key={index}>
                {`${formatDate(logObj.timestamp)} : ${logObj.message}`}
            </li>
        ))}
        </ul>
    </div>
    );
};

export default ActivityLogComponent;

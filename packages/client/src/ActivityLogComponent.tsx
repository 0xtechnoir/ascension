import React from "react";
import { Component, getComponentValue, Has } from "@latticexyz/recs";
import { useEntityQuery } from "@latticexyz/react";
import { useMUD } from "./MUDContext";
import  { LogMessage } from './CustomTypes';
import { formatDate } from "./utils";
import { Entity } from "@latticexyz/recs";

const ActivityLogComponent: React.FC = () => {

    const {
        components: { MoveExecuted },
    } = useMUD();

    let mappedLogs: any[] = [];
    let allMoveLogs = useEntityQuery([Has(MoveExecuted)]);

    mappedLogs = mapMoveLogs(mappedLogs, allMoveLogs, MoveExecuted);

    return (
        <div className="activity-log" style={{ maxHeight: "200px", overflowY: "auto" }}>
        <h3>Activity Log</h3>
        <ul>
        {
            mappedLogs.sort((a, b) => b.timestamp - a.timestamp)
            .map((logObj, index) => (
            <li key={index}>
                {`${formatDate(logObj.timestamp)} : ${logObj.message}`}
            </li>
        ))}
        </ul>
    </div>
    );
};

export default ActivityLogComponent;

function mapMoveLogs(mappedLogs: any[], allMoveLogs: Entity[], MoveExecuted: Component) {
    mappedLogs = allMoveLogs.map((entity) => {
        const rec = getComponentValue(MoveExecuted, entity); 
        const ts = rec?.timestamp;
        const numTs = Number(ts);
        const player = rec?.player;
        const fromX = rec?.fromX;
        const fromY = rec?.fromY;
        const toX = rec?.toX;
        const toY = rec?.toY;
        const mappedLog: LogMessage = {
            timestamp: numTs,
            message: `${player} moved from (${fromX}, ${fromY}) to (${toX}, ${toY})`
        };
        return mappedLog;
    });
    return mappedLogs;
}


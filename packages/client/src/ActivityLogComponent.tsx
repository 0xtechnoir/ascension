import React from "react";
import { Component, getComponentValue, Has } from "@latticexyz/recs";
import { useEntityQuery } from "@latticexyz/react";
import { useMUD } from "./MUDContext";
import  { LogMessage } from './CustomTypes';
import { formatDate } from "./utils";
import { Entity } from "@latticexyz/recs";

const ActivityLogComponent: React.FC = () => {

    const {
        components: { MoveExecuted, AttackExecuted },
    } = useMUD();

    let mappedLogs: LogMessage[] = [];
    let mappedMoveLogs: LogMessage[] = [];
    let mappedAttackLogs: LogMessage[] = [];
    let allMoveLogs = useEntityQuery([Has(MoveExecuted)]);
    let allAttackLogs = useEntityQuery([Has(AttackExecuted)]);

    mappedMoveLogs = mapMoveLogs(mappedMoveLogs, allMoveLogs, MoveExecuted);
    mappedAttackLogs = mapAttackLogs(mappedAttackLogs, allAttackLogs, AttackExecuted);
    mappedLogs = mappedLogs.concat(mappedMoveLogs, mappedAttackLogs);

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

function mapAttackLogs(mappedLogs: any[], allAttackLogs: Entity[], AttackExecuted: Component) {
    mappedLogs = allAttackLogs.map((entity) => {
        const rec = getComponentValue(AttackExecuted, entity); 
        const ts = rec?.timestamp;
        const numTs = Number(ts);
        const attacker = rec?.attacker;
        const target = rec?.target;
        const mappedLog: LogMessage = {
            timestamp: numTs,
            message: `${attacker} attacked ${target}`
        };
        return mappedLog;
    });
    return mappedLogs;
}


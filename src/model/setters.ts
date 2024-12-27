import {createId, model} from "@/model/model.ts";

export function createStatValue(statValues: StatValue[], stat: Stat) {
    statValues.push({
        id: createId(),
        statId: stat.id,
        value: stat.minValue === undefined ? 0 : stat.minValue,
    });
}

export function setAllStatValues(statValues: StatValue[]) {
    const missingStats: Stat[] = [];

    for (const stat of model.stats) {
        const statValue= statValues.find(statValue => statValue.statId === stat.id);
        if (statValue === undefined) {
            missingStats.push(stat);
        }
    }

    for (const stat of missingStats) {
        createStatValue(statValues, stat);
    }
}
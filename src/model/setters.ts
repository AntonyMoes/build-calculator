import {createId, model} from "@/model/model.ts";
import {getDefaultValue} from "@/model/getters.ts";

export function createStatValue(statValues: StatValue[], stat: Stat) {
    statValues.push({
        id: createId(),
        statId: stat.id,
        value: getDefaultValue(stat)
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

export function aggregateStatValue(accumulator: StatValue, value: StatValue) {
    accumulator.value += value.value;
}
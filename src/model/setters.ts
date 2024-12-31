import {createId, model, type Stat, type StatValue} from "@/model/model.ts";
import {getDefaultValue, getStat} from "@/model/getters.ts";

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
    if (accumulator.statId !== value.statId) {
        throw new Error(`Mismatching statIds: ${accumulator.statId} & ${value.statId}`);
    }

    accumulator.value += value.value;
    const stat = getStat(value.statId)!;
    clampStatValue(accumulator, stat);
}

function clampStatValue(statValue: StatValue, stat: Stat) {
    if (stat.minValue !== undefined) {
        statValue.value = Math.max(statValue.value, stat.minValue);
    }

    if (stat.maxValue !== undefined) {
        statValue.value = Math.min(statValue.value, stat.maxValue);
    }
}
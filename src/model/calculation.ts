import {type Character, type Stat, type StatValue, type TargetStat} from "@/model/modelData.ts";
import {DifferentiationTree} from "@/calculator/differentiationTree.ts";
import {computed, type ComputedRef} from "vue";
import type {Model} from "@/model/model.ts";
import {hasValue} from "@/utils/optional.ts";

export function getTargetStatCalculation(model: Model, targetStat: TargetStat, character: Character): [DifferentiationTree, ComputedRef<Map<string, number>>] {
    const tree = new DifferentiationTree(targetStat.tokenization);

    const variableMap = computed(() => {
        const stats: StatValue[] = [];
        for (const statName of tree.variables) {
            const stat = model.data.stats.find(stat => stat.name === statName);
            if (stat === undefined) {
                continue;
            }

            const statValue: StatValue = {
                id: -1,
                statId: stat.id,
                value: model.getDefaultStatValue(stat)
            };

            const characterStat = model.getCurrentLevel(character).stats.find(s => s.statId === statValue.statId)!;
            aggregateStatValue(model, statValue, characterStat);

            for (const group of character.equipment) {
                for (const equipmentId of group.equipment) {
                    if (!hasValue(equipmentId)) {
                        continue;
                    }

                    const equipment = model.getEquipment(equipmentId)!;
                    const equipmentStat = equipment.stats.find(s => s.statId === statValue.statId);
                    if (equipmentStat !== undefined) {
                        aggregateStatValue(model, statValue, equipmentStat);
                    }
                }
            }

            for (const group of character.statGroups) {
                const groupStat = model.getCurrentLevel(group).stats.find(s => s.statId === statValue.statId);
                if (groupStat !== undefined) {
                    aggregateStatValue(model, statValue, groupStat);
                }
            }

            stats.push(statValue);
        }


        const dict = new Map<string, number>();

        for (const statValue of stats) {
            const stat = model.getStat(statValue.statId)!;
            dict.set(stat.name, statValue.value);
        }

        return dict;
    })

    return [tree, variableMap];
}

function aggregateStatValue(model: Model, accumulator: StatValue, value: StatValue) {
    if (accumulator.statId !== value.statId) {
        throw new Error(`Mismatching statIds: ${accumulator.statId} & ${value.statId}`);
    }

    accumulator.value += value.value;
    const stat = model.getStat(value.statId)!;
    clampStatValue(accumulator, stat);
}

function clampStatValue(statValue: StatValue, stat: Stat) {
    if (hasValue(stat.minValue)) {
        statValue.value = Math.max(statValue.value, stat.minValue);
    }

    if (hasValue(stat.maxValue)) {
        statValue.value = Math.min(statValue.value, stat.maxValue);
    }
}
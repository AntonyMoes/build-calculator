import {
    type Character,
    type CharacterId,
    type EquipmentGroup,
    type EquipmentGroupId,
    type EquipmentId,
    type EquipmentType,
    type EquipmentTypeId,
    model,
    type Stat,
    type StatId,
    type StatValue,
    type TargetStat
} from "@/model/model.ts";
import {aggregateStatValue} from "@/model/setters.ts";
import {DifferentiationTree} from "@/calculator/differentiationTree.ts";
import {computed} from "vue";

export function getStat(id: StatId): Stat | undefined {
    return model.stats.find(stat => stat.id === id);
}

export function getDefaultValue(stat: Stat): number {
    return stat.minValue ?? 0;
}

export function getEquipmentType(id: EquipmentTypeId): EquipmentType | undefined {
    return model.equipmentTypes.find(type => type.id === id);
}

export function getEquipmentGroup(id: EquipmentGroupId): EquipmentGroup | undefined {
    return model.equipmentGroups.find(group => group.id === id);
}

export function getEquipment(id: EquipmentId): Equipment | undefined {
    return model.equipment.find(equipment => equipment.id === id);
}

export function getCharacter(id: CharacterId): Character | undefined {
    return model.characters.find(character => character.id === id);
}

export function calculateTargetStat(targetStat: TargetStat, character: Character): [number, Map<string, number>] {
    const stats: StatValue[] = [];
    const tree = new DifferentiationTree(targetStat.tokenization);
    for (const statName of tree.variables) {
        const stat = model.stats.find(stat => stat.name === statName);
        if (stat === undefined) {
            continue;
        }

        const statValue: StatValue = {
            id: -1,
            statId: stat.id,
            value: getDefaultValue(stat)
        };

        const characterStat = character.stats.find(s => s.statId === statValue.statId)!;
        aggregateStatValue(statValue, characterStat);

        for (const group of character.equipment) {
            for (const equipmentId of group.equipment) {
                if (equipmentId === null) {
                    continue;
                }

                const equipment = getEquipment(equipmentId)!;
                const equipmentStat = equipment.stats.find(s => s.statId === statValue.statId);
                if (equipmentStat !== undefined) {
                    aggregateStatValue(statValue, equipmentStat);
                }
            }
        }

        stats.push(statValue);
    }


    const dict = new Map<string, number>();

    for (const statValue of stats) {
        const stat = getStat(statValue.statId)!;
        dict.set(stat.name, statValue.value);
    }

    return [tree.calculate(dict), tree.calculateGradient(dict)];
}

export function getTargetStatCalculation(targetStat: TargetStat, character: Character) {
    const tree = new DifferentiationTree(targetStat.tokenization);

    const variableMap = computed(() => {
        const stats: StatValue[] = [];
        for (const statName of tree.variables) {
            const stat = model.stats.find(stat => stat.name === statName);
            if (stat === undefined) {
                continue;
            }

            const statValue: StatValue = {
                id: -1,
                statId: stat.id,
                value: getDefaultValue(stat)
            };

            const characterStat = character.stats.find(s => s.statId === statValue.statId)!;
            aggregateStatValue(statValue, characterStat);

            for (const group of character.equipment) {
                for (const equipmentId of group.equipment) {
                    if (equipmentId === null) {
                        continue;
                    }

                    const equipment = getEquipment(equipmentId)!;
                    const equipmentStat = equipment.stats.find(s => s.statId === statValue.statId);
                    if (equipmentStat !== undefined) {
                        aggregateStatValue(statValue, equipmentStat);
                    }
                }
            }

            stats.push(statValue);
        }


        const dict = new Map<string, number>();

        for (const statValue of stats) {
            const stat = getStat(statValue.statId)!;
            dict.set(stat.name, statValue.value);
        }

        return dict;
    })

    return [tree, variableMap];
}
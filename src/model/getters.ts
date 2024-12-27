import {
    type EquipmentGroup,
    type EquipmentGroupId,
    type EquipmentType,
    type EquipmentTypeId,
    model,
    type Stat,
    type StatId,
    type StatValue
} from "@/model/model.ts";
import {CalculationTree} from "@/calculator/calculationTree.ts";

export function getStat(id: StatId): Stat | undefined {
    return model.stats.find(stat => stat.id === id);
}

export function getEquipmentType(id: EquipmentTypeId): EquipmentType | undefined {
    return model.equipmentTypes.find(type => type.id === id);
}

export function getEquipmentGroup(id: EquipmentGroupId): EquipmentGroup | undefined {
    return model.equipmentGroups.find(group => group.id === id);
}

export function getCharacter(id: CharacterId): Character | undefined {
    return model.characters.find(character => character.id === id);
}

export function calculateTargetStat(targetStat: TargetStat, stats: StatValue[]): number {
    const tree = new CalculationTree(targetStat.tokenization);
    const dict = new Map<string, number>();
    ;
    for (const statValue of stats) {
        const stat = getStat(statValue.statId)!;
        dict.set(stat.name, statValue.value);
    }

    return tree.calculate(dict);
}
import {reactive} from "vue";
import {parseAndValidate} from "@/calculator/utils.ts";
import type {TreeToken} from "@/calculator/types.ts";

export interface Stat {
    id: number;
    name: string;
    minValue: number | undefined;
    maxValue: number | undefined;
}

export interface TargetStat {
    id: number;
    name: string;
    formula: string;
    tokenization: TreeToken[];
}

export interface EquipmentType {
    id: number;
    name: string;
}

export interface Equipment {
    name: string;
    stats: StatValue[];
}

export interface EquipmentSlot {
    type: EquipmentType;
    equipment: Equipment;
}

export interface EquipmentGroup {
    id: number;
    name: string;
    equipment: EquipmentType[];
}

export interface CharacterEquipmentGroup {
    name: string;
    equipment: EquipmentSlot[];
}

export interface StatValue {
    stat: Stat;
    value: number;
}

export interface Character {
    name: string;
    stats: StatValue[];
    equipment: CharacterEquipmentGroup[];
}

export interface Model {
    stats: Stat[],
    targetStats: TargetStat[],
    equipmentTypes: EquipmentType[],
    equipmentGroups: EquipmentGroup[],
    characters: Character[],
    characterPresets: Character[],
    equipment: Equipment[],
    nextId: number,
}

export const model = reactive<Model>({
    stats: [],
    targetStats: [],
    equipmentTypes: [],
    equipmentGroups: [],
    characters: [],
    characterPresets: [],
    equipment: [],
    nextId: 0,
});

export function createId(): number {
    const id = model.nextId;
    model.nextId += 1;
    return id;
}
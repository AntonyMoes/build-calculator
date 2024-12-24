import {reactive} from "vue";
import type {TreeToken} from "@/calculator/types.ts";

export type StatId = number;

export interface Stat {
    id: StatId;
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

export type EquipmentTypeId = number;

export interface EquipmentType {
    id: EquipmentTypeId;
    name: string;
}

export interface Equipment {
    id: number;
    name: string;
    imageSrc: string;
    stats: StatValue[];
}

export interface EquipmentSlot {
    type: EquipmentType;
    equipment: Equipment;
}

export interface EquipmentGroup {
    id: number;
    name: string;
    equipmentTypeIds: number[];
}

export interface CharacterEquipmentGroup {
    name: string;
    equipment: EquipmentSlot[];
}

export interface StatValue {
    id: number;
    statId: StatId;
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
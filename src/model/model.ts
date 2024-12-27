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

export type EquipmentId = number;

export interface Equipment {
    id: EquipmentId;
    typeId: EquipmentTypeId;
    name: string;
    imageSrc: string;
    stats: StatValue[];
}

export type EquipmentGroupId = number;

export interface EquipmentGroup {
    id: EquipmentGroupId;
    name: string;
    equipmentTypeIds: EquipmentTypeId[];
}

export type CharacterEquipmentGroupId = number;

export interface CharacterEquipmentGroup {
    id: CharacterEquipmentGroupId;
    groupId: EquipmentGroupId;
    equipment: (Equipment | null)[];
}

export type StatValueId = number;

export interface StatValue {
    id: StatValueId;
    statId: StatId;
    value: number;
}

export type CharacterId = number;

export interface Character {
    id: CharacterId;
    name: string;
    imageSrc: string;
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
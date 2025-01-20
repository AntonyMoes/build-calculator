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
    equipment: (EquipmentId | null)[];
}

export type StatValueId = number;

export interface StatValue {
    id: StatValueId;
    statId: StatId;
    value: number;
}

export type CharacterStatLevelId = number;

export interface CharacterStatLevel {
    id: CharacterStatLevelId;
    name: string;
    stats: StatValue[];
}

export type CharacterId = number;

export interface Character {
    id: CharacterId;
    name: string;
    imageSrc: string;
    currentLevelIndex: number;
    levels: CharacterStatLevel[];
    equipment: CharacterEquipmentGroup[];
}

export interface ModelData {
    stats: Stat[],
    targetStats: TargetStat[],
    equipmentTypes: EquipmentType[],
    equipmentGroups: EquipmentGroup[],
    characters: Character[],
    equipment: Equipment[],
    nextId: number,
}
import {type EquipmentType, type EquipmentTypeId, model, type Stat, type StatId} from "@/model/model.ts";

export function getStat(id: StatId): Stat | undefined {
    return model.stats.find(stat => stat.id === id);
}

export function getEquipmentType(id: EquipmentTypeId): EquipmentType | undefined {
    return model.equipmentTypes.find(type => type.id === id);
}
import type {Equipment} from "@/model/modelData.ts";
import {hasValue, type Optional} from "@/utils/optional.ts";

export function getDisplayName(equipment: Optional<Equipment>): string {
    return !hasValue(equipment) ? 'None' : equipment.name;
}

export function formatValue(value: number): string {
    return value.toFixed(1);
}
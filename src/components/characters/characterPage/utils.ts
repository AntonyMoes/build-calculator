import type {Equipment} from "@/model/modelData.ts";

export function getDisplayName(equipment: Equipment | null): string {
    return equipment === null ? 'None' : equipment.name;
}

export function formatValue(value: number): number {
    return value.toFixed(1);
}
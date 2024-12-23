import type {TreeToken} from "@/calculator/types.ts";
import {parseAndValidate} from "@/calculator/utils.ts";
import {model} from "@/model/model.ts";


export function validateStat(oldName: string, name: string, minValue: number | undefined, maxValue: number | undefined): string[] {
    const result = [];
    if (name !== oldName && (model.stats.find(stat => stat.name === name) !== undefined || name === "")) {
        result.push(`The name is empty or not unique: ${name}`);
    }

    if (minValue !== undefined && maxValue !== undefined && minValue > maxValue) {
        result.push(`Max value (${maxValue}) must be greater than min value (${minValue})`);
    }

    return result;
}

export function validateTargetStat(oldName: string, name: string, formula: string): {
    validationErrors: string[]
    tokenization: TreeToken[];
} {
    let result = [];
    if (name !== oldName && (model.targetStats.find(stat => stat.name === name) !== undefined || name === "")) {
        result.push(`The name is empty or not unique: ${name}`);
    }

    const {errors, missingVariables, tokenization} = parseAndValidate(formula, model.stats.map(stat => stat.name));
    result = result.concat(errors);

    if (missingVariables.length > 0) {
        result.push(`No such stats: ${missingVariables.join(", ")}`);
    }

    return {
        validationErrors: result,
        tokenization: tokenization
    };
}

export function validateEquipmentType(oldName: string, name: string): string[] {
    const result = [];
    if (name !== oldName && (model.equipmentTypes.find(type => type.name === name) !== undefined || name === "")) {
        result.push(`The name is empty or not unique: ${name}`);
    }

    return result;
}

export function validateEquipmentGroup(oldName: string, name: string): string[] {
    const result = [];
    if (name !== oldName && (model.equipmentGroups.find(group => group.name === name) !== undefined || name === "")) {
        result.push(`The name is empty or not unique: ${name}`);
    }

    return result;
}
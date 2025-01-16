import type {TreeToken} from "@/calculator/types.ts";
import {parseAndValidate} from "@/calculator/utils.ts";
import {type Stat} from "@/model/modelData.ts";
import {model} from "@/model/model.ts";
import {hasWhiteSpace} from "@/utils/stringUtils.ts";


function validateName(oldName: string, name: string, names: string[], allowWhiteSpace: boolean = true): string[] {
    const result = [];
    if (!allowWhiteSpace && hasWhiteSpace(name)) {
        result.push(`The name has whitespace characters!`);
    } else if (name !== oldName && (names.includes(name) || name === "")) {
        result.push(`The name is empty or not unique: ${name}`);
    }

    return result;
}

export function validateStat(oldName: string, name: string, minValue: number | undefined, maxValue: number | undefined): string[] {
    const result = validateName(oldName, name, model.data.stats.map(stat => stat.name), false);

    if (minValue !== undefined && maxValue !== undefined && minValue > maxValue) {
        result.push(`Max value (${maxValue}) must be greater than min value (${minValue})`);
    }

    return result;
}

export function validateTargetStat(oldName: string, name: string, formula: string): {
    validationErrors: string[]
    tokenization: TreeToken[];
} {
    let result = validateName(oldName, name, model.data.targetStats.map(stat => stat.name), false);

    const {errors, missingVariables, tokenization} = parseAndValidate(formula, model.data.stats.map(stat => stat.name));
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
    return validateName(oldName, name, model.data.equipmentTypes.map(type => type.name));
}

export function validateEquipmentGroup(oldName: string, name: string): string[] {
    return validateName(oldName, name, model.data.equipmentGroups.map(group => group.name));
}

export function validateStatValue(stat: Stat, statValue: number): string[] {
    const result = [];

    const minValue = stat.minValue;
    const maxValue = stat.maxValue;
    if (minValue !== undefined && statValue < minValue) {
        result.push(`Value should be >= ${minValue}`);
    } else if (maxValue !== undefined && statValue > maxValue) {
        result.push(`Value should be <= ${maxValue}`);
    }

    return result;
}
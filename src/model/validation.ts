import type {TreeToken} from "@/calculator/types.ts";
import {parseAndValidate} from "@/calculator/utils.ts";
import {
    type Character,
    type CharacterStatGroup,
    type CharacterStatLevel,
    type ModelData,
    type Stat
} from "@/model/modelData.ts";
import {Model, model} from "@/model/model.ts";
import {hasWhiteSpace} from "@/utils/stringUtils.ts";
import {hasValue, type Optional} from "@/utils/optional.ts";


function validateName(oldName: string, name: string, names: string[], allowWhiteSpace: boolean = true, dataModel: Model = model): string[] {
    const result = [];
    if (!allowWhiteSpace && hasWhiteSpace(name)) {
        result.push(`The name has whitespace characters!`);
    } else if (name !== oldName && (names.includes(name) || name === "")) {
        result.push(`The name is empty or not unique: ${name}`);
    }

    return result;
}

export function validateStat(oldName: string, name: string, minValue: Optional<number>, maxValue: Optional<number>, dataModel: Model = model): string[] {
    const result = validateName(oldName, name, dataModel.data.stats.map(stat => stat.name), false);

    if (hasValue(minValue) && hasValue(maxValue) && minValue > maxValue) {
        result.push(`Max value (${maxValue}) must be greater than min value (${minValue})`);
    }

    return result;
}

export function validateTargetStat(oldName: string, name: string, formula: string, dataModel: Model = model): {
    validationErrors: string[]
    tokenization: TreeToken[];
} {
    let result = validateName(oldName, name, dataModel.data.targetStats.map(stat => stat.name), false);

    const {
        errors,
        missingVariables,
        tokenization
    } = parseAndValidate(formula, dataModel.data.stats.map(stat => stat.name));
    result = result.concat(errors);

    if (missingVariables.length > 0) {
        result.push(`No such stats: ${missingVariables.join(", ")}`);
    }

    return {
        validationErrors: result,
        tokenization: tokenization
    };
}

export function validateEquipmentType(oldName: string, name: string, dataModel: Model = model): string[] {
    return validateName(oldName, name, dataModel.data.equipmentTypes.map(type => type.name));
}

export function validateEquipmentGroup(oldName: string, name: string, dataModel: Model = model): string[] {
    return validateName(oldName, name, dataModel.data.equipmentGroups.map(group => group.name));
}

export function validateStatValue(stat: Stat, statValue: number): string[] {
    const result = [];

    const minValue = stat.minValue;
    const maxValue = stat.maxValue;
    if (hasValue(minValue) && statValue < minValue) {
        result.push(`Value should be >= ${minValue}`);
    } else if (hasValue(maxValue) && statValue > maxValue) {
        result.push(`Value should be <= ${maxValue}`);
    }

    return result;
}

export function validateLevel(levelOwner: Character | CharacterStatGroup, newName: string, level: CharacterStatLevel | undefined = undefined): string[] {
    const oldName = level?.name ?? "";
    return validateName(oldName, newName, levelOwner.levels.map(level => level.name));
}

export function validateAndFixModelData(data: ModelData): string[] {
    const newModel = new Model(data);

    // TODO other errors
    return data.targetStats.map(stat => {
        const result = validateTargetStat(stat.name, stat.name, stat.formula, newModel);
        if (JSON.stringify(stat.tokenization) !== JSON.stringify(result.tokenization)) {
            stat.tokenization = result.tokenization;
        }

        return result.validationErrors;
    }).flat();
}
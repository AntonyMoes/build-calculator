import {
    type Character,
    type CharacterId,
    type CharacterStatLevel,
    type Equipment,
    type EquipmentGroup,
    type EquipmentGroupId,
    type EquipmentId,
    type EquipmentType,
    type EquipmentTypeId,
    type ModelData,
    type Stat,
    type StatId,
    type StatValue
} from "@/model/modelData.ts";
import {reactive} from "vue";

function createDefaultData(): ModelData {
    return {
        stats: [],
        targetStats: [],
        equipmentTypes: [],
        equipmentGroups: [],
        characters: [],
        characterPresets: [],
        equipment: [],
        nextId: 0,
    }
}

export class Model {
    data: ModelData

    constructor(data: ModelData | undefined = undefined) {
        this.data = data ?? createDefaultData();
    }

    setData(data: ModelData) {
        this.data = data;
    }

    createId() {
        const id = this.data.nextId;
        this.data.nextId += 1;
        return id;
    }

    getStat(id: StatId): Stat | undefined {
        return this.data.stats.find(stat => stat.id === id);
    }

    getDefaultStatValue(stat: Stat): number {
        return stat.minValue ?? 0;
    }

    getEquipmentType(id: EquipmentTypeId): EquipmentType | undefined {
        return this.data.equipmentTypes.find(type => type.id === id);
    }

    getEquipmentGroup(id: EquipmentGroupId): EquipmentGroup | undefined {
        return this.data.equipmentGroups.find(group => group.id === id);
    }

    getEquipment(id: EquipmentId): Equipment | undefined {
        return this.data.equipment.find(equipment => equipment.id === id);
    }

    getCharacter(id: CharacterId): Character | undefined {
        return this.data.characters.find(character => character.id === id);
    }

    addStatValue(statValues: StatValue[], stat: Stat) {
        statValues.push({
            id: this.createId(),
            statId: stat.id,
            value: this.getDefaultStatValue(stat)
        });
    }

    getCurrentCharacterLevel(character: Character): CharacterStatLevel {
        return character.levels[character.currentLevelIndex];
    }

    shiftCurrentCharacterLevel(character: Character, shift: number) {
        const index = character.currentLevelIndex;
        const newIndex = index + shift;

        const temp = character.levels[index];
        character.levels[index] = character.levels[newIndex];
        character.levels[newIndex] = temp;
    }

    setAllStatValues(statValues: StatValue[]) {
        const missingStats: Stat[] = [];

        for (const stat of this.data.stats) {
            const statValue= statValues.find(statValue => statValue.statId === stat.id);
            if (statValue === undefined) {
                missingStats.push(stat);
            }
        }

        for (const stat of missingStats) {
            this.addStatValue(statValues, stat);
        }
    }

    addCharacter() {
        const character: Character = {
            id: this.createId(),
            name: "character-new",
            imageSrc: "",
            currentLevelIndex: 0,
            levels: [],
            equipment: []
        };

        this.addLevel(character, "1");
        this.data.characters.push(character);
    }

    addLevel(character: Character, name: string, at: number | undefined = undefined, copyStats: CharacterStatLevel | undefined = undefined) {
        const index = at ?? character.levels.length;
        const newStats: StatValue[] = copyStats?.stats.map(statValue => {
            return {
                id: this.createId(),
                statId: statValue.statId,
                value: statValue.value
            }
        }) ?? [];

        character.levels.splice(index, 0, {
            id: model.createId(),
            name: name,
            stats: newStats
        });
    }
}

export const model = reactive(new Model());
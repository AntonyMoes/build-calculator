import {
    type Character,
    type CharacterId,
    type CharacterStatGroup,
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
import {reactive, watch} from "vue";

function createDefaultData(): ModelData {
    return {
        stats: [],
        targetStats: [],
        equipmentTypes: [],
        equipmentGroups: [],
        characters: [],
        equipment: [],
        nextId: 0,
    }
}

const SAVE_KEY = "calculator-model-key";

function saveModel() {
    const stringData = JSON.stringify(model.data);
    window.localStorage.setItem(SAVE_KEY, stringData);
}

function loadModel() {
    const stringData = window.localStorage.getItem(SAVE_KEY);
    if (stringData !== null) {
        const data = JSON.parse(stringData) as ModelData;
        model.setData(data);
    }
}

export class Model {
    data: ModelData

    constructor(data: ModelData | undefined = undefined) {
        this.data = data ?? createDefaultData();
    }

    setData(data: ModelData | undefined = undefined) {
        this.data = data ?? createDefaultData();
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

    getCurrentLevel(levelOwner: Character | CharacterStatGroup): CharacterStatLevel {
        return levelOwner.levels[levelOwner.currentLevelIndex];
    }

    shiftCurrentLevel(levelOwner: Character | CharacterStatGroup, shift: number) {
        const index = levelOwner.currentLevelIndex;
        const newIndex = index + shift;

        const temp = levelOwner.levels[index];
        levelOwner.levels[index] = levelOwner.levels[newIndex];
        levelOwner.levels[newIndex] = temp;
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
            equipment: [],
            statGroups: []
        };

        this.addLevel(character, "1");
        this.data.characters.push(character);
    }

    addLevel(statOwner: Character | CharacterStatGroup, name: string, at: number | undefined = undefined, copyStats: CharacterStatLevel | undefined = undefined) {
        const index = at ?? statOwner.levels.length;
        const newStats: StatValue[] = copyStats?.stats.map(statValue => {
            return {
                id: this.createId(),
                statId: statValue.statId,
                value: statValue.value
            }
        }) ?? [];

        statOwner.levels.splice(index, 0, {
            id: model.createId(),
            name: name,
            stats: newStats
        });
    }

    addStatGroup(character: Character) {
        const statGroup: CharacterStatGroup = {
            id: this.createId(),
            name: "stat-group-new",
            currentLevelIndex: 0,
            levels: []
        };

        this.addLevel(statGroup, "0");
        character.statGroups.push(statGroup);
    }

    removeStatFromLevels(statOwner: Character | CharacterStatGroup, statId: StatId) {
        for (const level of statOwner.levels) {
            const index = level.stats.findIndex(statValue => statValue.statId === statId);
            if (index > -1) {
                level.stats.splice(index, 1);
            }
        }
    }
}

export const model = reactive(new Model());

loadModel();
watch(model, saveModel);
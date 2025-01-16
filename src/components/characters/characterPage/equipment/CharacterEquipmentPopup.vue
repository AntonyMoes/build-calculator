<script setup lang="ts">
import Popup from "@/components/common/Popup.vue";
import CharacterEquipmentPopupItem
  from "@/components/characters/characterPage/equipment/CharacterEquipmentPopupItem.vue";
import {type Equipment, type EquipmentId, type EquipmentTypeId, type StatId} from "@/model/modelData.ts";
import {model} from "@/model/model.ts";
import {computed, ref} from "vue";
import {getDisplayName} from "../utils.ts";
import CharacterEquipmentPopupStatItem
  from "@/components/characters/characterPage/equipment/CharacterEquipmentPopupStatItem.vue";

const props = defineProps<{
  isOpen: boolean;
  typeId: EquipmentTypeId
  equipped: EquipmentId | null,
}>();

const emit = defineEmits<{
  (name: "close"): void;
  (name: "selectEquipment", equipment: Equipment | null): void;
}>();

const selected = ref<Equipment | null>(null);
const equipped = computed<Equipment | null>(() => {
  if (!props.isOpen) {
    return null;
  }

  const e = props.equipped === null ? null : model.getEquipment(props.equipped)!;
  selected.value = e;
  return e;
})

const equipmentList = computed<(Equipment | null)[]>(() => {
  if (!props.isOpen) {
    return [];
  }

  const filtered = model.data.equipment.filter(e => e.typeId === props.typeId);
  const full = [null].concat(filtered);
  if (props.equipped === null) {
    return full;
  }

  const equippedItem = model.getEquipment(props.equipped)!;
  const index = full.indexOf(equippedItem);
  full.splice(index, 1);
  return [equippedItem].concat(full);
});

const selectedStats = computed<StatId[]>(() => {
  let result: StatId[] = [];
  if (equipped.value !== null) {
    result = result.concat(equipped.value.stats.map(stat => stat.statId));
  }

  if (selected.value !== null && selected.value !== equipped.value) {
    result = result.concat(selected.value.stats
        .map(stat => stat.statId)
        .filter(statId => !result.includes(statId)))
  }

  return result;
});

function onSelectEquipment(equipment: Equipment | null) {
  selected.value = equipment;
}

function onClose() {
  emit("selectEquipment", selected.value);
  emit('close');
}
</script>

<template>
  <Popup :isOpen="isOpen" @close="onClose">
    <template #title>
      Select equipment
    </template>

    <template #content>
      <div class="character-equipment-content">
        <div class="character-equipment-items-container">
          <CharacterEquipmentPopupItem
              v-for="equipment of equipmentList"
              :key="equipment?.id ?? -1"
              :equipment="equipment"
              :equipped="equipment === null && equipped === null || equipment === equipped"
              :selected="equipment === selected"
              @selectEquipment="onSelectEquipment"
          />
        </div>

        <div class="character-equipment-stats">
          <div class="character-equipment-stats-title">
            {{ equipped === selected ? getDisplayName(equipped) : `${getDisplayName(equipped) } -> ${getDisplayName(selected) }` }}
          </div>
          <CharacterEquipmentPopupStatItem
              v-for="stat of selectedStats"
              :statId="stat"
              :equipped="equipped"
              :selected="selected"
          />
        </div>
      </div>
    </template>
  </Popup>
</template>

<style scoped>
.character-equipment-content {
  display: grid;
  grid-template-columns: 1fr 400px;
}

.character-equipment-items-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
  margin: 20px;
  overflow-y: scroll;
  scrollbar-width: none;
  max-height: 70vh;
}

.character-equipment-stats {
}

.character-equipment-stats-title {
  font-size: 18px;
}
</style>
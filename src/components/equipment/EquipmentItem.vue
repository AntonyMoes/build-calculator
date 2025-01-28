<script setup lang="ts">
import {type Equipment, type EquipmentId, type Stat} from "@/model/modelData.ts";
import {model} from "@/model/model.ts";
import RemoveButton from "@/components/common/RemoveButton.vue";
import EquipmentItemStat from "@/components/equipment/EquipmentItemStat.vue";
import {getRerenderKey} from "@/utils/rerenderKey.ts";
import {imageToSrc} from "@/utils/image.ts";
import SelectedImage from "@/components/common/SelectedImage.vue";
import {ref} from "vue";

const rerenderKey = getRerenderKey();

const equipmentModel = defineModel<Equipment>({required: true});

defineEmits<{
  (name: "remove", id: EquipmentId): void;
}>();

const selectedType = ref<string>(model.getEquipmentType(equipmentModel.value.typeId)!.name);

function updateType() {
  equipmentModel.value.typeId = model.data.equipmentTypes.find(type => type.name === selectedType.value)!.id;
}

function removeStat(index: number) {
  equipmentModel.value.stats.splice(index, 1);
}

function addStat() {
  if (model.data.stats.length === 0) {
    alert("No stat to add.");
    return;
  }

  let newStat: Stat | undefined = undefined;
  for (const stat of model.data.stats) {
    if (equipmentModel.value.stats.find(s => s.statId === stat.id) !== undefined) {
      continue;
    }

    newStat = stat;
    break;
  }

  if (newStat === undefined) {
    alert("No stat to add.");
    return;
  }

  model.addStatValue(equipmentModel.value.stats, newStat);
}

async function onImageSelected(image: File) {
  equipmentModel.value.imageSrc = await imageToSrc(image);
  rerenderKey.rerender();
}
</script>

<template>
  <div class="equipment-item" :key="rerenderKey.key.value">
    <input
        class=" equipment-item-block"
        type="text"
        v-model="equipmentModel.name"
    />

    <RemoveButton
        class="equipment-item-block"
        @remove="$emit('remove', equipmentModel.id)"
    />

    <select
        v-model="selectedType"
        @change="updateType"
    >
      <option disabled value="">Select group</option>
      <option
          v-for="type of model.data.equipmentTypes"
          :key="type.id"
      >
        {{type.name}}
      </option>
    </select>

    <SelectedImage
        class="equipment-item-img"
        :src="equipmentModel.imageSrc"
        :can-select="true"
        @selectImage="onImageSelected"
    />

    <EquipmentItemStat
        v-for="[index, item] of equipmentModel.stats.entries()"
        :key="item.id"
        :index="index"
        :parent-model="equipmentModel"
        :model-value="item"
        @remove="removeStat"
    />

    <input type="button" value="Add stat" v-on:click="addStat">
  </div>
</template>

<style scoped>
.equipment-item {
  width: 200px;
  height: fit-content;
  background-color: #282828;
}

.equipment-item-secret {
  display: none;
}

.equipment-item-block {
  display: inline-block;
}

.equipment-item-img {
  border: 1px solid #777777;
  width: 120px;
  height: 120px;
}
</style>
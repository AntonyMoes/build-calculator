<script setup lang="ts">
import {createId, type Equipment, model, type Stat} from "@/model/model.ts";
import RemoveButton from "@/components/common/RemoveButton.vue";
import EquipmentItemStat from "@/components/equipment/EquipmentItemStat.vue";
import {useTemplateRef} from "vue";
import {getRerenderKey} from "@/utils/rerenderKey.ts";

const rerenderKey = getRerenderKey();

const equipmentModel = defineModel<Equipment>({required: true});

defineEmits<{
  (name: "remove", id: number): void;
}>();

const imageInput = useTemplateRef("imageInput");
const emptyInput = useTemplateRef("emptyInput");

function removeStat(index: number) {
  equipmentModel.value.stats.splice(index, 1);
}

function addStat() {
  if (model.stats.length === 0) {
    alert("No stat to add.");
    return;
  }

  let newStat: Stat | undefined = undefined;
  for (const stat of model.stats) {
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

  equipmentModel.value.stats.push({
    id: createId(),
    statId: newStat.id,
    value: newStat.minValue === undefined ? 0 : newStat.minValue,
  })
}

function onImageClick() {
  imageInput.value!.click();
}

async function onImageSelected() {
  const file = imageInput.value!.files![0];
  imageInput.value!.files = emptyInput.value!.files;

  const fileDataURL = (f: File) => new Promise<string>((resolve, reject) => {
    let fr = new FileReader();
    fr.onload = () => resolve(fr.result as string);
    fr.onerror = reject;
    fr.readAsDataURL(f);
  });

  equipmentModel.value.imageSrc = await fileDataURL(file);
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
    <RemoveButton class="equipment-item-block" @remove="$emit('remove', equipmentModel.id)"/>
    <img
        class="equipment-item-img"
        :src="equipmentModel.imageSrc"
        alt="Image goes here"
        @click="onImageClick"
    >
    <input
        class="equipment-item-secret"
        type="file"
        accept="image/*"
        ref="imageInput"
        @change="onImageSelected"
    >
    <input
        class="equipment-item-secret"
        type="file"
        ref="emptyInput"
    />
    <EquipmentItemStat
        v-for="[index, item] of equipmentModel.stats.entries()"
        :key="item.id"
        :index="index"
        :parent-model="equipmentModel"
        :model-value="item"
        @remove="removeStat"
    />
    <input type="button" value="Add" v-on:click="addStat">
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
  max-width: 120px;
  max-height: 120px;
}
</style>
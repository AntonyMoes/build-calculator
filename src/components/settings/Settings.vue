<script setup lang="ts">
import {useTemplateRef} from "vue";
import Stats from "@/components/settings/stats/Stats.vue";
import TargetStats from "@/components/settings/targetStats/TargetStats.vue";
import {model} from "@/model/model.ts";
import {downloadFile} from "@/utils/utils.ts";
import {getRerenderKey} from "@/utils/rerenderKey.ts";
import EquipmentTypes from "@/components/settings/equipmentTypes/EquipmentTypes.vue";
import EquipmentGroups from "@/components/settings/equipmentGroups/EquipmentGroups.vue";


const rerenderKey = getRerenderKey();

const emptyInput = useTemplateRef("emptyInput");
const loadInput = useTemplateRef("loadInput");

function save() {
  const text = JSON.stringify(model);
  downloadFile("config.json", text);
}

function load() {
  loadInput.value!.click();
}

async function onLoadFileSelected() {
  const file = loadInput.value!.files![0];
  const text = await file.text();
  loadInput.value!.files = emptyInput.value!.files;

  // TODO parse and validate
  const result = JSON.parse(text);
  Object.assign(model, result);
  rerenderKey.rerender();
}
</script>

<template>
  <div class="page-container settings" :key="rerenderKey.key.value">
    <Stats/>
    <TargetStats/>
    <EquipmentTypes/>
    <EquipmentGroups/>

    <div class="save-block">
      <input
          class="save-button"
          type="button"
          value="Save"
          @click="save"
      />
      <input
          class="save-button"
          type="button"
          value="Load"
          @click="load"
      />
      <input
          class="save-secret"
          type="file"
          accept=".json"
          ref="loadInput"
          @change="onLoadFileSelected"
          @upload="onLoadFileSelected"
          @close="onLoadFileSelected"
      />
      <input
          class="save-secret"
          type="file"
          ref="emptyInput"
      />
    </div>
  </div>
</template>

<style scoped>
.settings {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 40px;
}

.save-block {
  display: flex;
  flex-direction: column;
  gap: 5px;

  position: fixed;
  right: 0;
  bottom: 0;

  padding: 5px;
}

.save-button {
  width: 100px;
  height: 40px;
}

.save-secret {
  display: none;
}
</style>
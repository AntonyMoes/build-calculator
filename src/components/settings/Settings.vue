<script setup lang="ts">
import {useTemplateRef} from "vue";
import Stats from "@/components/settings/stats/Stats.vue";
import TargetStats from "@/components/settings/targetStats/TargetStats.vue";
import {model} from "@/model/model.ts";
import {downloadFile} from "@/utils/utils.ts";
import {getRerenderKey} from "@/utils/rerenderKey.ts";
import EquipmentTypes from "@/components/settings/equipmentTypes/EquipmentTypes.vue";
import EquipmentGroups from "@/components/settings/equipmentGroups/EquipmentGroups.vue";
import type {ModelData} from "@/model/modelData.ts";
import {validateAndFixModelData} from "@/model/validation.ts";
import {type Preset, presets} from "@/model/presetData.ts";

const rerenderKey = getRerenderKey();

const emptyInput = useTemplateRef("emptyInput");
const loadInput = useTemplateRef("loadInput");

function save() {
  const text = JSON.stringify(model.data);
  downloadFile("config.json", text);
}

function load() {
  loadInput.value!.click();
}

async function onLoadFileSelected() {
  const file = loadInput.value!.files![0];
  loadInput.value!.files = emptyInput.value!.files;
  const text = await file.text();

  setData(text);
}

async function loadPreset(preset: Preset) {
  let result = await fetch(preset.location);
  let resultText = await result.text();

  setData(resultText);
}

function setData(data: string) {
  const result = JSON.parse(data) as ModelData;
  const errors = validateAndFixModelData(result);
  if (errors.length !== 0) {
    alert(errors.join("\n"));
    return;
  }

  model.setData(result);
  rerenderKey.rerender();
}

function clear() {
  const confirmed = confirm("You sure?");
  if (!confirmed) {
    return;
  }

  model.setData();
}
</script>

<template>
  <div class="page-container settings" :key="rerenderKey.key.value">
    <div class="settings-groups">
      <Stats/>
      <TargetStats/>
      <EquipmentTypes/>
      <EquipmentGroups/>
    </div>

    <div class="presets-block">
      <input
          type="button"
          class="preset-button"
          v-for="preset of presets"
          :value="preset.name"
          @click="loadPreset(preset)"
      />
    </div>

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
      />
      <input
          class="save-secret"
          type="file"
          ref="emptyInput"
      />
      <input
          class="save-button"
          type="button"
          value="Clear"
          @click="clear"
      />
    </div>
  </div>
</template>

<style scoped>

.settings-groups {
  margin-right: 100px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 40px;
}

.settings {

}

.presets-block {
  display: flex;
  flex-direction: column;
  gap: 5px;

  position: fixed;
  right: 0;
  top: 0;

  padding: 5px;
}

.preset-button {
  width: 100px;
  height: 40px;
}

.save-button {
  width: 100px;
  height: 40px;
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

.save-secret {
  display: none;
}
</style>
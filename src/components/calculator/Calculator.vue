<script setup lang="ts">
import {computed, type Ref, ref} from "vue";
import {type Token} from "@/calculator/types.ts";
import {calculator, tokenToString} from "@/components/calculator/calculator.ts";
import Variable from "@/components/calculator/Variable.vue";
import {toReversePolishNotation} from "@/calculator/reverser.ts";

function tokenizationToString(tokenization: Token[]): string {
  return tokenization.map(tokenToString).join(",");
}

const {input, tokenization, tree, error} = calculator();

const debugInfo = computed(() => {
  const errorString = error.value === undefined
      ? "OK"
      : error.value;

  const tokenizationString = tokenization.value !== undefined ? tokenizationToString(tokenization.value) : "";
  const variableString = tree.value !== undefined ? tree.value.variables.toString() : "";
  const reverseString = tree.value !== undefined ? tokenizationToString(toReversePolishNotation(tokenization.value)) : "";

  return `${tokenizationString} | ${reverseString} | ${variableString} | ${errorString}`;
})

const map = new Map<string, number>();
const result: Ref<number | undefined> = ref(undefined)

function calculate() {
  if (tree.value === undefined) {
    return;
  }

  result.value = tree.value.calculate(map);
}

function clearResult() {
  // result.value = undefined;
}

const variables = computed(() => {
  if (tree.value === undefined) {
    return [];
  }

  return tree.value.variables.map(variable => {
    return {
      name: variable,
      setValue: (value: number) => {
        map.set(variable, value);
        console.log(`${variable}: ${value}`);
        calculate();
      }
    }
  });
})

</script>

<template>
  <div class="calculator">
    <div>
      <input v-model="input" v-on:input="clearResult">
      <p>{{ input }}</p>
      <p>{{ debugInfo }}</p>
    </div>
    <div>
      <input type="button" value="Click!" v-on:click="calculate"></input>
      <p>{{ result }}</p>
    </div>

    <!--  :name="variable.name"-->
    <div class="variable-container">
      <Variable
          v-for="variable in variables"
          @change="variable.setValue"
      >
        <template #name>{{ variable.name }}</template>
      </Variable>
    </div>
  </div>
</template>

<style scoped>
.variable-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.calculator {
  margin: 100px;
}
</style>
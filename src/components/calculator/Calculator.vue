<script setup lang="ts">
import {computed, type Ref, ref} from "vue";
import {type Token} from "@/calculator/types.ts";
import {calculator, tokenToString} from "@/components/calculator/calculator.ts";

function tokenizationToString(tokenization: Token[]): string {
  return tokenization.map(tokenToString).join(",");
}

const {input, tokenization, tree, error} = calculator();

const debugInfo = computed(() => {
  const errorString = error.value === undefined
      ? "OK"
      : error.value;

  const tokenizationString = tokenization.value !== undefined ? tokenizationToString(tokenization.value) : "";
  return `${tokenizationString} | ${errorString}`;
})

const result: Ref<number | undefined> = ref(undefined)

function calculate() {
  if (tree.value === undefined) {
    return;
  }

  result.value = tree.value.calculate(new Map<string, number>());
}

function clearResult() {
  result.value = undefined;
}

//
// const input = ref("");
// const tokenizeError: Ref<string|undefined> = ref("");
// const tokenizedString: Ref<Token[]> = ref([]);
//
// function tokenToString(token: Token): string {
//   switch (token.kind) {
//     case "openParenthesis":
//       return Parenthesis.Open;
//     case "operator":
//       return token.operator;
//     case "variable":
//       return token.value;
//     case "constant":
//       return token.value.toString();
//     case "closeParenthesis":
//       return Parenthesis.Close;
//   }
// }
//
//
// function tokenizeAndGetResult() : string {
//   let tokenization: Token[] = [];
//   try {
//     tokenizedString.value = tokenize(input.value);
//     tokenizeError.value = undefined;
//   } catch (e) {
//     const parseError = e as ParseError;
//     tokenizeError.value = undefined;
//   }
//
//   const tokenizationString = tokenizationToString(tokenization);
//   const validationError = validate(tokenization);
//   const validationResultString = validationError === undefined
//       ? "OK"
//       : `Error in token #${validationError.tokenIndex}: ${tokenToString(tokenization[validationError.tokenIndex])}`;
//
//   let reversedTokens: TreeToken[] = [];
//   if (validationError === undefined) {
//     reversedTokens = toReversePolishNotation(tokenization);
//   }
//   const reversedString = tokenizationToString(reversedTokens);
//
//   return `${tokenizationString} | ${validationResultString}\n${reversedString}`;
// }
//
// function logResult() {
//   console.log(tokenizeAndGetResult());
// }
//
// const handledInput = computed(() => tokenizeAndGetResult());

</script>

<template>
  <div>
    <input v-model="input" v-on:input="clearResult">
    <p>{{ input }}</p>
    <p>{{ debugInfo }}</p>
  </div>
  <div>
    <input type="button" value="Click!" v-on:click="calculate"></input>
    <p>{{result}}</p>
  </div>
</template>

<style scoped>

</style>
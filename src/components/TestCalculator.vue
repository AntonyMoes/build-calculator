<script setup lang="ts">
import {ref, computed} from "vue";
import {tokenize} from "@/calculator/tokenizer.ts";
import {validate} from "@/calculator/astBuilder.ts";
import {Parenthesis, ParseError, type Token} from "@/calculator/types.ts";


const input = ref('');

function tokenToString(token: Token): string {
  switch (token.kind) {
    case "openParenthesis":
      return Parenthesis.Open;
    case "operator":
      return token.operator;
    case "variable":
      return token.value;
    case "constant":
      return token.value.toString();
    case "closeParenthesis":
      return Parenthesis.Close;
  }
}

function tokenizationToString(tokenization: Token[]): string {
  return tokenization.map(tokenToString).join(",");
}

function tokenizeAndGetResult() : string {
  let tokenization: Token[] = [];
  try {
    tokenization = tokenize(input.value);
  } catch (e) {
    const parseError = e as ParseError;
    return "ERROR: " + parseError.toString();
  }

  const tokenizationString = tokenizationToString(tokenization);
  const validationError = validate(tokenization);
  const validationResultString = validationError === undefined
      ? "OK"
      : `Error in token #${validationError.tokenIndex}: ${tokenToString(tokenization[validationError.tokenIndex])}`;

  return `${tokenizationString} | ${validationResultString}`;
}

function logResult() {
  console.log(tokenizeAndGetResult());
}

const handledInput = computed(() => tokenizeAndGetResult());

</script>

<template>
  <div>
    <input v-model="input">
    <p>{{ input }}</p>
    <p>{{ handledInput }}</p>
  </div>
  <div>
    <input type="button" value="Click!" v-on:click="logResult"></input>
  </div>
</template>

<style scoped>

</style>
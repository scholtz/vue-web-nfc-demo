<script setup lang="ts">
import { defineComponent, ref } from "vue";
import useNFC from "../composition/useNFC";
import Card from 'primevue/card';
import Button from 'primevue/button'

const { write, latestWrite, abortWrite } = useNFC();
const state = ref()
const writeNFC = () => {
  write({
    records: [{ recordType: "text", data: "Hello World" }],
  }).catch((e) => {
    console.log(e);
  });
};

const writeURL = () => {
  write({
    records: [
      { recordType: "url", data: "https://w3c.github.io/web-nfc/" },
    ],
  }).catch((e) => {
    state.value = e.message
    console.log(e);
  });
};

const writeEmpty = () => {
  write({
    records: [{ recordType: "empty" }],
  }).catch((e) => {
    state.value = e.message
    console.log(e);
  });
};
</script>
<template>
  <Card>
    <template #content>
      <Button class="m-1" @click="writeNFC"> Write Text </Button>
      <Button class="m-1" @click="writeURL"> Write URL </Button>
      <Button class="m-1" @click="writeEmpty"> Write Empty </Button>
      <Button class="m-1" @click="abortWrite"> Abort Write </Button>
      <div>Latest Write: {{ latestWrite || `N/A` }}</div>
      <div>Last error: {{ state }}</div>
    </template>
  </Card>
</template>
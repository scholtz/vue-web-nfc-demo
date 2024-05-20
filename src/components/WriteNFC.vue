<template>
  <Card>
    <template #content>
      <Button class="ma-1" @click="writeNFC"> Write Text </Button>
      <Button class="ma-1" @click="writeURL"> Write URL </Button>
      <Button class="ma-1" @click="writeEmpty"> Write Empty </Button>
      <Button class="ma-1" @click="abortWrite"> Abort Write </Button>
      <div>Latest Write: {{ latestWrite || `N/A` }}</div>
    </template>
  </Card>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import useNFC from "../composition/useNFC";
import Card from 'primevue/card';
import Button from 'primevue/button'

export default defineComponent({
  components: { Button, Card },
  setup() {
    const { write, latestWrite, abortWrite } = useNFC();

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
        console.log(e);
      });
    };

    const writeEmpty = () => {
      write({
        records: [{ recordType: "empty" }],
      }).catch((e) => {
        console.log(e);
      });
    };

    return {
      writeNFC,
      writeURL,
      writeEmpty,
      latestWrite,
      abortWrite,
    };
  },
});
</script>

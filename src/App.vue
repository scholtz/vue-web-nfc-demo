<template>
  <div class="layout">
    <Card>
      <template #content>
        <div>Has NFC: {{ hasNFC() }}</div>
        <div>Latest Read: {{ latest }}</div>
        <div>Latest Message: {{ latestMessage }}</div>
        <div>Error: {{ error || `No error` }}</div>
        <div>Status: {{ status }}</div>
        <div v-if="hasNFC()">
          <ReadNFC />
          <WriteNFC />
        </div>
        <div>
          <div>Scan the QR code to easy navigate to the demo on mobile:</div>
          <img src="/demo-link.png" />
        </div>
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
/// <reference path="web-nfc.d.ts" />
import { defineComponent, computed } from "vue";
import useNFC, { NFCStatus } from "./composition/useNFC";
import WriteNFC from "./components/WriteNFC.vue";
import ReadNFC from "./components/ReadNFC.vue";
import Card from "primevue/card";

export default defineComponent({
  name: "App",
  components: { WriteNFC, ReadNFC, Card },
  setup() {
    const hasNFC = () => {
      return "NDEFReader" in window;
    };

    const nfc = useNFC();

    const latest = computed(() => {
      return nfc.latestRead?.value && nfc.latestRead.value.message && nfc.latestRead.value.message.records[0] ? nfc.latestRead.value.message.records[0].recordType : "N/A";
    });
    const latestMessage = computed(() => {
      return nfc.latestRead?.value ? nfc.latestRead.value.message : "N/A";
    });

    return {
      hasNFC,
      NFCStatus,
      latest,
      latestMessage,
      ...nfc,
    };
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.va-card {
  margin: 1rem;
}
</style>

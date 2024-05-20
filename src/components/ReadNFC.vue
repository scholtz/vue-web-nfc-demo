<template>
  <Card>
    <template #content>
      <Button @click="startReading()" v-if="!is(NFCStatus.READING)">
        Start Reading
      </Button>
      <Button color="danger" @click="stopReading()" v-else>
        Stop Reading
      </Button>
    </template>
  </Card>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import useNFC, { NFCStatus } from "../composition/useNFC";
import Card from 'primevue/card';
import Button from 'primevue/button';

export default defineComponent({
  components: { Button, Card },
  setup() {
    const { startReading, stopReading, is } = useNFC();
    return { NFCStatus, startReading, stopReading, is };
  },
});
</script>

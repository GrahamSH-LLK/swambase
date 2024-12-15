<template>
  <MeetHeader />

  {{ useFormatEvent(data) }}
  <UCard v-for="entry of data.entries" :key="entry.entry">
    <template #header>
      {{ formatEntry(entry) }}
    </template>
    {{ entry.athlete.first }} {{ entry.athlete.last }}
  </UCard>
</template>

<script setup>
import { useFormatEvent } from "~/composables";

const route = useRoute();
const { data, status, error, refresh, clear } = await useFetch(
  `/api/meets/${route.params.slug}/events/${route.params.id}`,
  {}
);
</script>

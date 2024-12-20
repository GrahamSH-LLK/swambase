<template>
  <div class="flex flex-col gap-4">
    <MeetHeader />

    <h2 class="text-2xl">{{ useFormatEvent(data) }}</h2>
    <UTabs :items="tabItems" :content="false" v-model="activeTab"></UTabs>
    <UCard
      v-for="entry of data.entries"
      :key="entry.entry"
      v-if="activeTab == '0'"
      class="mb-4"
    >
      <template #header>
        {{ formatEntry(entry) }}
      </template>
      {{ entry.athlete?.first }} {{ entry.athlete?.last }}
    </UCard>
    <UCard v-if="activeTab == '1'">
      <UTable :data="resultsTable" :columns="resultsColumns" />
    </UCard>
  </div>
</template>

<script setup>
import { useFormatEvent } from "~/composables";

const route = useRoute();
const { data, status, error, refresh, clear } = await useFetch(
  `/api/meets/${route.params.slug}/events/${route.params.id}`,
  {}
);
const activeTab = ref("0");
const tabItems = ref([
  {
    label: "Entries",
    icon: "i-lucide-list",
  },
  {
    label: "Results",
    icon: "i-lucide-trophy",
  },
]);
const resultsTable = computed(() => {
  return data.value.results.map((result) => {
    return {
      place: result.place,
      time: result.time,
      athlete: result.athlete,
    };
  });
});
const resultsColumns = [
  {
    accessorKey: "place",
    label: "Place",
  },
  {
    accessorKey: "time",
    label: "Time",
  },
  {
    accessorKey: "athlete",
    label: "Athlete",
    cell: ({ row }) => {
      return `${row.original.athlete.first} ${row.original.athlete.last}`;
    },
  },
];
</script>

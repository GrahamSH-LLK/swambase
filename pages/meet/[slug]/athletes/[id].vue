<template>
  <div class="flex flex-col gap-4">
    <MeetHeader />
    <h2 class="text-2xl font-extrabold">{{ data.first }} {{ data.last }}</h2>

    <UCard>
      <template #header>
        <span class="font-bold text-xl">Entries</span>
      </template>

      <UTable :data="data.entries" class="flex-1" :columns="columns" />
    </UCard>
    <UCard>
      <template #header>
        <span class="font-bold text-xl">Results</span>
      </template>
      <UTable :data="resultsRows" class="flex-1" />
    </UCard>
</div>
</template>

<script setup lang="ts">
import { formatDuration, intervalToDuration } from "date-fns";
const route = useRoute();
const { data } = await useFetch(
  `/api/meets/${route.params.slug}/athletes/${route.params.id}`,
  {}
);
const columns = ref([
  {
    accessorKey: "heat",
    header: "Heat",
  },
  {
    accessorKey: "lane",
    header: "Lane",
  },
  {
    accessorKey: "iR",
    header: "Type",
    cell: ({ row }) => {
      return row.getValue("iR") == "I" ? "Individual" : "Relay";
    },
  },
  {
    accessorKey: "event",
    header: "Event",
    cell: ({ row }) => {
      return useFormatEvent(row.getValue("event"));
    },
  },
]);

const resultsRows = computed(() => {
  return data.value?.results?.map((result) => {

    return {
      event: useFormatEvent(result),
      place: result.place,
      time: useFormatTime(result.score), //`COMING SOON`
    };
  });
});
</script>

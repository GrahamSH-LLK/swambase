<template>
  <div class="flex flex-col gap-4">
    <h2 class="text-3xl">{{ data.first }} {{ data.last }}</h2>

    <MeetHeader :meet="meet" />
    <USelectMenu :items="meetDropdown" value-key="id" v-model="meet" />

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
const { data: meets } = await useFetch(
  `/api/athletes/${route.params.id}/meets`,
  {}
);
const meet = useRouteQuery("meet", meets.value?.[0].meet, {
  transform: Number,
});

const { data } = await useFetch(
  () => `/api/meets/${meet.value}/athletes/${route.params.id}`,
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
const meetDropdown = computed(() => {
  return meets.value?.map((meet) => {
    return {
      label: meet.mName,
      id: meet.meet,
    };
  });
});

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

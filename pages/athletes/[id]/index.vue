<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-2">
      <h1 class="text-4xl font-bold text-slate-900 dark:text-white">
        {{ data?.first }} {{ data?.last }}
      </h1>
      <AthleteBar />
    </div>

    <MeetHeader :meet="meet" />

    <USelectMenu
      :items="meetDropdown"
      value-key="id"
      v-model="meet"
      placeholder="Select a meet..."
      class="max-w-md"
      icon="i-lucide-calendar"
    />

    <div class="grid gap-6 lg:grid-cols-2">
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-list" class="w-5 h-5 text-blue-500" />
            <span class="font-bold text-xl text-slate-900 dark:text-white"
              >Entries</span
            >
          </div>
        </template>
        <UTable :data="data?.entries" class="flex-1" :columns="columns" />
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-trophy" class="w-5 h-5 text-amber-500" />
            <span class="font-bold text-xl text-slate-900 dark:text-white"
              >Results</span
            >
          </div>
        </template>
        <UTable :data="resultsRows" class="flex-1" />
      </UCard>
    </div>
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
  return meets.value?.map((meet) => ({
    label: meet.mName,
    id: meet.meet,
  }));
});

const resultsRows = computed(() => {
  return data.value?.results?.map((result) => ({
    event: useFormatEvent(result),
    place: result.place,
    time: useFormatTime(result.score),
  }));
});
</script>

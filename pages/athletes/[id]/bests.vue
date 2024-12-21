<template>
  <div class="flex flex-col gap-4">
    <h1 class="text-3xl font-bold font-stretch-semi-condensed">
      {{ athlete?.first }} {{ athlete?.last }} - Bests
    </h1>
    <AthleteBar/>
    <UTable :data="data" :columns="columns">
      <template #meet-cell="{ row }">
        <NuxtLink :to="`/meets/${row.original.meet.meet}`">
          <UBadge
            class="capitalize hover:ring-red-400 hover:bg-red-200 transition-colors"
            variant="subtle"
          >
            {{ row.original.meet.mName }}
            <span class="font-stretch-condensed">{{
              format(row.original.meet.start, "MMM dd, yyyy")
            }}</span></UBadge
          >
        </NuxtLink>
      </template>
    </UTable>
  </div>
</template>
<script lang="ts" setup>
import { format } from "date-fns";

const route = useRoute();
const { data: athlete } = await useFetch(
  `/api/athletes/${route.params.id}`,
  {}
);
const { data, status, error, refresh, clear } = await useFetch(
  `/api/athletes/${route.params.id}/bests`,
  {}
);
const getHeader = useGetHeader();
const columns = ref([
  {
    header: ({ column }) => getHeader(column, "Event"),
    cell: ({ row }) => {
      return useFormatEvent(row.original);
    },
    accessorKey: "event",
  },
  {
    header: ({ column }) => getHeader(column, "Best Time"),
    accessorKey: "score",
    cell: ({ row }) => {
      return useFormatTime(row.original.score);
    },
  },
  {
    header: ({ column }) => getHeader(column, "Meet"),
    accessorKey: "meet",
  },
]);
</script>

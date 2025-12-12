<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-2">
      <h1 class="text-4xl font-bold text-slate-900 dark:text-white">
        {{ athlete?.first }} {{ athlete?.last }}
      </h1>
      <p class="text-slate-500 dark:text-slate-400">Personal Best Times</p>
      <AthleteBar />
    </div>

    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-timer" class="w-5 h-5 text-amber-500" />
          <span class="font-bold text-xl text-slate-900 dark:text-white"
            >Best Times</span
          >
        </div>
      </template>

      <UTable :data="data" :columns="columns">
        <template #meet-cell="{ row }">
          <NuxtLink :to="`/meets/${row.original.meet.meet}`">
            <UBadge
              class="capitalize hover:ring-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors cursor-pointer"
              variant="subtle"
              color="primary"
            >
              {{ row.original.meet.mName }}
              <span
                class="font-mono text-xs text-slate-500 dark:text-slate-400 ml-1"
              >
                {{ format(row.original.meet.start, "MMM dd, yyyy") }}
              </span>
            </UBadge>
          </NuxtLink>
        </template>
      </UTable>
    </UCard>
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

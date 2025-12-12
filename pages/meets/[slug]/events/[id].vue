<template>
  <div class="flex flex-col gap-6">
    <MeetHeader />

    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-flag" class="w-5 h-5 text-blue-500" />
          <span class="font-bold text-xl text-slate-900 dark:text-white">
            {{ useFormatEvent(data) }}
          </span>
        </div>
      </template>

      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <UCard
          v-for="entry of data?.entries"
          :key="entry.entry"
          variant="subtle"
          class="hover:border-blue-500/50 transition-colors"
        >
          <template #header>
            <div class="flex items-center justify-between">
              <span class="font-semibold text-slate-700 dark:text-slate-300">
                {{ formatEntry(entry) }}
              </span>
            </div>
          </template>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-user" class="w-4 h-4 text-slate-400" />
            <span class="text-slate-900 dark:text-white">
              {{ entry.athlete?.first }} {{ entry.athlete?.last }}
            </span>
          </div>
        </UCard>
      </div>
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
</script>

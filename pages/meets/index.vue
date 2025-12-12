<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-2">
      <h1 class="text-4xl font-bold text-slate-900 dark:text-white">Meets</h1>
      <p class="text-slate-500 dark:text-slate-400">
        Browse all swimming meets and competitions
      </p>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        :to="`/meets/${meet.meet}`"
        as="NuxtLink"
        v-for="meet of data"
        :key="meet.meet"
      >
        <UCard class="cursor-pointer group">
          <template #header>
            <div class="flex items-start justify-between gap-2">
              <h2
                class="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
              >
                {{ meet.mName }}
              </h2>
              <UBadge color="primary" variant="subtle">
                {{ meet.entryCount }} entries
              </UBadge>
            </div>
          </template>

          <div class="flex flex-col gap-2 text-sm">
            <div
              class="flex items-center gap-2 text-slate-600 dark:text-slate-300"
            >
              <UIcon name="i-lucide-map-pin" class="w-4 h-4 text-slate-400" />
              {{ meet.location }}
            </div>
            <div
              class="flex items-center gap-2 text-slate-600 dark:text-slate-300"
            >
              <UIcon name="i-lucide-calendar" class="w-4 h-4 text-slate-400" />
              {{ format(new Date(meet.start), "MMM dd") }} -
              {{ format(new Date(meet.end), "MMM dd, yyyy") }}
            </div>
          </div>
        </UCard></NuxtLink
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from "date-fns";

const { data, status, error, refresh, clear } = await useFetch(
  "/api/meets/list",
  {}
);
</script>

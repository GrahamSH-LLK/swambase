<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-2">
      <h1 class="text-4xl font-bold text-slate-900 dark:text-white">Teams</h1>
      <p class="text-slate-500 dark:text-slate-400">
        Browse all swimming teams and their rosters
      </p>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <UCard
        v-for="team of data"
        :key="team.team"
        class=" cursor-pointer group"
        :to="`/teams/${team.team}`"
        as="NuxtLink"
      >
        <template #header>
          <div class="flex items-center justify-between gap-2">
            <h2
              class="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
            >
              {{ team.tName }}
            </h2>
            <UBadge color="neutral" variant="subtle" class="font-mono">
              {{ team.tCode }}
            </UBadge>
          </div>
        </template>

        <div class="flex flex-wrap gap-2">
          <UBadge color="primary" variant="subtle">
            <UIcon name="i-lucide-users" class="w-3 h-3 mr-1" />
            {{ team.athletes.length }} athletes
          </UBadge>
          <UBadge v-if="team.short" color="secondary" variant="subtle">
            {{ team.short }}
          </UBadge>
          <UBadge
            v-if="team.tState || team.tCntry"
            color="neutral"
            variant="outline"
          >
            <UIcon name="i-lucide-map-pin" class="w-3 h-3 mr-1" />
            {{ [team.tState, team.tCntry].filter(Boolean).join(", ") }}
          </UBadge>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data, status, error, refresh, clear } = await useFetch(
  "/api/teams/list",
  {}
);
</script>

<template>
  <div class="flex flex-col gap-6">
    <MeetHeader />

    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-flag" class="w-5 h-5 text-blue-500" />
            <span class="font-bold text-xl text-slate-900 dark:text-white">
              {{ useFormatEvent(data) }}
            </span>
          </div>
          <div class="flex gap-2">
            <UBadge variant="subtle" color="info">
              Event #{{ route.params.id }}
            </UBadge>
            <UBadge
              variant="subtle"
              :color="data?.iR === 'I' ? 'success' : 'warning'"
            >
              {{ data?.iR === "I" ? "Individual" : "Relay" }}
            </UBadge>
          </div>
        </div>
      </template>

      <UTabs
        :items="tabItems"
        :content="false"
        v-model="activeTab"
        class="mb-4"
      />

      <div v-if="activeTab === '0'">
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
            <NuxtLink
              :to="`/athletes/${entry.athlete?.athlete}?meet=${route.params.slug}`"
              class="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <UIcon name="i-lucide-user" class="w-4 h-4 text-slate-400" />
              <span class="text-slate-900 dark:text-white">
                {{ entry.athlete?.first }} {{ entry.athlete?.last }}
              </span>
            </NuxtLink>
          </UCard>
        </div>
      </div>

      <div v-else-if="activeTab === '1'">
        <div
          v-if="sortedResults?.length"
          class="divide-y divide-slate-100 dark:divide-slate-800"
        >
          <div
            v-for="(result, idx) in sortedResults"
            :key="result.result"
            class="flex items-center justify-between py-4 first:pt-0 last:pb-0"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                :class="getPlaceClass(result.place || idx + 1)"
              >
                {{ result.place || idx + 1 }}
              </div>
              <div>
                <NuxtLink
                  :to="`/athletes/${result.athlete?.athlete}?meet=${route.params.slug}`"
                  class="font-medium text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {{ result.athlete?.first }} {{ result.athlete?.last }}
                </NuxtLink>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <span
                class="font-mono text-xl font-semibold text-slate-900 dark:text-white"
              >
                {{ useFormatTime(result.score) }}
              </span>
              <div class="flex gap-2">
                <UBadge
                  v-if="result.fP === 'F'"
                  variant="subtle"
                  color="success"
                  size="xs"
                >
                  Finals
                </UBadge>
                <UBadge
                  v-else-if="result.fP === 'P'"
                  variant="subtle"
                  color="neutral"
                  size="xs"
                >
                  Prelims
                </UBadge>
                <UBadge
                  v-if="result.ex?.trim()"
                  variant="subtle"
                  color="warning"
                  size="xs"
                >
                  Exhibition
                </UBadge>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-12 text-slate-500">
          <UIcon
            name="i-lucide-inbox"
            class="w-12 h-12 mx-auto mb-4 opacity-50"
          />
          <p>No results available for this event</p>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup>
import { useFormatEvent, useFormatTime } from "~/composables";

const route = useRoute();
const { data, status, error, refresh, clear } = await useFetch(
  `/api/meets/${route.params.slug}/events/${route.params.id}`,
  {}
);

const tabItems = ref([
  { label: "Entries", icon: "i-lucide-list" },
  { label: "Results", icon: "i-lucide-trophy" },
]);

const activeTab = ref("0");

const sortedResults = computed(() => {
  if (!data.value?.results) return [];
  return [...data.value.results]
    .filter((r) => r.iR !== "R")
    .sort((a, b) => {
      if (a.place && b.place) return a.place - b.place;
      return (a.score || 0) - (b.score || 0);
    });
});

const getPlaceClass = (place) => {
  if (place === 1)
    return "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300";
  if (place === 2)
    return "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300";
  if (place === 3)
    return "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300";
  return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
};
</script>

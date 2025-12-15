<template>
  <div class="flex flex-col gap-6 w-full">
    <MeetHeader />

    <UTabs :items="items" :content="false" v-model="activeTab" />

    <UCard>
      <UTable
        v-if="activeTab == '0'"
        v-model:expanded="expanded"
        :data="events"
        :columns="columns"
        :ui="{ tr: 'data-[expanded=true]:bg-elevated/50' }"
        class="overflow-auto"
      >
        <template #expand-cell="{ row }">
          <UButton
            v-if="!row.original.individual"
            color="neutral"
            variant="ghost"
            icon="i-lucide-chevron-down"
            size="xs"
            square
            :ui="{
              leadingIcon: [
                'transition-transform duration-200',
                row.getIsExpanded() ? 'rotate-180' : '',
              ],
            }"
            @click="row.toggleExpanded()"
          />
        </template>
        <template #number-cell="{ row }">
          <UButton
            :to="`/meets/${route.params.slug}/events/${row.original.number}`"
            variant="subtle"
            size="sm"
          >
            {{ row.original.number }}
          </UButton>
        </template>
        <template #entries-cell="{ row }">
          <div
            v-if="row.original.individual"
            class="flex gap-2 md:flex-row flex-col flex-wrap"
          >
            <NuxtLink
              :to="`/athletes/${entry.athlete.athlete}?meet=${route.params.slug}`"
              v-for="entry of row.getValue(`entries`)"
              :key="entry.entry"
            >
              <UBadge
                class="capitalize hover:ring-2 hover:ring-offset-1 transition-all cursor-pointer"
                variant="subtle"
                :color="colors[entry.team % colors.length]"
              >
                {{ entry.athlete.first }} {{ entry.athlete.last }}
                <span class="font-mono text-xs opacity-70 ml-1">
                  H{{ entry.heat }}{{ entry.lane && ` L${entry.lane}` }}
                </span>
              </UBadge>
            </NuxtLink>
          </div>
          <div v-else class="flex items-center gap-2">
            <UBadge variant="subtle" color="success">
              {{
                row
                  .getValue("entries")
                  ?.filter((x) => x?.iR != "R" && x.athlete).length / 4
              }}
              relays
            </UBadge>
          </div>
        </template>
        <template #expanded="{ row }">
          <div class="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
            <h4
              class="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-3"
            >
              Relay Entries
            </h4>
            <div class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              <div
                v-for="(relay, index) in getRelayTeams(row.original.entries)"
                :key="index"
                class="bg-white dark:bg-slate-800 rounded-md p-3 border border-slate-200 dark:border-slate-700"
              >
                <div class="flex items-center gap-2 mb-2">
                  <UBadge
                    :color="colors[relay.team % colors.length]"
                    variant="subtle"
                    size="sm"
                  >
                    Heat {{ relay.heat }} Lane {{ relay.lane }}
                  </UBadge>
                </div>
                <div class="space-y-1">
                  <NuxtLink
                    v-for="(member, mIndex) in relay.members"
                    :key="mIndex"
                    :to="`/athletes/${member.athlete}?meet=${route.params.slug}`"
                    class="flex items-center gap-2 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <span class="text-xs text-slate-400 w-4"
                      >{{ mIndex + 1 }}.</span
                    >
                    <span>{{ member.first }} {{ member.last }}</span>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </template>
      </UTable>

      <div v-else-if="activeTab == '1'" class="flex flex-col gap-4">
        <UInput
          v-model="athleteSearch"
          placeholder="Search athletes..."
          icon="i-lucide-search"
          class="max-w-sm"
        />
        <UTable :data="filteredAthleteTable" :columns="athleteColumns">
          <template #actions-cell="{ row }">
            <NuxtLink
              :to="`/athletes/${row.original.id}?meet=${route.params.slug}`"
            >
              <UButton
                icon="i-lucide-circle-user"
                variant="ghost"
                color="primary"
                size="sm"
              />
            </NuxtLink>
          </template>
        </UTable>
      </div>

      <div v-else-if="activeTab == '2'" class="flex flex-col gap-6">
        <div class="flex flex-wrap gap-4 items-center mb-2">
          <UInput
            v-model="resultsSearch"
            placeholder="Search by athlete or event..."
            icon="i-lucide-search"
            class="max-w-sm"
          />
          <USelectMenu
            v-model="resultsEventFilter"
            :items="eventFilterOptions"
            placeholder="Filter by event"
            class="w-48"
            value-key="value"
          />
          <UButton
            v-if="resultsSearch || resultsEventFilter"
            variant="ghost"
            color="neutral"
            icon="i-lucide-x"
            @click="
              resultsSearch = '';
              resultsEventFilter = null;
            "
          >
            Clear
          </UButton>
        </div>

        <div class="space-y-6">
          <div
            v-for="eventGroup in groupedResults"
            :key="eventGroup.eventName"
            class="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden"
          >
            <div
              class="bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-950/50 dark:to-sky-950/50 px-4 py-3 border-b border-slate-200 dark:border-slate-700"
            >
              <div class="flex items-center justify-between">
                <h3
                  class="font-semibold text-slate-900 dark:text-white flex items-center gap-2"
                >
                  <UIcon name="i-lucide-flag" class="w-4 h-4 text-blue-500" />
                  {{ eventGroup.eventName }}
                </h3>
                <UBadge variant="subtle" color="neutral">
                  {{ eventGroup.results.length }} results
                </UBadge>
              </div>
            </div>
            <div class="divide-y divide-slate-100 dark:divide-slate-800">
              <div
                v-for="(result, idx) in eventGroup.results"
                :key="result.result"
                class="flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div class="flex items-center gap-4">
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    :class="getPlaceClass(result.place)"
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

                <div class="flex items-center gap-3">
                  <div class="text-right">
                    <span
                      class="font-mono text-lg font-semibold text-slate-900 dark:text-white"
                    >
                      {{ useFormatTime(result.score) }}
                    </span>
                    <div
                      v-if="getDistanceToCut(result, eventGroup)"
                      class="text-xs"
                      :class="
                        getDistanceToCut(result, eventGroup)?.achieved
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-slate-500 dark:text-slate-400'
                      "
                    >
                      {{ getDistanceToCut(result, eventGroup)?.text }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="groupedResults.length === 0"
          class="text-center py-12 text-slate-500"
        >
          <UIcon
            name="i-lucide-inbox"
            class="w-12 h-12 mx-auto mb-4 opacity-50"
          />
          <p>No results found</p>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useRouteQuery } from "@vueuse/router";
import type { Column } from "@tanstack/vue-table";
import type { StringFormatParams } from "zod/v4/core";
import { useDistanceToNextCut, qualifyingLevelLabels } from "~/composables";

const route = useRoute();
const getHeader = useGetHeader();

const { data, status, error, refresh, clear } = await useFetch(
  `/api/meets/${route.params.slug}`,
  {}
);

// Type assertion for the data since API returns meet with events and results
const meetData = computed(() => data.value);

const events = computed(() => {
  return meetData.value?.events
    ?.map((event: any) => ({
      number: event.eventNumber,
      name: useFormatEvent(event),
      entries: event.entries,
      individual: event.iR == "I",
    }))
    .filter((x: any) => x.number);
});

const colors = ["warning", "neutral", "info", "error", "success"] as const;

const expanded = ref<Record<string, boolean>>({});

const getRelayTeams = (entries: any[]) => {
  if (!entries) return [];

  const relayMap = new Map();

  entries.forEach((entry) => {
    if (!entry.athlete) return;

    const key = `${entry.heat}-${entry.lane}`;
    if (!relayMap.has(key)) {
      relayMap.set(key, {
        heat: entry.heat,
        lane: entry.lane,
        team: entry.team,
        members: [],
      });
    }
    relayMap.get(key).members.push(entry.athlete);
  });

  return Array.from(relayMap.values());
};

const columns = [
  {
    id: "expand",
    header: "",
  },
  {
    accessorKey: "number",
    header: ({ column }: { column: Column<any> }) =>
      getHeader(column, "Event #"),
  },
  {
    accessorKey: "name",
    header: ({ column }: { column: Column<any> }) =>
      getHeader(column, "Event Name"),
  },
  {
    accessorKey: "entries",
    header: "Entries",
  },
];

const items = ref([
  {
    label: "Entries",
    icon: "i-lucide-list",
  },
  {
    label: "Athletes",
    icon: "i-lucide-users",
  },
  {
    label: "Results",
    icon: "i-lucide-trophy",
  },
]);

const activeTabHash = useRouteQuery("tab", "entries");
const activeTab = computed({
  get() {
    return (
      items.value.findIndex(
        (item) => item.label?.toLowerCase() == activeTabHash.value
      ) || 0
    ).toString();
  },
  set(value: string) {
    activeTabHash.value =
      items.value[parseInt(value)]?.label?.toLowerCase() ?? "entries";
  },
});

const { data: athletes } = await useFetch(
  `/api/meets/${route.params.slug}/athletes/list`,
  {}
);

// Search state
const athleteSearch = ref("");
const resultsSearch = ref("");
const resultsEventFilter = ref<string | null>(null);

const athleteTable = computed(() => {
  return (athletes.value as any[])?.map((athlete: any) => ({
    id: athlete?.athlete,
    firstName: athlete?.first,
    lastName: athlete?.last,
    gender: athlete?.sex,
    team: athlete?.team?.tName,
  }));
});

const filteredAthleteTable = computed(() => {
  if (!athleteSearch.value) return athleteTable.value;
  const search = athleteSearch.value.toLowerCase();
  return athleteTable.value?.filter(
    (athlete) =>
      athlete.firstName?.toLowerCase().includes(search) ||
      athlete.lastName?.toLowerCase().includes(search) ||
      athlete.team?.toLowerCase().includes(search)
  );
});

const athleteColumns = ref([
  {
    header: ({ column }: { column: Column<any> }) =>
      getHeader(column, "First Name"),
    accessorKey: "firstName",
  },
  {
    header: ({ column }: { column: Column<any> }) =>
      getHeader(column, "Last Name"),
    accessorKey: "lastName",
  },
  {
    header: ({ column }: { column: Column<any> }) =>
      getHeader(column, "Gender"),
    accessorKey: "gender",
  },
  {
    header: ({ column }: { column: Column<any> }) => getHeader(column, "Team"),
    accessorKey: "team",
  },
  {
    id: "actions",
  },
]);

// Event filter options for results
const eventFilterOptions = computed(() => {
  const eventSet = new Map<string, string>();
  meetData.value?.results?.forEach((result: any) => {
    if (result.iR !== "R") {
      const eventName = useFormatEvent(result);
      eventSet.set(eventName, eventName);
    }
  });
  return [
    { label: "All Events", value: null },
    ...Array.from(eventSet.values()).map((name) => ({
      label: name,
      value: name,
    })),
  ];
});

// Group results by event
const groupedResults = computed(() => {
  if (!meetData.value?.results) return [];

  const filtered = meetData.value.results.filter((result: any) => {
    if (result.iR === "R") return false;

    const eventName = useFormatEvent(result);

    // Apply event filter
    if (resultsEventFilter.value && eventName !== resultsEventFilter.value) {
      return false;
    }

    // Apply search filter
    if (resultsSearch.value) {
      const search = resultsSearch.value.toLowerCase();
      const athleteName =
        `${result.athlete?.first} ${result.athlete?.last}`.toLowerCase();
      if (
        !athleteName.includes(search) &&
        !eventName.toLowerCase().includes(search)
      ) {
        return false;
      }
    }

    return true;
  });

  // Group by event
  const groups = new Map<string, { eventName: string; results: any[] }>();

  filtered.forEach((result: any) => {
    const eventName = useFormatEvent(result);
    if (!groups.has(eventName)) {
      groups.set(eventName, { eventName, results: [] });
    }
    groups.get(eventName)!.results.push(result);
  });

  // Sort results within each group by place/score
  groups.forEach((group) => {
    group.results.sort((a, b) => {
      if (a.place && b.place) return a.place - b.place;
      return (a.score || 0) - (b.score || 0);
    });
  });

  return Array.from(groups.values());
});

const getPlaceClass = (place: number | null) => {
  if (place === 1)
    return "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300";
  if (place === 2)
    return "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300";
  if (place === 3)
    return "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300";
  return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
};

const getDistanceToCut = (result: any, eventGroup: any) => {
  if (!result.score || result.score <= 0) return null;

  // Get the event info from the first result in the group (they share distance/stroke/sex)
  const eventResult = eventGroup.results[0] || result;

  const cutInfo = useDistanceToNextCut(
    result.score,
    eventResult.distance,
    eventResult.stroke,
    eventResult.sex
  );

  if (!cutInfo.level || cutInfo.difference === null) return null;

  const sign = cutInfo.achieved ? "-" : "+";
  const seconds = (Math.abs(cutInfo.difference) / 100).toFixed(2);
  const label = qualifyingLevelLabels[cutInfo.level];

  return {
    achieved: cutInfo.achieved,
    text: cutInfo.achieved ? `${label} ✓` : `${sign}${seconds}s to ${label}`,
  };
};
</script>

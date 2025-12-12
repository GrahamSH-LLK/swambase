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
                :color="colors[entry.team]"
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
                    :color="colors[relay.team]"
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

      <div v-else-if="activeTab == '1'">
        <UTable :data="athleteTable" :columns="athleteColumns">
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

      <div v-else-if="activeTab == '2'">
        <UTable :data="resultsTable" />
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const getHeader = useGetHeader();

const { data, status, error, refresh, clear } = await useFetch(
  `/api/meets/${route.params.slug}`,
  {}
);

const events = computed(() => {
  return data.value?.events
    ?.map((event) => ({
      number: event.eventNumber,
      name: useFormatEvent(event),
      entries: event.entries,
      individual: event.iR == "I",
    }))
    .filter((x) => x.number);
});

const colors = ["warning", "neutral", "info", "error", "success"] as const;

const expanded = ref<Record<string, boolean>>({});

// Group relay entries by heat/lane
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
    header: ({ column }) => getHeader(column, "Event #"),
  },
  {
    accessorKey: "name",
    header: ({ column }) => getHeader(column, "Event Name"),
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
    activeTabHash.value = items.value[parseInt(value)]["label"]?.toLowerCase();
  },
});

const { data: athletes } = await useFetch(
  `/api/meets/${route.params.slug}/athletes/list`,
  {}
);

const athleteTable = computed(() => {
  return athletes.value?.map((athlete) => ({
    id: athlete?.athlete,
    firstName: athlete?.first,
    lastName: athlete?.last,
    gender: athlete?.sex,
    team: athlete?.team.tName,
  }));
});

const athleteColumns = ref([
  {
    header: ({ column }) => getHeader(column, "First Name"),
    accessorKey: "firstName",
  },
  {
    header: ({ column }) => getHeader(column, "Last Name"),
    accessorKey: "lastName",
  },
  {
    header: ({ column }) => getHeader(column, "Gender"),
    accessorKey: "gender",
  },
  {
    header: ({ column }) => getHeader(column, "Team"),
    accessorKey: "team",
  },
  {
    id: "actions",
  },
]);

import { useRouteQuery } from "@vueuse/router";

const resultsTable = computed(() => {
  return data.value?.results
    .filter((result) => result.iR != "R")
    .map((result) => ({
      place: result.place,
      event: useFormatEvent(result),
      time: useFormatTime(result.score),
      athlete: result?.athlete?.first + " " + result?.athlete?.last,
    }));
});
</script>

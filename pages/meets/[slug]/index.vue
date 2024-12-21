<template>
  <div class="flex flex-col gap-4 p-4 flex-1 mx-auto w-full">
    <MeetHeader />
    <UTabs :items="items" :content="false" v-model="activeTab"></UTabs>
    <UCard class="flex overflow-scroll">
      <UTable
        :data="events"
        :columns="columns"
        class="overflow-auto "
        v-if="activeTab == '0'"
      >
        <template #number-cell="{ row }">
          <UButton
            :to="`/meets/${route.params.slug}/events/${row.original.number}`"
            class=" "
          >
            {{ row.original.number }}
          </UButton>
        </template>
        <template #entries-cell="{ row }">
          <div
            v-if="row.original.individual"
            class="flex gap-2 md:flex-row flex-col"
          >
            <NuxtLink
              :to="`/athletes/${entry.athlete.athlete}?meet=${route.params.slug}`"
              v-for="entry of row.getValue(`entries`)"
            >
              <UBadge
                class="capitalize hover:ring-neutral-400 hover:bg-neutral-200 transition-colors"
                variant="subtle"
                :color="colors[entry.team]"
                >{{ entry.athlete.first }} {{ entry.athlete.last }}
                <span class="font-stretch-condensed text-slate-500"
                  >H{{ entry.heat }} {{ entry.lane && "L" + entry.lane }}</span
                ></UBadge
              >
            </NuxtLink>
          </div>
          <div v-else>
            <UBadge class="capitalize" variant="subtle" color="success">{{
              row.getValue("entries")?.filter((x) => x?.iR != "R" && x.athlete)
                .length / 4
            }}</UBadge>
          </div>
        </template>
      </UTable>
      <div v-else-if="activeTab == '1'">
        <UTable :data="athleteTable" :columns="athleteColumns">
          <template #actions-cell="{ row }"
            ><NuxtLink
              :to="`/athletes/${row.original.id}?meet=${route.params.slug}`"
              ><UIcon name="lucide:circle-user" class="h-6 w-6 cursor-pointer"
            /></NuxtLink>
          </template>
        </UTable>
      </div>
      <div v-else-if="activeTab == '2'">
        <UTable :data="resultsTable"> </UTable>
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
    ?.map((event) => {
      return {
        number: event.eventNumber,
        name: useFormatEvent(event),
        entries: event.entries,
        individual: event.iR == "I",
      };
    })
    .filter((x) => x.number);
});
const UBadge = resolveComponent("UBadge");
const NuxtLink = resolveComponent("NuxtLink");

const colors = ["warning", "neutral", "info", "error", "success"];
const columns = [
  {
    accessorKey: "number",
    header: ({column}) => getHeader(column,"Event Number"),
  },
  {
    accessorKey: "name",
    header: ({column}) => getHeader(column,"Event Name"),
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
    icon: "i-lucide-user",
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
  return athletes.value.map((athlete) => {
    return {
      id: athlete?.athlete,
      firstName: athlete?.first,
      lastName: athlete?.last,
      gender: athlete?.sex,
      team: athlete?.team.tName,
    };
  });
});

const athleteColumns = ref([
  {
    header: ({column}) => getHeader(column,"First Name"),
    accessorKey: "firstName",
  },
  {
    header: ({column}) => getHeader(column,"Last Name"),
    accessorKey: "lastName",
  },
  {
    header: ({column}) => getHeader(column,"Gender"),
    accessorKey: "gender",
  },
  {
    header: ({column}) => getHeader(column,"Team"),
    accessorKey: "team",
  },
  {
    id: "actions",
  },
]);
import { breakpointsTailwind } from "@vueuse/core";
import { useRouteHash, useRouteQuery } from "@vueuse/router";
import { formatDuration } from "date-fns";
const resultsTable = computed(() => {
  return data.value?.results.map((result) => {
    return {
      place: result.place,
      event: useFormatEvent(result),
      time: useFormatTime(result.score),
      athlete: result?.athlete?.first + " " + result?.athlete?.last,
    };
  });
});
</script>

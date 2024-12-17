<template>
  <UContainer class="flex flex-col gap-4">
    <MeetHeader />
    <UTabs :items="items" :content="false" v-model="activeTab"></UTabs>
    <UCard>
      <UTable
        :data="events"
        :columns="columns"
        class="flex-1"
        v-if="activeTab == '0'"
      >
        <template #entries-cell="{ row }">
          <div v-if="row.original.individual" class="flex gap-2">
            <NuxtLink
              :to="`/meet/${route.params.slug}/athletes/${entry.athlete.athlete}`"
              v-for="entry of row.getValue(`entries`)"
            >
              <UBadge class="capitalize" variant="subtle" :color="colors[entry.team]"
                >{{ entry.athlete.first }}
                {{ entry.athlete.last }}</UBadge
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
              :to="`/meet/${route.params.slug}/athletes/${row.original.id}`"
              ><UIcon name="lucide:circle-user" class="h-6 w-6 cursor-pointer"
            /></NuxtLink>
          </template>
        </UTable>
      </div>
      <div v-else-if="activeTab == '2'">
        <p class="italic">Proper </p>
        <UTable :data="resultsTable"> </UTable>
      </div>
    </UCard>
  </UContainer>
</template>
<script setup lang="ts">
const route = useRoute();

const { data, status, error, refresh, clear } = await useFetch(
  `/api/meets/${route.params.slug}`,
  {}
);
const events = computed(() => {
  return data.value?.events?.map((event) => {
    return {
      number: event.eventNumber,
      name: useFormatEvent(event),
      entries: event.entries,
      individual: event.iR == "I",
    };
  });
});
const UBadge = resolveComponent("UBadge");
const NuxtLink = resolveComponent("NuxtLink");

const colors = ["warning", "neutral", "info", "error", "success"];
const columns = [
  {
    accessorKey: "number",
    label: "Event Number",
  },
  {
    accessorKey: "name",
    label: "Event Name",
  },
  {
    accessorKey: "entries",
    label: "Entries",
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
    header: "First Name",
    accessorKey: "firstName",
  },
  {
    header: "Last Name",
    accessorKey: "lastName",
  },
  {
    header: "Gender",
    accessorKey: "gender",
  },
  {
    header: "Team",
    accessorKey: "team",
  },
  {
    id: "actions",
  },
]);
import { useRouteHash, useRouteQuery } from "@vueuse/router";
import { formatDuration } from "date-fns";
const resultsTable = computed(() => {
  return data.value?.results.map((result) => {
    console.log(result);
    return {
      place: result.place,
      event: useFormatEvent(result),
      time: `COMING SOON!`,//formatDuration({ seconds: result.score }),
      athlete: result?.athlete?.first + " " + result?.athlete?.last,
    };
  });
});
</script>

<template>
  <UContainer class="flex flex-col gap-4">
    <MeetHeader />
    <UTabs :items="items" :content="false" v-model="activeTab"></UTabs>
    <UTable
      :data="events"
      :columns="columns"
      class="flex-1"
      v-if="activeTab == '0'"
    />
    <div v-else-if="activeTab == '1'">
      <UTable :data="athleteTable" />
    </div>
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
    cell: ({ row }) => {
      console.log(row);
      if (row.original.individual) {
        return h(
          "div",
          { className: "flex gap-2" },
          row
            .getValue("entries")
            ?.filter((x) => x.iR != "E" && x.iR != "R")
            .map((entry) => {
              return h(
                UBadge,
                {
                  class: "capitalize",
                  variant: "subtle",
                  color: colors[entry.team],
                },
                () =>
                  entry.athlete?.first +
                  " " +
                  entry.athlete?.last +
                  " H" +
                  entry.heat +
                  " L" +
                  entry.lane
              );
            })
        );
      } else {
        return h(
          UBadge,
          { class: "capitalize", variant: "subtle" },
          () =>
            row.getValue("entries")?.filter((x) => x?.iR != "R" && x.athlete)
              .length / 4
        );
      }
    },
  },
];
const items = ref([
  {
    label: "Entries",
    icon: "i-lucide-list",
    content: "This is the account content.",
  },
  {
    label: "Athletes",
    icon: "i-lucide-user",
    content: "This is the password content.",
  },
  {
    label: "Results",
    icon: "i-lucide-trophy",
    content: "This is the results content.",
  }
]);

const activeTab = ref("0");

const { data: athletes } = await useFetch(
  `/api/meets/${route.params.slug}/athletes/list`,
  {}
);

const athleteTable = computed(() => {
  return athletes.value.map((athlete) => {
    return {
      firstName: athlete?.first,
      lastName: athlete?.last,
      gender: athlete?.sex,
      team: athlete?.team.tName,
    };
  });
});
</script>

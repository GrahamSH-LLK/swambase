<template>
  <div class="flex flex-col">
    <h1 class="text-3xl font-bold font-stretch-semi-condensed">
      {{ team?.tName }}
    </h1>
    <div class="flex justify-between items-center p-2">
      <UCheckbox v-model="showInactive" label="Show inactive swimmers" />
      <UInput
        v-model="search"
        placeholder="Search"
        class="w-1/4"
        icon="heroicons-outline:search"
        />
    </div>
    <UTable :data="athletesTable" :columns="athleteColumns">
      <template #actions-cell="{ row }"
        ><NuxtLink :to="`/athletes/${row.original.id}`"
          ><UIcon name="lucide:circle-user" class="h-6 w-6 cursor-pointer"
        /></NuxtLink>
      </template>
    </UTable>
  </div>
</template>
<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";

const route = useRoute();
const { data: team } = await useFetch(`/api/teams/${route.params.team}`, {});
const showInactive = ref(false);
const search = ref("");
const getHeader = useGetHeader();
const athleteColumns: TableColumn<any>[] = ref([
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
    id: "actions",
  },
]);

const athletesTable = computed(() => {
  return team.value?.athletes
    .filter((athlete) => {
      return (showInactive.value || !athlete.inactive) && (athlete.first + " " + athlete.last)?.toLowerCase().includes(search.value.toLowerCase());
    })
    .map((athlete) => {
      return {
        firstName: athlete.first?.trim(),
        lastName: athlete.last?.trim(),
        id: athlete.athlete,
        gender: athlete.sex,
      };
    });
});
</script>

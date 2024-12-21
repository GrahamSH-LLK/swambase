<template>
  <div class="flex flex-col">
    <h1 class="text-3xl font-bold font-stretch-semi-condensed">
      {{ team?.tName }}
    </h1>
<UCheckbox v-model="showInactive" label="Show inactive swimmers"/>
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
import type { TableColumn } from '@nuxt/ui';

const route = useRoute();
const { data: team } = await useFetch(`/api/teams/${route.params.team}`, {});
const showInactive = ref(false);

const getHeader = useGetHeader();
const athleteColumns : TableColumn<any>[]= ref([
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
    id: "actions",
  },
]);

const athletesTable = computed(() => {
  return team.value?.athletes
    .filter((athlete) => {
      return showInactive.value || !athlete.inactive;
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

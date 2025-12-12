<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-2">
      <h1 class="text-4xl font-bold text-slate-900 dark:text-white">
        {{ team?.tName }}
      </h1>
      <div class="flex flex-wrap gap-2">
        <UBadge
          v-if="team?.tCode"
          color="neutral"
          variant="subtle"
          class="font-mono"
        >
          {{ team?.tCode }}
        </UBadge>
        <UBadge
          v-if="team?.tState || team?.tCntry"
          color="secondary"
          variant="outline"
        >
          <UIcon name="i-lucide-map-pin" class="w-3 h-3 mr-1" />
          {{ [team?.tState, team?.tCntry].filter(Boolean).join(", ") }}
        </UBadge>
      </div>
    </div>

    <UCard>
      <template #header>
        <div
          class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <h2 class="text-xl font-bold text-slate-900 dark:text-white">
            Athletes
          </h2>
          <div class="flex flex-col sm:flex-row gap-3">
            <UCheckbox v-model="showInactive" label="Show inactive swimmers" />
            <UInput
              v-model="search"
              placeholder="Search athletes..."
              icon="i-lucide-search"
              class="w-full sm:w-64"
            />
          </div>
        </div>
      </template>

      <UTable :data="athletesTable" :columns="athleteColumns">
        <template #actions-cell="{ row }">
          <NuxtLink :to="`/athletes/${row.original.id}`">
            <UButton
              icon="i-lucide-circle-user"
              variant="ghost"
              color="primary"
              size="sm"
            />
          </NuxtLink>
        </template>
      </UTable>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";

const route = useRoute();
const { data: team } = await useFetch(`/api/teams/${route.params.team}`, {});
const showInactive = ref(false);
const search = ref("");
const getHeader = useGetHeader();

const athleteColumns: TableColumn<any>[] = [
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
];

const athletesTable = computed(() => {
  return team.value?.athletes
    .filter((athlete) => {
      return (
        (showInactive.value || !athlete.inactive) &&
        (athlete.first + " " + athlete.last)
          ?.toLowerCase()
          .includes(search.value.toLowerCase())
      );
    })
    .map((athlete) => ({
      firstName: athlete.first?.trim(),
      lastName: athlete.last?.trim(),
      id: athlete.athlete,
      gender: athlete.sex,
    }));
});
</script>

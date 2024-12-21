<template>
  <UNavigationMenu
    orientation="vertical"
    :items="items"
    class="data-[orientation=vertical]:w-64"
  />
</template>
<script setup lang="ts">
const {
  data: meets,
  status,
  error,
  refresh,
  clear,
} = await useFetch("/api/meets/list", {});
const {
  data: teams,
  status: teamStatus,
  error: teamError,
} = await useFetch("/api/teams/list", {});
const items = computed(() => [
  {
    label: "Teams",
    to: "/teams",
    defaultOpen: true,

    children: [
      ...(teams.value?.map((team) => {
        return {
          label: team.tName,
          to: `/teams/${team.team}`,
        };
      }) || []),
      { label: "All Teams", to: "/teams", icon: "i-lucide-list" },
    ],
  },
  {
    label: "Meets",
    to: "/meets",
    defaultOpen: true,
    children: [
      ...(meets.value?.slice(0, 10).map((meet) => {
        return {
          label: meet.mName,
          to: `/meets/${meet.meet}`,
        };
      }) || []),
      { label: "All Meets", to: "/meets", icon: "i-lucide-list" },
    ],
  },
]);
</script>

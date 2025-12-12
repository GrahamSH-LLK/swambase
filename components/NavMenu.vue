<template>
  <UNavigationMenu
    orientation="vertical"
    :items="items"
    class="data-[orientation=vertical]:w-60"
    highlight
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
    icon: "i-lucide-users",
    to: "/teams",
    defaultOpen: true,
    children: [
      ...(teams.value?.map((team) => ({
        label: team.tName,
        to: `/teams/${team.team}`,
      })) || []),
      { label: "View All Teams", to: "/teams", icon: "i-lucide-arrow-right" },
    ],
  },
  {
    label: "Meets",
    icon: "i-lucide-calendar",
    to: "/meets",
    defaultOpen: true,
    children: [
      ...(meets.value?.slice(0, 8).map((meet) => ({
        label: meet.mName,
        to: `/meets/${meet.meet}`,
      })) || []),
      { label: "View All Meets", to: "/meets", icon: "i-lucide-arrow-right" },
    ],
  },
]);
</script>

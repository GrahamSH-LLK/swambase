<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <div class="flex flex-row fixed w-full">
      <div class="border-r border-neutral-200  flex flex-col">
        <Nav  />
        <UNavigationMenu
          orientation="vertical"
          :items="items"
          class="data-[orientation=vertical]:w-64  mx-4  "
        />
      </div>
      <NuxtPage class="h-screen overflow-auto flex-1 p-4 "/>
    </div>
  </UApp>
</template>

<script lang="ts" setup>
const {
  data: meets,
  status,
  error,
  refresh,
  clear,
} = await useFetch("/api/meets/list", {});
const { data: teams, status: teamStatus, error: teamError } = await useFetch(
  "/api/teams/list",
  {}
);
const items = ref([
  { label: "Teams", to: "/teams", children: [
    ...teams.value?.map((team) => {
      return {
        label: team.tName,
        //to: `/team/${team.team}`,
      };
    }) || [], { label: "All Teams", to: "/teams",icon:'i-lucide-list' }
  ] },
  {
    label: "Meets",
    to: "/meets",
    children: [...(meets.value?.slice(0,10).map((meet) => {
      return {
        label: meet.mName,
        to: `/meet/${meet.meet}`,
      };
    }) || []), { label: "All Meets", to: "/meets",icon:'i-lucide-list' }],
  },
]);
</script>

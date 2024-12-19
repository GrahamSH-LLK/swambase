<template>
  <div class="flex flex-1 p-4">
    <div class="flex flex-col gap-4">
      <UCard v-for="team of data" :key="team.team">
        <template #header>
          <span to="`/team/${team.team}`" class="text-2xl font-bold"
            >{{ team.tName }}
            <UBadge class="font-stretch-condensed font-bold">{{ team.tCode }}</UBadge>
        </span>
        </template>
<p>{{ team.short}}</p>
        <p>Location: {{ team.location }}</p>
        <p>{{ team.athletes.length }} athletes</p>
      </UCard>
    </div>
  </div>
</template>
<script setup lang="ts">
import { format } from "date-fns";
const { data, status, error, refresh, clear } = await useFetch(
  "/api/teams/list",
  {}
);
</script>

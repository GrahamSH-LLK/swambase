<template>
  <div class="flex flex-1 p-4">
    <div class="flex flex-col gap-4">
      <h1 class="text-3xl font-bold font-stretch-semi-condensed">Teams</h1>

      <UCard v-for="team of data" :key="team.team">
        <template #header>
          <NuxtLink :to="`/teams/${team.team}`" class="text-2xl font-bold"
            >{{ team.tName }}
            <UBadge class="font-stretch-condensed font-bold">{{
              team.tCode
            }}</UBadge>
          </NuxtLink>
        </template>
        <div class="flex gap-1">
        <UBadge>Short: {{ team.short }}</UBadge> 
        <UBadge>{{ team.athletes.length }} athletes</UBadge><UBadge>{{ team.tState}} {{ team.tCntry}}</UBadge></div>
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

<template>
  <div class="flex flex-1 p-4">
    <div class="flex flex-col gap-4">
      <h1 class="text-3xl font-bold font-stretch-semi-condensed">Meets</h1>

      <UCard v-for="meet of data" :key="meet.meet">
        <template #header>
          <NuxtLink :to="`/meets/${meet.meet}`" class="text-2xl font-bold">{{
            meet.mName
          }}</NuxtLink>
        </template>
        <p>Location: {{ meet.location }}</p>
        <p>{{ format(new Date(meet.start), "MMM dd, yyyy") }}</p>
        <p>{{ format(new Date(meet.end), "MMM dd, yyyy") }}</p>
        <p>{{ meet.entryCount }} entries</p>
      </UCard>
    </div>
  </div>
</template>
<script setup lang="ts">
import { format } from "date-fns";
const { data, status, error, refresh, clear } = await useFetch(
  "/api/meets/list",
  {}
);
</script>

<template>
  <UContainer>
    <div class="flex flex-col gap-4">
    <UCard v-for="meet of data" :key="meet.meet">
      <template #header> <NuxtLink :to="`/meet/${meet.meet}`" class="text-2xl font-bold">{{ meet.mName }}</NuxtLink> </template>
        <p>Location: {{ meet.location }} </p>
        <p> {{ format(new Date(meet.start), 'MMM dd, yyyy') }} </p>
        <p> {{ format(new Date(meet.end), 'MMM dd, yyyy') }} </p>
    </UCard>
    </div>
  </UContainer>
</template>
<script setup>
import {format} from 'date-fns'
const { data, status, error, refresh, clear } = await useFetch(
  "/api/meets/list",
  {}
);
</script>

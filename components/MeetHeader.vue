<template>
    <UCard>
        <h1 class="text-3xl font-black">{{ data.mName }}</h1>
        <p class="text-xl">{{ data.location }}</p>
        <p> {{ format(new Date(data.start), 'MMM dd, yyyy') }} </p>
    </UCard>
</template>


<script setup>
import {format} from 'date-fns'
const route = useRoute();
const { data, status, error, refresh, clear } = await useFetch(
  `/api/meets/${route.params.slug}/`,
  {}
);


</script>
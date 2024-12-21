<template>
    <UCard>
        <h1 class="text-3xl font-black">{{ data.mName }}</h1>
        <p class="text-xl">{{ data.location }}</p>
        <p> {{ format(new Date(data.start), 'MMM dd, yyyy') }} </p>
    </UCard>
</template>


<script setup lang="ts">
import {format} from 'date-fns'
import { string } from 'zod';
const route = useRoute();
const props = defineProps<{
  meet?: number;
}>();
const { data, status, error, refresh, clear } = await useFetch(
  () =>`/api/meets/${props.meet ?? route.params.slug}/`,
  {}
);


</script>
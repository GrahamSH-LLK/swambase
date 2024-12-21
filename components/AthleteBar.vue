<template>
      <UNavigationMenu color="primary" :items="items" />

</template>
<script setup lang="ts">
const route = useRoute();
const items = computed(()=> {
    return [
        {
            label: "Meet Results",
            to: `/athletes/${route.params.id}`
        },
        {
            label: "Best Times",
            to: `/athletes/${route.params.id}/bests`
        }
    ]
})
</script>
<template>
  <UNavigationMenu
    :items="items"
    highlight
    color="primary"
    class="border-b border-slate-200 dark:border-slate-800 pb-2"
  />
</template>

<script setup lang="ts">
const route = useRoute();

const items = computed(() => [
  {
    label: "Meet Results",
    to: `/athletes/${route.params.id}`,
    icon: "i-lucide-trophy",
  },
  {
    label: "Best Times",
    to: `/athletes/${route.params.id}/bests`,
    icon: "i-lucide-timer",
  },
]);
</script>

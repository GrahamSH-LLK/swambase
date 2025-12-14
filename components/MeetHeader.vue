<template>
  <UCard
    class="bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-950/50 dark:to-sky-950/50 border-blue-200 dark:border-blue-800"
  >
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div class="flex-1">
        <h1 class="text-3xl font-black text-slate-900 dark:text-white">
          {{ meetData?.mName }}
        </h1>
        <div
          class="flex flex-wrap items-center gap-4 mt-3 text-slate-600 dark:text-slate-300"
        >
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-map-pin" class="w-4 h-4 text-blue-500" />
            <span>{{ meetData?.location }}</span>
          </div>
          <div v-if="meetData?.city" class="flex items-center gap-2">
            <UIcon name="i-lucide-building-2" class="w-4 h-4 text-blue-500" />
            <span
              >{{ meetData?.city
              }}{{ meetData?.state ? `, ${meetData.state}` : "" }}</span
            >
          </div>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-calendar" class="w-4 h-4 text-blue-500" />
            <span>{{
              meetData?.start
                ? format(new Date(meetData.start), "MMM dd, yyyy")
                : ""
            }}</span>
          </div>
          <div v-if="meetData?.course" class="flex items-center gap-2">
            <UIcon name="i-lucide-ruler" class="w-4 h-4 text-blue-500" />
            <UBadge variant="subtle" :color="useCourseColor(meetData.course)">
              {{ useCourseLabel(meetData.course) }}
            </UBadge>
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { format } from "date-fns";

const route = useRoute();
const props = defineProps<{
  meet?: number;
}>();

const { data, status, error, refresh, clear } = await useFetch(
  () => `/api/meets/${props.meet ?? route.params.slug}/`,
  {}
);

// Type assertion for meet data
const meetData = computed(() => data.value as any);
</script>

<template>
  <header
    class="w-full border-b border-red-400 bg-red-50/50 backdrop-blur dark:bg-gray-950/25 mb-4 shadow-xs shadow-red-400/50"
  >
    <div
      class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex items-center justify-between gap-3 h-[var(--ui-header-height)]"
    >
      <div class="flex gap-2">
        <NuxtLink
          class="font-bold font-display font-stretch-extra-condensed text-3xl text-blue-950 dark:text-white flex justify-center items-center gap-2"
          to="/"
          >SwamBase 🏊</NuxtLink
        >
      </div>
      <UPopover v-if="mdAndDown">
        <UButton icon="i-lucide-list" color="neutral" variant="soft" />

        <template #content>
          <div class="my-4">
          <NavMenu class=""/></div>
        </template>
      </UPopover>
    </div>
  </header>
</template>
<script setup lang="ts">
import { breakpointsTailwind } from "@vueuse/core";

const breakpoints = useBreakpoints(breakpointsTailwind);
const mdAndDown =breakpoints.smallerOrEqual('md');
</script>

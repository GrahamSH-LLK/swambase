<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <div class="min-h-screen bg-[var(--ui-bg)]">
      <div class="flex flex-col md:flex-row md:fixed w-screen h-screen">
        <aside
          class="border-r border-slate-200 dark:border-slate-800 flex flex-col bg-[var(--ui-bg-elevated)] shrink-0"
        >
          <Nav />
          <NavMenu class="mx-2 hidden md:block flex-1 overflow-auto pb-4" />
        </aside>
        <main class="flex-1 overflow-auto">
          <NuxtPage class="p-4 md:p-6 max-w-7xl mx-auto" />
        </main>
      </div>
    </div>
  </UApp>
</template>

<script lang="ts" setup>
import { breakpointsTailwind } from "@vueuse/core";

const breakpoints = useBreakpoints(breakpointsTailwind);
const mdAndUp = breakpoints.greaterOrEqual("md");
</script>

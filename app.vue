<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <div class="flex flex-col md:flex-row md:fixed w-screen">
      <div class="border-r border-neutral-200 flex flex-col">
        <Nav />
        <NavMenu  class="mx-4 hidden md:block"/>
      </div>
      <NuxtPage class="h-screen overflow-auto flex-1 p-4" />
    </div>
  </UApp>
</template>

<script lang="ts" setup>
import { breakpointsTailwind } from "@vueuse/core";

const breakpoints = useBreakpoints(breakpointsTailwind);
const mdAndUp = breakpoints.greaterOrEqual('md')
</script>

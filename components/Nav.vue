<template>
  <header
    class="w-full border-b border-blue-500/30 backdrop-blur bg-white/80 dark:bg-slate-950/80"
  >
    <div
      class="px-4 sm:px-6 flex items-center justify-between gap-3 h-[var(--ui-header-height)]"
    >
      <NuxtLink
        class="font-bold text-2xl md:text-3xl text-blue-600 dark:text-blue-400 flex items-center gap-2 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        to="/"
      >
        <span class="text-3xl">🏊</span>
        <span class="font-display font-stretch-extra-condensed">SwamBase</span>
      </NuxtLink>

      <div class="flex items-center gap-2">
        <UColorModeButton />
        <UPopover class="block md:hidden">
          <UButton
            icon="i-lucide-menu"
            color="neutral"
            variant="ghost"
            size="lg"
          />
          <template #content>
            <div class="p-2 min-w-64">
              <NavMenu />
            </div>
          </template>
        </UPopover>
      </div>
    </div>
  </header>
</template>

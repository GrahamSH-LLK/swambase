<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-2">
      <h1 class="text-4xl font-bold text-slate-900 dark:text-white">
        {{ athlete?.first }} {{ athlete?.last }}
      </h1>
      <p class="text-slate-500 dark:text-slate-400">Personal Best Times</p>
      <AthleteBar />
    </div>

    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-timer" class="w-5 h-5 text-amber-500" />
          <span class="font-bold text-xl text-slate-900 dark:text-white"
            >Best Times</span
          >
        </div>
      </template>

      <UTable
        v-model:expanded="expanded"
        :data="data"
        :columns="columns"
        :ui="{ tr: 'data-[expanded=true]:bg-elevated/50' }"
      >
        <template #meet-cell="{ row }">
          <NuxtLink :to="`/meets/${row.original.meet.meet}`">
            <UBadge
              class="capitalize hover:ring-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors cursor-pointer"
              variant="subtle"
              color="primary"
            >
              {{ row.original.meet.mName }}
              <span
                class="font-mono text-xs text-slate-500 dark:text-slate-400 ml-1"
              >
                {{ format(row.original.meet.start, "MMM dd, yyyy") }}
              </span>
            </UBadge>
          </NuxtLink>
        </template>

        <template #expanded="{ row }">
          <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <div class="mb-4">
              <h4
                class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
              >
                Time Progression for {{ useFormatEvent(row.original) }}
              </h4>
              <div
                class="h-64 w-full"
                v-if="getEventHistory(row.original)?.length > 1"
              >
                <VChart :option="getChartOption(row.original)" autoresize />
              </div>
              <p v-else class="text-sm text-slate-500 dark:text-slate-400">
                Only one result recorded for this event.
              </p>
            </div>

            <div v-if="getEventHistory(row.original)?.length > 0">
              <h4
                class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
              >
                All Times ({{ getEventHistory(row.original)?.length }} results)
              </h4>
              <UTable
                :data="getEventHistoryWithIndex(row.original)"
                :columns="historyColumns"
              >
                <template #date-cell="{ row: historyRow }">
                  {{
                    historyRow.original.meet?.start
                      ? format(historyRow.original.meet.start, "MMM dd, yyyy")
                      : "N/A"
                  }}
                </template>
                <template #meet-cell="{ row: historyRow }">
                  <NuxtLink
                    :to="`/meets/${historyRow.original.meet?.meet}`"
                    class="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {{ historyRow.original.meet?.mName }}
                  </NuxtLink>
                </template>
                <template #time-cell="{ row: historyRow }">
                  <span
                    class="font-mono"
                    :class="
                      historyRow.original.score === row.original.score
                        ? 'text-green-600 dark:text-green-400 font-bold'
                        : 'text-slate-700 dark:text-slate-300'
                    "
                  >
                    {{ useFormatTime(historyRow.original.score) }}
                    <UBadge
                      v-if="historyRow.original.score === row.original.score"
                      variant="subtle"
                      color="success"
                      size="xs"
                      class="ml-2"
                    >
                      PR
                    </UBadge>
                  </span>
                </template>
                <template #improvement-cell="{ row: historyRow }">
                  <span
                    v-if="historyRow.original._index > 0"
                    :class="
                      historyRow.original._improvement < 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-500 dark:text-red-400'
                    "
                  >
                    {{ historyRow.original._improvementText }}
                  </span>
                  <span v-else class="text-slate-400">—</span>
                </template>
              </UTable>
            </div>
          </div>
        </template>
      </UTable>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import { format } from "date-fns";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from "echarts/components";
import VChart from "vue-echarts";

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
]);

const UButton = resolveComponent("UButton");

const route = useRoute();
const { data: athlete } = await useFetch(
  `/api/athletes/${route.params.id}`,
  {}
);
const { data, status, error, refresh, clear } = await useFetch(
  `/api/athletes/${route.params.id}/bests`,
  {}
);
const { data: history } = await useFetch(
  `/api/athletes/${route.params.id}/history`,
  {}
);

const getHeader = useGetHeader();
const expanded = ref({});

const getEventKey = (result: any) => {
  return `${result.distance}-${result.stroke}-${result.course}`;
};

const getEventHistory = (result: any) => {
  if (!history.value) return [];
  const key = getEventKey(result);
  return history.value[key] || [];
};

const getEventHistoryWithIndex = (result: any) => {
  const eventHistory = getEventHistory(result);
  return eventHistory.map((r: any, index: number) => ({
    ...r,
    _index: index,
    _improvement: getImprovement(eventHistory, index),
    _improvementText: getImprovementText(eventHistory, index),
  }));
};

const getImprovement = (results: any[], index: number) => {
  const slicedResults = results.slice(0, index);
  const previousBest = Math.min(...slicedResults.map((r) => r.score));
  return results[index].score - previousBest;
};

const getImprovementText = (results: any[], index: number) => {
  const diff = getImprovement(results, index);
  if (diff === 0) return "—";
  const sign = diff < 0 ? "-" : "+";
  const absDiff = Math.abs(diff);
  const seconds = (absDiff / 100).toFixed(2);
  return `${sign}${seconds}s`;
};

const getChartOption = (result: any) => {
  const eventHistory = getEventHistory(result);
  if (!eventHistory || eventHistory.length === 0) return {};

  const dates = eventHistory.map((r: any) =>
    r.meet?.start ? format(r.meet.start, "MMM dd, yyyy") : "Unknown"
  );
  const times = eventHistory.map((r: any) => r.score / 100);

  return {
    tooltip: {
      trigger: "axis",
      formatter: (params: any) => {
        const point = params[0];
        const timeValue = point.value;
        const minutes = Math.floor(timeValue / 60);
        const seconds = (timeValue % 60).toFixed(2);
        const formattedTime =
          minutes > 0
            ? `${minutes}:${seconds.padStart(5, "0")}`
            : `${seconds}s`;
        return `${point.name}<br/>Time: ${formattedTime}`;
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: dates,
      axisLabel: {
        rotate: 45,
        fontSize: 10,
      },
    },
    yAxis: {
      type: "value",
      inverse: true,
      min: Math.floor((Math.min(...times) - 5) / 5) * 5,
      axisLabel: {
        formatter: (value: number) => {
          const minutes = Math.floor(value / 60);
          const seconds = (value % 60).toFixed(0);
          return minutes > 0
            ? `${minutes}:${seconds.padStart(2, "0")}`
            : `${seconds}s`;
        },
      },
    },
    series: [
      {
        data: times,
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 8,
        lineStyle: {
          color: "#3b82f6",
          width: 2,
        },
        itemStyle: {
          color: "#3b82f6",
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(59, 130, 246, 0.3)" },
              { offset: 1, color: "rgba(59, 130, 246, 0.05)" },
            ],
          },
        },
        markPoint: {
          data: [{ type: "min", name: "Best Time" }],
          label: {
            formatter: (params: any) => {
              const value = params.value;
              const minutes = Math.floor(value / 60);
              const seconds = (value % 60).toFixed(2);
              return minutes > 0
                ? `${minutes}:${seconds.padStart(5, "0")}`
                : `${seconds}`;
            },
          },
        },
      },
    ],
  };
};

const columns = ref([
  {
    id: "expand",
    cell: ({ row }) =>
      h(UButton, {
        color: "neutral",
        variant: "ghost",
        icon: "i-lucide-chevron-down",
        square: true,
        "aria-label": "Expand",
        ui: {
          leadingIcon: [
            "transition-transform",
            row.getIsExpanded() ? "duration-200 rotate-180" : "",
          ],
        },
        onClick: () => row.toggleExpanded(),
      }),
  },
  {
    header: ({ column }) => getHeader(column, "Event"),
    cell: ({ row }) => {
      return useFormatEvent(row.original);
    },
    accessorKey: "event",
  },
  {
    header: ({ column }) => getHeader(column, "Best Time"),
    accessorKey: "score",
    cell: ({ row }) => {
      return useFormatTime(row.original.score);
    },
  },
  {
    header: ({ column }) => getHeader(column, "Meet"),
    accessorKey: "meet",
  },
]);

const historyColumns = ref([
  {
    header: "Time",
    accessorKey: "time",
  },
  {
    header: "Improvement",
    accessorKey: "improvement",
  },

  {
    header: "Date",
    accessorKey: "date",
  },
  {
    header: "Meet",
    accessorKey: "meet",
  },
]);
</script>

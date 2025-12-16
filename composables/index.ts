import { UDropdownMenu, UButton } from "#components";
const strokes = [
  { stroke_abbr: "FR", stroke_name: "Freestyle" },
  { stroke_abbr: "BK", stroke_name: "Backstroke" },
  { stroke_abbr: "BR", stroke_name: "Breaststroke" },
  { stroke_abbr: "FLY", stroke_name: "Butterfly" },
  { stroke_abbr: "IM", stroke_name: "IM" },
  { stroke_abbr: "STK", stroke_name: "Diving" },
  { stroke_abbr: "FRM", stroke_name: "Free-medley" },
  { stroke_abbr: "PAD", stroke_name: "Paddles" },
  { stroke_abbr: "FIN", stroke_name: "Fins" },
  { stroke_abbr: "DRY", stroke_name: "Dry-land" },
  { stroke_abbr: "SUR", stroke_name: "Surgical Tubing" },
  { stroke_abbr: "WTS", stroke_name: "Weight-Lifting" },
];
const sexLong: Record<string, string> = {
  M: "Men's",
  F: "Women's",
};
export const individualRelayLong: Record<string, string> = {
  I: "Individual",
  R: "Relay",
};
const dists = {
  9991: "6 Meter",
};
export const useFormatEvent = (event: any) => {
  return `${sexLong[event?.sex] || ""} ${
    event.distance < 9000 ? event.distance : dists[event.distance]
  } ${strokes[event.stroke - 1]?.stroke_name} ${
    individualRelayLong[event.iR] || ""
  }`;
};

export const formatEntry = (entry: any) => {
  return `Heat ${entry.heat} Lane ${entry.lane}`;
};
export const useFormatTime = (time: number) => {
  if (time > 0) {
    const zeroPad = (num) => String(num).padStart(2, "0");

    const minutes = time / 100 / 60;
    const seconds = (minutes - Math.floor(minutes)) * 60;
    const milliseconds = (seconds - Math.floor(seconds)) * 100;
    const formatted = `${zeroPad(Math.floor(minutes))}:${zeroPad(
      Math.floor(seconds)
    )}.${zeroPad(Math.floor(milliseconds))}`;
    return formatted;
  } else {
    return (time * -1) / 100;
  }
};
import type { TableColumn } from "@nuxt/ui";
import type { Column } from "@tanstack/vue-table";

export const useGetHeader = () => {
  return function (column: Column<any>, label: string) {
    const isSorted = column.getIsSorted();

    return h(
      UDropdownMenu,
      {
        content: {
          align: "start",
        },
        items: [
          {
            label: "Asc",
            type: "checkbox",
            icon: "i-lucide-arrow-up-narrow-wide",
            checked: isSorted === "asc",
            onSelect: () => {
              if (isSorted === "asc") {
                column.clearSorting();
              } else {
                column.toggleSorting(false);
              }
            },
          },
          {
            label: "Desc",
            icon: "i-lucide-arrow-down-wide-narrow",
            type: "checkbox",
            checked: isSorted === "desc",
            onSelect: () => {
              if (isSorted === "desc") {
                column.clearSorting();
              } else {
                column.toggleSorting(true);
              }
            },
          },
        ],
      },
      () =>
        h(UButton, {
          color: "neutral",
          variant: "ghost",
          label,
          icon: isSorted
            ? isSorted === "asc"
              ? "i-lucide-arrow-up-narrow-wide"
              : "i-lucide-arrow-down-wide-narrow"
            : "i-lucide-arrow-up-down",
          class: "-mx-2.5 data-[state=open]:bg-[var(--ui-bg-elevated)]",
        })
    );
  };
};

export const useCourseLabel = (course: string) => {
  const labels: Record<string, string> = {
    Y: "Short Course Yards",
    YO: "Short Course Yards",

    S: "Short Course Meters",
    SO: "Short Course Meters",

    L: "Long Course Meters",
    LO: "Long Course Meters",
    YSL: "Multi-Course",
    YLS: "Multi-Course",
  };
  return labels[course] || course;
};

export const useCourseColor = (
  course: string
): "info" | "success" | "warning" | "neutral" => {
  const colors: Record<string, "info" | "success" | "warning" | "neutral"> = {
    Y: "info",
    YO: "info",
    S: "success",
    SO: "success",
    L: "warning",
  };
  return colors[course] || "neutral";
};

export type QualifyingLevel =
  | "north"
  | "south"
  | "centralWest"
  | "stateD1"
  | "stateD2"
  | "fastChance";

export interface QualifyingStandard {
  boys: number | null;
  girls: number | null;
}

export const qualifyingTimes: Record<
  string,
  Record<QualifyingLevel, QualifyingStandard>
> = {
  // 200 Medley Relay
  "200 FRM": {
    north: { boys: 11261, girls: 13535 },
    south: { boys: 11299, girls: 12673 },
    centralWest: { boys: 11959, girls: 13081 },
    stateD1: { boys: 10818, girls: 12646 },
    stateD2: { boys: 10980, girls: 12440 },
    fastChance: { boys: null, girls: null },
  },
  // 200 Freestyle
  "200 FR": {
    north: { boys: 11759, girls: 13148 },
    south: { boys: 11902, girls: 13257 },
    centralWest: { boys: 12499, girls: 13562 },
    stateD1: { boys: 11411, girls: 13009 },
    stateD2: { boys: 11697, girls: 12951 },
    fastChance: { boys: 13990, girls: 15070 },
  },
  // 200 IM
  "200 IM": {
    north: { boys: 13303, girls: 14973 },
    south: { boys: 13512, girls: 15013 },
    centralWest: { boys: 14218, girls: 15484 },
    stateD1: { boys: 12894, girls: 14819 },
    stateD2: { boys: 13275, girls: 14717 },
    fastChance: { boys: 16069, girls: 17059 },
  },
  // 50 Freestyle
  "50 FR": {
    north: { boys: 2403, girls: 2698 },
    south: { boys: 2428, girls: 2714 },
    centralWest: { boys: 2498, girls: 2727 },
    stateD1: { boys: 2338, girls: 2684 },
    stateD2: { boys: 2368, girls: 2684 },
    fastChance: { boys: 2768, girls: 3090 },
  },
  // 100 Butterfly
  "100 FLY": {
    north: { boys: 5910, girls: 6732 },
    south: { boys: 5932, girls: 6712 },
    centralWest: { boys: 6374, girls: 6874 },
    stateD1: { boys: 5697, girls: 6685 },
    stateD2: { boys: 5803, girls: 6642 },
    fastChance: { boys: 7313, girls: 7964 },
  },
  // 100 Freestyle
  "100 FR": {
    north: { boys: 5291, girls: 5985 },
    south: { boys: 5339, girls: 6046 },
    centralWest: { boys: 5488, girls: 6033 },
    stateD1: { boys: 5166, girls: 5935 },
    stateD2: { boys: 5199, girls: 5935 },
    fastChance: { boys: 6223, girls: 6834 },
  },
  // 500 Freestyle
  "500 FR": {
    north: { boys: 32425, girls: 36247 },
    south: { boys: 32994, girls: 35837 },
    centralWest: { boys: 34582, girls: 36367 },
    stateD1: { boys: 31536, girls: 34747 },
    stateD2: { boys: 32266, girls: 34837 },
    fastChance: { boys: 39670, girls: 41094 },
  },
  // 200 Freestyle Relay
  "200 FR R": {
    north: { boys: 10052, girls: 11871 },
    south: { boys: 10074, girls: 11383 },
    centralWest: { boys: 10593, girls: 11672 },
    stateD1: { boys: 9686, girls: 11183 },
    stateD2: { boys: 9803, girls: 11183 },
    fastChance: { boys: null, girls: null },
  },
  // 100 Backstroke
  "100 BK": {
    north: { boys: 6067, girls: 6826 },
    south: { boys: 6249, girls: 6898 },
    centralWest: { boys: 6668, girls: 7009 },
    stateD1: { boys: 5896, girls: 6718 },
    stateD2: { boys: 5996, girls: 6748 },
    fastChance: { boys: 7652, girls: 7945 },
  },
  // 100 Breaststroke
  "100 BR": {
    north: { boys: 6773, girls: 7813 },
    south: { boys: 6907, girls: 7912 },
    centralWest: { boys: 7072, girls: 7891 },
    stateD1: { boys: 6488, girls: 7748 },
    stateD2: { boys: 6721, girls: 7716 },
    fastChance: { boys: 8294, girls: 8977 },
  },
  // 400 Freestyle Relay
  "400 FR R": {
    north: { boys: 22267, girls: 26648 },
    south: { boys: 22262, girls: 25324 },
    centralWest: { boys: 24835, girls: 26080 },
    stateD1: { boys: 21542, girls: 24660 },
    stateD2: { boys: 22155, girls: 24535 },
    fastChance: { boys: null, girls: null },
  },
};

export const useQualifyingTime = (
  distance: number,
  stroke: number,
  sex: "M" | "F",
  level: QualifyingLevel = "stateD1"
): number | null => {
  const strokeMap: Record<number, string> = {
    1: "FR",
    2: "BK",
    3: "BR",
    4: "FLY",
    5: "IM",
  };

  const key = `${distance} ${strokeMap[stroke] || ""}`;
  const times = qualifyingTimes[key];

  if (!times || !times[level]) return null;
  return sex === "M" ? times[level].boys : times[level].girls;
};

export const qualifyingLevelLabels: Record<QualifyingLevel, string> = {
  north: "North",
  south: "South",
  centralWest: "Central/Western",
  fastChance: "Fast Chance",
  stateD1: "State Division I",
  stateD2: "State Division II",
};

// Qualifying levels to check in order (easiest to hardest)
const qualifyingLevelsOrder: QualifyingLevel[] = [
  "fastChance",
  "centralWest",
  "stateD2",
];

export interface NextCutInfo {
  level: QualifyingLevel | null;
  cutTime: number | null;
  difference: number | null;
  achieved: boolean;
}

export const useDistanceToNextCut = (
  time: number,
  distance: number,
  stroke: number,
  sex: "M" | "F"
): NextCutInfo => {
  const strokeMap: Record<number, string> = {
    1: "FR",
    2: "BK",
    3: "BR",
    4: "FLY",
    5: "IM",
  };

  const key = `${distance} ${strokeMap[stroke] || ""}`;
  const eventTimes = qualifyingTimes[key];

  if (!eventTimes) {
    return { level: null, cutTime: null, difference: null, achieved: false };
  }

  for (const level of qualifyingLevelsOrder) {
    const cutTime =
      sex === "M" ? eventTimes[level]?.boys : eventTimes[level]?.girls;
    if (cutTime === null || cutTime === undefined) continue;

    if (time > cutTime) {
      return {
        level,
        cutTime,
        difference: time - cutTime,
        achieved: false,
      };
    }
  }

  const lastLevel = qualifyingLevelsOrder[qualifyingLevelsOrder.length - 1];
  const lastCutTime =
    sex === "M" ? eventTimes[lastLevel]?.boys : eventTimes[lastLevel]?.girls;

  return {
    level: lastLevel,
    cutTime: lastCutTime,
    difference: lastCutTime ? time - lastCutTime : null,
    achieved: true,
  };
};

const strokes = [
  { stroke_abbr: "FR", stroke_name: "Freestyle" },
  { stroke_abbr: "BK", stroke_name: "Backstroke" },
  { stroke_abbr: "BR", stroke_name: "Breaststroke" },
  { stroke_abbr: "FLY", stroke_name: "Butterfly" },
  { stroke_abbr: "IM", stroke_name: "IM" },
  { stroke_abbr: "STK", stroke_name: "Your  Stroke" },
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
export const useFormatEvent = (event: any) => {
  return `${sexLong[event.sex] || ""} ${event.distance} ${
    strokes[event.stroke - 1]?.stroke_name
  } ${individualRelayLong[event.iR] || ""}`;
};

export const formatEntry = (entry: any) => {
    return `Heat ${entry.heat} Lane ${entry.lane}`;
}
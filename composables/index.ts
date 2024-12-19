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
  9991: "6 Meter"
}
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
  const milliseconds = (seconds - Math.floor(seconds)) * 60;
  const formatted = `${zeroPad(Math.floor(minutes))}:${zeroPad(
    Math.floor(seconds)
  )}.${zeroPad(Math.floor(milliseconds))}`;
  return formatted;
} else {
  return (time  * -1) / 100;
}
};

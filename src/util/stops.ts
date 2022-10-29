export const fetchStops = async () => {
  const stopsSourceRaw = await fetch("data/data.json");
  const stopsSourceJson = await stopsSourceRaw.json();
  const stops = parseStops(stopsSourceJson);

  return stops;
};

const parseStops = (stopsSourceJson: any) => {
  return (stopsSourceJson.data.allData as any[]).map((stopSource: any[]) => {
    const [, , , lat, lon, id, name, routeId] = stopSource;

    return {
      position: [lon, lat],
      id,
      name,
      routeId,
    } as Stop;
  });
};

export interface Stop {
  position: [number, number];
  id: string;
  name: string;
  routeId: string;
}

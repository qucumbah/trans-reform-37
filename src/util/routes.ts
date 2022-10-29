export const fetchRoutes = async () => {
  const routesSourceRaw = await fetch("data/data2.json");
  const routesSourceJson = await routesSourceRaw.json();
  const routes = parseRoutes(routesSourceJson);

  return routes;
};

const parseRoutes = (routesSourceJson: any) => {
  return (routesSourceJson.data.allData as any[]).map((routeSource: any[]) => {
    const waypointSegments = routeSource[0].geometry.coordinates.map(
      (segment: [number, number][]) => segment.map(([lon, lat]) => [lat, lon])
    );

    const [
      name,
      id,
      type,
      route,
      busType,
      busClass,
      busCapacity,
      interval,
      hours,
    ] = routeSource.slice(2);

    return {
      waypointSegments,
      name,
      id,
      type,
      route,
      bus: {
        type: busType,
        class: busClass,
        capacity: busCapacity,
      },
      interval,
      hours,
    } as Route;
  });
};

export type RouteType =
  | "магистральный"
  | "городской"
  | "пригородный"
  | "подвозящий";
export type BusType = "Троллейбус" | "Автобус";
export type BusClass = "Большой класс" | "Средний класс" | "Малый класс";
export type BusCapacity =
  | "81 чел."
  | "68 чел."
  | "43 чел."
  | "33 чел."
  | "21 чел.";

export interface Route {
  waypointSegments: [number, number][][];
  type: RouteType;
  name: string;
  id: string;
  route: string;
  bus: {
    type: BusType;
    class: BusClass;
    capacity: BusCapacity;
  };
  interval: string;
  hours: string;
}

import Script from "next/script";
import { useCallback, useEffect, useId, useState } from "react";
import type ymaps2 from "yandex-maps";

declare global {
  interface window {
    ymaps: typeof ymaps2;
  }
}

export default function Home() {
  const [ymaps, setYmaps] = useState<typeof window.ymaps | null>(null);
  const [map, setMap] = useState<ymaps.Map | null>(null);

  const mapContainerId = useId();

  const initializeMap = useCallback(() => {
    const ymaps = window.ymaps;
    setYmaps(ymaps);

    ymaps.ready(() => {
      const routesButtonSize = "40px";

      const map = new ymaps.Map(
        mapContainerId,
        {
          center: [56.996667, 40.981944],
          zoom: 13,
          controls: [
            new ymaps.control.GeolocationControl({
              options: {
                position: {
                  left: "96px",
                  top: "10px",
                },
              },
            }),
            new ymaps.control.SearchControl({
              options: {
                position: {
                  left: "132px",
                  top: "10px",
                },
              },
            }),
            new ymaps.control.TypeSelector(),
            new ymaps.control.ZoomControl(),
          ],
        },
        {
          autoFitToViewport: "always",
        }
      );
      setMap(map);
      console.log(map);
    });
  }, []);

  const [routes, setRoutes] = useState<Route[]>([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      const routesSourceRaw = await fetch("data/data2.json");
      const routesSourceJson = await routesSourceRaw.json();
      const routes = parseRoutes(routesSourceJson);

      setRoutes(routes);
    };

    fetchRoutes();
  }, []);

  const setCurrentRoute = useCallback(
    (index: number) => {
      const route = routes[index];
      console.log(route);

      const segments = route.waypointSegments.map((segment) => {
        return new ymaps.Polyline(
          segment,
          {
            balloonContent: "Маршрут",
          },
          {
            strokeColor: "#ff0000",
            strokeWidth: 4,
          }
        );
      });

      map.geoObjects.removeAll();
      for (const segment of segments) {
        map.geoObjects.add(segment);
      }
    },
    [map, routes]
  );
  console.log(setCurrentRoute);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="">
      <div
        className="absolute h-full w-[300px] z-10 transition-[left]"
        style={{
          left: isMenuOpen ? 0 : "-300px",
        }}
      >
        THIS IS THE MENU
      </div>
      <div
        id={mapContainerId}
        className="fixed h-full right-0 transition-[width]"
        style={{
          width: isMenuOpen ? `calc(100% - 300px)` : "100%",
        }}
      >
        <button
          className={[
            "absolute w-20 h-7 left-[10px] top-[10px] z-50",
            "bg-white flex justify-center items-center",
            "rounded shadow-[0_1px_2px_1px_rgb(0_0_0_/_15%),_0_2px_5px_-3px_rgb(0_0_0_/_15%)]",
          ].join(" ")}
          onClick={() => setIsMenuOpen((old) => !old)}
        >
          Меню
        </button>
      </div>
      <Script
        src="https://api-maps.yandex.ru/2.1/?apikey=226a673e-7daf-4dff-a934-ae42f5931cb5&lang=ru_RU"
        onLoad={initializeMap}
      />
    </div>
  );
}

function parseRoutes(routesSourceJson: any) {
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
}

interface Route {
  waypointSegments: [number, number][][];
  type: "магистральный" | "городской" | "пригородный" | "подвозящий";
  name: string;
  id: string;
  route: string;
  bus: {
    type: "Троллейбус" | "Автобус";
    class: "Большой класс" | "Средний класс" | "Малый класс";
    capacity: "81 чел." | "68 чел." | "43 чел." | "33 чел." | "21 чел.";
  };
  interval: string;
  hours: string;
}

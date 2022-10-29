import dynamic from 'next/dynamic';
import Script from "next/script";
import { useCallback, useEffect, useId, useState } from "react";
import { useWindowSize } from "react-use";
import type ymaps2 from "yandex-maps";
import Menu from "../components/Menu";

declare global {
  interface window {
    ymaps: typeof ymaps2;
  }
}

const Home = () => {
  const [ymaps, setYmaps] = useState<typeof window.ymaps | null>(null);
  const [map, setMap] = useState<ymaps.Map | null>(null);

  const mapContainerId = useId();

  const initializeMap = useCallback(() => {
    const ymaps = window.ymaps;
    setYmaps(ymaps);

    ymaps.ready(() => {
      const map = new ymaps.Map(
        mapContainerId,
        {
          center: [56.996667, 40.981944],
          zoom: 13,
          controls: [
            new ymaps.control.GeolocationControl(),
            new ymaps.control.SearchControl(),
            new ymaps.control.TypeSelector(),
            new ymaps.control.ZoomControl(),
          ],
        },
        {
          autoFitToViewport: "always",
        }
      );
      setMap(map);
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
    (id: string) => {
      const route = routes.find((route) => route.id === id);

      const segments = route.waypointSegments.map((segment) => {
        return new ymaps.Polyline(
          segment,
          {
            balloonContent: route.name,
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

  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const { width } = useWindowSize();
  const isMobile = width < 640;

  return (
    <div className="">
      <div
        className="absolute h-full z-10 transition-[left] bg-white"
        style={{
          width: isMobile ? isMenuOpen ? "100%" : 0 : "300px",
          left: isMenuOpen ? 0 : "-100%",
        }}
      >
        <Menu
          routes={routes}
          onRouteChange={(route) => setCurrentRoute(route.id)}
          onClose={() => setIsMenuOpen(false)}
        />
      </div>
      <div
        id={mapContainerId}
        className="fixed h-full right-0 transition-[width]"
        style={{
          width: isMobile ? "100%" : isMenuOpen ? `calc(100% - 300px)` : "100%",
        }}
      >
        <button
          className={[
            "absolute w-20 h-7 left-ya top-[45px] z-50",
            "bg-white flex justify-center items-center",
            "rounded shadow-yandex transition-opacity outline-none",
            isMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"
          ].join(" ")}
          onClick={() => setIsMenuOpen(true)}
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

export default dynamic(() => Promise.resolve(Home), {
  ssr: false,
});

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

export type RouteType = "магистральный" | "городской" | "пригородный" | "подвозящий";
export type BusType = "Троллейбус" | "Автобус";
export type BusClass = "Большой класс" | "Средний класс" | "Малый класс";
export type BusCapacity = "81 чел." | "68 чел." | "43 чел." | "33 чел." | "21 чел.";

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

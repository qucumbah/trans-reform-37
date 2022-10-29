import dynamic from "next/dynamic";
import Script from "next/script";
import { useCallback, useEffect, useId, useState } from "react";
import { useWindowSize } from "react-use";
import Menu from "../components/Menu";
import { Route, fetchRoutes } from "../util/routes";
import { fetchStops, Stop } from "../util/stops";

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
          yandexMapDisablePoiInteractivity: true,
        }
      );
      setMap(map);
    });
  }, []);

  const [routes, setRoutes] = useState<Route[]>([]);
  const [stops, setStops] = useState<Stop[]>([]);

  useEffect(() => {
    fetchRoutes().then(setRoutes);
    fetchStops().then(setStops);
  }, []);

  const setCurrentRoute = useCallback(
    (id: string) => {
      const route = routes.find((route) => route.id === id);

      const routeSegments = route.waypointSegments.map((segment) => {
        return new ymaps.Polyline(
          segment,
          {
            balloonContent: route.name,
          },
          {
            strokeColor: "#234f95",
            strokeWidth: 4,
          }
        );
      });

      const routeStops = stops
        .filter((stop) => stop.routeId === route.id)
        .map((stop) => {
          return new ymaps.Placemark(
            stop.position,
            {
              hintContent: `Остановка "${stop.name}"`,
              balloonContent: `Остановка "${stop.name}".<br>Маршруты: ${stop.otherRoutes}.`,
            },
            {
              iconLayout: "default#image",
              iconImageHref: "stop.png",
            }
          );
        });

      map.geoObjects.removeAll();
      for (const segment of routeSegments) {
        map.geoObjects.add(segment);
      }
      for (const stop of routeStops) {
        map.geoObjects.add(stop);
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
          width: isMobile ? (isMenuOpen ? "100%" : 0) : "300px",
          left: isMenuOpen ? 0 : "-100%",
        }}
      >
        <Menu
          routes={routes}
          onRouteChange={(route) => {
            setCurrentRoute(route.id);

            if (isMobile) {
              setIsMenuOpen(false);
            }
          }}
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
            "absolute px-4 h-yabtn left-ya top-[45px] z-50",
            "bg-white flex justify-center items-center",
            "rounded shadow-yandex transition-opacity outline-none",
            isMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100",
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
};

export default dynamic(() => Promise.resolve(Home), {
  ssr: false,
});

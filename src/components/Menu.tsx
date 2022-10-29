import { useCallback, useState } from "react";
import { Route, RouteType } from "../util/routes";

const Menu: React.FC<{
  routes: Route[];
  selectedRouteId: string | null;
  onRouteChange: (route: Route) => void;
  onClose: () => void;
}> = ({ routes, selectedRouteId, onRouteChange, onClose }) => {
  const [typeFilter, setTypeFilter] = useState<RouteType | "все">("все");
  const [nameFilter, setNameFilter] = useState<string>("");

  const routesFilter = useCallback(
    (route: Route) => {
      if (typeFilter !== "все" && route.type !== typeFilter) {
        return false;
      }

      const normalizedRouteName = route.name
        .toLocaleLowerCase()
        .replaceAll("m", "м")
        .replaceAll("a", "а");

      if (!normalizedRouteName.includes(nameFilter.toLocaleLowerCase())) {
        return false;
      }

      return true;
    },
    [typeFilter, nameFilter]
  );

  return (
    <div className="relative w-full h-full pt-ya pb-4 flex flex-col">
      <div className="relative px-ya flex flex-col gap-ya">
        <div className="relative h-yabtn flex items-center justify-between">
          <a
            href="https://github.com/qucumbah/trans-reform-37"
            target="_blank"
            rel="noreferrer"
            className="relative rounded px-4 h-full shadow-yandex"
          >
            О проекте
          </a>
          <button
            onClick={onClose}
            className="relative rounded px-4 h-full shadow-yandex"
          >
            Закрыть
          </button>
        </div>
        <div className="flex flex-col gap-ya items-stretch">
          <input
            type="text"
            placeholder="Поиск маршрута"
            onChange={(event) => setNameFilter(event.target.value)}
            className="p-2 bg-slate-100"
          />
          <select
            onChange={(event) => setTypeFilter(event.target.value as any)}
            className="p-2 bg-slate-100"
          >
            <option value="все">Все типы</option>
            <option value="магистральный">Магистральный</option>
            <option value="городской">Городской</option>
            <option value="пригородный">Пригородный</option>
            <option value="подвозящий">Подвозящий</option>
          </select>
        </div>
      </div>
      <div className="pt-ya" />
      <div className="relative overflow-y-auto p-ya flex gap-2 flex-col border-t">
        {routes.filter(routesFilter).map((route) => (
          <RouteComponent
            route={route}
            isHighlighted={route.id === selectedRouteId}
            onSelect={() => onRouteChange(route)}
            key={route.id}
          />
        ))}
      </div>
    </div>
  );
};

const RouteComponent: React.FC<{
  route: Route;
  isHighlighted: boolean;
  onSelect: () => void;
}> = ({ route, isHighlighted, onSelect }) => {
  return (
    <button
      className={[
        "p-2 rounded-md",
        isHighlighted ? "bg-slate-200" : "bg-slate-100",
      ].join(" ")}
      onClick={onSelect}
    >
      <div>Маршрут: {route.name}</div>
      <div>{route.route}</div>
      <div>Тип: {route.type}</div>
      <div>Интервал: {route.interval}</div>
      <div>Часы работы: {route.hours}</div>
    </button>
  );
};

export default Menu;

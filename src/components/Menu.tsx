import { useCallback, useState } from "react";
import { Route, RouteType } from "../util/routes";

const Menu: React.FC<{
  routes: Route[];
  onRouteChange: (route: Route) => void;
  onClose: () => void;
}> = ({ routes, onRouteChange, onClose }) => {
  const [typeFilter, setTypeFilter] = useState<RouteType | "все">("все");

  const routesFilter = useCallback(
    (route: Route) => {
      if (typeFilter !== "все" && route.type !== typeFilter) {
        return false;
      }

      return true;
    },
    [typeFilter]
  );

  return (
    <div className="relative w-full h-full pt-ya pb-4 flex flex-col">
      <div className="relative px-ya flex flex-col gap-ya">
        <div className="relative h-yabtn flex items-center justify-between">
          <span className="">Меню</span>
          <button
            onClick={onClose}
            className="relative rounded px-4 h-full shadow-yandex"
          >
            Закрыть
          </button>
        </div>
        <div className="">
          <select
            onChange={(event) => setTypeFilter(event.target.value as any)}
            className="relative w-full p-2"
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
  onSelect: () => void;
}> = ({ route, onSelect }) => {
  return (
    <button className="p-2 rounded-md bg-slate-100" onClick={onSelect}>
      <div>Маршрут: {route.name}</div>
      <div>{route.route}</div>
      <div>Тип: {route.type}</div>
      <div>Интервал: {route.interval}</div>
      <div>Часы работы: {route.hours}</div>
    </button>
  );
};

export default Menu;

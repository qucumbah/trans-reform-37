import { Route } from "../pages";

const Menu: React.FC<{
  routes: Route[];
  onRouteChange: (route: Route) => void;
  onClose: () => void;
}> = ({ routes, onRouteChange, onClose }) => {
  return (
    <div className="relative w-full h-full p-4">
      <div className="relative pb-4">
        <span>This is the header</span>
        <button onClick={onClose} className="absolute top-0 right-0">
          Close
        </button>
      </div>
      <div className="overflow-y-auto flex gap-2 flex-col">
        {routes.map((route) => (
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

import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("monsters", "routes/monsters.tsx"),
] satisfies RouteConfig;

import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Encounter Architect" },
    {
      name: "description",
      content: "Build encounters for role-playing games using 5e ruleset.",
    },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return { message: "Hello from Vercel" };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <Welcome message={loaderData.message} />;
}

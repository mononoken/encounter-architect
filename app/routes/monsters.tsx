import { useLoaderData } from "react-router";
import { Stack, Text, Title } from "@mantine/core";

type Monster = {
  slug: string;
  name: string;
  challenge_rating: number;
};

type Open5eResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Monster[];
};

export function meta() {
  return [
    { title: "Encounter Architect" },
    {
      name: "description",
      content: "Build encounters for role-playing games using 5e ruleset.",
    },
  ];
}

export async function loader() {
  const response = await fetch(
    "https://api.open5e.com/monsters/?document__slug=wotc-srd&limit=400"
  );

  const { results: monsters } = (await response.json()) as Open5eResponse;

  return { monsters };
}

export default function MonstersIndex() {
  const { monsters } = useLoaderData<typeof loader>();

  return (
    <Stack>
      <Title>Monsters</Title>
      <Stack>
        {monsters.map((monster) => (
          <Stack key={monster.slug}>
            <Title>{monster.name}</Title>
            <Text>{monster.challenge_rating}</Text>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

import { Button, Group, Stack, Text, Title } from "@mantine/core";
import { Link } from "react-router";

export function meta() {
  return [
    { title: "Encounter Architect" },
    {
      name: "description",
      content: "Build encounters for role-playing games using 5e ruleset.",
    },
  ];
}

export default function Home() {
  return (
    <Stack align="center" ta="center" maw={700} mx="auto" mt="xl">
      <Title order={1} size="h1" fw={900}>
        Encounter Architect
      </Title>
      <Text size="lg">
        A tool for Dungeons & Dragons Dungeon Masters to quickly browse and
        filter monsters by challenge rating to help build balanced and engaging
        encounters for their campaigns, powered by data from the Open5e API.
      </Text>
      <Group mt="xl">
        <Button component={Link} to="/monsters" size="md">
          Get started
        </Button>
        <Button
          component="a"
          href="https://github.com/mononoken/encounter-architect"
          target="_blank"
          variant="default"
          size="md"
        >
          GitHub
        </Button>
      </Group>
    </Stack>
  );
}

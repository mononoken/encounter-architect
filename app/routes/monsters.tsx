import {
  useLoaderData,
  useNavigate,
  useNavigation,
  type LoaderFunctionArgs,
} from "react-router";
import {
  ActionIcon,
  Card,
  Group,
  Pagination,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useEncounter } from "~/context/EncounterContext";
import { IconPlus } from "@tabler/icons-react";
import type { Monster } from "~/types";

type Open5eResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Monster[];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page")) || 1;
  const pageLimit = 20;

  // https://open5e.com/api-docs
  const response = await fetch(
    `https://api.open5e.com/monsters/?document__slug=wotc-srd&ordering=challenge_rating&limit=${pageLimit}&page=${page}`
  );

  const { count: monstersCount, results: monsters } =
    (await response.json()) as Open5eResponse;

  const pageCount = Math.ceil(monstersCount / pageLimit);

  return { monstersCount, monsters, page, pageCount };
}

function PendingMonstersIndex() {
  return (
    <Stack>
      <Title order={1} mb="lg">
        Monsters
      </Title>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
        {Array.from({ length: 20 }).map((_, index) => (
          <Card key={index} shadow="sm" padding="lg" radius="md" withBorder>
            <Stack>
              <Skeleton height={35} />
              <Group>
                <Skeleton height={24} />
              </Group>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>
    </Stack>
  );
}

export default function MonstersIndex() {
  const { monstersCount, monsters, page, pageCount } =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const { addMonster } = useEncounter();

  const isLoading = navigation.state === "loading";

  const handlePageChange = (newPage: number) => {
    navigate(`/monsters?page=${newPage}`);
  };

  return isLoading ? (
    <PendingMonstersIndex />
  ) : (
    <Stack>
      <Title order={1}>Monsters ({monstersCount})</Title>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
        {monsters.map((monster) => (
          <Card
            key={monster.slug}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
          >
            <Stack>
              <Group justify="space-between" align="center">
                <Title order={2}>{monster.name}</Title>
                <ActionIcon
                  variant="default"
                  size="md"
                  aria-label="Add to encounter"
                  onClick={() => addMonster(monster)}
                >
                  <IconPlus />
                </ActionIcon>
              </Group>
              <Group>
                <Text>Challenge rating:</Text>
                <Text>{monster.challenge_rating}</Text>
              </Group>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>
      <Group justify="center">
        <Pagination
          total={pageCount}
          value={page}
          onChange={handlePageChange}
        />
      </Group>
    </Stack>
  );
}

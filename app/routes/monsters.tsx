import {
  useLoaderData,
  useNavigate,
  type LoaderFunctionArgs,
} from "react-router";
import {
  Card,
  Group,
  Pagination,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";

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

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page")) || 1;
  const pageLimit = 20;

  const response = await fetch(
    `https://api.open5e.com/monsters/?document__slug=wotc-srd&limit=${pageLimit}&page=${page}`
  );

  const { count: monstersCount, results: monsters } =
    (await response.json()) as Open5eResponse;

  const pageCount = Math.ceil(monstersCount / pageLimit);

  return { monstersCount, monsters, page, pageCount };
}

export default function MonstersIndex() {
  const { monstersCount, monsters, page, pageCount } =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const handlePageChange = (newPage: number) => {
    navigate(`/monsters?page=${newPage}`);
  };

  return (
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
            <Title order={2}>{monster.name}</Title>
            <Group>
              <Text>Challenge rating:</Text>
              <Text>{monster.challenge_rating}</Text>
            </Group>
          </Card>
        ))}
      </SimpleGrid>
      <Pagination total={pageCount} value={page} onChange={handlePageChange} />
    </Stack>
  );
}

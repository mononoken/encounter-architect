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
  Select,
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

const VALID_CRS = [
  "0",
  "1/8",
  "1/4",
  "1/2",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30",
];

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page")) || 1;
  const cr = url.searchParams.get("cr");
  const pageLimit = 20;

  // https://open5e.com/api-docs
  const queryParams = new URLSearchParams({
    document__slug: "wotc-srd",
    limit: String(pageLimit),
    page: String(page),
    ordering: "challenge_rating",
  });

  if (cr) {
    queryParams.append("cr", cr);
  }

  const response = await fetch(
    `https://api.open5e.com/monsters/?${queryParams}`
  );

  const { count: monstersCount, results: monsters } =
    (await response.json()) as Open5eResponse;

  const pageCount = Math.ceil(monstersCount / pageLimit);

  return { monstersCount, monsters, page, pageCount, cr };
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
  const { monstersCount, monsters, page, pageCount, cr } =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const { addMonster } = useEncounter();

  const isLoading = navigation.state === "loading";

  const handlePageChange = (newPage: number) => {
    const searchParams = new URLSearchParams();
    searchParams.set("page", String(newPage));
    if (cr) {
      searchParams.set("cr", cr);
    }
    navigate(`/monsters?${searchParams}`);
  };

  const handleCrChange = (newCr: string | null) => {
    const searchParams = new URLSearchParams();
    searchParams.set("page", "1");
    if (newCr) {
      searchParams.set("cr", newCr);
    }
    navigate(`/monsters?${searchParams}`);
  };

  return isLoading ? (
    <PendingMonstersIndex />
  ) : (
    <Stack>
      <Group>
        <Title order={1}>Monsters ({monstersCount})</Title>
        <Select
          label="Challenge Rating"
          placeholder="Pick Value"
          data={VALID_CRS}
          value={cr}
          onChange={handleCrChange}
          clearable
        />
      </Group>
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

import { Link } from "react-router";
import {
  Button,
  Group,
  NumberInput,
  Stack,
  Table,
  Text,
  Title,
  ActionIcon,
  Anchor,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useEncounter } from "../context/EncounterContext";

export function meta() {
  return [
    { title: "Encounter Builder - Encounter Architect" },
    {
      name: "description",
      content: "Build and balance encounters for your D&D 5e campaigns.",
    },
  ];
}

export async function loader() {
  return {};
}

export default function EncounterPage() {
  const {
    monsters,
    removeMonster,
    clearMonsters,
    setMonsterQuantity,
    totalEncounterXp,
  } = useEncounter();

  const rows = monsters.map((monster) => (
    <Table.Tr key={monster.slug}>
      <Table.Td>{monster.name}</Table.Td>
      <Table.Td>{monster.challenge_rating}</Table.Td>
      <Table.Td>
        <NumberInput
          value={monster.quantity}
          onChange={(val) =>
            setMonsterQuantity(monster.slug, typeof val === "number" ? val : 0)
          }
          min={0}
          max={99}
          w={80}
        />
      </Table.Td>
      <Table.Td>
        <ActionIcon
          variant="transparent"
          color="red"
          onClick={() => removeMonster(monster.slug)}
        >
          <IconTrash size={20} />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Stack>
      <Title order={1} mb="lg">
        Build Your Encounter
      </Title>

      <Group justify="space-between">
        <Title order={2}>Monsters in Encounter</Title>
        <Button
          variant="outline"
          color="red"
          onClick={clearMonsters}
          disabled={monsters.length === 0}
        >
          Clear All
        </Button>
      </Group>

      {monsters.length === 0 ? (
        <Text>
          No monsters added to the encounter yet. Go to the{" "}
          <Anchor component={Link} to="/monsters">
            monsters list
          </Anchor>{" "}
          to add some!
        </Text>
      ) : (
        <Table stickyHeader striped withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>CR</Table.Th>
              <Table.Th>Quantity</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      )}
      <Text size="lg" fw={700}>
        Total Encounter XP: {totalEncounterXp}
      </Text>
    </Stack>
  );
}

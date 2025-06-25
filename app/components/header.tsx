import { Link } from "react-router";
import { ActionIcon, Anchor, Container, Group } from "@mantine/core";
import { IconBrandGithub } from "@tabler/icons-react";
import classes from "./Header.module.css";

const links = [
  { link: "/monsters", label: "Monsters" },
  { link: "/encounter", label: "Encounter" },
];

export function Header() {
  const items = links.map((link) => (
    <Link key={link.label} to={link.link} className={classes.link}>
      {link.label}
    </Link>
  ));

  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <Anchor
          component={Link}
          to="/"
          variant="gradient"
          gradient={{ from: "blue", to: "purple" }}
          fw={800}
          fz="lg"
        >
          Encounter Architect
        </Anchor>
        <Group gap="md" visibleFrom="xs">
          {items}
          <ActionIcon
            component="a"
            href="https://github.com/mononoken/encounter-architect"
            variant="outline"
            color="black"
          >
            <IconBrandGithub />
          </ActionIcon>
        </Group>
      </Container>
    </header>
  );
}

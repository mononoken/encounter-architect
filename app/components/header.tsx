import { Link, NavLink } from "react-router";
import { ActionIcon, Anchor, Button, Container, Group } from "@mantine/core";
import classes from "../styles/Header.module.css";
import { IconBrandGithub } from "@tabler/icons-react";

const links = [{ link: "/monsters", label: "Monsters" }];

export function Header() {
  const items = links.map((link) => (
    <NavLink
      key={link.label}
      to={link.link}
      className={({ isActive, isPending }) =>
        isPending ? "pending" : isActive ? "active" : ""
      }
    >
      {link.label}
    </NavLink>
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

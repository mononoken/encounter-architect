import { Link, NavLink } from "react-router";
import { Anchor, Container, Group } from "@mantine/core";
import classes from "../styles/Header.module.css";

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
        <Anchor component={Link} to="/">
          Encounter Architect
        </Anchor>
        <Group gap={5} visibleFrom="xs">
          {items}
        </Group>
      </Container>
    </header>
  );
}

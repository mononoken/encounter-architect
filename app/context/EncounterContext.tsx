import { notifications } from "@mantine/notifications";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import type { Monster } from "~/types";

type MonsterInEncounter = {
  slug: string;
  name: string;
  challenge_rating: number;
  quantity: number;
};

type EncounterContextType = {
  monsters: MonsterInEncounter[];
  addMonster: (monster: Monster) => void;
  removeMonster: (slug: string) => void;
  setMonsterQuantity: (slug: string, quantity: number) => void;
  clearMonsters: () => void;

  totalEncounterXp: number;
};

const EncounterContext = createContext<EncounterContextType | undefined>(
  undefined
);

const useLocalStorageState = <T,>(key: string, defaultValue: T) => {
  const [state, setState] = useState<T>(() => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  }, [key, state]);

  return [state, setState] as const;
};

const CR_XP_MAP: { [key: string]: number } = {
  "0": 10,
  "1/8": 25,
  "1/4": 50,
  "1/2": 100,
  "1": 200,
  "2": 450,
  "3": 700,
  "4": 1100,
  "5": 1800,
  "6": 2300,
  "7": 2900,
  "8": 3900,
  "9": 5000,
  "10": 5900,
  "11": 7200,
  "12": 8400,
  "13": 10000,
  "14": 11500,
  "15": 13000,
  "16": 15000,
  "17": 18000,
  "18": 20000,
  "19": 22000,
  "20": 25000,
  "21": 33000,
  "22": 41000,
  "23": 50000,
  "24": 62000,
  "25": 75000,
  "26": 90000,
  "27": 105000,
  "28": 120000,
  "29": 135000,
  "30": 155000,
};

function getXpMultiplier(monsterCount: number) {
  if (monsterCount <= 1) return 1;
  if (monsterCount === 2) return 1.5;
  if (monsterCount <= 6) return 2;
  if (monsterCount <= 10) return 2.5;
  if (monsterCount <= 14) return 3;
  return 4;
}

export function EncounterProvider({ children }: { children: React.ReactNode }) {
  const [monsters, setMonsters] = useLocalStorageState<MonsterInEncounter[]>(
    "encounterMonsters",
    []
  );

  const addMonster = useCallback(
    (monsterToAdd: Monster) => {
      setMonsters((prevMonsters) => {
        const notificationMessage = `${monsterToAdd.name} added to encounter.`;

        const existingMonsterIndex = prevMonsters.findIndex(
          (prevMonster) => prevMonster.slug === monsterToAdd.slug
        );

        if (existingMonsterIndex === -1) {
          notifications.show({
            title: "Encounter Updated",
            message: notificationMessage,
          });

          return [...prevMonsters, { ...monsterToAdd, quantity: 1 }];
        }

        const updatedMonsters = [...prevMonsters];
        updatedMonsters[existingMonsterIndex] = {
          ...updatedMonsters[existingMonsterIndex],
          quantity: updatedMonsters[existingMonsterIndex].quantity + 1,
        };

        notifications.show({
          title: "Encounter Updated",
          message: notificationMessage,
        });

        return updatedMonsters;
      });
    },
    [setMonsters]
  );

  const removeMonster = useCallback(
    (slug: string) => {
      setMonsters((prevMonsters) =>
        prevMonsters.filter((prevMonster) => prevMonster.slug !== slug)
      );
    },
    [setMonsters]
  );

  const clearMonsters = useCallback(() => {
    setMonsters([]);
  }, [setMonsters]);

  const setMonsterQuantity = useCallback(
    (slugToUpdate: string, newQuantity: number) => {
      setMonsters((prevMonsters) => {
        if (newQuantity <= 0) {
          return prevMonsters.filter(
            (prevMonster) => prevMonster.slug !== slugToUpdate
          );
        }

        const monsterIndex = prevMonsters.findIndex(
          (prevMonster) => prevMonster.slug === slugToUpdate
        );

        if (monsterIndex === -1) {
          console.warn(
            `Attempted to set quantity for non-existent monster: ${slugToUpdate}`
          );
          return prevMonsters;
        }

        const updatedMonsters = [...prevMonsters];
        updatedMonsters[monsterIndex] = {
          ...updatedMonsters[monsterIndex],
          quantity: newQuantity,
        };
        return updatedMonsters;
      });
    },
    [setMonsters]
  );

  const totalEncounterXp = useMemo(() => {
    let totalBaseXp = 0;
    let totalMonsterCount = 0;

    monsters.forEach((monster) => {
      const xpPerMonster = CR_XP_MAP[monster.challenge_rating.toString()];
      if (xpPerMonster !== undefined) {
        totalBaseXp += xpPerMonster * monster.quantity;
      }
      totalMonsterCount += monster.quantity;
    });

    const xpMultiplier = getXpMultiplier(totalMonsterCount);
    return totalBaseXp * xpMultiplier;
  }, [monsters]);

  return (
    <EncounterContext.Provider
      value={useMemo(
        () => ({
          monsters,
          addMonster,
          removeMonster,
          clearMonsters,
          setMonsterQuantity,
          totalEncounterXp,
        }),
        [
          monsters,
          addMonster,
          removeMonster,
          clearMonsters,
          setMonsterQuantity,
          totalEncounterXp,
        ]
      )}
    >
      {children}
    </EncounterContext.Provider>
  );
}

export function useEncounter() {
  const context = useContext(EncounterContext);
  if (context === undefined) {
    throw new Error("useEncounter must be used within an EncounterProvider");
  }

  return context;
}

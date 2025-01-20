from dataclasses import dataclass, field


@dataclass
class Stat:
    id: int
    name: str
    minValue: float | None = None
    maxValue: float | None = None


@dataclass
class StatValue:
    id: int
    statId: int
    value: float


@dataclass
class CharacterStatLevel:
    id: int
    name: str
    stats: list[StatValue]


@dataclass
class Character:
    id: int
    name: str
    levels: list[CharacterStatLevel]
    imageSrc: str = ""
    currentLevelIndex: int = 0
    equipment = []


@dataclass
class Model:
    stats: list[Stat] = field(default_factory=list)
    characters: list[Character] = field(default_factory=list)
    targetStats = []
    equipmentTypes = []
    equipmentGroups = []
    equipment = []
    nextId: int = 0

    def create_id(self) -> int:
        new_id = self.nextId
        self.nextId += 1
        return new_id

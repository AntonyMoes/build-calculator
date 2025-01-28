from dataclasses import dataclass, field


@dataclass
class TargetStat:
    id: int
    name: str
    formula: str
    tokenization: list = field(default_factory=list)


@dataclass
class Stat:
    id: int
    name: str
    shownCharacterStat: bool
    minValue: float | None = None
    maxValue: float | None = None


@dataclass
class EquipmentType:
    id: int
    name: str

@dataclass
class EquipmentGroup:
    id: int
    name: str
    equipmentTypeIds: list[int]

@dataclass
class CharacterEquipmentGroup:
    id: int
    groupId: int
    equipment: list = field(default_factory=list)

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
class CharacterStatGroup:
    id: int
    name: str
    levels: list[CharacterStatLevel]
    currentLevelIndex: int = 0

@dataclass
class Character:
    id: int
    name: str
    levels: list[CharacterStatLevel]
    equipment: list[CharacterEquipmentGroup] = field(default_factory=list)
    statGroups: list[CharacterStatGroup] = field(default_factory=list)
    imageSrc: str = ""
    currentLevelIndex: int = 0


@dataclass
class Model:
    stats: list[Stat] = field(default_factory=list)
    targetStats: list[TargetStat] = field(default_factory=list)
    characters: list[Character] = field(default_factory=list)
    equipmentTypes: list[EquipmentType] = field(default_factory=list)
    equipmentGroups: list[EquipmentGroup] = field(default_factory=list)
    equipment: list = field(default_factory=list)
    nextId: int = 0

    def create_id(self) -> int:
        new_id = self.nextId
        self.nextId += 1
        return new_id

    def get_stat(self, stat_name: str) -> Stat | None:
        return next(filter(lambda stat: stat.name == stat_name, self.stats), None)

from abc import ABC, abstractmethod
from dataclasses import dataclass

from data_scraper.character_data import Character, Stat, Model, TargetStat, EquipmentGroup, EquipmentType

AdditionalCharacterDataType = any


@dataclass
class CharacterUrlData:
    additional_data: AdditionalCharacterDataType
    urls: list[str]


@dataclass
class CharacterParseResult:
    character: Character
    image_url: str


class Parser(ABC):
    @property
    @abstractmethod
    def character_list_url(self) -> str:
        pass

    @abstractmethod
    def generate_stats(self, model: Model) -> list[Stat]:
        pass

    @abstractmethod
    def generate_target_stats(self, model: Model) -> list[TargetStat]:
        pass

    @abstractmethod
    def generate_equipment_types(self, model: Model) -> list[EquipmentType]:
        pass

    @abstractmethod
    def generate_equipment_groups(self, model: Model) -> list[EquipmentGroup]:
        pass

    @abstractmethod
    def get_character_urls_from_list(self, list_page: str) -> list[CharacterUrlData]:
        pass

    @abstractmethod
    def parse_character(self, additional_data: AdditionalCharacterDataType, character_pages: list[str],
                        model: Model) -> CharacterParseResult:
        pass

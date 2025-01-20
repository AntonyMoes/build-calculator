import re
from abc import ABC, abstractmethod
from collections import Counter
from dataclasses import dataclass
from typing import Tuple
from urllib import parse

from selectolax.parser import HTMLParser, Node

from data_scraper.character_data import Character, Stat, Model, StatValue, CharacterStatLevel


@dataclass
class CharacterUrlData:
    additional_data: any
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
    def get_character_urls_from_list(self, list_page: str) -> list[CharacterUrlData]:
        pass

    @abstractmethod
    def parse_character(self, additional_data: any, character_pages: list[str], model: Model) -> CharacterParseResult:
        pass


class HSRParser(Parser):
    STATS = [
        "BaseHP",
        "BaseATK",
        "BaseDEF",
        "BaseSPD",
    ]

    __image_regex = re.compile(r"(.*\.([a-zA-Z0-9])+)")
    __level_regex = re.compile(r"(\d+)/(\d+)")

    @property
    def character_list_url(self) -> str:
        return "https://honkai-star-rail.fandom.com/wiki/Character/List"

    def generate_stats(self, model: Model) -> list[Stat]:
        return [Stat(model.create_id(), stat) for stat in self.STATS]

    def get_character_urls_from_list(self, list_page: str) -> list[CharacterUrlData]:
        parser = HTMLParser(list_page)
        table = parser.css_first("table.article-table")
        rows = table.css("tbody > tr")

        def filter_and_destructure_rows(rows: list[Node]) -> list[list[Node]]:
            return [row.css("td") for row in filter(lambda row: "Combat Type" not in row.text(), rows)]

        character_name_link_paths = [(row[0].text(), row[0].css_first("a").attributes["href"], row[2].text().strip())
                                     for row in filter_and_destructure_rows(rows)]

        base_url = self.character_list_url.replace(parse.urlparse(self.character_list_url).path, "")
        character_counter = Counter(map(lambda character: character[0], character_name_link_paths))

        def get_urls(name: str, link: str, path: str) -> list[str]:
            main_url = base_url + link
            combat_url = main_url + "/Combat"
            if character_counter[name] > 1:
                combat_url += "/" + path.replace(" ", "_")

            return [main_url, combat_url]

        def get_name(name: str, path: str) -> Tuple[str, bool]:
            return (name, False) if character_counter[name] == 1 else (name + " - " + path, True)

        return [CharacterUrlData(get_name(name, path), get_urls(name, link, path))
                for name, link, path in character_name_link_paths]

    def parse_character(self, additional_data: any, character_pages: list[str], model: Model) -> CharacterParseResult:
        page, combat_page = character_pages

        additional_data: Tuple[str, bool]
        name, image_from_combat_page = additional_data

        page_parser = HTMLParser(page)
        combat_page_parser = HTMLParser(combat_page)
        image_page_parser = combat_page_parser if image_from_combat_page else page_parser
        image_src_raw = image_page_parser.css_first("figure > a > img").attributes["src"]
        image_src = self.__image_regex.match(image_src_raw).groups()[0] + "/revision/latest/scale-to-width-down/256"

        table = combat_page_parser.css_first("table.ascension-stats")
        rows_and_header = table.css("tr:not(.mobile-only)")
        header = rows_and_header[0]
        rows = [(rows_and_header[i], rows_and_header[i + 1]) for i in range(1, len(rows_and_header), 2)]

        header_columns = (col.text() for col in header.css("th"))

        def get_column_stat(row: str) -> Stat | None:
            return next(filter(lambda stat: stat.name == row, model.stats), None)

        column_stats = dict(
            (i - 1, stat) for i, stat in enumerate(map(get_column_stat, header_columns)) if stat is not None)

        levels = [
            level
            for row in rows
            for level in self.parse_row(model, column_stats, row)
        ]

        return CharacterParseResult(Character(model.create_id(), name, levels), image_src)

    def parse_row(self, model: Model, column_stats: dict[int, Stat], row: (Node, Node)) -> [CharacterStatLevel]:
        def parse_sub_row(sub_row: Node, ignore_first_column: bool) -> CharacterStatLevel:
            columns = [col.text().replace(",", "") for col in sub_row.css("td")]
            if ignore_first_column:
                columns = columns[1:]

            level_match = self.__level_regex.match(columns[0])
            level, level_cap = map(lambda lvl: int(lvl), level_match.groups())
            level_name = str(level) if level == level_cap or level == 1 else str(level) + "A"

            stats = [StatValue(model.create_id(), stat.id, float(columns[column])) for column, stat in
                     column_stats.items()]
            return CharacterStatLevel(model.create_id(), level_name, stats)

        return [parse_sub_row(row[0], True), parse_sub_row(row[1], False)]

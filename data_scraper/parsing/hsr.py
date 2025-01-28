import re
from collections import Counter
from typing import Tuple
from urllib import parse

from selectolax.parser import HTMLParser, Node

from data_scraper.character_data import Character, Stat, Model, StatValue, CharacterStatLevel, TargetStat, \
    EquipmentType, EquipmentGroup, CharacterEquipmentGroup, CharacterStatGroup
from data_scraper.parsing import Parser, CharacterUrlData, CharacterParseResult
from data_scraper.parsing.parser import AdditionalCharacterDataType


# "BaseHP",
#         "HPBoost",
#         "BonusHP",
#         "BaseATK",
#         "ATKBoost",
#         "BonusATK",
#         "BaseDEF",
#         "DEFBoost",
#         "BonusDEF",
#         "BaseSPD",
#         "SPDBoost",
#         "BonusSPD",
#         "CritRate",
#         "CritDMG",
#         "BreakEffect"

class HSRParser(Parser):
    STATS: dict[str, Tuple[float | None, float | None]] = dict({
        ("BaseHP", (True, None, None)),
        ("HPBoost", (False, None, None)),
        ("BonusHP", (False, None, None)),
        ("BaseATK", (True, None, None)),
        ("ATKBoost", (False, None, None)),
        ("BonusATK", (False, None, None)),
        ("BaseDEF", (True, None, None)),
        ("DEFBoost", (False, None, None)),
        ("BonusDEF", (False, None, None)),
        ("BaseSPD", (True, None, None)),
        ("SPDBoost", (False, None, None)),
        ("BonusSPD", (False, None, None)),
        ("CritRate", (True, 0.0, 100.0)),
        ("CritDMG", (True, None, None)),
        ("BreakEffect", (False, None, None))
    })

    DEFAULT_VALUES = dict({
        ("CritRate", 5.0),
        ("CritDMG", 50.0)
    })

    TARGET_STATS = [
        ("AvgCRIT", "100 + CritRate * CritDMG / 100"),
        ("ATK", "BaseATK * (1 + ATKBoost / 100) + BonusATK"),
        ("DEF", "BaseDEF * (1 + DEFBoost / 100) + BonusDEF"),
        ("HP", "BaseHP * (1 + HPBoost / 100) + BonusHP"),
        ("SPD", "BaseSPD * (1 + SPDBoost / 100) + BonusSPD"),
        ("BreakEffect", "BreakEffect"),
        ("ExampleAvgATKDMG", "(BaseATK * (1 + ATKBoost / 100) + BonusATK) * (100 + CritRate * CritDMG / 100) / 100")
    ]

    EQUIPMENT_TYPES = [
        "Hand",
        "Head",
        "Body",
        "Feet",
        "Sphere",
        "Rope"
    ]

    __image_regex = re.compile(r"(.*\.([a-zA-Z0-9])+)")
    __level_regex = re.compile(r"(\d+)/(\d+)")
    __trace_regex = re.compile(r".*?([a-zA-Z]+( [a-zA-Z]+)?) increases by ([0-9]+(.[0-9]+))(%?).*")

    @property
    def character_list_url(self) -> str:
        return "https://honkai-star-rail.fandom.com/wiki/Character/List"

    def generate_stats(self, model: Model) -> list[Stat]:
        return [Stat(model.create_id(), stat, show, min_value, max_value)
                for stat, (show, min_value, max_value) in self.STATS.items()]

    def generate_target_stats(self, model: Model) -> list[TargetStat]:
        return [TargetStat(model.create_id(), stat, formula) for stat, formula in self.TARGET_STATS]

    def generate_equipment_types(self, model: Model) -> list[EquipmentType]:
        return [EquipmentType(model.create_id(), equipment_type) for equipment_type in self.EQUIPMENT_TYPES]

    def generate_equipment_groups(self, model: Model) -> list[EquipmentGroup]:
        return [EquipmentGroup(model.create_id(), "Relics", [equipment_type.id
                                                             for equipment_type in model.equipmentTypes])]

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

    def parse_character(self, additional_data: AdditionalCharacterDataType, character_pages: list[str],
                        model: Model) -> CharacterParseResult:
        page, combat_page = character_pages

        additional_data: Tuple[str, bool]
        name, image_from_combat_page = additional_data

        page_parser = HTMLParser(page)
        combat_page_parser = HTMLParser(combat_page)
        image_src = self._parse_image_src(page_parser, combat_page_parser, image_from_combat_page)
        levels = self._parse_stat_levels(model, combat_page_parser)
        equipment_groups = [CharacterEquipmentGroup(model.create_id(), model.equipmentGroups[0].id)]
        stat_groups = self._parse_stat_groups(model, combat_page_parser)

        return CharacterParseResult(
            Character(model.create_id(), name, levels, equipment_groups, stat_groups),
            image_src
        )

    def _parse_image_src(self, page_parser: HTMLParser, combat_page_parser: HTMLParser, from_combat_page: bool) -> str:
        image_page_parser = combat_page_parser if from_combat_page else page_parser
        image_src_raw = image_page_parser.css_first("figure > a > img").attributes["src"]
        return self.__image_regex.match(image_src_raw).groups()[0] + "/revision/latest/scale-to-width-down/256"

    def _parse_stat_levels(self, model: Model, combat_page_parser: HTMLParser) -> list[CharacterStatLevel]:
        table = combat_page_parser.css_first("table.ascension-stats")
        rows_and_header = table.css("tr:not(.mobile-only)")
        header = rows_and_header[0]
        rows = [(rows_and_header[i], rows_and_header[i + 1]) for i in range(1, len(rows_and_header), 2)]

        header_columns = (col.text() for col in header.css("th"))

        column_stats = dict(
            (i - 1, stat) for i, stat in enumerate(map(model.get_stat, header_columns)) if stat is not None)
        default_stats = [(model.get_stat(stat_name), value) for stat_name, value in self.DEFAULT_VALUES.items()]

        return [
            level
            for row in rows
            for level in self._parse_stat_row(model, column_stats, default_stats, row)
        ]

    def _parse_stat_row(self, model: Model, column_stats: dict[int, Stat], default_stats: list[Tuple[Stat, float]],
                        row: (Node, Node)) -> list[CharacterStatLevel]:
        def parse_sub_row(sub_row: Node, ignore_first_column: bool) -> CharacterStatLevel:
            columns = [col.text().replace(",", "") for col in sub_row.css("td")]
            if ignore_first_column:
                columns = columns[1:]

            level_match = self.__level_regex.match(columns[0])
            level, level_cap = map(lambda lvl: int(lvl), level_match.groups())
            level_name = str(level) if level == level_cap or level == 1 else str(level) + "A"

            values = [(stat, float(columns[column])) for column, stat in column_stats.items()] + default_stats
            stats = [StatValue(model.create_id(), stat.id, value) for stat, value in values]
            return CharacterStatLevel(model.create_id(), level_name, stats)

        return [parse_sub_row(row[0], True), parse_sub_row(row[1], False)]

    def _parse_stat_groups(self, model: Model, combat_page_parser: HTMLParser) -> list[CharacterStatGroup]:
        traces_id = "Traces"
        nodes = [n for n in combat_page_parser.css_first("#" + traces_id).parent.parent.iter()]

        table: Node | None = None
        found_traces = False
        for node in nodes:
            if node.child is not None and node.child.id == traces_id:
                found_traces = True

            if node.tag == "table" and found_traces:
                table = node
                break

        if table is None:
            return []

        return list(
            filter(lambda trace: trace is not None, [self._parse_trace(model, trace) for trace in table.css("td")]))

    def _parse_trace(self, model: Model, trace: Node) -> CharacterStatGroup | None:
        trace_name = "Trace - " + trace.css_first("b").text()
        trace_text = trace.text(deep=False)

        result = self.__trace_regex.match(trace_text)
        if result is None:
            return None

        possible_stat_name = result.groups()[0]
        stat_value = float(result.groups()[2])
        boost = len(result.groups()[4]) > 0

        possible_stat_name = (possible_stat_name
                              .lower()
                              .replace("max", "")
                              .replace(" ", ""))

        def compare_stat_names(stat: str, possible_stat: str) -> bool:
            stat_lower = stat.lower()
            if stat_lower == possible_stat:
                return True

            if boost:
                possible_stat += "boost"
            else:
                possible_stat = "bonus" + possible_stat

            return stat_lower == possible_stat

        stat_name = next((stat for stat in self.STATS.keys() if compare_stat_names(stat, possible_stat_name)), None)
        if stat_name is None:
            return None

        stat = model.get_stat(stat_name)

        def create_stat_values(value: float = 0) -> list[StatValue]:
            return [StatValue(model.create_id(), stat.id, value)]

        levels = [
            CharacterStatLevel(model.create_id(), "0", create_stat_values()),
            CharacterStatLevel(model.create_id(), "1", create_stat_values(stat_value)),
        ]
        return CharacterStatGroup(model.create_id(), trace_name, levels)

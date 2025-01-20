import asyncio
import json
import re
import shutil
from dataclasses import asdict
from pathlib import Path
from urllib import parse

import aiofiles
import yarl
from aiohttp import ClientResponse
from aiohttp.client import ClientSession, TCPConnector, _BaseRequestContextManager

from data_scraper.character_data import Model, Character
from data_scraper.parser import Parser, HSRParser

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
}

PARSERS = [
    (HSRParser(), "src/assets/hsr"),
    # (HSRParser(), "src/assets/zzz")
]

FILE_NAME = "config.json"

IMAGE_NAME_REGEX = re.compile(r"([^/]+\.([a-zA-Z0-9]+))")


async def main():
    for _, path_str in PARSERS:
        path = Path(path_str)
        shutil.rmtree(path, ignore_errors=True)
        path.mkdir(parents=True, exist_ok=True)

    connector = TCPConnector(limit=20, limit_per_host=10)
    async with ClientSession(connector=connector) as session:
        models = await asyncio.gather(*[parse_resource(parser, path_str, session)
                                        for parser, path_str in PARSERS])

    await asyncio.gather(*[save_model(model, path_str) for model, (_, path_str) in zip(models, PARSERS)])


async def parse_resource(parser: Parser, path_str: str, session: ClientSession) -> Model:
    list_text = await get_text(session, parser.character_list_url)

    character_urls = parser.get_character_urls_from_list(list_text)
    print(character_urls)

    model = Model()
    model.stats = parser.generate_stats(model)
    model.characters = await asyncio.gather(
        *[parse_character(parser, path_str, session, model, data.additional_data, data.urls)
          for data in character_urls])

    return model


async def parse_character(parser: Parser, path_str: str, session: ClientSession, model: Model, additional_data: any,
                          character_urls: list[str]) -> Character:
    character_texts = await asyncio.gather(*[get_text(session, url) for url in character_urls])
    result = parser.parse_character(additional_data, character_texts, model)
    result.character.imageSrc = await download_image_and_get_path(path_str, session, result.image_url)
    return result.character


async def save_model(model: Model, path_str: str):
    path = Path(path_str).joinpath(FILE_NAME)
    async with aiofiles.open(path, "w") as file:
        json_text = json.dumps(asdict(model))
        await file.write(json_text)


async def get_text(session: ClientSession, url: str) -> str:
    async with get(session, url) as result:
        return await result.text()


async def download_image_and_get_path(path_str: str, session: ClientSession, url: str) -> str:
    file_name = parse.unquote(IMAGE_NAME_REGEX.findall(url)[-1][0])
    path = Path(path_str).joinpath(file_name)
    async with get(session, url) as result:
        async with aiofiles.open(path, "wb") as file:
            await file.write(await result.read())

    return "/" + str(path)


def get(session: ClientSession, url: str) -> _BaseRequestContextManager[ClientResponse]:
    actual_url = yarl.URL(url, encoded=True)
    return session.get(actual_url, max_redirects=20, headers=HEADERS)


if __name__ == '__main__':
    asyncio.run(main())

#!/usr/bin/env python3

from typing import Optional, TypedDict
from urllib.parse import urlparse


class NetworkID (str):
    @staticmethod
    def from_address(addr: Optional[str]) -> Optional['NetworkID']:
        if addr is None:
            return None
        elif addr == '':
            return NetworkID('')
        url = urlparse(addr)
        return NetworkID(f'{url.netloc}-{url.path[1:]}')

    @staticmethod
    def as_address(id: Optional['NetworkID']) -> Optional[str]:
        if id is None:
            return None
        else:
            return id.address

    @staticmethod
    def from_str(s: Optional['str']) -> Optional['NetworkID']:
        if s is None or s == '':
            return None
        else:
            return NetworkID(s)

    @property
    def address(self) -> str:
        items = self.split('-')
        if len(items) != 2:
            raise Exception(f'invalid network id(id={self})')
        return f'btp://{items[0]}/{items[1]}'


class FeeEntryJSON(TypedDict):
    id: str
    name: str
    fees: list[str]


class FeeTableJSON(TypedDict):
    decimal: int
    symbol: str
    table: list[FeeEntryJSON]


class LinkID(TypedDict):
    src: NetworkID
    dst: NetworkID
    src_name: str
    dst_name: str


class LinkInfo(TypedDict):
    src: NetworkID
    dst: NetworkID
    src_name: str
    dst_name: str
    state: str
    tx_seq: Optional[int]
    rx_seq: Optional[int]
    tx_height: Optional[int]
    rx_height: Optional[int]
    pending_count: Optional[int]
    pending_delay: Optional[float]
    time_limit: Optional[int]
from __future__ import annotations

import io
import re
import urllib.request
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public' / 'data'
OUT.mkdir(parents=True, exist_ok=True)

SBL_URL = 'https://github.com/LogosBible/SBLGNT/archive/refs/heads/master.zip'
OSHB_URL = 'https://github.com/openscriptures/morphhb/archive/refs/heads/master.zip'

SBL_BOOKS = {
    'Matt':'MAT','Mark':'MRK','Luke':'LUK','John':'JHN','Acts':'ACT','Rom':'ROM','1Cor':'1CO','2Cor':'2CO','Gal':'GAL','Eph':'EPH','Phil':'PHP','Col':'COL','1Thess':'1TH','2Thess':'2TH','1Tim':'1TI','2Tim':'2TI','Titus':'TIT','Phlm':'PHM','Heb':'HEB','Jas':'JAS','1Pet':'1PE','2Pet':'2PE','1John':'1JN','2John':'2JN','3John':'3JN','Jude':'JUD','Rev':'REV'
}

WLC_FILES = {
    'Gen':'GEN','Exod':'EXO','Lev':'LEV','Num':'NUM','Deut':'DEU','Josh':'JOS','Judg':'JDG','Ruth':'RUT','1Sam':'1SA','2Sam':'2SA','1Kgs':'1KI','2Kgs':'2KI','1Chr':'1CH','2Chr':'2CH','Ezra':'EZR','Neh':'NEH','Esth':'EST','Job':'JOB','Ps':'PSA','Prov':'PRO','Eccl':'ECC','Song':'SNG','Isa':'ISA','Jer':'JER','Lam':'LAM','Ezek':'EZK','Dan':'DAN','Hos':'HOS','Joel':'JOL','Amos':'AMO','Obad':'OBA','Jonah':'JON','Mic':'MIC','Nah':'NAM','Hab':'HAB','Zeph':'ZEP','Hag':'HAG','Zech':'ZEC','Mal':'MAL'
}

NS = {'o':'http://www.bibletechnologies.net/2003/OSIS/namespace'}


def download_zip(url: str) -> zipfile.ZipFile:
    with urllib.request.urlopen(url) as response:
        data = response.read()
    return zipfile.ZipFile(io.BytesIO(data))


def build_sbl() -> None:
    z = download_zip(SBL_URL)
    rows: list[str] = []
    for filename, code in SBL_BOOKS.items():
        path = f'SBLGNT-master/data/sblgnt/text/{filename}.txt'
        text = z.read(path).decode('utf-8')
        for line in text.splitlines()[1:]:
            if '\t' not in line:
                continue
            ref, verse_text = line.split('\t', 1)
            match = re.match(r'^(\S+)\s+(\d+):(\d+)$', ref.strip())
            if not match:
                continue
            _, chapter, verse = match.groups()
            rows.append(f'{code} {chapter}:{verse} {verse_text.strip()}')
    (OUT / 'sblgnt_vpl.txt').write_text('\n'.join(rows) + '\n', encoding='utf-8')


def render_verse(verse: ET.Element) -> str:
    out = ''
    for child in list(verse):
        tag = child.tag.split('}')[-1]
        text = (child.text or '').replace('/', '')
        if tag == 'w':
            if out and not out.endswith('־'):
                out += ' '
            out += text
        elif tag == 'seg':
            out += text
    return out.strip()


def build_oshb() -> None:
    z = download_zip(OSHB_URL)
    rows: list[str] = []
    for filename, code in WLC_FILES.items():
        path = f'morphhb-master/wlc/{filename}.xml'
        root = ET.fromstring(z.read(path))
        for verse in root.findall('.//o:verse', NS):
            osis_id = verse.attrib.get('osisID', '')
            parts = osis_id.split('.')
            if len(parts) != 3:
                continue
            _, chapter, number = parts
            rows.append(f'{code} {chapter}:{number} {render_verse(verse)}')
    (OUT / 'oshb_wlc_vpl.txt').write_text('\n'.join(rows) + '\n', encoding='utf-8')


if __name__ == '__main__':
    build_sbl()
    build_oshb()
    print('Built', OUT / 'sblgnt_vpl.txt')
    print('Built', OUT / 'oshb_wlc_vpl.txt')
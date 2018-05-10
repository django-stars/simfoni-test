import re
from collections import namedtuple

from cleanco import cleanco

from company.models import Company, Match, RawCompany

MAX_INPUT_LENGTH = 25


SPECILA_CHARS = [
    r'\!', r'\"', r'\#', r'\$', r'\%', r'\&', r'\'', r'\(', r'\)', r'*',
    r'\+', r'\,', r'\-', r'\.', r'\/', r'\:', r'\;', r'\<', r'\=', r'\>',
    r'\?', r'\@', r'\[', r'\\', r'\]', r'\^', r'\_', r'\`', r'\{',
    r'\|', r'\}', r'\~']


# 134 unique. -> cleanco provide 306 variants
COMPANY_EXT = [
    'AB', 'AB', 'A.C.', 'ACE', 'AD', 'AE', 'AG', 'AG', 'AG', 'AL', 'AmbA',
    'ANS', 'Apb', 'ApS', 'AS', 'A/S', 'A.S.', 'A.S.', 'A.S.', 'A.S.', 'ASA',
    'AVV', 'Bpk', 'Bt', 'B.V.', 'B.V.', 'B.V.', 'BVBA', 'CA', 'Corp.',
    'C.V.', 'CVA', 'CVoA', 'DA', 'd/b/a', 'd.d.', 'd.d.', 'd.n.o.', 'd.o.o.',
    'd.o.o.', 'EE', 'EEG', 'EIRL', 'ELP', 'EOOD', 'EPE', 'EURL', 'e.V.',
    'GbR', 'GCV', 'GesmbH', 'GIE', 'GmbH', 'GmbH', 'GmbH', 'HB', 'hf', 'IBC',
    'Inc.', 'Inc', 'I/S', 'j.t.d.', 'KA/S', 'Kb', 'Kb', 'KD', 'k.d.', 'k.d.',
    'KDA', 'k.d.d.', 'Kft', 'KG', 'KG', 'KGaA', 'KK', 'Kkt', 'k.s.', 'K/S',
    'KS', 'Kv', 'Ky', 'Lda', 'LDC', 'LLC', 'LLP', 'Ltd.', 'Ltda', 'Ltée.',
    'N.A.', 'NT', 'NV', 'NV', 'NV', 'NV', 'OE', 'OHG', 'OHG', 'OOD', 'OÜ',
    'Oy', 'OYJ', 'P/L', 'PLC', 'PMA', 'PMDN', 'PrC', 'PT', 'Pty.', 'RAS',
    'Rt', 'S/A', 'SA', 'SA', 'SA', 'sa', 'SA', 'SA', 'SA', 'SA', 'SA', 'SA',
    'SA', 'S.A.', 'SAFI', 'S.A.I.C.A.', 'SApA', 'Sarl', 'Sarl', 'SAS', 'SC',
    'SC', 'S.C.', 'SCA', 'SCA', 'SCP', 'SCS', 'S.C.S.', 'SCS', 'SENC', 'SGPS',
    'SK', 'SNC', 'SNC', 'SNC', 'SNC', 'SOPARFI', 'sp', 'SpA', 'SPRL', 'Srl',
    'Srl', 'Srl', 'Srl', 'Srl', 'td', 'TLS', 'VEB', 'VOF', 'v.o.s.',
    'Kol. SrK', 'Kom. SrK', 'PC Ltd', 'Prp. Ltd.', 'Sdn Bhd', 'spol s.r.o.',
    'Sp. z.o.o.', 'A. en P.', 'S. de R.L.', 'S. en C.', 'S. en N.C.',
    'SA de CV', 'ApS & Co. K/S', 'GmbH & Co. KG'
]


def set_upper(value):
    return value.upper()


def set_title(value):
    return value.title()


def trim_spaces(value):
    return value.strip()


def remove_duplicate_spaces(value):
    return re.sub(' +', ' ', value)


def remove_special_characters(value):
    return re.sub("[{}]".format("".join(SPECILA_CHARS)), ' ', value)


def remove_corporate_cleanco(value):
    return cleanco(value).clean_name()


def remove_corporate_own(value):
    return re.sub("[{}]".format("".join(COMPANY_EXT)), '', value)


def remove_cp_and_friends(value):
    return value.replace('(CP)', '').replace('C0', 'CO')


def guess_ending(value):
    if len(value) == MAX_INPUT_LENGTH:
        if value.endswith(" C"):
            value = "{}O".format(value)
        elif value.endswith(" I"):
            value = "{}NC".format(value)
        elif value.endswith(" IN"):
            value = "{}C".format(value)
    return value


def remove_the(value):
    return re.sub('^the ', '', value, flags=re.U | re.I)


PIPELINE = [
    set_upper, guess_ending, trim_spaces, remove_the, remove_duplicate_spaces,
    remove_cp_and_friends, remove_special_characters, remove_corporate_cleanco,
    remove_corporate_cleanco,
    trim_spaces, remove_duplicate_spaces, set_title,
]


def process(value):
    for step in PIPELINE:
        value = step(value)
    return value


def match(processed_names):
    for current_name in processed_names:
        # get list of similar names
        names_to_match = []
        for name_info in processed_names:
            # check is this name is similar
            # Actually all code above could be done in 1 cycle but it's less readable.
            if all(part in name_info.parts for part in current_name.parts):
                # similar, need to determine correct order info.
                matched_words = tuple(part for part in name_info.parts if part in current_name.parts)
                correct_order = matched_words == current_name.parts
                names_to_match.append(MatchInfo(
                    name_info=name_info, matched_words=matched_words, is_correct_order=correct_order)
                )

        # calculate score & create Match object
        for match_info in names_to_match:
            score = get_score(current_name, match_info)
            Match.objects.create(
                score=score,
                correct_order=match_info.is_correct_order,
                company=Company.objects.get(name=match_info.name_info.name),
                raw_company=RawCompany.objects.get(name=match_info.name_info.raw_name),
            )


def get_score(name, match_info):
    if name == match_info.name_info.name:
        return 100
    else:
        matched_words = len(match_info.matched_words)
        all_words = len(match_info.name_info.parts)
        return (matched_words / all_words) * 100


MatchInfo = namedtuple('MatchInfo', ['name_info', 'matched_words', 'is_correct_order'])
NameInfo = namedtuple('NameInfo', ['name', 'raw_name', 'parts'])


def match_companies(raw_companies):
    """
    For each cleaned name we create a Company.
    When user accepts or decline Match suggestion - the Companies without any match are removed.
    """
    processed_names = {}
    for raw_company in raw_companies:
        processed_name = process(raw_company.name)
        if processed_name not in processed_names.keys():
            processed_names[processed_name] = NameInfo(
                name=processed_name, raw_name=raw_company.name, parts=tuple(processed_name.split(' '))
            )

    # populate db with all unique companies
    # to use bulk insert we need to ensure manually that db doesn't contain rows which we plan to insert
    companies_in_db = set(Company.objects.all().values_list('name', flat=True))
    Company.objects.bulk_create(
        Company(name=processed_name) for
        processed_name in processed_names.keys() if processed_name not in companies_in_db
    )

    # create Match objects
    match(processed_names.values())

    # collect statistic
    #duplicates = len(raw_companies) - len(processed_names)
    #normalized


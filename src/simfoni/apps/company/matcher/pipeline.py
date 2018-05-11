import re

from cleanco import cleanco


MAX_INPUT_LENGTH = 25


SPECIAL_CHARS = [
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
    return re.sub("[{}]".format("".join(SPECIAL_CHARS)), ' ', value)


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
    trim_spaces, remove_duplicate_spaces, set_title,
]


def process(value):
    # TODO: switch to pandas for performance boost
    for step in PIPELINE:
        value = step(value)
    return value

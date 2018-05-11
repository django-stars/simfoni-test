import re

from cleanco import cleanco


MAX_INPUT_LENGTH = 25


SPECIAL_CHARS = [
    r'\!', r'\"', r'\#', r'\$', r'\%', r'\&', r'\'', r'\(', r'\)', r'*',
    r'\+', r'\,', r'\-', r'\.', r'\/', r'\:', r'\;', r'\<', r'\=', r'\>',
    r'\?', r'\@', r'\[', r'\\', r'\]', r'\^', r'\_', r'\`', r'\{',
    r'\|', r'\}', r'\~']


# from provided file, 134 unique. -> cleanco provide 306 variants
COMPANY_EXT = [
    'sp', 'e.V.', 'AL', 'PMA', 'SPRL', 'ASA', 'ACE', 'S.C.S.', 'Bt', 'SCP', 'GIE', 'OÜ', 'IBC', 'EOOD',
    'SCA', 'RAS', 'LLC', 'I/S', 'Ltd.', 'd.o.o.', 'OYJ', 'TLS', 'AD', 'EEG', 'LDC', 'B.V.', 'GbR', 'NV',
    'Ky', 'NT', 'SApA', 'EIRL', 'A. en P.', 'LLP', 'VOF', 'S.A.I.C.A.', 'ELP', 'Bpk', 'Pty.', 'd.n.o.',
    'td', 'Apb', 'ANS', 'SOPARFI', 'SpA', 'CVoA', 'SAS', 'S. en C.', 'P/L', 'A.S.', 'k.d.d.', 'Ltda',
    'EPE', 'Kv', 'Srl', 'Oy', 'PC Ltd', 'Kkt', 'S.A.', 'hf', 'Inc', 'PT', 'SENC', 'd.d.', 'Inc.', 'EURL',
    'PMDN', 'k.s.', 'A/S', 'AVV', 'DA', 'KA/S', 'OHG', 'S.C.', 'AB', 'KGaA', 'AmbA', 'KK', 'PrC', 'VEB',
    'S. de R.L.', 'KG', 'K/S', 'AE', 'j.t.d.', 'Kol. SrK', 'Sarl', 'sa', 'Sdn Bhd', 'AS', 'Prp. Ltd.', 'CA',
    'Corp.', 'PLC', 'S. en N.C.', 'SCS', 'SA', 'GCV', 'CVA', 'SK', 'SAFI', 'GmbH', 'KDA', 'EE', 'v.o.s.',
    'ApS', 'Lda', 'spol s.r.o.', 'N.A.', 'SGPS', 'S/A', 'Kom. SrK', 'GmbH & Co. KG', 'A.C.', 'Kft', 'KD',
    'Sp. z.o.o.', 'BVBA', 'k.d.', 'd/b/a', 'Kb', 'KS', 'C.V.', 'SA de CV', 'ApS & Co. K/S', 'AG', 'SC',
    'HB', 'OOD', 'Ltée.', 'GesmbH', 'SNC', 'OE', 'Rt',
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

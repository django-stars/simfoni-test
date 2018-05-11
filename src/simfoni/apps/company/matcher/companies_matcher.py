from collections import namedtuple

from company.matcher.pipeline import process
from company.models import Company, Match


MatchInfo = namedtuple('MatchInfo', ['name_info', 'matched_words', 'is_correct_order'])
NameInfo = namedtuple('NameInfo', ['name', 'raw_company', 'parts'])


def _match(processed_names, companies_cache):
    matches = []  # collect objects for bulk_create
    for current_name_info in processed_names:
        # get list of similar names
        names_to_match = []
        for name_info in processed_names:
            # check is this name is similar. If we find at least 1 common word - we build a match.
            if any(part in name_info.parts for part in current_name_info.parts):
                # similar, need to determine correct order info.
                matched_words = tuple(part for part in name_info.parts if part in current_name_info.parts)
                correct_order = matched_words == current_name_info.parts or len(matched_words) == 1
                names_to_match.append(MatchInfo(
                    name_info=name_info, matched_words=matched_words, is_correct_order=correct_order)
                )

        # calculate score & create Match object
        for match_info in names_to_match:
            score = _get_score(current_name_info, match_info)
            matches.append(Match(
                score=score,
                correct_order=match_info.is_correct_order,
                company=companies_cache[current_name_info.name],
                raw_company=match_info.name_info.raw_company,
            ))

    Match.objects.bulk_create(matches)


def _get_score(current_name_info, match_info):
    if current_name_info.name == match_info.name_info.name:
        return 100
    else:
        matched_words = len(match_info.matched_words)
        # pick the biggest length, so 'American Stainless Tubing' with 'STAINLESS' will give 33.33% (instead of 100)
        match_words = len(match_info.name_info.parts)
        current_words = len(current_name_info.parts)
        all_words = match_words if match_words > current_words else current_words

        return (matched_words / all_words) * 100


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
                name=processed_name, raw_company=raw_company, parts=tuple(processed_name.split(' '))
            )

    # populate db with all unique companies
    # to use bulk insert we need to ensure manually that db doesn't contain rows which we plan to insert
    companies_in_db = set(Company.objects.all().values_list('name', flat=True))

    Company.objects.bulk_create(
        Company(name=processed_name) for
        processed_name in processed_names.keys() if processed_name not in companies_in_db
    )
    # greatly speed up Match creation reducing amount of queries via caching
    companies_cache = {company.name: company for company in Company.objects.all()}

    # create Match objects
    _match(processed_names.values(), companies_cache)

    # update is_completed info for companies which already were in db
    Company.objects.filter(is_completed=True, matches__is_accepted=False).update(is_completed=False)

    # collect statistic
    processed_names_count = len(processed_names.keys())
    return {
        'normalized': processed_names_count,
    }

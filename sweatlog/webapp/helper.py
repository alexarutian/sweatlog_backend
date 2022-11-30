from datetime import datetime
from datetime import date


# takes a python date object
def date_to_json_string(d):
    # combines passed in date with essentially midnight
    dt = datetime.combine(d, datetime.min.time())
    # returns particularly formatted date - rFC3339
    # return dt.strftime("%Y-%m-%dT%H:%M:%SZ")
    return dt.isoformat()

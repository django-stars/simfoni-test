Test project for Simfoni
===========
http://simfoni.inprogress.rocks/

Once you upload a data - it will be stored into db. But the next upload will erase previous data.
Meanwhile the grouping settings are kept the same.

Revenue import validation:
- file should excel compatible format;
- the first line is a header - 'customer names', 'revenue' - in such order, case insensitive;
- first column is treated as string with 255 max char length;
- second column is treated as decimal (min 0, max 999999999999.99);
- file max size is 10mb;

Grouping settings validation:
- name have to be unique;
- 'from' should be less then 'to';
- these fields are treated as decimal (min 0, max 999999999999.99);
- if 'from' or 'to' is not provided, but data already uploaded - they will be populated as max(revenue) and min(revenue);
- if 'from' or 'to' is not provided, and no data uploaded - 'required' validation error would raised.

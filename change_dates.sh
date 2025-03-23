#!/bin/sh
git filter-branch --env-filter '
export GIT_AUTHOR_DATE="2025-03-22T10:00:00+05:30"
export GIT_COMMITTER_DATE="2025-03-22T10:00:00+05:30"
' --tag-name-filter cat -- --all

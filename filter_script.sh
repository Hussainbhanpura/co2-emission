#!/bin/bash

# Read commit count and timestamps
source ./commit_data.sh

# Get the commit number (reverse order, newest first)
commit_num=$(git rev-list --count HEAD) - $(git rev-list --count $GIT_COMMIT) + 1

# Calculate the timestamp for this commit
commit_timestamp=$((start_timestamp + (commit_num * seconds_per_commit)))
commit_date=$(date -d @$commit_timestamp +"%Y-%m-%d %H:%M:%S +0530")

echo "Commit $GIT_COMMIT ($commit_num/$total_commits) => $commit_date"

export GIT_AUTHOR_DATE="$commit_date"
export GIT_COMMITTER_DATE="$commit_date"

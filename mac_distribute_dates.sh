#!/bin/bash

# Get the total number of commits
total_commits=$(git rev-list --count HEAD)
echo "Total commits: $total_commits"

# Calculate time increment in seconds
# From March 22, 12:00 PM to March 23, 4:00 AM = 16 hours = 57600 seconds
start_timestamp=$(date -j -f "%Y-%m-%d %H:%M:%S" "2025-03-22 12:00:00" "+%s")
end_timestamp=$(date -j -f "%Y-%m-%d %H:%M:%S" "2025-03-23 04:00:00" "+%s")
time_range=$((end_timestamp - start_timestamp))
seconds_per_commit=$((time_range / (total_commits - 1)))

echo "Start time: $(date -j -f "%s" "$start_timestamp" "+%Y-%m-%d %H:%M:%S")"
echo "End time: $(date -j -f "%s" "$end_timestamp" "+%Y-%m-%d %H:%M:%S")"
echo "Time range: $time_range seconds"
echo "Seconds per commit: $seconds_per_commit"

# Create a temporary directory for our filter-branch operation
mkdir -p /tmp/git-filter

# Export variables for the filter script
export GIT_START_TIMESTAMP=$start_timestamp
export GIT_SECONDS_PER_COMMIT=$seconds_per_commit
export GIT_TOTAL_COMMITS=$total_commits

# Create the filter-branch script
cat > /tmp/git-filter/filter_script.sh << 'INNEREOF'
#!/bin/bash

# Get the commit number (oldest first)
commit_position=$(git rev-list --count $GIT_COMMIT)

# Calculate the timestamp for this commit
timestamp=$((GIT_START_TIMESTAMP + ((GIT_TOTAL_COMMITS - commit_position) * GIT_SECONDS_PER_COMMIT)))
formatted_date=$(date -j -f "%s" "$timestamp" "+%Y-%m-%d %H:%M:%S +0530")

echo "Processing commit $GIT_COMMIT ($commit_position/$GIT_TOTAL_COMMITS) => $formatted_date"

export GIT_AUTHOR_DATE="$formatted_date"
export GIT_COMMITTER_DATE="$formatted_date"
INNEREOF

chmod +x /tmp/git-filter/filter_script.sh

# Run filter-branch
git filter-branch -f --env-filter '. /tmp/git-filter/filter_script.sh' --tag-name-filter cat -- --all

# Clean up
rm -rf /tmp/git-filter

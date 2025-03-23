#!/bin/bash

# Get the total number of commits
total_commits=$(git rev-list --count HEAD)
echo "Total commits: $total_commits"

# Calculate time increment in seconds
# From March 22, 12:00 PM to March 23, 4:00 AM = 16 hours = 57600 seconds
# Divide by number of commits to get seconds per commit
start_timestamp=$(date -d "2025-03-22 12:00:00 +0530" +%s)
end_timestamp=$(date -d "2025-03-23 04:00:00 +0530" +%s)
time_range=$((end_timestamp - start_timestamp))
seconds_per_commit=$((time_range / total_commits))

echo "Start time: $(date -d @$start_timestamp)"
echo "End time: $(date -d @$end_timestamp)"
echo "Time range: $time_range seconds"
echo "Seconds per commit: $seconds_per_commit"

# Create the filter-branch script
cat > filter_script.sh << 'INNEREOF'
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
INNEREOF

chmod +x filter_script.sh

# Create data file for the filter script
cat > commit_data.sh << EOF
total_commits=$total_commits
start_timestamp=$start_timestamp
seconds_per_commit=$seconds_per_commit

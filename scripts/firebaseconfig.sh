#!/bin/bash

# Usage: ./script.sh KEY1=VALUE1 KEY2=VALUE2 ...


# Check if at least one argument is provided
if [ "$#" -eq 0 ]; then
    echo "Usage: $0 KEY1=VALUE1 [KEY2=VALUE2 ...]"
    exit 1
fi

# Start the TypeScript file
echo "export const firebaseConfig = {"

# Loop through all arguments
for input in "$@"; do
    key="${input%%=*}"
    value="${input#*=}"
    echo "  $key: \"$value\","
done

# Close the object
echo "};"
#!/bin/bash

# Usage: Just run the script; it will use environment variables

# List of required Firebase config environment variables
# List of required Firebase config environment variables (read from ENV)
VARS=("API_KEY" "AUTH_DOMAIN" "PROJECT_ID" "STORAGE_BUCKET" "MESSAGING_SENDER_ID" "APP_ID", "MEASUREMENT_ID")

# Start the TypeScript file
echo "export const firebaseConfig = {"

# Output each variable if set
for key in "${VARS[@]}"; do
    value="${!key}"
    echo "  $key: \"${value//\"/\\\"}\","
done

# Close the object
echo "};"

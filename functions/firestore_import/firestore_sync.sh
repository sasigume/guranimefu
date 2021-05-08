# https://medium.com/firebase-developers/how-to-import-production-data-from-cloud-firestore-to-the-local-emulator-e82ae1c6ed8
# Stop following command execution if command before failed
set -e

# Remove previous bucket if exists
delete_previous_version_if_exists() {
  rm -r ./exported_for_local_development &&
  gsutil -m rm -r gs://guranimefu.appspot.com/exported_for_local_development ||
  gsutil -m rm -r gs://guranimefu.appspot.com/exported_for_local_development
}

export_production_firebase_to_emulator() {
  gcloud firestore export gs://guranimefu.appspot.com/exported_for_local_development
  
  gsutil -m cp -r gs://guranimefu.appspot.com/exported_for_local_development .
}

delete_previous_version_if_exists && export_production_firebase_to_emulator ||
export_production_firebase_to_emulator
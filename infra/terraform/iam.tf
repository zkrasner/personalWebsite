# Service account for sync function (read/write to books bucket)
resource "google_service_account" "sync" {
  account_id   = "bookshelf-sync"
  display_name = "Bookshelf Sync Function"
}

resource "google_storage_bucket_iam_member" "sync_writer" {
  bucket = google_storage_bucket.books_data.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.sync.email}"
}

# Service account for read function (read-only to books bucket)
resource "google_service_account" "read" {
  account_id   = "bookshelf-read"
  display_name = "Bookshelf Read Function"
}

resource "google_storage_bucket_iam_member" "read_viewer" {
  bucket = google_storage_bucket.books_data.name
  role   = "roles/storage.objectViewer"
  member = "serviceAccount:${google_service_account.read.email}"
}

# Allow Cloud Scheduler to invoke the sync function
resource "google_cloud_run_v2_service_iam_member" "scheduler_invoker" {
  project  = var.project_id
  location = var.region
  name     = google_cloudfunctions2_function.sync.name
  role     = "roles/run.invoker"
  member   = "serviceAccount:${google_service_account.scheduler.email}"
}

resource "google_service_account" "scheduler" {
  account_id   = "bookshelf-scheduler"
  display_name = "Bookshelf Scheduler"
}

# Allow unauthenticated access to read function
resource "google_cloud_run_v2_service_iam_member" "read_public" {
  project  = var.project_id
  location = var.region
  name     = google_cloudfunctions2_function.read.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

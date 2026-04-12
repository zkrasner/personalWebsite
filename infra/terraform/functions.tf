# --- Sync function source upload ---

resource "google_storage_bucket_object" "sync_source" {
  name   = "sync-${filemd5("${path.module}/../sync.zip")}.zip"
  bucket = google_storage_bucket.function_source.name
  source = "${path.module}/../sync.zip"
}

resource "google_cloudfunctions2_function" "sync" {
  name     = "bookshelf-sync"
  location = var.region

  depends_on = [google_project_service.apis["cloudfunctions.googleapis.com"]]

  build_config {
    runtime     = "nodejs20"
    entry_point = "syncBooks"

    source {
      storage_source {
        bucket = google_storage_bucket.function_source.name
        object = google_storage_bucket_object.sync_source.name
      }
    }
  }

  service_config {
    available_memory   = "256Mi"
    timeout_seconds    = 60
    min_instance_count = 0
    max_instance_count = 1
    ingress_settings   = "ALLOW_INTERNAL_ONLY"

    service_account_email = google_service_account.sync.email

    environment_variables = {
      BUCKET_NAME = google_storage_bucket.books_data.name
    }
  }
}

# --- Read function source upload ---

resource "google_storage_bucket_object" "read_source" {
  name   = "read-${filemd5("${path.module}/../read.zip")}.zip"
  bucket = google_storage_bucket.function_source.name
  source = "${path.module}/../read.zip"
}

resource "google_cloudfunctions2_function" "read" {
  name     = "bookshelf-read"
  location = var.region

  depends_on = [google_project_service.apis["cloudfunctions.googleapis.com"]]

  build_config {
    runtime     = "nodejs20"
    entry_point = "readBooks"

    source {
      storage_source {
        bucket = google_storage_bucket.function_source.name
        object = google_storage_bucket_object.read_source.name
      }
    }
  }

  service_config {
    available_memory   = "128Mi"
    timeout_seconds    = 10
    min_instance_count = 0
    max_instance_count = 3

    service_account_email = google_service_account.read.email

    environment_variables = {
      BUCKET_NAME     = google_storage_bucket.books_data.name
      ALLOWED_ORIGINS = var.allowed_origins
    }
  }
}

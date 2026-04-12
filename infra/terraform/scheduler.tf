resource "google_cloud_scheduler_job" "sync_books" {
  name     = "bookshelf-sync-nightly"
  schedule = "0 3 * * *"
  time_zone = "America/New_York"

  depends_on = [google_project_service.apis["cloudscheduler.googleapis.com"]]

  http_target {
    uri         = google_cloudfunctions2_function.sync.url
    http_method = "POST"

    oidc_token {
      service_account_email = google_service_account.scheduler.email
      audience              = google_cloudfunctions2_function.sync.url
    }
  }

  retry_config {
    retry_count = 1
  }
}

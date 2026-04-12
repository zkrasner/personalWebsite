output "read_function_url" {
  description = "URL of the read API Cloud Function"
  value       = google_cloudfunctions2_function.read.url
}

output "sync_function_url" {
  description = "URL of the sync Cloud Function"
  value       = google_cloudfunctions2_function.sync.url
}

output "books_bucket_name" {
  description = "Name of the GCS bucket storing books.json"
  value       = google_storage_bucket.books_data.name
}

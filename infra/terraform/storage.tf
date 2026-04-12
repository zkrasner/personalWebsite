resource "google_storage_bucket" "books_data" {
  name     = "${var.project_id}-books-data"
  location = var.region

  uniform_bucket_level_access = true
  public_access_prevention    = "enforced"

  versioning {
    enabled = true
  }
}

resource "google_storage_bucket" "function_source" {
  name     = "${var.project_id}-function-source"
  location = var.region

  uniform_bucket_level_access = true
  public_access_prevention    = "enforced"
}

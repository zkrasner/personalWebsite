terraform {
  required_version = ">= 1.5"

  backend "gcs" {
    bucket = "zkrasner-tf-state"
    prefix = "personal-website"
  }

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_project_service" "apis" {
  for_each = toset([
    "cloudfunctions.googleapis.com",
    "cloudscheduler.googleapis.com",
    "storage.googleapis.com",
    "cloudbuild.googleapis.com",
    "run.googleapis.com",
    "artifactregistry.googleapis.com",
  ])

  service            = each.value
  disable_on_destroy = false
}

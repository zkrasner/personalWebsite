# Bookshelf Backend

Nightly pipeline that syncs reading data from Goodreads into a GCS bucket, served to the frontend via a Cloud Function API.

## Architecture

```
Cloud Scheduler (3 AM ET) → Sync Cloud Function → GCS bucket (books.json)
                                                          ↑
Bookshelf page (client fetch) → Read Cloud Function ──────┘
```

All infrastructure is managed via Terraform in `infra/terraform/`.

## GCP Project Setup

<details>
<summary>One-time bootstrap (manual)</summary>

1. Create a GCP project and enable billing
2. Create a GCS bucket for Terraform state: `gsutil mb gs://zkrasner-tf-state`
3. Set up Workload Identity Federation for GitHub Actions ([guide](https://github.com/google-github-actions/auth#workload-identity-federation))
4. Add GitHub secrets:
   - `GCP_PROJECT_ID` — your project ID
   - `GCP_WORKLOAD_IDENTITY_PROVIDER` — WIF provider resource name
   - `GCP_SERVICE_ACCOUNT` — service account email for CI/CD
5. Run `make tf-init` then `make tf-apply` locally for the first deploy

</details>

## Commands

| Command              | Description                                                 |
| -------------------- | ----------------------------------------------------------- |
| `make fn-build`      | Build both Cloud Function zips                              |
| `make fn-build-sync` | Build sync function only                                    |
| `make fn-build-read` | Build read function only                                    |
| `make sync-books`    | Run sync locally (needs `BUCKET_NAME` env var and GCP auth) |
| `make tf-init`       | Initialize Terraform                                        |
| `make tf-plan`       | Preview infrastructure changes                              |
| `make tf-apply`      | Apply infrastructure changes                                |

## Local Development

1. Copy `.env.local.example` to `.env.local`
2. Set `NEXT_PUBLIC_BOOKS_API_URL=http://localhost:8080` (or point to deployed function URL)
3. Run `make dev`

## Environment Variables

### Cloud Functions

- `BUCKET_NAME` — GCS bucket name (set by Terraform)
- `ALLOWED_ORIGINS` — comma-separated CORS origins (set by Terraform)

### Frontend

- `NEXT_PUBLIC_BOOKS_API_URL` — read function URL (set in `.env.production`)

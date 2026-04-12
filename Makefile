.PHONY: dev build lint test tf-init tf-plan tf-apply tf-destroy fn-build fn-build-sync fn-build-read sync-books upload-overrides

# --- Frontend ---

dev:
	npm run dev

build:
	npm run build

lint:
	npm run lint

# --- Infrastructure ---

tf-init:
	cd infra/terraform && terraform init

tf-plan:
	cd infra/terraform && terraform plan

tf-apply:
	cd infra/terraform && terraform apply

tf-destroy:
	cd infra/terraform && terraform destroy

# --- Cloud Functions ---

fn-build: fn-build-sync fn-build-read

fn-build-sync:
	cd infra/functions/sync && \
		rm -rf dist shared && \
		cp -r ../shared shared && \
		npm install && \
		npx tsc && \
		node -e "const p=require('./package.json'); delete p.scripts; delete p.devDependencies; p.main='index.js'; require('fs').writeFileSync('dist/package.json',JSON.stringify(p,null,2))" && \
		cd dist && npm install --omit=dev && \
		zip -r ../../../sync.zip .

fn-build-read:
	cd infra/functions/read && \
		rm -rf dist shared && \
		cp -r ../shared shared && \
		npm install && \
		npx tsc && \
		node -e "const p=require('./package.json'); delete p.scripts; delete p.devDependencies; p.main='index.js'; require('fs').writeFileSync('dist/package.json',JSON.stringify(p,null,2))" && \
		cd dist && npm install --omit=dev && \
		zip -r ../../../read.zip .

sync-books:
	cd infra/functions/sync && \
		cp -r ../shared shared && \
		BUCKET_NAME=$${BUCKET_NAME:-} npx tsx index.ts; \
		rm -rf shared

upload-overrides:
	gcloud storage cp data/book-overrides.json gs://$${BUCKET_NAME:-zkrasnerwebsite-books-data}/overrides.json

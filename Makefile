# ---------- Config ----------
TRIVY_IMAGE ?= aquasec/trivy:0.71.1
# Pin to an immutable digest for supply-chain safety (recommended for CI):
#   docker pull aquasec/trivy:0.71.0
#   docker inspect --format='{{index .RepoDigests 0}}' aquasec/trivy:0.71.0
# Then set:  TRIVY_IMAGE ?= aquasec/trivy:0.71.0@sha256:abc123...
TRIVY_CACHE = $(HOME)/.trivy
TARGET ?= .                         # default folder to scan
REPORT_DIR = $(PWD)/trivy-reports

# Scan scope
TRIVY_SKIP_DIRS ?= .git,node_modules,coverage,demo/dist,trivy-reports
TRIVY_VULN_TYPE ?= os,library       # os | library | os,library
TRIVY_SEVERITIES ?= CRITICAL,HIGH,MEDIUM,LOW
TRIVY_IGNORE_UNFIXED ?= true        # skip vulnerabilities without a fix
TRIVY_CI_SEVERITIES ?= CRITICAL,HIGH

# Base args shared across all fs scans
TRIVY_FS_ARGS = \
	--skip-dirs $(TRIVY_SKIP_DIRS) \
	--vuln-type $(TRIVY_VULN_TYPE) \
	--severity $(TRIVY_SEVERITIES)

# ---------- DB update ----------
trivy-db-update:
	@echo "Updating Trivy vulnerability DB (cache: $(TRIVY_CACHE))"
	docker run --rm \
		-v $(TRIVY_CACHE):/root/.cache/trivy \
		$(TRIVY_IMAGE) image \
		--cache-dir /root/.cache/trivy --download-db-only
	@echo "Done."

# ---------- Report dir ----------
$(REPORT_DIR):
	mkdir -p $@

$(TRIVY_CACHE):
	mkdir -p $@

# ---------- Helper for safe base name ----------
NORMALIZED_TARGET := $(patsubst %/,%,$(strip $(TARGET)))
BASE_NAME := $(notdir $(NORMALIZED_TARGET))
ifeq ($(BASE_NAME),)
BASE_NAME := $(notdir $(CURDIR))
endif
ifeq ($(BASE_NAME),.)
BASE_NAME := $(notdir $(CURDIR))
endif

# ---------- Common docker run wrapper ----------
# Escaped so the shell expands $(TRIVY_FS_ARGS) at invocation time.
TRIVY_RUN = docker run --rm \
	-v $(PWD):/app \
	-v $(TRIVY_CACHE):/root/.cache/trivy \
	$(TRIVY_IMAGE) fs \
	$(TRIVY_FS_ARGS)

# ---------- Scans ----------
# Basic scan (vulnerabilities only)
trivy: $(TRIVY_CACHE) | trivy-db-update
	$(TRIVY_RUN) --scanners vuln /app/$(TARGET)

# Fast scan (vuln + misconfig, skip secrets)
trivy-fast: $(TRIVY_CACHE) | trivy-db-update
	$(TRIVY_RUN) --scanners vuln,misconfig /app/$(TARGET)

# Full scan: all scanners + JSON + SARIF reports
trivy-full: $(REPORT_DIR) $(TRIVY_CACHE) | trivy-db-update
	@echo "Scanning $(TARGET)..."
	$(TRIVY_RUN) \
		--scanners license,vuln,secret,misconfig \
		--include-dev-deps \
		-f json -o /app/trivy-reports/trivy-$(BASE_NAME).json \
		/app/$(TARGET)
	$(TRIVY_RUN) \
		--scanners vuln,secret,misconfig \
		--include-dev-deps \
		-f sarif -o /app/trivy-reports/trivy-$(BASE_NAME).sarif \
		/app/$(TARGET)
	@echo "Reports saved in $(REPORT_DIR)"

# SARIF-only output (consumable by github/codeql-action/upload-sarif)
trivy-sarif: $(REPORT_DIR) $(TRIVY_CACHE) | trivy-db-update
	$(TRIVY_RUN) \
		--scanners vuln,secret,misconfig \
		-f sarif -o /app/trivy-reports/trivy-$(BASE_NAME).sarif \
		/app/$(TARGET)
	@echo "SARIF: $(REPORT_DIR)/trivy-$(BASE_NAME).sarif"

# SBOM generation (CycloneDX format)
trivy-sbom: $(REPORT_DIR) $(TRIVY_CACHE) | trivy-db-update
	$(TRIVY_RUN) \
		--scanners vuln \
		--format cyclonedx \
		--output /app/trivy-reports/trivy-$(BASE_NAME).sbom.json \
		/app/$(TARGET)
	@echo "SBOM: $(REPORT_DIR)/trivy-$(BASE_NAME).sbom.json"

# CI gate: exit code 1 if fixable vulnerabilities found at configured severity
trivy-ci: $(TRIVY_CACHE) | trivy-db-update
	$(TRIVY_RUN) \
		--scanners vuln \
		--severity $(TRIVY_CI_SEVERITIES) \
		--ignore-unfixed \
		--exit-code 1 \
		/app/$(TARGET)

# Purge Trivy cache (e.g. after a corrupted DB)
trivy-cache-clean:
	@echo "Clearing Trivy cache at $(TRIVY_CACHE)..."
	rm -rf $(TRIVY_CACHE)/*
	@echo "Done."

# ---------- Help ----------
help:
	@echo "Usage: make <target> [TARGET=folder] [VAR=value]"
	@echo ""
	@echo "Targets:"
	@echo "  trivy          - basic scan (vulnerabilities only)"
	@echo "  trivy-fast     - fast scan (vuln + misconfig, skip secrets)"
	@echo "  trivy-full     - full scan (license, vuln, secret, misconfig) + JSON/SARIF reports"
	@echo "  trivy-sarif    - SARIF-only output (for GitHub code scanning upload)"
	@echo "  trivy-sbom     - SBOM generation (CycloneDX format)"
	@echo "  trivy-ci       - CI gate (exit 1 if fixable vulns above threshold)"
	@echo "  trivy-db-update    - update Trivy vulnerability DB in cache"
	@echo "  trivy-cache-clean  - purge Trivy cache"
	@echo ""
	@echo "Key variables (all optional):"
	@echo "  TARGET=folder            - folder to scan (default: .)"
	@echo "  TRIVY_SEVERITIES=...     - severities for scan (default: CRITICAL,HIGH,MEDIUM,LOW)"
	@echo "  TRIVY_CI_SEVERITIES=...  - severities for CI gate (default: CRITICAL,HIGH)"
	@echo "  TRIVY_IGNORE_UNFIXED=... - skip unfixed vulns (default: true)"
	@echo "  TRIVY_SKIP_DIRS=...      - comma-separated dirs to exclude"
	@echo "  TRIVY_VULN_TYPE=...      - os, library, or os,library (default: os,library)"
	@echo "  TRIVY_IMAGE=...          - image tag or digest (default: aquasec/trivy:0.71.0)"
	@echo ""
	@echo "Examples:"
	@echo "  make trivy-ci TRIVY_CI_SEVERITIES=CRITICAL"
	@echo "  make trivy-sarif TARGET=packages/scrollspy"
	@echo "  make trivy-sbom"

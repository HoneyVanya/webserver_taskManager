
# We start with a stable Debian image that comes with more tools pre-installed.
FROM debian:stable-slim

# Install the necessary SSH tools. Debian's package manager (apt-get)
# ensures that all dependencies and libraries are version-compatible.
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    openssh-client \
    && rm -rf /var/lib/apt/lists/*
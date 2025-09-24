FROM debian:stable-slim

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    openssh-client \
    coreutils \
    && rm -rf /var/lib/apt/lists/*
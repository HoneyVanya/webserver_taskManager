FROM debian:stable-slim

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    openssh-client \
    && rm -rf /var/lib/apt/lists/*
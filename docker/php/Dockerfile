FROM php:8.4-cli

# System dependencies + libaio symlink (Trixie ships libaio.so.1t64)
RUN apt-get update && apt-get install -y \
    libaio1t64 \
    wget \
    unzip \
    git \
    zip \
    libzip-dev \
    && ln -sf /usr/lib/aarch64-linux-gnu/libaio.so.1t64 /usr/lib/aarch64-linux-gnu/libaio.so.1 \
    && docker-php-ext-install zip \
    && rm -rf /var/lib/apt/lists/*

# Oracle Instant Client (ARM64)
ENV ORACLE_HOME=/opt/oracle/instantclient
ENV LD_LIBRARY_PATH=/opt/oracle/instantclient

RUN mkdir -p /opt/oracle && cd /opt/oracle \
    && wget -q https://download.oracle.com/otn_software/linux/instantclient/2340000/instantclient-basic-linux.arm64-23.4.0.24.05.zip \
    && wget -q https://download.oracle.com/otn_software/linux/instantclient/2340000/instantclient-sdk-linux.arm64-23.4.0.24.05.zip \
    && unzip -o instantclient-basic-linux.arm64-23.4.0.24.05.zip \
    && unzip -o instantclient-sdk-linux.arm64-23.4.0.24.05.zip \
    && mv instantclient_23_4 instantclient \
    && rm -f *.zip \
    && echo /opt/oracle/instantclient > /etc/ld.so.conf.d/oracle.conf \
    && ldconfig

# Install OCI8 and PDO_OCI via PECL (not bundled in PHP 8.4+)
RUN echo "instantclient,/opt/oracle/instantclient" | pecl install oci8 \
    && docker-php-ext-enable oci8

RUN echo "instantclient,/opt/oracle/instantclient" | pecl install pdo_oci \
    && docker-php-ext-enable pdo_oci

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

EXPOSE 8000

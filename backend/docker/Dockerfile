FROM ruby:3.3.0
ARG OPENAPI_VERSION=6.6.0
ARG bundler_version=2.5.6

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    git \
    vim \
    libpq-dev \
    openssh-server \
    build-essential \
    wget \
    postgresql-client \
    # for openapi
    openjdk-17-jre-headless \
    && rm -rf /var/lib/apt/lists/*

# Install a quick colorized prompt and turn on ls coloring
RUN git clone https://github.com/nojhan/liquidprompt.git ~/liquidprompt && \
    echo '[[ $- = *i* ]] && source ~/liquidprompt/liquidprompt' >>~/.bashrc && \
    mkdir -p ~/.config && \
    echo 'export LP_HOSTNAME_ALWAYS=1' >>~/.config/liquidpromptrc && \
    echo 'export LP_USER_ALWAYS=-1' >>~/.config/liquidpromptrc && \
    sed -i "/color=auto/"' s/# //' ~/.bashrc && \
    sed -i "/alias ls/,/lA/"' s/# //' ~/.bashrc

WORKDIR /code/backend
COPY . /code

RUN gem install bundler --no-document --version $bundler_version && \
    bundle config set path /gems && \
    bundle config set no-cache 'true' && \
    bundle config set silence_root_warning 'true' && \
    bundle update --bundler && \
    bundle install && \
    bundle binstubs --all && \
    echo 'export PATH=/code/backend/bin:$PATH' >> ~/.bashrc

### openapi-codegen
RUN mkdir /usr/lib/openapi-codegen && \
  wget -q https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/${OPENAPI_VERSION}/openapi-generator-cli-${OPENAPI_VERSION}.jar -O \
 /usr/lib/openapi-codegen/openapi-codegen-cli.jar && \
  echo "java -jar /usr/lib/openapi-codegen/openapi-codegen-cli.jar \$@" > /usr/bin/openapi-generator && \
  chmod a+x /usr/bin/openapi-generator

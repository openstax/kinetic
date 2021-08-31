FROM ruby:3.0.1

ARG bundler_version

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    git \
    vim \
    libpq-dev \
    openssh-server \
    build-essential \
    wget \
    # for swagger
    openjdk-11-jre-headless \
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
    gem install lefthook && \
    bundle config set path /gems && \
    bundle config set no-cache 'true' && \
    bundle config set silence_root_warning 'true' && \
    bundle install && \
    bundle binstubs --all && \
    echo 'export PATH=/code/backend/bin:$PATH' >> ~/.bashrc

### swagger-codegen

RUN mkdir /usr/lib/swagger-codegen && \
  wget -q https://repo1.maven.org/maven2/io/swagger/swagger-codegen-cli/2.4.13/swagger-codegen-cli-2.4.13.jar -O /usr/lib/swagger-codegen/swagger-codegen-cli.jar && \
  echo "java -jar /usr/lib/swagger-codegen/swagger-codegen-cli.jar \$@" > /usr/bin/swagger-codegen && \
  chmod a+x /usr/bin/swagger-codegen

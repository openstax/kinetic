FROM ruby:2.6.7-slim

ARG bundler_version

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    git \
    vim \
    libpq-dev \
    openssh-server \
    build-essential \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Install a quick colorized prompt and turn on ls coloring
RUN git clone https://github.com/nojhan/liquidprompt.git ~/liquidprompt && \
    echo '[[ $- = *i* ]] && source ~/liquidprompt/liquidprompt' >>~/.bashrc && \
    mkdir -p ~/.config && \
    echo 'export LP_HOSTNAME_ALWAYS=1' >>~/.config/liquidpromptrc && \
    echo 'export LP_USER_ALWAYS=-1' >>~/.config/liquidpromptrc && \
    sed -i "/color=auto/"' s/# //' ~/.bashrc && \
    sed -i "/alias ls/,/lA/"' s/# //' ~/.bashrc

# VSCode Live Share libraries
# RUN wget -O ~/vsls-reqs https://aka.ms/vsls-linux-prereq-script && chmod +x ~/vsls-reqs && ~/vsls-reqs

WORKDIR /code
COPY . /code/

RUN gem install bundler --no-document --version $bundler_version && \
    gem install lefthook && \
    bundle config set no-cache 'true' && \
    bundle config set silence_root_warning 'true' && \
    cd backend && bundle install

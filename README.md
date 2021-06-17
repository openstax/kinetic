# labs

## Backend

If you want your Git config and SSH keys available inside running docker containers,
copy the `docker-compose.override.yml.example` file to `docker-compose.override.yml` and
modify its contents as necessary for your configuration.

```bash
$> docker-compose build
$> docker-compose up
```

Which will start hosting the Rails app at http://0.0.0.0:4006

Get into a backend terminal with

```bash
$> docker-compose exec api /bin/bash
```

Then you can run `rake db:migrate`, `rspec`, whatever.  Or you can run those directly from the host with

```bash
$> docker-compose exec api rake db:migrate
```

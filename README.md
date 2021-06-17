# labs

## Backend

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

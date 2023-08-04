# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* Linting

The [lefthook](https://github.com/Arkweid/lefthook) is included in the Docker build.  When you push your code to GitHub, lefthook runs Rubocop on all the files you have changed.  It won't let you push if you have Rubocop errors.  You'll have to fix the errors or make changes to the `.rubocop.yml` files to bypass the errors.  You can also run lefthook directly with

```bash
$ /code> lefthook run pre-push
```

* ...

**Connecting to remote databases**
```heroku pg:psql --remote={remote-name}```

**Getting into the backend terminal**
```docker compose exec api /bin/bash```
or if the container isn't running
```docker compose run api bash```

**Tests**
```rspec```

**Get into a rails console**
```rails c```

**Create data using `FactoryBot`**
```FactoryBot.create(:factory_name)```

**Migrations and database related things**  
- Backup
  - `heroku pg:backups:capture --app kinetic-web-prod`
  - `heroku pg:backups:download --app kinetic-web-prod`
- Restore
  - `bin/rails db:drop db:create`
  - `bin/rails db:environment:set RAILS_ENV=development`
  - `cat ~path/to/file.dump | docker exec -i kinetic-postgres-1 pg_restore --verbose --clean --no-acl --no-owner -U kinetic -d kinetic_development`
  - `bin/rails db:migrate`

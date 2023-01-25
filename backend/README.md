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



** Getting into the backend terminal
```docker compose exec api /bin/bash```

** Tests
```rspec```

** Get into a rails console
```rails c```

** Create data using `FactoryBot`
```FactoryBot.create(:model_name)```

# OpenStax Kinetic  - a Research Platform for Education

## Getting Started

To get start make sure you have docker and docker-compose installed. You may also want to install yarn as well. Next try running these commands in the root directory:  

```bash
$> docker compose build
$> docker compose up
```
You may run into migration issues at first. To fix that go into the back-end terminal with:

```bash
$> docker compose exec api /bin/bash
```

Then run:

```bash
$> bin/rails db:migrate RAILS_ENV=development
```

and try running the docker compose commands again to see if that fixes it.

When run correctly the front-end may be at http://localhost:4000/.

## Frontend

To run the front-end for development:

`yarn run start`

To build the front-end:

`yarn run build`

Building will generate files in the `dist` directory.  One of the files is a `manifest.json` file that contains references to all the assets that were built.

## Backend

If you want your Git config and SSH keys available inside running docker containers,
copy the `docker compose.override.yml.example` file to `docker compose.override.yml` and
modify its contents as necessary for your configuration.

```bash
$> docker compose build
$> docker compose up
```

Which will start hosting the Rails api app at http://0.0.0.0:4006.  A PetStore app showing the Rails app API runs at http://0.0.0.0:4008.  The front-end will be at http://0.0.0.0:4000

Get into a backend terminal with

```bash
$> docker compose exec api /bin/bash
```

Then you can run `rake db:migrate`, `rspec`, whatever.  Or you can run those directly from the host with

```bash
$> docker compose exec api rake db:migrate
```

### Deploying Kinetic

Kinetic is currently hosted on Heroku using the Docker integration.  To deploy the application you need to add a git remote per the [heroku  instructions](https://devcenter.heroku.com/articles/git)

Set up remotes (after authenticating with heroku) as such:
```bash
$> heroku git:remote -a kinetic-web -r staging
```

```bash
$> heroku git:remote -a kinetic-web-dev -r dev
```

```bash
$> heroku git:remote -a kinetic-web-prod -r prod
```

To build and deploy to heroku from the terminal, assuming the remotes were named as above:
```bash
$> git push dev main
$> git push staging main
$> git push prod main
# To push a development branch to heroku
$> git push <remote> feature-branch:main
```

Connecting to a remote heroku instance, eg. for staging:
```bash
heroku run 'bundle exec rails c' -a kinetic-web
```

### Deploying Homepage to Openstax CMS.

Access the [cms](https://openstax.org/admin).
Grab the updated homepage HTML
```
./homepage/copy-to-clipboard
```
and paste it into the CMS for openstax/kinetic homepage

### OpenApi, Clients, and Bindings

The Kinetic API is documented in the code using OpenApi.  OpenApi JSON can be accessed at `/api/v1/openapi`.

### Autogenerating bindings

Within the baseline, we use OpenApi-generated Ruby code to serve as bindings for request and response data.  Calling
`rake openstax_openapi:generate_model_bindings[X]` will create version X request and response model bindings in `app/bindings/api/vX`.
See the documentation at https://github.com/openstax/openapi-rails for more information.

### Autogenerating clients

A rake script is provided to generate client libraries.  Call
`rake openstax_openapi:generate_client[X,lang]` to generate the major version X client for the given language, e.g.
`rake openstax_openapi:generate_client[0,ruby]` will generate the Ruby client for the latest version 0 API.  This
will generate code in the baseline, so if you don't want it committed move it elsewhere.


### Testing accounts

A few testing accounts may be created by running `rake demo-users`.  This will create:
 * kinetic-adm-01@mailinator.com
 * kinetic-researcher-01@mailinator.com
 * kinetic-student-01@mailinator.com
 * kinetic-student-02@mailinator.com
 * kinetic-student-03@mailinator.com

### Stubbing Authentication

In the development environment, there are some extra endpoints available to faking your logged-in user.  Your logged-in user is set via a special development-environment-only cookie.  Here are the APIs:

```GET    /development/users```

Gets you a hash of research and admin users so you can know who you want to log in as, e.g.

```json
{
  'researchers': [
    { 'some-uuid': { name: 'Captain Ron' } }
  ],
  'admins': [
    'some-other-uuid'
  ]
}
```

```PUT    /development/users/:user_id/log_in```

Logs in as the user UUID provided in the path.

```PUT    /development/users/ensure_users_exist```

Call this to make sure an admin and researcher user exists.  After calling this you can call the `/development/users` endpoint to get the admin's UUID.

```GET    /development/users/whoami```

Call this to see who you are logged in as.


### Managing Banners & Rewards

Be logged in as an admin, and go to `/admin`




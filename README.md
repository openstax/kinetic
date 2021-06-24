# labs

## Backend

If you want your Git config and SSH keys available inside running docker containers,
copy the `docker-compose.override.yml.example` file to `docker-compose.override.yml` and
modify its contents as necessary for your configuration.

```bash
$> docker-compose build
$> docker-compose up
```

Which will start hosting the Rails api app at http://0.0.0.0:4006.  A PetStore app showing the Rails app API runs at http://0.0.0.0:4008.  The front-end will be at http://0.0.0.0:4000

Get into a backend terminal with

```bash
$> docker-compose exec api /bin/bash
```

Then you can run `rake db:migrate`, `rspec`, whatever.  Or you can run those directly from the host with

```bash
$> docker-compose exec api rake db:migrate
```

### Swagger, Clients, and Bindings

The Labs API is documented in the code using Swagger.  Swagger JSON can be accessed at `/api/v0/swagger`.

### Autogenerating bindings

Within the baseline, we use Swagger-generated Ruby code to serve as bindings for request and response data.  Calling
`rake openstax_swagger:generate_model_bindings[X]` will create version X request and response model bindings in `app/bindings/api/vX`.
See the documentation at https://github.com/openstax/swagger-rails for more information.

### Autogenerating clients

A rake script is provided to generate client libraries.  Call
`rake openstax_swagger:generate_client[X,lang]` to generate the major version X client for the given language, e.g.
`rake openstax_swagger:generate_client[0,ruby]` will generate the Ruby client for the latest version 0 API.  This
will generate code in the baseline, so if you don't want it committed move it elsewhere.

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

```PUT    /development/users/ensure_an_admin_exists```

Call this to make sure an admin exists.  After calling this you can call the `/development/users` endpoint to get the admin's UUID.

```GET    /development/users/whoami```

Call this to see who you are logged in as.


## TODOs

* [] Don't delete studies

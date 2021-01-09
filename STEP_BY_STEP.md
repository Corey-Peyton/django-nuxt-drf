# How to build this project, Step by Step

## Django Project Initilization

Create a virtual environment with Python 3.8. I use anaconda to do this:

```
conda create -n dj-nuxt python=3.8
```

```
conda activate dj-nuxt
```

Install Django

```
pip install Django==3.1.4
```

Start a new Django project:

```
django-admin startproject backend
```

I call all of my Django projects `backend`, feel free to name your project whatever you like, but keep in mind that the name will be important in later steps.

Now we have our basic working Django project. We can run it with:

```
(dj-nuxt)$ ./manage.py migrate && ./manage.py runserver
Operations to perform:
  Apply all migrations: admin, auth, contenttypes, sessions
Running migrations:
  Applying contenttypes.0001_initial... OK
  Applying auth.0001_initial... OK
  Applying admin.0001_initial... OK
  Applying admin.0002_logentry_remove_auto_add... OK
  Applying admin.0003_logentry_add_action_flag_choices... OK
  Applying contenttypes.0002_remove_content_type_name... OK
  Applying auth.0002_alter_permission_name_max_length... OK
  Applying auth.0003_alter_user_email_max_length... OK
  Applying auth.0004_alter_user_username_opts... OK
  Applying auth.0005_alter_user_last_login_null... OK
  Applying auth.0006_require_contenttypes_0002... OK
  Applying auth.0007_alter_validators_add_error_messages... OK
  Applying auth.0008_alter_user_username_max_length... OK
  Applying auth.0009_alter_user_last_name_max_length... OK
  Applying auth.0010_alter_group_name_max_length... OK
  Applying auth.0011_update_proxy_permissions... OK
  Applying auth.0012_alter_user_first_name_max_length... OK
  Applying sessions.0001_initial... OK
Watching for file changes with StatReloader
Performing system checks...

System check identified no issues (0 silenced).
December 26, 2020 - 16:14:27
Django version 3.1.4, using settings 'backend.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

This command runs the database migrations and then starts the development server.

I usually do a few things at the beginngin of a new Django project to help with code organization, management of settings and productivity. Here's what I'll do to finish setting up our Django application before moving on to Nuxt.JS setup.

1. Add a `.gitignore` file
1. Remove `db.sqlite3` (since we will use Postgres in production, we should set it up to use locally, too. We will do this in the following steps)
1. Create an initial git commit
1. Break out `settings.py` into a module with `base.py`, `development.py` and `production.py` (this will help us tweak some minor settings that will helpful to set in local development)
1. Add Postgres to the `DATABASE` settings
1. Create an `apps` directory. All of our Django apps will live in the `apps` folder
1. Create an app called `core` to be used for miscellaneous things
1. Create an `accounts` app with a CustomUser model and manager and authorization-related code
1. Create a `requirements` folder with `base.txt`, `dev.txt` and `test.txt` and add project dependencies that we will need to each of these files
1. Create a development Dockerfile for the Django app that installs dependencies, adds code and sets a non-root user
1. Create a `docker-compose.yml` file that we can use to start our Django app, NuxtJS app and database. (We will start with just Django and Postgres, and add things to this later). This file will only be used for **local development**
1. Run `makemigrations` and `migrate` management commands
1. Create two git branches: `develop` and `main`. Change `develop` to be the default branch and main will be used for production releases. We can delete the `master` branch.
1. Run the `createsuperuser` command
1. Start adding tests/features
1. Setup VSCode to lint and format
1. Add continuous integration with `.gitlab-ci.yml`
1. Run `black` code formatting

Let's go through each of these steps in detail to make sure everything is setup correctly.

### Add `.gitignore`

Here's a good `.gitignore` file for Python/Django applications:

[https://www.toptal.com/developers/gitignore/api/python,django](https://www.toptal.com/developers/gitignore/api/python,django)

```
wget -O backend/.gitignore https://www.toptal.com/developers/gitignore/api/python,django
```

### Remove `db.sqlite3`

```
rm backend/db.sqlite3
```

### Initial `git commit`

I usually create projects in GitLab first, and then clone empty repositories to my development machine. So you can start with either `git clone git@gitlab.com:yourname/your-new-project.git` or `git init` and then add a git remote.

```
git init
git add .
git commit -m "initial commit"
```

### Settings module

First, let's move `settings.py` to a file called `base.py`.

```
mkdir backend/backend/settings && mv backend/backend/settings.py backend/backend/settings
```

This command creates a `settings` directory in the `backend/backend` folder and then moves `backend/backend/settings.py` into that folder.

Why all of the `backend`s? In a typical Django project repo, the top-most `backend` would be the project root directory. I put the Django app into a top-level `backend` directory to separate the backend and frontend code.

For now we can also create three more files in the `backend/settings` directory:

- `__init__.py`
- `development.py`
- `production.py`

In `development.py`, add the following:

```py
from .base import *  # noqa

DEBUG_APPS = ["debug_toolbar", "django_extensions"]

INSTALLED_APPS += DEBUG_APPS

MIDDLEWARE = [
    "debug_toolbar.middleware.DebugToolbarMiddleware",
] + MIDDLEWARE  # noqa


def show_toolbar(request):
    return True


DEBUG_TOOLBAR_CONFIG = {
    "SHOW_TOOLBAR_CALLBACK": show_toolbar,
}
```

We will come back to this file later.

We also need to make some adjustments to the `backend/urls.py` file. It should look like this:

```py
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
]

if settings.DEBUG:
    import debug_toolbar  # noqa

    urlpatterns = (
        urlpatterns
        + [path("__debug__/", include(debug_toolbar.urls),)]
        + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
        + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    )

```

For now the only other changes to make are to remove the plain-text value of `SECRET_KEY` and replace it with an environment variable and, use environment variables to configure the `DEBUG` mode and change the `BASE_DIR`:

```py
import os

...

BASE_DIR = Path(__file__).resolve(strict=True).parent.parent.parent
SECRET_KEY = os.environ.get("SECRET_KEY")
DEBUG = bool(int(os.environ.get("DEBUG", "1")))
```

By defautl, `DEBUG` will be `True`. If we set an environment variable for `DEBUG` equal to `0`, then `DEBUG` will evaluate to `False` (for production).

The value of `BASE_DIR` changed from:


```py
BASE_DIR = Path(__file__).resolve(strict=True).parent.parent
```

to

```py
BASE_DIR = Path(__file__).resolve(strict=True).parent.parent.parent
```

We simply add another `.parent` since the file is now one folder deeper relative to `manage.py`.


### Add Postgres to `DATABASES`

By default, Django projects use SQLite3 for the database.

```py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

Replace this `DATABASES` value in `base.py` with the following:


```py
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
        "NAME": os.environ.get("POSTGRES_NAME", "postgres"),
        "USER": os.environ.get("POSTGRES_USERNAME", "postgres"),
        "PASSWORD": os.environ.get("POSTGRES_PASSWORD", "postgres"),
        "HOST": os.environ.get("POSTGRES_SERVICE_HOST", "postgres"),
        "PORT": os.environ.get("POSTGRES_SERVICE_PORT", 5432),
    }
}
```

### Apps Directory

The apps directory will be the one folder where we put all of our Django apps. A Django app refers to a section of a Django project that is logically independent of the other parts of the project.

```
mkdir backend/apps
```

### Create a `core` app in the `apps` directory

```
(dj-nuxt)$ cd backend && django-admin startapp core && mv core/ apps/core/
```

Add `core` to the `INSTALLED_APPS` in `settings/base.py`.

```py
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'apps.core',
]
```

### Create an `accounts` app

```
(dj-nuxt)$ cd backend && django-admin startapp accounts && mv accounts/ apps/accounts/
```

There are several parts of the code that need small changes and additions, I'll go through each one of them here:

- Add `apps.accounts` to `INSTALLED_APPS` similar to how we did with core
- Create the `CustomUser` model in `accounts/models.py`
- Create the `CustomerUserManager` in `accounts/managers.py`
- Create the `CustomUserAdmin` model Admin in `accounts/admin.py`
- Create the `CustomUserCreationForm` and `CustomUserChangeForm` in `accounts/forms.py`
- Add `AUTH_USER_MODEL = "apps.accounts.CustomUser"` to `settings/base.py`
- Run the `makemigrations` management command (we will do this later)


### Requirements

Usually a Django project has `requirements.txt` file that lists Python packages that are installed with

```
pip install -r requirements.txt
```

I tend to split my requirements into `base.txt`, `dev.txt` and `test.txt`.

In local development I install all three requirement files. In continuous integration environments, only `base.txt` and `test.txt` are installed. In production, only `base.txt` requirements are installed.

Here's an interesting article listing the most downloaded Django packages from 2020: [https://viewflow.medium.com/top-102-most-downloaded-django-packages-in-2020-108f0cd372e7](https://viewflow.medium.com/top-102-most-downloaded-django-packages-in-2020-108f0cd372e7).

I use several of the packages listed here. Here are some of the packages I usually install in `base.txt`, `dev.txt` and `test.txt`:

```
# base.txt
celery==5.0.2
Django==3.1
djangorestframework==3.11.1
django-redis==4.12.1
gunicorn==20.0.4
kombu==5.0.2
psycopg2-binary==2.8.6
redis==3.5.3
requests==2.25.0
```

```
# dev.txt
django-debug-toolbar==2.2
watchdog==0.10.3
pyyaml==5.3.1
argh==0.26.2
django-extensions==3.0.5
ipython==7.17.0
jupyter==1.0.0
Werkzeug==1.0.1
pylint-django==2.3.0
```

```
# test.txt
black==19.10b0
pytest==6.2.1
pytest-cov==2.10.1
pytest-django==4.1.0
factory_boy==3.1.0
flake8==3.8.4
```

Let's add these three files. Add or remove your own requirements as needed.

```
mkdir backend/requirements && touch backend/requirements/{base,dev,test}.txt
```

### Django Dockerfile

Now that we some basic code and our dependencies, we can create a Dockerfile for our local development environment. Here's the Dockerfile I typically use (I name it `Dockerfile.dev`, you can name it whatever you want):

```
touch backend/Dockerfile.dev
```

```Dockerfile
# backend/Dockerfile.dev
FROM python:3.8-slim
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1
RUN mkdir /code
WORKDIR /code
ADD requirements/base.txt \
    requirements/dev.txt \
    requirements/test.txt \
    /code/requirements/
RUN pip3 install -r requirements/base.txt
RUN pip3 install -r requirements/dev.txt
RUN pip3 install -r requirements/test.txt
ADD . /code/
RUN useradd -m app
USER app
```

### `docker-compose.yml` for local development

Now let's create a `docker-compose.yml` file in the root of the project directory:

```
touch docker-compose.yml
```

The `docker-compose.yml` file will set environment variables for the services from the `.env` file. We should keep this file outside of git.

Let's add a new `.gitignore` file that lists `.env`. We can add `.env.template` to the project root in order to indicate which environment variables should be listed in the `.env` file.

```
echo .env > .gitignore
touch .env .env.template
```

```
# .env.template
# this file is for reference, do not add values to it
# instead, add values to .env that will be used in local development
DJANGO_SETTINGS_MODULE=backend.settings.development
POSTGRES_PASSWORD=
SECRET_KEY=
```

```
# .env
DJANGO_SETTINGS_MODULE=backend.settings.development
POSTGRES_PASSWORD=postgres
SECRET_KEY=abc123
```

```yml
version: "2.4"

services:
  postgres:
    container_name: postgres
    image: postgres:11.5
    networks:
      - main
    ports:
      - "5434:5432"
    volumes:
      - pg-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=postgres

  backend:
    container_name: backend
    build:
      context: ./backend
      dockerfile: docker/Dockerfile.dev
    command:
      - "watchmedo"
      - "auto-restart"
      - "--directory=./"
      - "--pattern=*.py"
      - "--recursive"
      - "--"
      - "python3"
      - "manage.py"
      - "runserver_plus"
      - "0.0.0.0:8000"
    volumes:
      - ./backend:/code
    networks:
      - main
    ports:
      - "8000:8000"
      - "8888:8888"
    env_file:
      - .env
    depends_on:
      - postgres
```

Now we can run the command to start our application locally:

```
docker-compose up
```

### Run `makemigrations` and `migate` management commands

We still need to run the `makemigrations` and `migrate` commands. We can do that now.

You may see the following error in the docker-compose logs:

```
ValueError: Dependency on app with no migrations: accounts
```

The Django backend container should be running, we can access the shell of the container with:

```
docker exec -it backend bash
app@7576535e7498:/code$ ./manage.py makemigrations
Migrations for 'accounts':
  apps/accounts/migrations/0001_initial.py
    - Create model CustomUser
app@7576535e7498:/code$
```

Next, run the `migrate` management command:

```
app@7576535e7498:/code$ ./manage.py migrate
Operations to perform:
  Apply all migrations: accounts, admin, auth, contenttypes, sessions
Running migrations:
  Applying contenttypes.0001_initial... OK
  Applying contenttypes.0002_remove_content_type_name... OK
  Applying auth.0001_initial... OK
  Applying auth.0002_alter_permission_name_max_length... OK
  Applying auth.0003_alter_user_email_max_length... OK
  Applying auth.0004_alter_user_username_opts... OK
  Applying auth.0005_alter_user_last_login_null... OK
  Applying auth.0006_require_contenttypes_0002... OK
  Applying auth.0007_alter_validators_add_error_messages... OK
  Applying auth.0008_alter_user_username_max_length... OK
  Applying auth.0009_alter_user_last_name_max_length... OK
  Applying auth.0010_alter_group_name_max_length... OK
  Applying auth.0011_update_proxy_permissions... OK
  Applying auth.0012_alter_user_first_name_max_length... OK
  Applying accounts.0001_initial... OK
  Applying admin.0001_initial... OK
  Applying admin.0002_logentry_remove_auto_add... OK
  Applying admin.0003_logentry_add_action_flag_choices... OK
  Applying sessions.0001_initial... OK
```

### `createsuperuser`

```
app@db4a369c0928:/code$ ./manage.py createsuperuser
```



### `.gitlab-ci.yml` for continuous integration

Add a file in the root of the project called `.gitlab-ci.yml`. This will be used to run automated tests when our code is pushed to GitLab:

```
# .gitlab-ci.yml
stages:
  - test

Pytest:
  image: python:3.8
  stage: test
  services:
    - postgres:13.1
    - redis:6.0.9-alpine
  variables:
    DJANGO_SETTINGS_MODULE: "backend.settings.development"
    SECRET_KEY: "secret"
    DEBUG: "1"
    POSTGRES_HOST_AUTH_METHOD: trust
  script:
    - cd backend
    - pip install -r requirements/base.txt
    - pip install -r requirements/test.txt
    - flake8
    - black -l 79 -S --diff .
    - pytest --cov --cov-config=.coveragerc
  coverage: '/TOTAL.+ ([0-9]{1,3}\.[0-9]{1,3}%)/'
```


There is always more we can do to enhance our Django development experience locally. What we have here is more than enough to start. Now let's switch to setting up a NuxtJS application in our project.




### Working with VSCode

A quick note about working with VSCode, docker and Python/Django. I typically install pip dependencies twice: once in the docker container that I use in the application during development, and once in the virtual environment that I created for the project `(dj-nuxt)`. Install project dependencies in `(dj-nuxt)` provides all of the Python integration in VSCode: `black`, autocompletion, etc.

## NuxtJS Project Initialization

Here's a high-level overview of what we will do in this section:

[x] Generate a NuxtJS project using `create-nuxt-app`
[x] Create some backend API resources to play use with our Nuxt SSR app
[x] Create corresponding pages and components in our Nuxt app that will help us first list blog posts and display individual blog posts.
[x] Configure NGINX in local development to resolve CORS issues.
[x] Generate fake blog posts with faker
[o] Create authentication components in Vue.
[x] Add 404 page for Nuxt (`layouts/error.vue`)
[x] Add date formatting filter via plugin
[x] Add Vuetify (replace TailwindCSS)
[x] Add pagination to Post list
[o] Add a form for creating new blog posts

Let's set up a NuxtJS project in a top-level `nuxt` folder.

First, check to make sure that you have access to a recent version of `npm`:

```
$ node -v
v15.0.1
```

I'm going to follow along with the Official NuxtJS documentation:

[https://nuxtjs.org/docs/2.x/get-started/installation](https://nuxtjs.org/docs/2.x/get-started/installation)

We can do this with the following command:

```
npx create-nuxt-app frontend
```

I call my frontend apps `frontend` in most of my projects, feel free to call this whatever you want. I selected the following options in the interactive menu:

```
create-nuxt-app v3.4.0
✨  Generating Nuxt.js project in frontend
? Project name: frontend
? Programming language: JavaScript
? Package manager: Yarn
? UI framework: Tailwind CSS
? Nuxt.js modules: Axios
? Linting tools: ESLint, Prettier
? Testing framework: Jest
? Rendering mode: Universal (SSR / SSG)
? Deployment target: Server (Node.js hosting)
? Development tools: jsconfig.json (Recommended for VS Code if you're not using typescript)
? Continuous integration: None
? Version control system: Git
```

Notice that we selected `Git` in `Version control system: Git`. We should delete the `.git` folder inside the generated `frontend` folder:

```
rm -rf frontend/.git
```

We are using a mono-repo approach here; frontend, backend and all other project code lives in the same git repo. Selecting the `Git` option gives us the correct `.gitignore` file (I think).

Now run the following commands:

```
cd frontend
yarn dev
```

This starts the Nuxt application in development mode. Now we are ready to start connecting our Django and Nuxt applications. One of my first goals is to figure out how to setup Django session authentication with our Nuxt app.

> This seems to work correctly *almost* out of the box. We will touch on the main issue shortly (which, of course, is CORS) and how we can resolve it.

It should be similar to how things work with a regular Vue app.

I mostly work with Quasar Framework and Material UI. I added TailwindCSS as I have also worked with that Framework for building UIs.

One of my first goals is to better understand `asyncData` in Nuxt applications and how it interacts with Django.

I *think* what happens is that:

1. A request is sent to https://oursite.com
1. The NuxtJS Node server processes the request
1. In `asyncData`, we make requests to Django for any content that must be used to render the response (HTML) from the NuxtJS Node server.
1. We can make additional calls to the Django backend as needed in the regular Vue lifecycle hooks like `mounted` or `created`. I think this is the best place to do Django authentication.

> I will probably want to use NGINX as I have in other projects to serve as a reverse proxy. This way I can have all incoming requests handled by NGINX, and I can send requests for `/api/*` and `/admin/*` to Django and all other requests to the NuxtJS node server that is doing our Server Side Rendering (SSR). This should resolve the CORS issue, too.

Here are some objectives we can start with for setting up our Nuxt project:

[x] Setup some CRUD views in Nuxt
[x] Set up List and Detail views for the Posts model in Django that we can use for trying out Nuxt SSR features
[x] Apply some permissions for the CRUD model:
[] pick a theme/layout from [https://tailwindcomponents.com/components/Layouts](https://tailwindcomponents.com/components/Layouts)
[] Scaffold a site design, setup a Login page that we can use for testing authentication

We can try to focus on the meta part of the pages for our posts. So we can include images, descriptions, titles in the meta tags and Open Graph (og) tags for post pages.

### Create a `blog` Django app

```
(dj-nuxt)$ cd backend && django-admin startapp blog && mv blog/ apps/blog/
```

Let's create a `BaseModel` model in the `core` app first to provide the following fields that we might reuse for other models:

- `created_on`
- `modified_on`
- `created_by`
- `modified_by`

On our `Post` model, add the following fields:


```py
    title = models.CharField(max_length=200)
    body = models.CharField(max_length=10_000)
```

Let's create the following:

- Serializer for Posts
- `ModelViewSet` for Posts
- Router for Posts
- Admin for Posts

These are all pretty straightforward; I won't write the code for these here, please reference the files `blog/{admin,serializers,urls,views}.py` to see how these are set up.

We also need to set up DRF settings in `settings/base.py`:

```py
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',  # noqa
    'PAGE_SIZE': 10,
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
    ),
}
```

### Add NGINX to local development setup in order to resolve CORS issues

Instead of making requests to `localhost:3000` and then making API requests to `localhost:8000` from our NuxtJS SSR application, we can use `localhost` (port 80) for both of the requests by adding NGINX.

Requests for `/admin/*` and `/api/*` will be sent to the Django backend and all other request will be handled by the Nuxt application.

For local development, we need a `dev.conf` NGINX configuration file and a Dockerfile for NGINX. We can put these in an NGINX folder in the root of our project.

```
mkdir -p nginx/dev && touch nginx/dev/{dev.conf,Dockerfile}
```

We will also add a Dockerfile for Nuxt so that we can easily proxy NGINX requests to that container.

> Technically we don't need to run Nuxt in a container, but it should make things easier by bringing up the entire project with one `docker-compose` command. If this doesn't work or causes any SSR-specific bugs, we can try another way, but I think this should work similar to how other Vue projects of mine have been running in containers.

We also need to add `frontend` and `nginx` to `docker-compose.yml`.

**Important**: you need to use `.dockerignore` when building the frontend Docker container. If you don't, what essentially happens is that you makea POST request to the docker daemon where the data contains a serialized version of `node_modules`, which can cause the docker CLI to hand. To fix this, add the following `.dockerignore` file to ``frontend`:


```
.dockerignore
```

If everything works, you should see Nuxt start in docker:

```
frontend    |
frontend    |                                      :-:
frontend    |                                    .==-+:
frontend    |                                   .==. :+- .-=-
frontend    |                                  .==.   :==++-+=.
frontend    |                                 :==.     -**: :+=.
frontend    |                                :+-      :*+++. .++.
frontend    |                               :+-      -*= .++: .=+.
frontend    |                              -+:      =*-   .+*: .=+:
frontend    |                             -+:     .=*-     .=*-  =+:
frontend    |                           .==:     .+*:        -*-  -+-
frontend    |                          .=+:.....:+*-.........:=*=..=*-
frontend    |                          .-=------=++============++====:
frontend    |
frontend    |                           Thanks for installing nuxtjs
frontend    |                  Please consider donating to our open collective
frontend    |                         to help us maintain this package.
frontend    |
frontend    |                             Number of contributors: 0
frontend    |                               Number of backers: 395
frontend    |                               Annual budget: $74,387
frontend    |                              Current balance: $53,172
frontend    |
frontend    |                  Donate: https://opencollective.com/nuxtjs/donate
frontend    |
````


We will also need to make these changes to `nuxt.config.js`:

[https://nuxtjs.org/faq/host-port/#configure-in-nuxtconfigjs](https://nuxtjs.org/faq/host-port/#configure-in-nuxtconfigjs):

```
export default {
  server: {
    port: 3000, // default: 3000
    host: '0.0.0.0' // default: localhost
  }
  // other configs
}
```
And we also need to change the address that `$axios` uses to make requests to the backend service.

Nuxt provides settings for `publicRuntimeConfig` and `privateRuntimeConfig`. We need to configure axios settings for `browserBaseURL` in `publicRuntimeConfig` and `baseURL` in `privateRunTimeConfig`.

The following works:

```
  publicRuntimeConfig: {
    axios: {
      browserBaseURL: process.env.BROWSER_BASE_URL || 'http://localhost',
    },
  },
  privateRuntimeConfig: {
    axios: {
      baseURL: process.env.BASE_URL || 'http://backend:8000',
    },
  },
```

> If we don't set these values and just set `http://localhost` as the axios `baseURL`, the initial page load would fail to load data, because the Nuxt SSR Node process running in a docker containre can't resolve `localhost`.


## Authentication

- [x] Create Login Form
- [x] Create auth store module
- [x] Create backend auth routes (login, logout, set-cookie)
- [x] setup nuxtServerInit action to check user auth on each server request (page load)
- [x] Figure out how to send csrf token with Nuxt axios module (middleware?)
- [x] Create axios plugin to send CSRF token (https://axios.nuxtjs.org/extend#adding-interceptors)


## Some interesting errors I encountered

### store

> Your state value should always be a function to avoid unwanted shared state on the server side.

I didn't pay attention to this and had an unwanted consequence of having the auth state for one user persist for other users. If one user logged in, any user is "authenticated" from the perspective of Vuex (these users would still be unable to make API requests). This bug only showed up when using Nuxt in production. Locally, this didn't seem to be an issue; logging in in two different browser windows didn't seem to share the state. This caused a lot of confusion.

Here's another important point:

> Using factory function for a state is a nuxt.js feature. It is used in the SSR mode to create a new state for each client. But for getters it doesn't make sense, because these are pure functions of the state. getters should be a plain object:

From [https://stackoverflow.com/questions/57074134/understanding-state-and-getters-in-nuxt-js-getters-wont-working](https://stackoverflow.com/questions/57074134/understanding-state-and-getters-in-nuxt-js-getters-wont-working)

Nuxt Vuex module mode vs "export default" mode?

> Converting circular structure to JSON --> starting at object with constructor 'ClientRequest' | property 'socket' -> object with constructor 'Socket' --- property '_httpMessage' closes the circle

This was caused by having `$axios.get` in `asyncData`. The correct syntax is `$axios.$get`.

## Questions I have

- [ ] Can the `head` property access `asyncData`? I'm pretty sure the answer is yes.
- [ ] How do I setup Nuxt SSR with NGINX as a reverse proxt in development? Is it that same as with a regular Vue app? I think it probably is.
- [ ] Why exactly does the initial request return successfully, but `<nuxt-link>`s fail with CORS issues? It probably comes down to differences in how Node makes requests and how the browser makes requests. When `<nuxt-link>`s are clicked, I think the Nuxt app functions as an SPA and doesn't make new requests to the Node.js server to render HTML responses on the server.
- [ ] What's the best practice for async/await and .then/.catch? **try/catch blocks** seems like the best way: https://javascript.info/async-await
- [ ]
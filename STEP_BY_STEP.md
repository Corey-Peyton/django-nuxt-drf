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
1. Create an `apps` directory. All of our Django apps will live in the `apps` folder
1. Create an app called `core` to be used for miscellaneous things
1. Create an `accounts` app with a CustomUser model and manager and authorization-related code
1. Create a `requirements` folder with `base.txt`, `dev.txt` and `test.txt` and add project dependencies that we will need to each of these files
1. Create a development Dockerfile for the Django app that installs dependencies, adds code and sets a non-root user
1. Create a `docker-compose.yml` file that we can use to start our Django app, NuxtJS app and database. (We will start with just Django and Postgres, and add things to this later). This file will only be used for **local development**
1. Create two git branches: `develop` and `main`. Change `develop` to be the default branch and main will be used for production releases. We can delete the `master` branch.

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

## NuxtJS Project Initialization
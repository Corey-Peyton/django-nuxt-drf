# Django Nuxt Starter Project

This project will demonstrate how to use Django with Nuxt. It will use the Vue Composition API and Django Session Authentication.

See the [Step by Step Guide to the project](/STEP_BY_STEP.md) for a detailed walkthrough of how to create this project.

To start the project, create a file called `.env` in the root directory, copied from `.env.template`, then run:

```
docker-compose up
```

When this is up and running, run:

```
docker exec -it backend bash
```

From the container shell, run:

```
./manage.py migrate
./manage.py createsuperuser
```
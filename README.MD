## What is this?

A self-hosted dockerized fitness dashboard webapp built with NextJS and Django.

-   Track your workouts and performance.
-   Measure your weight, calories, body fat, body measurements, and much more.
-   Create workout templates and repeat them daily/weekly/biweekly. Design your own unique workout split.
-   Track exercise performance, such as Best sets, PRs, 1RMs, and more.
-   Record, track, and work towards your fitness goals.
-   Completely offline and self-hosted.

## Installation

Please make sure you have [Docker](https://www.docker.com) installed on your machine.

1. Clone this repository.

```bash
git clone https://github.com/hassanaziz0012/athletix
```

2. cd into the directory where you cloned it, and run `docker-compose up`.

```bash
cd athletix
docker-compose up
```

3. When the server is running, head over to http://localhost:3001 to use the app.

## Config

### Changing ports

-   Changing the frontend's port is very straightforward. Just change the `APP_PORT` variable in the `.env` file.

-   Changing the backend port will require a rebuild of the frontend image, bcos of how NextJS works. Follow these steps:

1. Change the `BACKEND_PORT` variable in the `.env` file.
2. Run the app again with the `--build` flag. This will rebuild the frontend image with the new settings.

```bash
docker-compose up --build
```

## About The Author

I'm Hassan, a freelance web developer and designer. Wanna have a chat, get in touch here:

-   Github: https://github.com/hassanziz0012
-   Twitter/X: https://x.com/nothassanaziz
-   Discord: Hassan#3557 (itshassanaziz)

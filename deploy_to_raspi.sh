set -e

# https://stackoverflow.com/questions/39296472/how-to-check-if-an-environment-variable-exists-and-get-its-value

if [[ -z "${DOCKER_HOST}" ]]; then
  echo "DOCKER_HOST not set, exiting."
  exit 1;
fi

if [[ -z "${BROWSER_BASE_URL}" ]]; then
  echo "BROWSER_BASE_URL not set, exiting."
  exit 1;
fi


RED='\033[0;31m'
NC='\033[0m'
REGISTRY=localhost:5000

echo "Building docker images for backend and frontend"

echo "Building backend image"

if [[ -z "${VERSION}" ]]; then
  echo "No backend version set, using git short hash"
  VERSION=$(git rev-parse --short HEAD);
  echo $VERSION
else
  echo "Backend version is $VERSION"
fi

echo "Building and tagging backend container\n"

docker build \
    -t $REGISTRY/backend:$VERSION \
    -f backend/docker/Dockerfile.prod \
    ./backend/

echo "Building and tagging nginx container"

docker build \
    -t $REGISTRY/nginx:$VERSION \
    -f nginx/prod/Dockerfile \
    ./nginx/

echo "Building and tagging nuxt container"

docker build \
    --build-arg BROWSER_BASE_URL=${BROWSER_BASE_URL} \
    -t $REGISTRY/nuxt:$VERSION \
    -f frontend/Dockerfile.prod \
    ./frontend/

export CI_REGISTRY_IMAGE=$REGISTRY
export CI_COMMIT_SHORT_SHA=$VERSION

echo "Checking environment variables for swarm"

if [[ -z "${POSTGRES_PASSWORD}" ]]; then
  echo "WARNING: ${RED}POSTGRES_PASSWORD not set, exiting.${NC}"
fi

docker stack deploy -c raspi.yml app-stack

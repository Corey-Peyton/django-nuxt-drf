#!/bin/bash

# https://docs.npmjs.com/cli/cache
npm cache verify

# install project dependencies
yarn install

npm install --save nuxt

# run the development server
yarn dev
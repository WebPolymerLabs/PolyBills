#!/bin/bash

gulp build

if [ -d "firebase/public" ]; then
  rm -rf firebase/public/*
else
  mkdir firebase/public
fi

cp -R .build/* firebase/public/
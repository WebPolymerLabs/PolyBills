#!/bin/bash

polymer build

if [ -d "firebase/public" ]; then
  rm -rf firebase/public/*
else
  mkdir firebase/public
fi

cp -R build/bundled/* firebase/public/
#!/bin/bash

mkdir -p images

for pdf in pdfs/*.pdf; do
    convert "${pdf}" \
            "./images/$(basename ${pdf} .pdf).png"
done

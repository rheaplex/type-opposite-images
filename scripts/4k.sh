#!/bin/bash

mkdir -p 4k

for pdf in pdfs/*.pdf; do
    convert -density 640 "${pdf}" \
            -gravity Center -crop 3840x2160+0+0 +repage \
            -background white -flatten \
            "4k/$(basename ${pdf} .pdf).png"
done

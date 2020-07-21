#!/bin/bash

rm -rf dist
npm run build
#monoploy game
rm -rf dist/!(_nuxt|.nojekyll|tmoney.ico|monoploy|mmonoploy|monomaker|monoploy|index.html|index_monoploy)

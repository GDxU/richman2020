#!/bin/bash
rm -rf dist
DIRSET=/Users/hesk/Documents/officialwebsite/richmancity/
npm run build

#monoploy game
#cd dist

shopt -s extglob

rm -v -rf dist/!(_nuxt|.nojekyll|tmoney.ico|monoploy|mmonoploy|monomaker|monoprogram|monoploy|index.html|index_monoploy)

rm -v -rf $DIRSET!(.git|.ignore)

mv dist/* $DIRSET

set -e
npm run build
rm -rf ../../chess_app_backend/build
cp -r build ../../chess_app_backend
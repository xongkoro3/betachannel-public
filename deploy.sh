cd /var/www/betachannel.co/html/
git fetch --all
git reset --hard origin/master
yarn install
yarn build
pm2 delete all || true
pm2 start "yarn run start" --name "app"
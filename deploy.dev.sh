cd /var/www/dev.betachannel.co/html/
git fetch --all
git reset --hard origin/dev
yarn install
yarn build
pm2 delete all || true
pm2 start "yarn run start --port 3001" --name "dev-app"
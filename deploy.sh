#!/bin/sh
# version: 1.1

echo 'Pulling last verions.';
cd /repositories/trendytrades-web-app/;
git pull;

echo 'Building the project.';
cp /repositories/trendytrades-web-app/config.server.json /repositories/trendytrades-web-app/config.json;
cd /repositories/trendytrades-web-app/;
rm -rf node_modules;
source ~/.nvm/nvm.sh;
npm i;
npm run build;

echo 'Removing old version from workspace.';
rm -rf /workspace/trendytrades/web-app/*;

echo 'Copying build version to workspace.';
cp /repositories/trendytrades-web-app/* /workspace/trendytrades/web-app/ -r;

echo 'Restoring repository.';
git restore .;

echo 'Restarting application.';
pm2 restart trendytrades.io;

echo 'Deployment has been done.';
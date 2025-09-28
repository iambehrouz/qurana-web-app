#!/bin/sh
# version: 1.1

echo 'Pulling last verions.';
cd /repositories/qurana-web-app/;
git pull;

echo 'Building the project.';
cp /repositories/qurana-web-app/config.server.json /repositories/qurana-web-app/config.json;
cd /repositories/qurana-web-app/;
rm -rf node_modules;
source ~/.nvm/nvm.sh;
npm i;
npm run build;

echo 'Removing old version from workspace.';
rm -rf /workspace/qurana/web-app/*;

echo 'Copying build version to workspace.';
cp /repositories/qurana-web-app/* /workspace/qurana/web-app/ -r;

echo 'Restoring repository.';
git restore .;

echo 'Restarting application.';
pm2 restart qurana.chateq.fr;

echo 'Deployment has been done.';
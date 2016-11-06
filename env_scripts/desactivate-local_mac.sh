#!/bin/bash
SCRIPTDIR=$(cd $(dirname "$0") && pwd)
CFGDIR=${SCRIPTDIR}/cfg
nginx_cfg=polybills-dev

echo Removing ${nginx_cfg} Nginx configuration
sudo rm -rf /usr/local/etc/nginx/sites-enabled/${nginx_cfg}

echo Restarting Nginx
sudo nginx -s stop
sudo nginx


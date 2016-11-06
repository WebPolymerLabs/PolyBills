#!/bin/bash
SCRIPTDIR=$(cd $(dirname "$0") && pwd)
CFGDIR=${SCRIPTDIR}/cfg
nginx_cfg=polybills-dev

#echo Setting up your /etc/hosts file
#sudo ${SCRIPTDIR}/stchosts_mac.sh import ${CFGDIR}/polybills.hosts

echo config Nginx
mkdir -p /usr/local/etc/nginx/sites-{enabled,available}

echo Removing default Nginx configuration
sudo rm -rf /usr/local/etc/nginx/sites-enabled/default

echo Adding ${nginx_cfg} local configuration to Nginx
sudo cp ${CFGDIR}/${nginx_cfg} /usr/local/etc/nginx/sites-available/${nginx_cfg}
sudo ln -sf /usr/local/etc/nginx/sites-available/${nginx_cfg} /usr/local/etc/nginx/sites-enabled/${nginx_cfg}

echo Restarting Nginx
sudo nginx -s stop
sudo nginx


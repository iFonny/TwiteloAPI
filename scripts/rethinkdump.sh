#!/bin/bash

echo "Weekly backup started! ($(date +%Y-%m-%d-T%H:%M:%S))"
rethinkdb dump -f /root/db_backup/rethinkdbdump$(date +%Y-%m-%d-T%H:%M:%S).tar.gz
echo "=> Backup finished"

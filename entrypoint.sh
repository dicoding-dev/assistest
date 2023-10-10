#!/bin/bash
rm -f /home/assistest/reports/report.json || true
chown -R assistest:assistest /home/assistest/student-app
exec gosu assistest "$@"

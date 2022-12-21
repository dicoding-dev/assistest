FROM node:18

RUN apt update
RUN apt install net-tools

RUN apt install nginx -y
RUN > /etc/nginx/sites-available/default
RUN echo   'server { \n\
          	listen 80 default_server; \n\
          	listen [::]:80 default_server; \n\
            \n\
          	root /var/www/html; \n\
            \n\
          	# Add index.php to the list if you are using PHP \n\
          	index index.html index.htm index.nginx-debian.html; \n\
            \n\
          	server_name _;\n\
            \n\
          	location / { \n\
          		proxy_pass http://localhost:5000; \n\
          		proxy_http_version 1.1; \n\
          		proxy_set_header Upgrade $http_upgrade; \n\
          		proxy_set_header Connection 'upgrade'; \n\
          		proxy_set_header Host $host; \n\
          		proxy_cache_bypass $http_upgrade; \n\
          	} \n\
          }' >>  /etc/nginx/sites-available/default

CMD ["nginx", "-g", "daemon off;"]
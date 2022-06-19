# Serve application on localhost:4200:
# ng serve --host 0.0.0.0
# 
# To update /docs files served by github:
# ng build
docker build -t donate-monitor . && \
docker run -it --rm -p 4200:4200 -v "$(pwd)":/code donate-monitor

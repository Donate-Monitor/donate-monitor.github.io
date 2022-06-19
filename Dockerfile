FROM node

RUN npm install -g @angular/cli
RUN ng config -g cli.warnings.versionMismatch false

WORKDIR /code/src/donate-monitor
EXPOSE 4200
ENTRYPOINT ["/bin/bash"]

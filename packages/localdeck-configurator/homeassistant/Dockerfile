ARG BUILD_FROM
FROM $BUILD_FROM

RUN apk add --no-cache nodejs

WORKDIR /usr/src/app
COPY . /usr/src/app

RUN chmod a+x run.sh

EXPOSE 3000
CMD "/usr/src/app/run.sh"

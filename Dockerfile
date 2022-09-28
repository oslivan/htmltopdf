FROM basivan/pptr:nodev16.17.1

RUN mkdir /app
WORKDIR /app
COPY package.json /app/
COPY yarn.lock /app/
RUN yarn install

COPY . .
CMD ["bin/www"]

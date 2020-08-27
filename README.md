# README

## Directions

You'll need docker installed with the `docker-compose` command
as well as ruby and the bundler gem and node with yarn.

## Running the app

### First run

You will need to create a db called travel_app_development that the postgres user 
has access to without password after you start docker before first running the app.

`docker-compose up db`

and then:

`docker-compose run db /bin/bash -c "createdb travel_app_development -U postgres -h host.docker.internal -p 5440"`

### All runs
 
In one tab run:

`docker-compose up db`

In another tab run:

`yarn install && ./bin/webpack-dev-server`

In a final tab run: 

`bundle install && bundle exec rake db:migrate && bundle exec rails s -p 5000`

Finally visit http://localhost:5000

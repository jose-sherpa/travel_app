# README

*Directions*

You'll need docker installed with the `docker-compose` command
as well as ruby and the bundler gem and node with yarn.

*First run*

You will need to create a db called travel_app_development
after you start docker before first running the app.
 
In one tab run:

`docker-compose up db`

In another tab run:

`yarn install && ./bin/webpack-dev-serving`

In a final tab run: 

`bundle install && bundle exec rake db:migrate && bundle exec rails s -p 5000`

Finally visit http://localhost:5000

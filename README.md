# README

*Directions*

You'll need docker installed with the `docker-compose` command
as well as ruby and the bundler gem and node with yarn.

Note: In order to receive a confirmation email you'll need sendmail running on
the machine the app is running on. Otherwise you will have to click the link
in the print out from the server logs.
 
In one tab run:

`docker-compose up db`

In another tab run:

`yarn install && ./bin/webpack-dev-serving`

In a final tab run: 

`bundle install && bundle exec rake db:migrate && bundle exec rails s -p 5000`

Finally visit http://localhost:5000

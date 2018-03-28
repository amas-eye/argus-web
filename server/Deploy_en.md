# the deploy doc is for argus-web(which is part of argus-monitor)

0. install database and other dependencies
   nodejs from nodejs.org(version demand >= 8.4.0)
   mongodb : version >= 3.4.0
   redis: version >=3.10.0
   the default setting:
   mongodb connected 'mongodb://localhost'
   redis connected 'redis://localhost/0'
   

1. front-end start
   #### needed to be build , no need to run another process,it can be started with node app
   1. go in to app or app_phone folder,and do npm install
   2. after the dependencies installed, run npm run build
   3. waiting for build finish, dist folder will be created
     and then rename the dist folder into the father folder name(e.g: app/dist change to app/app ),the copy to the argus-web/server
   (so far the build is success in windows and mac , we have no idea what's wrong with linux, PR for this issue is warmly welcome)

2. backend-start
   0. change the configuration at argus-web/server/start_config.js
   1. go into argus/server , do npm install
   2. if npm install done, do npm run start.
   (the app will be start default in tcp port 8080 )

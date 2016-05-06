# .-ppitectur.
Appitecture is a simple nodejs module that helps scaffold project route handlers and controller functions. The current build is suited only for NodeJS projects using Express.

# How To Use
- `npm install appitecture -g`
- Define an `appitecture.apt` file in the directory you wish to scaffold your route handlers and controllers in ![alt text](https://farm8.staticflickr.com/7053/26245480323_d5e5c14972_b.jpg "Appitecture.apt")
- Run `appitecture` in your terminal

# Appitecture.apt Syntax
- The first line of the apt file specifies a directive telling the parser what route inclusion method to use. Valid entries for this line include:
	- use `app.route` _generates route handlers defined like this:_ `app.route('/game/new').post(ctrlr.handler)`
	- use `app.method` _generates route handlers defined like this:_ `app.get('/game/new', ctrl.handler)`
	- use `router.route` _generates route handlers defined like this:_ `router.route('/game/new').post(ctrlr.handler)`
	- use `router.method` _generates route handlers defined like this:_ `router.get('/game/new', ctrl.handler)`
- The second line of the apt file specifies a flag directive used by the generator to determine whether or not to generate controller function files.
	- createcontrollerfunctions yes|no
- The remaining lines in the apt files are for route specification 
	- Basic route: `/route/path1/path2 httpmethod:controller.handler,[anotherhttpmethod:controller.handler]`
	- Route with middleware: `/route/path1 (middleware1 middleware2 ..middlewaren)httpmethod:controller.handler`
	- Route with sub-routes: 
	```
		/parentroute httpmethod:controller.handler
		   		/childroute1 httpmethod:controller.handler
		   		/childroute2 httpmethod:controller.handler
		   			/grandchildroute2 httpmethod:controller.handler
	```
	The above will resolve to the following routes /parentroute, /parentroute/childroute1, .. , /parentroute/childroute2/grandchildroute2.
- Few notes:
	- Controller handlers are optional. In such cases, routes are specified like so: `/route httpmethod` (this creates an anonymous function in the route definition) ![alt text](https://farm8.staticflickr.com/7376/26756535052_2cf4e3b31e_b.jpg "Appitecture.apt") 
	- When specifying middlewares, a # indicates that an anonymous function be created inline e.g. `/users (yyt.uiyui #)get:user.listUser` 
![alt text](https://farm8.staticflickr.com/7533/26245962753_c166ece7c3_b.jpg "Appitecture.apt")


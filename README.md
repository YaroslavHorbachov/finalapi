In order to deploy the project on your personal computer,you need <strong>node, npm and nginx server</strong>.<br>
<strong>1</strong> : To perform the initialization of the libraries and project dependencies,<br> 
						
						cd path/to/dir
						
						npm install
						
<strong>2</strong> : In order to get a webpack bundle, you need to run<br>
						
						npm run build 
						
<strong>3</strong>:  If you already have nginx server, you can use our configuration file and source project from: <br>
						
						server/conf/nginx.conf
						
						server/http/[all]
					
		
<strong>3.1</strong> But if you haven't nginx server from different reasons, just start server from:
		
		
						server/conf/nginx.exe

                       
<strong>4</strong> : Finally open your browser on localhost:3000.<br>

This is all actions for to deploy a project on your computer<br>

Please use this [JSONPlaceholder](https://jsonplaceholder.typicode.com/) or [CIST API](http://cist.nure.ua/i/ias/doc/api/native_API.pdf) as test data.

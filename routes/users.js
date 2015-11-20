app.route('/users').get(yyt.uiyui,function(req,res,next){
 /*code goes in here*/ 
},user.listUser).post(user.newUser);
app.route('/users/:id').get(user.getUser);
app.route('/users/:id/edit').post(user.editUser);
app.route('/users/:id/delete').post(user.deleteUser);

app.get('/users',yyt.uiyui,function(req,res,next){


app.get('/users/:id',user.getUser);
app.post('/users/:id/edit',user.editUser);
app.post('/users/:id/delete',user.deleteUser);
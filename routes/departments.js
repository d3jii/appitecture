app.get('/departments',department.listDepartments).post('/departments',department.newDepartment);
app.get('/departments/:id',department.getDepartment);
app.post('/departments/:id/delete',department.deleteDepartment);
app.post('/departments/:id/edit',department.editDepartment);
app.post('/departments/:id/users',department.getDepartmentUsers);
app.post('/departments/:id/users/log',function(req,res,next){
 /*code goes in here*/ 
});
app.post('/departments/:id/users/gameone',department.getJar).get('/departments/:id/users/gameone',department.loadAll);

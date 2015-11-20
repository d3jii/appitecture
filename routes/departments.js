app.route('/departments').get(department.listDepartments).post(department.newDepartment);
app.route('/departments/:id').get(department.getDepartment);
app.route('/departments/:id/delete').post(department.deleteDepartment);
app.route('/departments/:id/edit').post(department.editDepartment);
app.route('/departments/:id/users').post(department.getDepartmentUsers);
app.route('/departments/:id/users/log').post(function(req,res,next){
 /*code goes in here*/ 
});
app.route('/departments/:id/users/gameone').post(department.getJar).get(department.loadAll);

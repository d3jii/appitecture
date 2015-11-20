router.route('/departments').get(department.listDepartments).post(department.newDepartment);
router.route('/departments/:id').get(department.getDepartment);
router.route('/departments/:id/delete').post(department.deleteDepartment);
router.route('/departments/:id/edit').post(department.editDepartment);
router.route('/departments/:id/users').post(department.getDepartmentUsers);
router.route('/departments/:id/users/log').post(function(req,res,next){
 /*code goes in here*/ 
});
router.route('/departments/:id/users/gameone').post(department.getJar).get(department.loadAll);

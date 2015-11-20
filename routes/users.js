router.route('/users').get(yyt.uiyui,function(req,res,next){
 /*code goes in here*/ 
},user.listUsersr).post(user.newUser);
router.route('/users/:id').get(user.getUser);
router.route('/users/:id/edit').post(user.editUser);
router.route('/users/:id/delete').post(user.deleteUser);

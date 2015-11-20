router.route('/companies').get(company.listCompanies).post(company.newCompany);
router.route('/companies/:id').get(company.getCompany);
router.route('/companies/:id/delete').post(company.deleteCompany);
router.route('/companies/:id/edit').post(company.editCompany);
router.route('/companies/:id/users').get(company.getCompanyUsers);
router.route('/companies/:id/departments').get(company.getCompanyDepartments);

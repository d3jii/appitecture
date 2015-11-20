app.route('/companies').get(company.listCompanies).post(company.newCompany);
app.route('/companies/:id').get(company.getCompany);
app.route('/companies/:id/delete').post(company.deleteCompany);
app.route('/companies/:id/edit').post(company.editCompany);
app.route('/companies/:id/users').get(company.getCompanyUsers);
app.route('/companies/:id/departments').get(company.getCompanyDepartments);

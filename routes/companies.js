app.get('/companies',company.listCompanies).post('/companies',company.newCompany);
app.get('/companies/:id',company.getCompany);
app.post('/companies/:id/delete',company.deleteCompany);
app.post('/companies/:id/edit',company.editCompany);
app.get('/companies/:id/users',company.getCompanyUsers);
app.get('/companies/:id/departments',company.getCompanyDepartments);

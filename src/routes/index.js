import React from 'react';
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";

import Home from '../components/home/Home';
import Companies from '../components/companies/Companies';
import CompaniesForm from '../components/companies/CompanyForm';
import Employees from '../components/employees/Employees';
import EmployeesForm from '../components/employees/EmployeeForm';
import { Navbar } from 'react-bootstrap';

export default function Routes() {
    return (
        <BrowserRouter>
            <Navbar bg="dark">
                <Link to="/">Início</Link>
            </Navbar>
            <div className="container">
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/companies" exact component={Companies} />
                    <Route path="/companies/:companyId" exact component={CompaniesForm} />
                    <Route path="/companies/new" exact component={CompaniesForm} />
                    <Route path="/companies/:companyId/employees" exact component={Employees} />
                    <Route path="/companies/:companyId/employees/new" exact component={EmployeesForm} />
                </Switch>
            </div>
        </BrowserRouter>
    );
}

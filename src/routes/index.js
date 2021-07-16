import React from 'react';
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";

import Home from '../components/home/Home';
import Companies from '../components/companies/Companies';
import CompaniesForm from '../components/companies/CompanyForm';
import Employees from '../components/employees/Employees';
import EmployeesForm from '../components/employees/EmployeeForm';
import { Card, Navbar } from 'react-bootstrap';

export default function Routes() {
    return (
        <BrowserRouter>
            <Navbar bg="dark">
                <Link to="/">Início</Link>
            </Navbar>
            <div className="container">
                <Switch>
                    <Card className="mt-3 mb-3">
                        <Card.Body>
                            <Route path="/" exact component={Home} />
                            <Route path="/companies" exact component={Companies} />
                            <Route path="/companies/:companyId" exact component={CompaniesForm} />
                            <Route path="/companies/:companyId/employees" exact component={Employees} />
                            <Route path="/companies/:companyId/employees/:employeeId" exact component={EmployeesForm} />
                        </Card.Body>
                    </Card>
                </Switch>
            </div>
        </BrowserRouter>
    );
}

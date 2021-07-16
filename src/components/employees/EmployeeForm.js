import 'bootstrap/dist/css/bootstrap.min.css';
import Api from '../../service/api';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Alert, Breadcrumb, Button, Col, Form, InputGroup } from 'react-bootstrap';
import InputMask from 'react-input-mask';
import { Link } from 'react-router-dom';

function EmployeeForm() {
    const [employeeData, setEmployeeData] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { employeeId, companyId } = useParams();

    useEffect(() => {
        if (employeeId && employeeId !== 'new') {
            getEmployeeDataFromApi(employeeId);
        }
    }, [employeeId]);

    function handleEmployeeForm(el) {
        const { name, value } = el.target;

        setEmployeeData({ ...employeeData, [name]: value });
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (employeeId !== 'new') {
            putEmployee();
        } else {
            postEmployee();
        }
    }

    async function getEmployeeDataFromApi(employeeId) {
        const res = await Api.get(`companies/${companyId}/employees/${employeeId}`);

        if (res.status === 200 && res.data) {
            setEmployeeData({ ...res.data });
        }
    }

    async function putEmployee() {
        const { name, salary, role } = employeeData;
        const putData = {
            name,
            salary,
            role
        }

        Api.put(`companies/employees/${employeeId}`, putData)
            .then(response => {
                setSuccessMessage('Funcionário editada com sucesso!');
                setTimeout(() => setSuccessMessage(''), 4000);
            })
            .catch(error => {
                setErrorMessage('Erro ao salvar Funcionário! Verifique os dados do formulário!')
                setTimeout(() => setErrorMessage(''), 4000);
            });
    }

    async function postEmployee() {
        const { name, salary, role } = employeeData;
        const postData = {
            name,
            salary: parseFloat(salary),
            role
        }

        Api.post(`companies/${companyId}/employees`, postData)
            .then(response => {
                setSuccessMessage('Funcionário criada com sucesso!');
                setTimeout(() => setSuccessMessage(''), 4000);
            })
            .catch(error => {
                setErrorMessage('Erro ao criar Funcionário! Verifique os dados do formulário!')
                setTimeout(() => setErrorMessage(''), 4000);
            });
    }

    return (
        <div className="container">
            <Breadcrumb>
                <Link to={`/`} className="breadcrumb-item">Home</Link>
                <Link to={`/companies/${companyId}`} className="breadcrumb-item">Empresa</Link>
            </Breadcrumb>
            {employeeId !== 'new'
                ? <h1>Editar Funcionário</h1>
                : <h1>Cadastrar Funcionário</h1>
            }
            <Form className="text-left" onSubmit={handleSubmit}>
                <Form.Row>
                    <Form.Group as={Col} controlId="employeeName" lg="8">
                        <Form.Label>Nome do Funcionário</Form.Label>
                        <Form.Control name="name" type="text" placeholder="Nome do funcionário" value={employeeData.name} onChange={(el) => { handleEmployeeForm(el); }} />
                    </Form.Group>

                    <Form.Group as={Col} controlId="employeeSalary" lg="4">
                        <Form.Label>Salário</Form.Label>
                        <InputGroup>
                            <InputGroup.Text>R$</InputGroup.Text>
                            <InputMask name="salary" type="number" className="form-control" placeholder="Salário" value={employeeData.salary} onChange={(el) => { handleEmployeeForm(el); }} />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group as={Col} controlId="employeeRole" lg="4">
                        <Form.Label>Cargo</Form.Label>
                        <select name="role" className="form-control" value={employeeData.role} onChange={(el) => { handleEmployeeForm(el); }} >
                            <option value="Front-End">Front-End</option>
                            <option value="Back-End">Back-End</option>
                            <option value="Design">Design</option>
                        </select>
                    </Form.Group>

                </Form.Row>

                {errorMessage
                    ? (
                        <Alert variant={'danger'} dismissible>
                            {errorMessage}
                        </Alert>
                    )
                    : ''
                }

                {successMessage
                    ? (
                        <Alert variant={'success'}>
                            {successMessage}
                        </Alert>
                    )
                    : ''
                }

                {employeeId !== 'new'
                    ? <Button variant="primary" type="submit">Editar</Button>
                    : <Button variant="primary" type="submit">Cadastrar</Button>
                }
            </Form>
        </div>
    );
}

export default EmployeeForm;

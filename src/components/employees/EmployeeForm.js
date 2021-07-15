import 'bootstrap/dist/css/bootstrap.min.css';
import Api from '../../service/api';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Alert, Button, Col, Form } from 'react-bootstrap';
import InputMask from 'react-input-mask';

function EmployeeForm({ companyId }) {
    const [employeeData, setEmployeeData] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { employeeId } = useParams();

    useEffect(() => {
        if (employeeId !== 'new') {
            getEmployeeDataFromApi(employeeId);
        }
    }, [companyId]);

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
            setEmployeeData({ ...res.data, cep: res.data.address.zipCode, number: res.data.address.number });
        }
    }

    async function putEmployee() {
        const { phone, cep: zipCode, number } = employeeData;
        const putData = {
            phone,
            address: {
                zipCode,
                number: parseInt(number)
            }
        }

        Api.put(`employees/${employeeId}`, putData)
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
        const { name, phone, cep: zipCode, number } = employeeData;
        const postData = {
            name,
            phone,
            address: {
                zipCode,
                number: parseInt(number)
            }
        }

        Api.post(`employees`, postData)
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
            {employeeId !== 'new'
                ? <h1>Editar Funcionário</h1>
                : <h1>Cadastrar Funcionário</h1>
            }
            <Form className="text-left" onSubmit={handleSubmit}>
                <Form.Row>
                    <Form.Group as={Col} controlId="employeeName" lg="8">
                        <Form.Label>Nome do Funcionário</Form.Label>
                        <Form.Control name="name" type="text" placeholder="Nome da empresa" value={employeeData.name} onChange={(el) => { handleEmployeeForm(el); }} />
                    </Form.Group>

                    <Form.Group as={Col} controlId="employeeSalary" lg="4">
                        <Form.Label>Telefone</Form.Label>
                        <InputMask name="salary" type="number" className="form-control" placeholder="Salário" value={employeeData.salary} onChange={(el) => { handleEmployeeForm(el); }} />
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

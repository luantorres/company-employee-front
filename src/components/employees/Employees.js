import 'bootstrap/dist/css/bootstrap.min.css';
import Api from '../../service/api';
import { useEffect, useState } from 'react';
import { Alert, Button, Modal, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import Pagination from '../pagination/Pagination';
import Companies from '../companies/Companies';

const defaultPage = {
    limit: 3,
    page: 1,
    pages: 0
}

function Employees({ companyId }) {
    const [employees, setEmployees] = useState([]);
    const [pagination, setPagination] = useState(defaultPage);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteEmployeeId, setDeleteEmployeeId] = useState(false);

    const handleCloseDeleteModal = () => {
        setDeleteEmployeeId(false);
        setShowDeleteModal(false);
    };
    const handleShowDeleteModal = (employeeId) => {
        setShowDeleteModal(true);
        setDeleteEmployeeId(employeeId);
    };
    const paginate = pageNumber => setPagination({ ...pagination, page: pageNumber })

    useEffect(() => {
        getEmployees();
    }, [pagination.page]);

    function handleDelete() {
        deleteEmployee(deleteEmployeeId);
    }

    async function getEmployees() {
        const res = await Api.get(`/companies/${companyId}/employees?page=${pagination.page}&limit=${pagination.limit}`);

        if (res.data && res.data.employees) {
            setEmployees(res.data.employees);
            setPagination({ ...res.data });
        }
    }

    async function deleteEmployee(employeeId) {
        if (employeeId) {
            Api.delete(`companies/employees/${employeeId}`)
                .then(response => {
                    setSuccessMessage('Funcionário deletado!');
                    getEmployees();
                    setTimeout(() => setSuccessMessage(''), 4000);
                })
                .catch(error => {
                    setErrorMessage('Erro ao deletar Funcionário!')
                    setTimeout(() => setErrorMessage(''), 4000);
                });
        }
    }

    return (
        <div className="EmployeeList">
            {errorMessage
                ? (
                    <Alert variant={'danger'} className="mb-3 mt-3" dismissible>
                        {errorMessage}
                    </Alert>
                )
                : ''
            }

            {successMessage
                ? (
                    <Alert variant={'success'} className="mb-3 mt-3" >
                        {successMessage}
                    </Alert>
                )
                : ''
            }

            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Deseja deletar a empresa?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeleteModal}>
                        Não
                    </Button>
                    <Button variant="primary"
                        onClick={(el) => {
                            handleDelete();
                            handleCloseDeleteModal();
                        }}
                    >
                        Sim
                    </Button>
                </Modal.Footer>
            </Modal>

            <h3>Funcionários</h3>
            <Link to={`/companies/${companyId}/employees/new`} className="btn btn-primary">Cadastrar funcionário</Link>
            {employees.length
                ?
                    <>
                        <Table striped bordered hover className="mt-3">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Funcionário</th>
                                    <th>Salário</th>
                                    <th>Cargo</th>
                                    <th className="text-center">Opções</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map(employee => (
                                    <tr key={employee._id}>
                                        <td>{employee.name}</td>
                                        <td>{employee.salary}</td>
                                        <td>{employee.role}</td>
                                        <td className="text-center">
                                            <Link to={`/companies/${companyId}/employees/${employee._id}`} className="m-2 btn btn-primary">
                                                <FontAwesomeIcon icon={faPenAlt} />
                                            </Link>
                                            <Button variant="danger" onClick={(el) => handleShowDeleteModal(employee._id)}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <Pagination limit={pagination.limit} page={pagination.page} pages={pagination.pages} paginate={paginate} />
                    </>
                : ''
            }
        </div>
    );
}

export default Employees;

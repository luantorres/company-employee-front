import 'bootstrap/dist/css/bootstrap.min.css';
import Api from '../../service/api';
import { useEffect, useState } from 'react';
import { Alert, Button, Modal, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import Pagination from '../pagination/Pagination';

const defaultPage = {
    limit: 3,
    page: 1,
    pages: 0
}

function Companies() {
    const [companies, setCompanies] = useState([]);
    const [pagination, setPagination] = useState(defaultPage);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteCompanyId, setDeleteCompanyId] = useState(false);

    const handleCloseDeleteModal = () => {
        setDeleteCompanyId(false);
        setShowDeleteModal(false);
    };
    const handleShowDeleteModal = (companyId) => {
        setShowDeleteModal(true);
        setDeleteCompanyId(companyId);
    };
    const paginate = pageNumber => setPagination({ ...pagination, page: pageNumber })

    useEffect(() => {
        getCompanies();
    }, [pagination.page]);

    function handleDelete() {
        deleteCompany(deleteCompanyId);
    }

    async function getCompanies() {
        const res = await Api.get(`companies?page=${pagination.page}&limit=${pagination.limit}`);

        if (res.data && res.data.companies) {
            setCompanies(res.data.companies);
            setPagination({ ...res.data });
        }
    }

    async function deleteCompany(companyId) {
        if (companyId) {
            Api.delete(`companies/${companyId}`)
                .then(response => {
                    setSuccessMessage('Empresa deletada!');
                    getCompanies();
                    setTimeout(() => setSuccessMessage(''), 4000);
                })
                .catch(error => {
                    setErrorMessage('Erro ao deletar Empresa!')
                    setTimeout(() => setErrorMessage(''), 4000);
                });
        }
    }

    return (
        <div className="CompanyList">
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

            <h1 className="mt-2">Empresas</h1>
            <Link to="/companies/new" className="btn btn-primary">Cadastrar empresa</Link>
            {companies && companies.length
                ?
                <>
                    <Table striped bordered hover className="mt-3">
                        <thead className="thead-dark">
                            <tr>
                                <th>Empresa</th>
                                <th>Telefone</th>
                                <th>Endereço</th>
                                <th className="text-center">Opções</th>
                            </tr>
                        </thead>
                        <tbody>
                            {companies.map(company => (
                                <tr key={company._id}>
                                    <td>{company.name}</td>
                                    <td>{company.phone}</td>
                                    <td>{company.address.address}, {company.address.district} - {company.address.number} - {company.address.city} - {company.address.state}{company.address.complement ? `Complemento: ${company.address.complement}` : ''}</td>
                                    <td className="text-center">
                                        <Link to={`/companies/${company._id}`} className="m-2 btn btn-primary">
                                            <FontAwesomeIcon icon={faPenAlt} />
                                        </Link>
                                        <Button variant="danger" onClick={(el) => handleShowDeleteModal(company._id) }>
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

export default Companies;

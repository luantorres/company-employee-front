import 'bootstrap/dist/css/bootstrap.min.css';
import Api from '../../service/api';
import viacepApi from '../../service/viacep';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Alert, Breadcrumb, Button, Card, Col, Form } from 'react-bootstrap';
import InputMask from 'react-input-mask';
import EmployeesList from '../employees/Employees';
import { Link } from 'react-router-dom';

const emptyCepData = {
    cep: '',
    logradouro: '',
    complemento: '',
    bairro: '',
    localidade: '',
    uf: ''
};

const emptyCompanyData = {
    name: '',
    phone: '',
    zipCode: '',
    number: ''
}

function CompanyForm() {
    const [companyData, setCompanyData] = useState(emptyCompanyData);
    const [cepData, setCepData] = useState(emptyCepData);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { companyId } = useParams();

    useEffect(() => {
        if (companyId !== 'new') {
            getCompanyDataFromApi(companyId);
        }
    }, []);

    useEffect(() => {
        if (companyData.cep && companyData.cep.length === 9) {
            getViaCepAddress(companyData.cep);
        }
    }, [ companyData.cep ]);

    function handleAddressChange(el) {
        const { name, value } = el.target;

        setCepData({ ...cepData, [name]: value });
        setCompanyData({ ...companyData, [name]: value });
    }

    function handleCompanyForm(el) {
        const { name, value } = el.target;

        setCompanyData({ ...companyData, [name]: value });
    }

    function handleSubmit (e) {
        e.preventDefault();

        if (companyId !== 'new') {
            putCompany();
        } else {
            postCompany();
        }
    }

    async function getViaCepAddress(cep) {
        if (cep && cep.length === 9) {
            const res = await viacepApi.get(`${cep}/json`);

            if (res.status === 200 && !res.data.erro) {
                setCepData(res.data);
                return;
            }
        }

        setCepData(emptyCepData);
    }

    async function getCompanyDataFromApi(companyId) {
        const res = await Api.get(`companies/${companyId}`);

        if (res.status === 200 && res.data) {
            setCompanyData({ ...res.data, cep: res.data.address.zipCode, number: res.data.address.number });
        }
    }

    async function putCompany() {
        const { phone, cep: zipCode, number } = companyData;
        const putData = {
            phone,
            address: {
                zipCode,
                number: parseInt(number)
            }
        }

        Api.put(`companies/${companyId}`, putData)
            .then(response => {
                setSuccessMessage('Empresa editada com sucesso!');
                setTimeout(() => setSuccessMessage(''), 4000);
            })
            .catch(error => {
                setErrorMessage('Erro ao salvar Empresa! Verifique os dados do formulário!')
                setTimeout(() => setErrorMessage(''), 4000);
            });
    }

    async function postCompany() {
        const { name, phone, cep: zipCode, number } = companyData;
        const postData = {
            name,
            phone,
            address: {
                zipCode,
                number: parseInt(number)
            }
        }

        Api.post(`companies`, postData)
            .then(response => {
                setSuccessMessage('Empresa criada com sucesso!');
                setTimeout(() => setSuccessMessage(''), 4000);
            })
            .catch(error => {
                setErrorMessage('Erro ao criar Empresa! Verifique os dados do formulário!')
                setTimeout(() => setErrorMessage(''), 4000);
            });
    }

    return (
        <div className="container">
            <Breadcrumb>
                <Link to={`/`} className="breadcrumb-item">Home</Link>
                <Link to={`/companies`} className="breadcrumb-item">Todas as empresas</Link>
            </Breadcrumb>

            {companyId !== 'new'
                ? <h1>Editar Empresa</h1>
                : <h1>Cadastrar Empresa</h1>
            }

            <Form className="text-left" onSubmit={handleSubmit}>
                <Form.Row>
                    <Form.Group as={Col} controlId="companyName" lg="8">
                        <Form.Label>Nome de empresa</Form.Label>
                        <Form.Control name="name" type="text" placeholder="Nome da empresa" value={companyData.name} onChange={(el) => { handleCompanyForm(el); }} disabled={companyId !== 'new'} />
                    </Form.Group>

                    <Form.Group as={Col} controlId="companyPhone" lg="4">
                        <Form.Label>Telefone</Form.Label>
                        <InputMask name="phone" type="tel" className="form-control" placeholder="Telefone" mask="(99) 99999-9999" maskChar="" value={companyData.phone} onChange={(el) => {handleCompanyForm(el);}} />
                    </Form.Group>
                </Form.Row>

                <Form.Row>
                    <Form.Group as={Col} lg="8" controlId="companyZipCode">
                        <Form.Label>CEP</Form.Label>
                        <InputMask
                            name="cep"
                            type="text"
                            className="form-control"
                            placeholder="CEP"
                            mask="99999-999"
                            maskChar=""
                            value={companyData.cep}
                            onChange={(el) => {
                                handleAddressChange(el);
                                getViaCepAddress(el.value);
                            }}
                        />
                    </Form.Group>

                    <Form.Group as={Col} lg="4" controlId="companyAddressNumber">
                        <Form.Label>Número</Form.Label>
                        <Form.Control
                            type="number"
                            name="number"
                            placeholder="Número"
                            value={companyData.number}
                            onChange={(el) => {
                                handleCompanyForm(el);
                                handleAddressChange(el);
                            }}
                        />
                    </Form.Group>
                </Form.Row>

                <Form.Row>
                    <Form.Group as={Col} lg="6">
                        <Form.Label>Logradouro</Form.Label>
                        <Form.Control type="text" placeholder="" name="logradouro" readOnly onChange={(el) => handleAddressChange(el)} value={cepData.logradouro} />
                    </Form.Group>

                    <Form.Group as={Col} lg="6">
                        <Form.Label>Complemento</Form.Label>
                        <Form.Control type="text" placeholder="" name="complemento" readOnly onChange={(el) => handleAddressChange(el)} value={cepData.complemento} />
                    </Form.Group>
                </Form.Row>

                <Form.Row>
                    <Form.Group as={Col} lg="5">
                        <Form.Label>Bairro</Form.Label>
                        <Form.Control type="text" placeholder="" name="bairro" readOnly onChange={(el) => handleAddressChange(el)} value={cepData.bairro} />
                    </Form.Group>

                    <Form.Group as={Col} lg="5">
                        <Form.Label>Cidade</Form.Label>
                        <Form.Control type="text" placeholder="" name="localidade" readOnly onChange={(el) => handleAddressChange(el)} value={cepData.localidade} />
                    </Form.Group>

                    <Form.Group as={Col} lg="2">
                        <Form.Label>Estado</Form.Label>
                        <Form.Control type="text" placeholder="" name="uf" readOnly onChange={(el) => handleAddressChange(el)} value={cepData.uf} />
                    </Form.Group>
                </Form.Row>

                {companyId && companyId !== 'new'
                    ?
                    <>
                        <Form.Row>
                            <Form.Group as={Col} xs="12">
                                <Card>
                                    <Card.Body>
                                        <EmployeesList companyId={companyId} />
                                    </Card.Body>
                                </Card>
                            </Form.Group>
                        </Form.Row>
                    </>
                    : ''
                }

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

                {companyId !== 'new'
                    ? <Button variant="primary" type="submit">Editar</Button>
                    : <Button variant="primary" type="submit">Cadastrar</Button>
                }
            </Form>
        </div>
    );
}

export default CompanyForm;

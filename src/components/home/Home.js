import 'bootstrap/dist/css/bootstrap.min.css';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="Home">
            <div className="container">
                <Card className="m-3">
                    <Card.Body>
                        <Card.Title>Empresas</Card.Title>
                        <Link to="/companies" className="btn btn-primary mr-2">Todas as empresas</Link>
                        <Link to="/companies/new" className="btn btn-primary">Cadastrar empresa</Link>
                    </Card.Body>
                </Card>
                <Card className="m-3">
                    <Card.Body>
                        <Card.Title>Funcionários</Card.Title>
                        <Link to="/employees" className="btn btn-primary mr-2">Todos os funcionários</Link>
                        <Link to="/employees/new" className="btn btn-primary">Cadastrar funcionário</Link>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
}

export default Home;

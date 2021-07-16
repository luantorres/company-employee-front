import { faBuilding } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="Home text-center">
            <Card.Title><h1>Empresas <FontAwesomeIcon icon={faBuilding} /></h1></Card.Title>
            <Link to="/companies" className="btn btn-primary mr-2">
                Todas as empresas
            </Link>
            <Link to="/companies/new" className="btn btn-info">
                Cadastrar empresa
            </Link>
        </div>
    );
}

export default Home;

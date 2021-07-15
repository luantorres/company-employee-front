import { useEffect, useState } from "react";
import Pagination from "react-bootstrap/Pagination";

function CustomPagination({ limit, page, pages, paginate }) {
    const [pagination, setPagination] = useState({});

    useEffect(() => {
        setPagination({ limit, page, pages, paginate });
    }, [limit, page, pages, paginate]);

    function handlePageChange(pageNumber) {
        setPagination({ ...pagination, page: pageNumber });

        if (typeof paginate === 'function') {
            paginate(pageNumber);
        }
    }

    return(
        <>
            <Pagination className="justify-content-center mb-1">
                <Pagination.First disabled={pagination.page === 1} onClick={() => handlePageChange(1)} />
                <Pagination.Prev disabled={pagination.page === 1} onClick={() => handlePageChange(Math.max(--pagination.page, 1))} />
                {[...Array(pagination.pages)].map((page, id) => {
                    return <Pagination.Item key={id} active={id+1 === pagination.page} onClick={(el) => handlePageChange(id+1)} >{id+1}</Pagination.Item>
                })}
                <Pagination.Next disabled={pagination.page === pagination.pages} onClick={() => handlePageChange(Math.min(++pagination.page, pagination.pages))} />
                <Pagination.Last disabled={pagination.page === pagination.pages} onClick={() => handlePageChange(pagination.pages)} />
            </Pagination>
            <p className="text-center">Página {pagination.page} de {pagination.pages}</p>
        </>
    )
}

export default CustomPagination;

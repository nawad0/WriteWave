import React from "react";

const Pagination = ({ pageNumber, totalCount, onPageChange }) => {
    const pageSize = 3; // Assuming pageSize is 5, change it accordingly
    const totalPages = Math.ceil(totalCount / pageSize);

    const handleClick = (page) => {
        onPageChange(page);
    };

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
            <button key={i} onClick={() => handleClick(i)}>{i}</button>
        );
    }

    return (
        
        <div>
            {pageNumber > 1 && (
                <button onClick={() => handleClick(pageNumber - 1)}>Previous</button>
            )}
            {pageNumbers}
            {pageNumber < totalPages && (
                <button onClick={() => handleClick(pageNumber + 1)}>Next</button>
            )}
        </div>
    );
};
export default Pagination;
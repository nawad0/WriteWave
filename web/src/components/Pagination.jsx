import React from 'react';
import classes from './Pagination.module.css';

const Pagination = ({ pageNumber, totalCount, onPageChange, pageSize }) => {
	// Assuming pageSize is 5, change it accordingly
	const totalPages = Math.ceil(totalCount / pageSize);

	if (totalPages === 1) {
		// Если всего одна страница, не рендерим пагинацию
		return null;
	}

	const handleClick = (page) => {
		onPageChange(page);
	};

	const pageNumbers = [];
	for (let i = 1; i <= totalPages; i++) {
		const isActive = i === pageNumber ? classes.active : '';
		pageNumbers.push(
			<button key={i} className={isActive} onClick={() => handleClick(i)}>
				{i}
			</button>
		);
	}

	return (
		<div className={classes.pagin}>
			{pageNumber > 1 && <button onClick={() => handleClick(pageNumber - 1)}>Предыдущая</button>}
			{pageNumbers}
			{pageNumber < totalPages && <button onClick={() => handleClick(pageNumber + 1)}>Следующая</button>}
		</div>
	);
};
export default Pagination;

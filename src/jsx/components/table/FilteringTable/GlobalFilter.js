import React from 'react';

export const GlobalFilter = ( {filter, setFilter} ) =>{
	return(
		<div>
			{/* Search : {' '} */}
			<input className="ml-2 input-search form-control" placeholder='Search'
				value={filter || ''}  onChange={e => setFilter(e.target.value)} style={{width: "20%", minWidth: 200, minHeight: 48}}
            />
		</div>
	)
} 
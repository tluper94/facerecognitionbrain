import React from 'react';

const Rank = ({ user }) => {
	return (
		<div>
			<div className='white f2'>{`${user.name}, your number of entries is...`}</div>
			<div className='white f1'>{user.entries}</div>
		</div>
	);
};
export default Rank;

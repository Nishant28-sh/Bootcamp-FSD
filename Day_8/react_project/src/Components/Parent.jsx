import React from 'react'
import Child from './Child';

const Parent = () => {
    const name = "Mukesh Ambani";
    const property = "4 Bhiga Highway vala zamin";
  return (
    <>
    <div>Parent</div>
    <h1>{name}</h1>
    <Child property={property} />
    </>
  );
};

export default Parent


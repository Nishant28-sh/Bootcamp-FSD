import React, { useState } from 'react';

const FormHandling = () => {
    const[name,setName]=useState('');

    const handleChange=(e)=>{
       setName(e.target.value);
      
    }
  return (
    <div>
        <input type="text" placeholder='Enter name'
        onChange={handleChange}/>

        <h2>Hello {name}</h2>
    </div>
    
  );
}

export default FormHandling
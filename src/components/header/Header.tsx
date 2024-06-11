import React from 'react'
import cglogo from '../../assets/cg_lense_logo.png';

function Header() {
  return (
    <div>
        <img src={cglogo} alt="" className='logo-img'/>
    </div>
  )
}

export default Header
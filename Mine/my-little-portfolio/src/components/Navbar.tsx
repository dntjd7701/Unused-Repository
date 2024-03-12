import React from 'react';
import { face } from '../assets';
import { navLinks } from '../constants'

// 네비게이션 바 작업 
const Navbar = () => {
          console.debug('navLinks:', navLinks)

  return (
    <nav className="w-full flex py-6 justify-between items-center">
        <img src={face} alt='woosung' className='w-[55px] h-[70px]'/>
        <ul>
          {navLinks.map(({id, title}) => (
            <li
              key={id}
              className={``}
            >
                <a href={`#${id}`}>{title}</a>

            </li>
          ))}
        </ul>
    </nav>
  )
}

export default Navbar
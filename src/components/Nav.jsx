import React from 'react';
import { Link } from "react-router-dom";

function Nav({account}) {

  return (

<nav class="border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-700 transition ease-in-out hover:bg-gray-950 ">
  <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
    <div class="flex cursor-pointer items-center space-x-3 rtl:space-x-reverse">
        <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">NFT MarketPlace</span>
                      
    </div>

    <div className='w-1/2 flex justify-around px-6'>
                     <Link className='no-underline text-gray-200 text-lg font-semibold hover:text-xl' as={Link} to="/">Home</Link>
                      <Link className='no-underline text-gray-200 text-lg font-semibold hover:text-xl' as={Link} to="/create">Create</Link>
                      <Link className='no-underline text-gray-200 text-lg font-semibold hover:text-xl' as={Link} to="/my-listed-nfts">My Listed Items</Link>
                      <Link className='no-underline text-gray-200 text-lg font-semibold hover:text-xl' as={Link} to="/my-purchases">My Purchases</Link>
    </div>
   
    <div className='flex justify-center items-center'>
    <button type="button" class="inline-flex items-center justify-center border-1 p-2 w-22  h-10 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-hamburger" aria-expanded="false">
    {account.slice(0, 5) + '...' + account.slice(38, 42)}
      </button>

    </div>
    
      
   

  </div>
</nav>

  )
}

export default Nav
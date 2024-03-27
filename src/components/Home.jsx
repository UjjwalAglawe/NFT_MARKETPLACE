import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { click } from '@testing-library/user-event/dist/click';

const Home = ({ marketplace, nft , account }) => {

  useEffect(()=>{
    document.title = "Home"
}, []);

  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const loadMarketplaceItems = async () => {
   
    const itemCount = await marketplace.itemCount()
    let items = []
    for (let i = 1; i <= itemCount; i++) {
      const item = await marketplace.items(i)
      if (!item.sold) {
       
        const uri = await nft.tokenURI(item.tokenId)
        
        const response = await fetch(uri)
        const metadata = await response.json()
      
        const totalPrice = await marketplace.getTotalPrice(item.itemId)
       
        items.push({
          totalPrice,
          itemId: item.itemId,
          seller: item.seller,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image
        })
      }
    }
    setLoading(false)
    setItems(items)
    
  }

  const buyMarketItem = async (item) => {
    await (await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })).wait()
    // await marketplace.item.seller=account;
    loadMarketplaceItems()
  }

  useEffect(() => {
    loadMarketplaceItems()
  }, [])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )
  const homeClick=()=>{
    console.log("click");
  }
  return (
    <>
    <div className="flex justify-center">
      {items.length > 0 ?
      <div className="px-5 py-3 container">
        <div className='flex flex-wrap  gap-4 mt-4 justify-start items-center'>
            {items.map((item, idx) => (
              

        <div className="w-1/5 h-fit bg-red-200 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 ">
            
                <img
                    className="rounded-t-lg overflow-hidden object-cover justify-center w-full max-h-60"
                    src={item.image}
                    alt="flower"
                />
          
            <div className="py-2 flex flex-col items-center flex-center">
                
                    <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {item.name}
                    </h5>
                
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                   <strong>{ethers.utils.formatEther(item.totalPrice)} ETH</strong>
                </p>
                <a onClick={() => homeClick()} className="inline-flex no-underline w-20 items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                   Buy
                    <svg
                        className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                    </svg>
                </a>
            </div>
        </div>
             
            ))}
         </div>
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No listed assets</h2>
          </main>
        )}
        </div>
    </>
  );
}
export default Home
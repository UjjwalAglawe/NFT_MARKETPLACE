import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { click } from '@testing-library/user-event/dist/click';

const Home = ({ marketplace , account }) => {

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
       
        const uri = await marketplace.tokenURI(item.tokenId);
        
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
  <div className="flex justify-center min-h-screen">
    {items.length > 0 ? (
      <div className="container mx-auto mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => (
            <div key={idx} className="bg-gray-100 rounded-lg shadow-md dark:bg-gray-800 hover:transform hover:scale-105 transition-transform duration-300">
              <img
                className="rounded-t-lg object-cover w-full h-56"
                src={item.image}
                alt="flower"
              />
              <div className="p-4">
                <h5 className="text-xl font-semibold text-blue-600 dark:text-blue-400">{item.name}</h5>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <strong>{ethers.utils.formatEther(item.totalPrice)} ETH</strong>
                </p>
                <a
                  onClick={() => buyMarketItem(item)}
                  className="mt-4 w-full px-4 py-2 text-sm font-medium leading-5 text-white transition-transform transform duration-300 bg-gradient-to-r from-blue-500 to-purple-600 border border-transparent rounded-lg shadow-lg hover:scale-105 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                  Buy
                  <svg
                    className="rtl:rotate-180 w-4 h-4 inline-block ml-2 -mt-px"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 14 10"
                    fill="none"
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
    ) : (
      <main style={{ padding: "1rem 0" }}>
        <h2>No listed assets</h2>
      </main>
    )}
  </div>
</>

  );
}
export default Home
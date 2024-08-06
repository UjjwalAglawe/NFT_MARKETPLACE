import { useState, useEffect } from 'react'
import { ethers } from "ethers"


function renderSoldItems(items) {

 
    
  return (
    <>
  <h2 className="text-2xl font-semibold text-center mt-8">Sold</h2>
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
              <strong>For {ethers.utils.formatEther(item.totalPrice)} ETH</strong><br />
              <strong>Received {ethers.utils.formatEther(item.price)} ETH</strong>
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
</>

  )
}

export default function MyItem({ marketplace, account }) {
  const [loading, setLoading] = useState(true)
  const [listedItems, setListedItems] = useState([])
  const [soldItems, setSoldItems] = useState([])

  useEffect(()=>{
    document.title = "My Items"
}, []); 

  const loadListedItems = async () => {
    // Load all sold items that the user listed
    const itemCount = await marketplace.itemCount()
    let listedItems = []
    let soldItems = []
    for (let indx = 1; indx <= itemCount; indx++) {
      const i = await marketplace.items(indx)
      
      if (i.ogOwner === account) {
        
        // get uri url from nft contract
        const uri = await marketplace.tokenURI(i.tokenId)
        // use uri to fetch the nft metadata stored on ipfs 
        const response = await fetch(uri)
        const metadata = await response.json()
        // get total price of item (item price + fee)
        const totalPrice = await marketplace.getTotalPrice(i.itemId)
        // define listed item object
        let item = {
          totalPrice,
          price: i.price,
          itemId: i.itemId,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image
        }
        listedItems.push(item)
        // Add listed item to sold items array if sold
        if (i.sold) soldItems.push(item)
      }
    }
    setLoading(false)
    setListedItems(listedItems)
    setSoldItems(soldItems)
  }

  useEffect(() => {
    loadListedItems()
  }, [])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Fetching...</h2>
    </main>
  )
  return (
    <div className="flex justify-center min-h-screen">
  {listedItems.length > 0 ? (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-semibold text-center mt-8">Created NFT</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
        {listedItems.map((item, idx) => (
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
            </div>
          </div>
        ))}
      </div>
      {soldItems.length > 0 && renderSoldItems(soldItems)}
    </div>
  ) : (
    <main className="flex justify-center items-center min-h-screen">
      <h2 className="text-xl">No listed NFT's</h2>
    </main>
  )}
</div>

  );
}
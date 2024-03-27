import { useState, useEffect } from 'react'
import { ethers } from "ethers"


export default function Purchaes({ marketplace, nft, account }) {
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  const [listedItems, setListedItems] = useState([])
  const [soldItemss, setSoldItems] = useState([])

  useEffect(() => {
    document.title = "Purchases"
  }, []);



  const loadPurchasedItems = async () => {

    const itemCount = await marketplace.itemCount()
    let listedItems = []
    let soldItems = []

    for (let indx = 1; indx <= itemCount; indx++) {
      // const i = await marketplace.Bought(indx);
      const i = await marketplace.items(indx);
      // console.log("This is Item");
      // console.log(i.seller);

      if (i.seller === account) {

        // get uri url from nft contract
        console.log('INSIDE IF');

        const uri = await nft.tokenURI(i.tokenId)
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
        console.log("This is Item");
        console.log(item);
        // purchases.push(item);
        // setPurchases(purchases)


        listedItems.push(item)
        // // Add listed item to sold items array if sold
        if (i.sold) soldItems.push(item)
      }
    console.log("This is listed Items");
    console.log(listedItems);
    
    }
    setLoading(false)
    // setPurchases(purchases)
    setListedItems(listedItems)
    setSoldItems(soldItems)

  }






  useEffect(() => {

    loadPurchasedItems();

  }, [])



  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )


  return (
    <div className="flex justify-center">
      {soldItemss.length > 0 ?
        <div className="px-5 container">
          <div className='flex flex-wrap  gap-4 mt-4 justify-start items-center'>
            {soldItemss.map((item, idx) => (
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

                </div>
              </div>
            ))}
          </div>
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No purchases</h2>
          </main>
        )}
    </div>
  );
}
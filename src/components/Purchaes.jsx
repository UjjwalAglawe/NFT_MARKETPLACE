import { useState, useEffect } from 'react'
import { ethers } from "ethers"

export default function Purchases({ marketplace, account }) {
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = "Purchases"
    loadPurchasedItems();
  }, []);

  const loadPurchasedItems = async () => {
    const itemCount = await marketplace.itemCount();
    let purchasedItems = [];

    for (let indx = 1; indx <= itemCount; indx++) {
      const item = await marketplace.items(indx);

      // Check if the item has been sold and if the buyer is the current account
      if (item.sold && item.seller === account) {
        // Get the token URI from the NFT contract
        const uri = await marketplace.tokenURI(item.tokenId);

        // Fetch metadata from the token URI
        const response = await fetch(uri);
        const metadata = await response.json();

        // Get the total price of the item
        const totalPrice = await marketplace.getTotalPrice(item.itemId);

        // Create the item object
        let purchasedItem = {
          totalPrice,
          price: item.price,
          itemId: item.itemId,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image
        };

        // Add the purchased item to the list
        purchasedItems.push(purchasedItem);
      }
    }

    // Set the state with the list of purchased items
    setPurchases(purchasedItems);
    setLoading(false);
  };

  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )

  return (
    <div className="flex justify-center min-h-screen">
  {purchases.length > 0 ? (
    <div className="container mx-auto mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
        {purchases.map((item, idx) => (
          <div key={idx} className="bg-gray-100 rounded-lg shadow-md dark:bg-gray-800 hover:transform hover:scale-105 transition-transform duration-300">
            <img
              className="rounded-t-lg object-cover w-full h-56"
              src={item.image}
              alt="NFT"
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
    </div>
  ) : (
    <main className="flex justify-center items-center min-h-screen">
      <h2 className="text-xl">No purchases</h2>
    </main>
  )}
</div>

  );
}

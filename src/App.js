import './App.css';
import {marketplace_abi, nft_abi} from "./abi.js"
import { ethers } from 'ethers';
import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Hero from './components/Home.jsx';
import Create from './components/Create.jsx';
import MyItem from './components/MyItem.jsx';
import MyPurchases from "./components/Mypurchases.jsx";
import Nav from './components/Nav.jsx';
import Purchaes from './components/Purchaes.jsx';

function App() {

  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState("");
  const [marketplace, setMarketplace]= useState({});
  // const [nft, setNFT] = useState({})


  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload()
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        setLoading(false)
        // let marketplaceAddress = "0xcF858f53eB4bDD05CC98c275D2C22d97A89d0DE4";
        // let nftAddress = "0x477E818F18393e8bb755283493E5e2D0039Ee163";
        let marketplaceAddress="0xA87C4A395f21C38D1BC43b9E2b6FC97Fe3056178";

        const marketplacecontract = new ethers.Contract(
          marketplaceAddress,
          marketplace_abi,
          signer
        );

        // const nftcontract = new ethers.Contract(
        //   nftAddress,
        //   nft_abi,
        //   signer
        // )

        //console.log(contract);
        setMarketplace(marketplacecontract);
        // setNFT(nftcontract)
       
      } else {
        console.error("Metamask is not installed");
      }
    };

    provider && loadProvider();
  }, []);


  return (
   
    <BrowserRouter>
     <ToastContainer/>
    <div className="App bg-gradient-to-r from-indigo-500 to-indigo-200...">
      <Nav account={account}/>
      {
        loading ? (<div>Connecting to Metamask</div>) :(
          <Routes>
          <Route path='/' element={<Hero marketplace={marketplace} account={account}/>}/>
          <Route path='/create'  element={<Create marketplace={marketplace} />}/>
          <Route path='/my-listed-nfts' element={<MyItem marketplace={marketplace} account={account} />}/>
          {/* <Route path='/my-purchases' element={<MyPurchases marketplace={marketplace} nft={nft} account={account} />} /> */}
          <Route path='/my-purchases' element={<Purchaes marketplace={marketplace} account={account} />} />
        </Routes>
        )}
    
    </div>
    </BrowserRouter>
  );
}

export default App;

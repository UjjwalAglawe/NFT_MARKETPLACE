import { useEffect, useState } from 'react'
import { ethers } from "ethers"
import { Row, Form, Button } from 'react-bootstrap'
import axios from 'axios'
import { toast } from 'react-toastify'


const Create = ({ marketplace, nft }) => {

  console.log(API)
  console.log(SECRET)

    const [nftimage, setNFTImage] = useState();
    const [forminfo, setFormInfo] = useState({
      title:"",
      description:"",
      price: null
    });

    useEffect(()=>{
      document.title = "Create"
  }, []);
  
    const handleChange = (event) => {
      const { name, value } = event.target;
      setFormInfo((prevState) => ({ ...prevState, [name]: value }));
    };
  
    const changeHandler = (event) => {
      setNFTImage(event.target.files[0]);
    };
  
    const handleEvent = async (e) => {
      e.preventDefault();
      console.log(nftimage)
      console.log(forminfo);

      const formData = new FormData();
      const jsonformData = new FormData();
  
      formData.append('file', nftimage);
  
      const metadata = JSON.stringify({
          name: forminfo.title,
          description: forminfo.description
      });
      jsonformData.append('pinataMetadata', metadata);
      
      const options = JSON.stringify({
          cidVersion: 0,
      })
      jsonformData.append('pinataOptions', options);
  
      try{
  
          const resFile = await axios({
              method: "post",
              url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
              data: formData,
              headers: {
                pinata_api_key: `0a13ef76fb9e01561e05`,
                pinata_secret_api_key: `f0a2d096004e4f0483a64d06236ddc252b8d8acf612cde6465bc78f013a08ab0`,
                "Content-Type": "multipart/form-data",
              },
            });
  
          console.log(resFile.data);
  
          const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
  
          const info ={
              name: forminfo.title,
              description: forminfo.description,
              image: ImgHash,
              price: forminfo.price
          }
  
          async function pinJSONToPinata(info) {
              const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
              const headers = {
                  'Content-Type': 'application/json',
                  'pinata_api_key': `0a13ef76fb9e01561e05`,
                  'pinata_secret_api_key': `f0a2d096004e4f0483a64d06236ddc252b8d8acf612cde6465bc78f013a08ab0`
              };
  
              try {
                  const res = await axios.post(url, info, { headers });
                  const meta = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`
                  console.log(meta);
                  mintThenList(meta);
              } catch (error) {
                  console.error(error);
              }
  
          }
      
       pinJSONToPinata(info)
  
        //   setFormInfo({
        //       title:"",
        //       description:"",
        //       price:""

        //   })
        //   setNFTImage(null);
      
        } catch (error) {
          console.log(error);
        }
  
  
      
    };


  const mintThenList = async (uri) => { 
    toast.info("Confirm to Mint the NFT", {
      position: "top-center"
    })
  const tx1=  await(await nft.mint(uri))

  toast.info("Wait till transaction Confirms....", {
    position: "top-center"
  })

  await tx1.wait()
    const id = await nft.tokenCount()

    toast.info("Approve To sell NFT on marketplace", {position:"top-center"})
    
  const tx2 = await(await nft.setApprovalForAll(marketplace.address, true))

  toast.info("Wait till transaction Confirms....", {
    position: "top-center"
  })

  await tx2.wait()
    
    toast.info("Confirm to Add Item to Marketplace", {position:"top-center"})
    const listingPrice = ethers.utils.parseEther(forminfo.price.toString())
   const tx3 =  await(await marketplace.makeItem(nft.address, id, listingPrice))
   toast.info("Wait till transaction Confirms....", {
    position: "top-center"
  })

  await tx3.wait()
    toast.success("NFT added to marketplace successfully", {position:"top-center"})
  }


  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
          <div className="content mx-auto">
            <Row className="g-4">
              <Form.Control
                type="file"
                required
                name="file"
                onChange={changeHandler}
              />
              <Form.Control onChange={handleChange} name="title" id="title"  size="lg" required type="text" placeholder="Name" />
              <Form.Control onChange={handleChange} name="description" id="description" size="lg" required as="textarea" placeholder="Description" />
              <Form.Control onChange={handleChange} name="price" id="price" size="lg" required type="number" placeholder="Price in ETH" />
              <div className="d-grid px-0">
                <Button onClick={handleEvent} variant="primary" size="lg">
                  Create & List NFT!
                </Button>
              </div>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Create
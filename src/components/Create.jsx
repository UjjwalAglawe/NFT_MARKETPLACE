// import { useEffect, useState } from 'react'
// import { ethers } from "ethers"
// import { Row, Form, Button } from 'react-bootstrap'
// import axios from 'axios'
// import { toast } from 'react-toastify'


// const Create = ({ marketplace, nft }) => {

//     const [nftimage, setNFTImage] = useState();
//     const [forminfo, setFormInfo] = useState({
//       title:"",
//       description:"",
//       price: null
//     });

//     useEffect(()=>{
//       document.title = "Create"
//   }, []);

//     const handleChange = (event) => {
//       const { name, value } = event.target;
//       setFormInfo((prevState) => ({ ...prevState, [name]: value }));
//     };

//     const changeHandler = (event) => {
//       setNFTImage(event.target.files[0]);
//     };

//     const handleEvent = async (e) => {
//       e.preventDefault();
//       console.log(nftimage)
//       console.log(forminfo);

//       const formData = new FormData();
//       const jsonformData = new FormData();

//       formData.append('file', nftimage);

//       const metadata = JSON.stringify({
//           name: forminfo.title,
//           description: forminfo.description
//       });
//       jsonformData.append('pinataMetadata', metadata);

//       const options = JSON.stringify({
//           cidVersion: 0,
//       })
//       jsonformData.append('pinataOptions', options);

//       try{

//           const resFile = await axios({
//               method: "post",
//               url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
//               data: formData,
//               headers: {
//                 pinata_api_key: `1a7cac69d0dac2bceaeb`,
//                 pinata_secret_api_key: `d70366959ea7a7fd5396abed2b11003168369c278987b9d6cb09d195d71cebc2`,
//                 "Content-Type": "multipart/form-data",
//               },
//             });

//           console.log(resFile.data);

//           const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;

//           const info ={
//               name: forminfo.title,
//               description: forminfo.description,
//               image: ImgHash,
//               price: forminfo.price
//           }

//           async function pinJSONToPinata(info) {
//               const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
//               const headers = {
//                   'Content-Type': 'application/json',
//                   'pinata_api_key': `1a7cac69d0dac2bceaeb`,
//                   'pinata_secret_api_key': `d70366959ea7a7fd5396abed2b11003168369c278987b9d6cb09d195d71cebc2`
//               };

//               try {
//                   const res = await axios.post(url, info, { headers });
//                   const meta = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`
//                   console.log(meta);
//                   mintThenList(meta);
//               } catch (error) {
//                   console.error(error);
//               }

//           }

//        pinJSONToPinata(info)

//         //   setFormInfo({
//         //       title:"",
//         //       description:"",
//         //       price:""

//         //   })
//         //   setNFTImage(null);

//         } catch (error) {
//           console.log(error);
//         }



//     };


//     const mintThenList = async (uri) => { 
//       // toast.info("Confirm to Mint the NFT", {
//       //   position: "top-center"
//       // })
//     const tx1=  await(await nft.mint(uri))

//     toast.info("Wait till transaction Confirms....", {
//       position: "top-center"
//     })

//     await tx1.wait()
//       const id = await nft.tokenCount()

//       toast.info("Approve To sell NFT on marketplace", {position:"top-center"})

//     const tx2 = await(await nft.approve(marketplace.address, id))

//     toast.info("Wait till transaction Confirms....", {
//       position: "top-center"
//     })

//     await tx2.wait()

//       toast.info("Confirm to Add Item to Marketplace", {position:"top-center"})
//       const listingPrice = ethers.utils.parseEther(forminfo.price.toString())
//       console.log("This is listing price")
//       console.log(listingPrice)
//      const tx3 =  await(await marketplace.makeItem(nft.address, id, listingPrice))
//      toast.info("Wait till transaction Confirms....", {
//       position: "top-center"
//     })

//     await tx3.wait()
//       toast.success("NFT added to marketplace successfully", {position:"top-center"})
//     }




//   return (
//     <div style={{"min-height":"100vh"}} >
//       <div className="flex ml-20 mt-20">
//         <main role="main">
//           <div className="content mx-auto text-xl ml-20 space-y-8 text-white shadow-2xl rounded-lg border-2 p-5 px-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ...">
//             <Row className="g-4">
//               <Form.Control
//                 type="file"
//                 required
//                 name="file"
//                 onChange={changeHandler}
//               />
//               <Form.Control onChange={handleChange} name="title" id="title"  size="lg"  required type="text" placeholder="Name" />
//               <Form.Control onChange={handleChange} name="description" id="description" size="lg" required as="textarea" placeholder="Description" />
//               <Form.Control onChange={handleChange} name="price" id="price" size="lg" required type="number" placeholder="Price in ETH" />
//               <div className="d-grid px-0">
//                 <Button onClick={handleEvent} variant="primary" size="lg">
//                   Create NFT!
//                 </Button>
//               </div>
//             </Row>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

// export default Create


import { useEffect, useState } from 'react'
import { ethers } from "ethers"
import { Row, Form, Button } from 'react-bootstrap'
import axios from 'axios'
import { toast } from 'react-toastify'


const Create = ({ marketplace }) => {

  const [nftimage, setNFTImage] = useState();
  // const [videoFile, setVideoFile] = useState();
  const [forminfo, setFormInfo] = useState({
    title: "",
    description: "",
    price: null
  });


  useEffect(() => {
    document.title = "Create"
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  const changeHandler = (event, fileType) => {
    if (event.target.files && event.target.files[0]) {
      // if (fileType === 'image') {
      //   setNFTImage(event.target.files[0]);
      // } else if (fileType === 'video') {
      //   setVideoFile(event.target.files[0]);
      // }
      setNFTImage(event.target.files[0]);
    }
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

    try {

      const resFile = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          pinata_api_key: `1a7cac69d0dac2bceaeb`,
          pinata_secret_api_key: `d70366959ea7a7fd5396abed2b11003168369c278987b9d6cb09d195d71cebc2`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(resFile.data);

      const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;

      // Upload video
      // const formDataVideo = new FormData();
      // formDataVideo.append("file", videoFile);
      // const resVideo = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formDataVideo, {
      //     headers: {
      //         pinata_api_key: `18475aac732291be8c7c`,
      //         pinata_secret_api_key: `4593b2a9ce8fd83a816bd16971d4454828f291374549874739250f5d95128009`,
      //         "Content-Type": "multipart/form-data",
      //     },
      // });
      // const videoHash = `https://gateway.pinata.cloud/ipfs/${resVideo.data.IpfsHash}`;

      const info = {
        name: forminfo.title,
        description: forminfo.description,
        image: ImgHash,
        // video:videoHash,
        price: forminfo.price
      }

      async function pinJSONToPinata(info) {
        const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
        const headers = {
          'Content-Type': 'application/json',
          'pinata_api_key': `1a7cac69d0dac2bceaeb`,
          'pinata_secret_api_key': `d70366959ea7a7fd5396abed2b11003168369c278987b9d6cb09d195d71cebc2`
        };

        try {
          const res = await axios.post(url, info, { headers });
          const meta = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`
          console.log(meta);
          mintThenList(meta, info.price);
        } catch (error) {
          console.error(error);
        }

      }

      pinJSONToPinata(info)


    } catch (error) {
      console.log(error);
    }



  };

  const mintThenList = async (uri) => {
    toast.info("Confirm to Mint the NFT", {
      position: "top-center"
    })
    const listingPrice = ethers.utils.parseEther(forminfo.price.toString())
    const tx1 = await (await marketplace.mint(uri, listingPrice))

    toast.info("Wait till transaction Confirms....", {
      position: "top-center"
    })

    await tx1.wait()
    const id = await marketplace.tokenCount()

    toast.success("NFT added to marketplace successfully", { position: "top-center" });
  }



  return (
    (
      <div className="min-h-screen flex justify-center items-center">
        <main className="container mx-auto px-4">
          <div className="content text-white shadow-lg rounded-lg p-5 flex flex-col items-center">
            <div className="space-y-8 w-full max-w-[500px]">
              <Row className="g-4">
                <Form.Group>
                  <Form.Label className="text-lg">Upload Thumbnail Image</Form.Label>
                  <Form.Control
                    type="file"
                    required
                    name="image"
                    accept="image/*" // Only accept image files
                    onChange={(event) => changeHandler(event, 'image')}
                    className="max-w-[500px] w-full"
                  />
                </Form.Group>
                {/* <Form.Group>
            <Form.Label className="text-lg">Upload Video</Form.Label>
            <Form.Control
              type="file"
              required
              name="video"
              accept="video/*" // Only accept video files
              onChange={(event) => changeHandler(event, 'video')}
              className="max-w-[500px] w-full"
            />
          </Form.Group> */}
                <Form.Control
                  onChange={handleChange}
                  name="title"
                  id="title"
                  size="lg"
                  required
                  type="text"
                  placeholder="Name"
                  className="text-lg max-w-[200px] w-full"
                />
                <Form.Control
                  onChange={handleChange}
                  name="description"
                  id="description"
                  size="lg"
                  required
                  as="textarea"
                  placeholder="Description"
                  className="text-lg max-w-[200px] w-full"
                />
                <Form.Control
                  onChange={handleChange}
                  name="price"
                  id="price"
                  size="lg"
                  required
                  type="number"
                  placeholder="Price in XRP"
                  className="text-lg max-w-[200px] w-full"
                />
                <div className="flex justify-center">
                  <Button onClick={handleEvent} variant="primary" size="lg" className="inline-block rounded-full border-2 border-primary px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-primary transition duration-150 ease-in-out hover:border-primary-accent-300 hover:bg-primary-50/50 hover:text-primary-accent-300 focus:border-primary-600 focus:bg-primary-50/50 focus:text-primary-600 focus:outline-none focus:ring-0 active:border-primary-700 active:text-primary-700 motion-reduce:transition-none dark:text-primary-500 dark:hover:bg-blue-950 dark:focus:bg-blue-950 text-white">
                    Create NFT!
                  </Button>
                </div>
              </Row>
            </div>
          </div>
        </main>
      </div>


    )
  );
}

export default Create
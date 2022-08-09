import './App.css';
import "./market.css";
import QRCode from 'qrcode.react';
import "bootstrap/dist/css/bootstrap.min.css";
import { getBalance, fetchCardsOf } from './api/UseCaver';
import React, { useState } from 'react';
import * as KlipAPI from './api/UseKlip';
import {Alert, Card, Container, Nav, Form, Button} from 'react-bootstrap';
import { MARKET_CONTRACT_ADDRESS } from './constants';


const DEFAULT_QR_CODE = "DEFAULT";
const DEFAULT_ADDRESS = '0x0000000000000000000000';
function App() {
  //state Data

  // Global Data (domain data)
  //address
  // nft
  const [nfts, setNfts] = useState([]); //{tokenId: '101', tokenUri: ''}
  const [myBalance, setMyBalance] = useState('0');
  const [myAddress, setMyAddress] = useState(DEFAULT_ADDRESS);

  //UI
  const [qrvalue, setQrvalue] = useState(DEFAULT_QR_CODE);
  const [tab, setTab] = useState('MINT') //market, mint, wallet
  const [mintImageUrl, setMintImageUrl] = useState("");
  //tab
  //mintInput

  //Modal

  //fetchMarketNFTs
  const fetchMarketNFTs = async ()=> {
    const _nfts = await fetchCardsOf(MARKET_CONTRACT_ADDRESS);
    setNfts(_nfts);
  }

  //fetchMyNFTs
  const fetchMyNFTs = async ()=> {
    const _nfts = await fetchCardsOf('0xD9af7D7E78E11D97DD84BE78CdFa3C2BCaA25A14');
    setNfts(_nfts);
  }

  //onClickMint
  const onClickMint = async (uri)=> {
    if(myAddress === DEFAULT_ADDRESS) alert("NO ADRESS");
    const randomTokenId = parseInt(Math.random()*1000000);
    KlipAPI.mintCardWithURI(myAddress,randomTokenId, uri, setQrvalue, (result)=> {
      alert(JSON.stringify(result));
    });
  };
  //onClickMyCard
  //onClickMarketCard

  const getUserData = () => {
    KlipAPI.getAddress(setQrvalue, async (address)=> {
      setMyAddress(address);
      const _balance = await getBalance(address);
      setMyBalance(_balance);
    });
  };

  return (
    <div className="App">
      <div style = {{backgroundColor: "#B6D7A8" , padding: 10}}>
        {/*주소 잔고*/}
        <div 
        style = {{
          fontSize: 30, 
          fontHeight: "bold", 
          paddingLeft: 5, 
          marginTop: 10, 
          color: "white",
          }}
        >
             내 지갑
        </div>
        {myAddress}
        <br/>
        <Alert 
        onClick={getUserData}
          variant ={"balance"} 
          style={{backgroundColor: "#B7BFE4", fontSize: 25, color:"white"}}
          >
            {myBalance}
          </Alert>
          <Container 
        style = {{
          backgroundColor: "white",
          width: 300, 
          height: 300, 
          padding: 20,
         }}>
        <QRCode value={qrvalue} size={256} style ={{margin: "auto"}}/>
        <br/>
        <br/>
        </Container>

          {/*갤러리(마켓, 내 지갑) */}
          {tab ==="MARKET" || tab === "WALLET" ? (
             <div className='container' style = {{padding:0, width: "100%"}}>
            {nfts.map((nft,index)=> (
              <Card.Img className='img-responsive' src={nfts[index].uri}></Card.Img>
            ))}
            </div>
             ) :null }
        {/*발행 페이지*/}
        {tab === "MINT" ?  (
        <div className='container' style={{padding:0, width: "100%"}}>
          <Card className='text-center' style={{color:"black", height:"50%",borderColor:"#C5B358" }}>
            <Card.Body style={{opacity: 0.9, backgroundColor:"black" }}>
              {mintImageUrl !== ""? <Card.Img src={mintImageUrl} height={"50%"} />:null}
              <Form>
                <Form.Group>
                  <Form.Control
                  value={mintImageUrl}
                  onChange={(e)=> {
                    console.log(e.target.value);
                    setMintImageUrl(e.target.value);
                  }}
                  type="text"
                  placeholder="이미지 주소를 입력해주세요"
                  />
                </Form.Group>
                <br/>
                <Button
                onClick={()=>{
                  onClickMint(mintImageUrl)}} 
                variant="primary" 
                style={{
                  backgroundColor:"#B10034",
                  borderColor: "B10034"
                  }}> 발행하기
                </Button>
              </Form>
            </Card.Body>
          </Card>

          </div> ): null}
        </div>
        <button onClick={fetchMyNFTs}>
         NFT 가져오기
        </button>

        {/*모달*/}
        {/*탭*/}
        <nav style ={{backgroundColor:"#1b1717", height: 45}} 
          className="navbar fixed-bottom navbar-light"
          role="navigation">
          <Nav className="w-100">
            <div className='d-flex flex-row justify-content-around w-100'>
              <div onClick={()=> {
                setTab("MARKET");
                fetchMarketNFTs();
              }}
              className = "row d-flex flex-column justify-content-center align-items-center"
            >
              <div>MARKET</div>
            </div>
            <div onClick={()=> {
                setTab("MINT");
              }}
              className = "row d-flex flex-column justify-content-center align-items-center"
            >
              <div>MINT</div>
            </div>
            <div onClick={()=> {
                setTab("WALLET");
                fetchMyNFTs();
              }}
              className = "row d-flex flex-column justify-content-center align-items-center"
            >
              <div>WALLET</div>
            </div>
          </div>
          </Nav>
        </nav>
    </div>
  );
}

export default App;

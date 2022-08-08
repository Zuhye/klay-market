import './App.css';
import "./market.css";
import QRCode from 'qrcode.react';
import "bootstrap/dist/css/bootstrap.min.css";
import { getBalance, readCount, setCount } from './api/UseCaver';
import { useState } from 'react';
import * as KlipAPI from './api/UseKlip';
import {Alert, Container} from 'react-bootstrap';


const DEFAULT_QR_CODE = "DEFAULT";
const DEFAULT_ADDRESS = '0x0000000000000000000000';
function App() {
  //state Data

  // Global Data (domain data)
  //address
  // nft
  const [nfts, setNfts] = useState([]);
  const [myBalance, setMyBalance] = useState('0');
  const [myAddress, setMyAddress] = useState(DEFAULT_ADDRESS);

  //UI
  const [qrvalue, setQrvalue] = useState(DEFAULT_QR_CODE);
  //tab
  //mintInput

  //Modal

  //fetchMarketNFTs
  //fetchMyNFTs
  //onClickMint
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
        </div>
        {/*주소 잔고*/}
        <Container 
        style = {{
          backgroundColor: "white",
          width: 300, 
          height: 300, 
          padding: 20,
         }}>
          <QRCode value={qrvalue} size={256} style ={{margin: "auto"}}/>
        </Container>
        
        {/*갤러리*/}
        {/*발행 페이지*/}
        {/*탭*/}
        {/*모달*/}
    </div>
  );
}

export default App;

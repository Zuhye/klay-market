import './App.css';
import QRCode from 'qrcode.react';
import { getBalance, readCount, setCount } from './api/UseCaver';
import { useState } from 'react';
import * as KlipAPI from './api/UseKlip';


const DEFALUT_QR_CODE = "DEFALUT";
function App() {
  const [balance, setBalance] = useState('0');
  const [qrvalue, setQrvalue] = useState(DEFALUT_QR_CODE);

  //readCount();
  //getBalance('0xd9af7d7e78e11d97dd84be78cdfa3c2bcaa25a14');
  
  const onClickGetAddress = () => {
    KlipAPI.getAddress(setQrvalue);
  }

  const onClickSetCount = () => {
    KlipAPI.setCount(2000, setQrvalue);
  }

  return (
    <div className="App">
      <header className="App-header">
        <button 
          onClick={()=>{
          onClickGetAddress();
          }}>주소 가져오기</button>

        <button 
          onClick={()=>{
          onClickSetCount();
          }}>카운트 값 변경</button>

        <br/>
        <br/>
        <br/>
        <QRCode value={qrvalue}/>
        <p>{balance}</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

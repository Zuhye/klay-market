import './App.css';
import "./market.css";
import QRCode from 'qrcode.react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faHome, faWallet, faPlus} from '@fortawesome/free-solid-svg-icons';
import "bootstrap/dist/css/bootstrap.min.css";
import { getBalance, fetchCardsOf } from './api/UseCaver';
import React, { useEffect, useState } from 'react';
import * as KlipAPI from './api/UseKlip';
import {Alert, Card, Container, Nav, Form, Button, Modal, Row, Col} from 'react-bootstrap';
import { MARKET_CONTRACT_ADDRESS } from './constants';


const DEFAULT_QR_CODE = "DEFAULT";
const DEFAULT_ADDRESS = '0x0000000000000000000000';
function App() {

  const [nfts, setNfts] = useState([]); //{id: '101', uri: ''}
  const [myBalance, setMyBalance] = useState('0');
  const [myAddress, setMyAddress] = useState(DEFAULT_ADDRESS);

  //UI
  const [qrvalue, setQrvalue] = useState(DEFAULT_QR_CODE);
  const [tab, setTab] = useState('MARKET') //market, mint, wallet
  const [mintImageUrl, setMintImageUrl] = useState("");

  //Modal

  const[showModal, setShowModal] = useState(false);
  const[modalProps, setModalProps] = useState({
    title: "MODAL", 
    onConfirm:() => {},
  });

  const rows=nfts.slice(nfts.length/2);

  const fetchMarketNFTs = async ()=> {
    const _nfts = await fetchCardsOf(MARKET_CONTRACT_ADDRESS);
    setNfts(_nfts);
  }

  const fetchMyNFTs = async ()=> {
    if(myAddress === DEFAULT_ADDRESS)  {
      alert("NO ADRESS");
      return;
    }
    const _nfts = await fetchCardsOf('0xBd1374A87f8ea0E5e0AcC4bA200dcfa784a02A88');
    setNfts(_nfts);
  }

  const onClickMint = async (uri)=> {
    if(myAddress === DEFAULT_ADDRESS)  {
      alert("NO ADRESS");
      return;
    }
    const randomTokenId = parseInt(Math.random()*1000000);
    KlipAPI.mintCardWithURI(myAddress,randomTokenId, uri, setQrvalue, (result)=> {
      alert(JSON.stringify(result));
    });
  };

  const onClickCard =(id) => {
    if (tab ==="WALLET") {
      setModalProps({
        title: "NFT를 마켓에 올리시겠어요?", 
        onConfirm:()=> {
          onClickMyCard(id);
        },
      });
      setShowModal(true);
    }
    if (tab === "MARKET") {
      setModalProps({
        title: "NFT를 구매하시겠어요?", 
        onConfirm:()=> {
          onClickMarketCard(id);
        },
      });
      setShowModal(true);
    }
  };
  const onClickMyCard = (tokenId)=> {
    KlipAPI.listingCard(myAddress, tokenId, setQrvalue, (result)=> {
      alert(JSON.stringify(result));
    });
  };

  const onClickMarketCard = (tokenId) => {
    KlipAPI.buyCard(tokenId, setQrvalue, (result)=> {
      alert(JSON.stringify(result));
    });
  }

  const getUserData = () => {
    setModalProps({
      title: "Klip 지갑을 연동하시겠습니까?",
      onConfirm: ()=> {
        KlipAPI.getAddress(setQrvalue, async (address)=> {
          setMyAddress(address);
          const _balance = await getBalance(address);
          setMyBalance(_balance);
        }); 
      }
    });
    setShowModal(true);
  };

  useEffect(() => {
    getUserData();
    fetchMarketNFTs();
  }, [])
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
            {myAddress !== DEFAULT_ADDRESS 
            ? `${myBalance} KLAY` 
            : "지갑 연동하기"}
          </Alert>
          {qrvalue !== "DEFAULT" ? (
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
        ) : null }

          {/*갤러리(마켓, 내 지갑) */}
          {tab ==="MARKET" || tab === "WALLET" ? (
             <div className='container' style = {{padding:0, width: "100%"}}>
              {rows.map((o, rowIndex)=> (
                <Row>
                  <Col style ={{marginRight:0, paddingRight:0}}>
                    <Card onClick={()=> {
                      onClickCard(nfts[rowIndex*2].id);
                    }}>
                      <Card.Img src={nfts[rowIndex*2].url}/>
                    </Card>
                    [{nfts[rowIndex*2].id}]NFT
                  </Col>
                  <Col style ={{marginRight:0, paddingRight:0}}>
                    {nfts.length> rowIndex*2+1 ?(
                      <Card onClick={()=> {
                        onClickCard(nfts[rowIndex*2+1].id);
                      }}>
                        <Card.Img src={nfts[rowIndex*2+1].url}/>
                      </Card>
                    ):null}
                    {nfts.length> rowIndex*2+1 ?( 
                    <>[{nfts[rowIndex*2+1].id}]NFT</>):null}
                  </Col>
                </Row>
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
        <br/>
        <br/>
        <br/>
        <br/>


        {/*모달*/}
        <Modal 
        centered
        size="sm"
        show={showModal}
        onHide={()=> {
          setShowModal(false);
        }}
        >
          <Modal.Header closeButton style={{border:0, backgroundColor: "black", opacity:0.8}}>
            <Modal.Title>{modalProps.title}</Modal.Title>
          </Modal.Header>
          <Modal.Footer style={{border:0, backgroundColor: "black", opacity:0.8}}>
            <Button variant='secondary' onClick={()=> {setShowModal(false);
            }}>닫기
            </Button>
            <Button
            variant='primary'
            onClick={()=> {
              modalProps.onConfirm();
              setShowModal(false);
            }}
            style={{backgroundColor:"#B10034", borderColor: "#B10034" }}
            >
            진행</Button>
          </Modal.Footer>
        </Modal>

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
              <div><FontAwesomeIcon color="white" size='lg' icon={faHome}/>
              </div>
            </div>
            <div onClick={()=> {
                setTab("MINT");
              }}
              className = "row d-flex flex-column justify-content-center align-items-center"
            >
              <div><FontAwesomeIcon color="white" size='lg' icon={faPlus}/></div>
            </div>
            <div onClick={()=> {
                setTab("WALLET");
                fetchMyNFTs();
              }}
              className = "row d-flex flex-column justify-content-center align-items-center"
            >
              <div><FontAwesomeIcon color="white" size='lg' icon={faWallet}/></div>
            </div>
          </div>
          </Nav>
        </nav>
    </div>
  );
}

export default App;

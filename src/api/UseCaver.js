import Caver from 'caver-js';
import KIP17ABI from '../abi/KIP17TokenABI.json';
import MarketABI from '../abi/MarketABI.json';
import {ACCESS_KEY_ID, SECRET_ACCESS_KEY, CHAIN_ID, NFT_CONTRACT_ADDRESS} from '../constants';

const option = {
    headers:[
      {
        name: "Authorization",
        value: "Basic " + Buffer.from(ACCESS_KEY_ID + ":" + SECRET_ACCESS_KEY).toString("base64")
      },
      {name: 'x-chain-id', value: CHAIN_ID} //testNet이냐 mainNet이냐 판단
    ]
  }
  
  const caver = new Caver(new Caver.providers.HttpProvider("https://node-api.klaytnapi.com/v1/klaytn", option));
  const NFTContract = new caver.contract(KIP17ABI, NFT_CONTRACT_ADDRESS);


  export const fetchCardsOf = async (address)=> {
    //fetch Balance
    const balance = await NFTContract.methods.balanceOf(address).call();
    console.log(`[NFT Balance] ${balance}`);
    //fetch Token IDs

    const tokenIds = [];
    for (let i = 0; i< balance; i++) {
      const id = await NFTContract.methods.tokenOfOwnerByIndex(address, i).call();
      tokenIds.push(id);
    }
    //fetch Token URIs
    const tokenUris = [];
    for (let i = 0; i< balance; i++) {
      const uri = await NFTContract.methods.tokenURI(tokenIds[i]) .call();
      tokenUris.push(uri);
    }
    const nfts = [];
    for(let i = 0;i<balance; i++){
      nfts.push({uri: tokenUris[i], id:tokenIds[i]});
    }
    console.log(nfts);
    return nfts;
  };

  
  export const getBalance = (address) => {
    return caver.rpc.klay.getBalance(address).then((response)=> { //특정 잔고에 대한 주소를 가져다 주세요 -> 답변이 오면
      const balance = caver.utils.convertFromPeb(caver.utils.hexToNumberString(response)); //이 답(16진수)을 읽을수 있게 한 후 우리가 읽을 수 있는 klay 단위로 변경해 주세요 
      console.log(`BALANCE: ${balance}`);
      return balance;
    })
  }

  //const CountContract = new caver.contract(CounterABI, COUNT_CONTRACT_ADDRESS);

  // export const readCount = async () => {
  //   const _count = await CountContract.methods.count().call();
  //   console.log(_count);
  // }
  
  // export const setCount = async (newCount)=> {
  //   //사용할 account 설정
  //   try {
  //     const privatekey = '0x8808ceed2a7d75475d0be4a6e978b6629c888c3bf1ead323ac6563b86f252155';
  //     const deployer = caver.wallet.keyring.createFromPrivateKey(privatekey);
  //     caver.wallet.add(deployer);
  //     // 스마트 컨트랙트 실행 트랜잭션 날리기
  //     //결과확인
    
  //     const receipt = await CountContract.methods.setCount(newCount).send({
  //       from: deployer.address, //address
  //       gas:"0x4bfd200" //적당히 큰 수 
  //     })
  //     console.log(receipt);
  //   } catch(e) {
  //     console.log(`[ERROR_SET_COUNT]${e}`);
  //   }
  // }
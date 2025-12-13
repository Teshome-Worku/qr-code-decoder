import { Html5Qrcode } from "html5-qrcode";
import decodeImg from "./assets/decode.png";
import './App.css';
import { useEffect, useRef,useState } from "react";

const  App=()=> {
  const qrRef=useRef(null);
  const [result,setResult]=useState("");
  const [isCameraOn,setIsCameraOn]=useState(false);
  const[startButton,setStartButton]=useState(true);
  const[stopButton,setStoptButton]=useState(false);
  const[copy,setCopy]=useState(false);
  const [loading,setLoading]=useState(false);
  const [disable,setDisable]=useState(false);
  const handleFileScan = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    setResult("");
    const html5QrCode = new Html5Qrcode("file-qr-reader");
  
    html5QrCode.scanFile(file, true)
      .then((text) => {
        setResult(text);
      })
      .catch((err) => {
        console.error("File scan error:", err);
      })
      .finally(()=>{
        setTimeout(()=>{
          setLoading(false);
          setDisable(true);
        },2000)
      })
  };
  let front=true;
  useEffect(() => {
    if (!isCameraOn) return;
  
    const qr = new Html5Qrcode("qr-reader");
  
    qr
      .start(
        { facingMode:front? "environment":"user" },
        { fps: 15, qrbox: 250 },

        (decodedText) => {
          if (decodedText.startsWith("http://") || decodedText.startsWith("https://")) {
            window.location.href = decodedText;
            return;
          } 
          setResult(decodedText); 
          setTimeout(()=>{
            setIsCameraOn(false);
            qr.stop();

          },2000);
          
          
        },
        (error) => {
          console.log("scanning...")
        }
      )
      .catch(err => console.error(err));
  
    return () => {
      qr.stop().catch(() => {});
    };
  }, [isCameraOn]);
  
  return (
    <div className="app-container"> 
      <h2>QR Code Decoder App</h2>
      <img src={decodeImg} alt="decoder image" />
     {startButton&&<button onClick={()=>{
      setIsCameraOn(true);
      setStartButton(false);
      setStoptButton(true);

      }}>
      📷 Tap to Scan QR code</button>}  
      <div id="file-qr-reader" style={{ display: "none" }}></div><br />

     {stopButton&&<button onClick={()=>{
      setIsCameraOn(false);
      setStartButton(true);
      setStoptButton(false);
      }}>
      
      ⛔Stop Scanning</button>}
      {stopButton&&<button onClick={()=>{
        front=!front;
      }}>Flip Camera</button>}
        {isCameraOn&& <div id="qr-reader" ref={qrRef}></div>}
        <input
        type="file"
        accept="image/*"
        onChange={handleFileScan}
      />
      {loading && <p style={{color:"#059669"}}>📡 Scanning<span className="dots">.</span></p>}
        {disable&&result && (
          <p>🔍<strong>Scanned Result:</strong>{result}</p>
        )}
        {disable&&result&&<button 
          onClick={()=>{
          navigator.clipboard.writeText(result);
          setCopy(true);
          
        }

        } title="copy to clipboard">
          {copy?"Copied":"📋Copy"} </button>}

        {disable&&result.startsWith("http") && (
         <a href={result} target="_blank" rel="noopener noreferrer">
           🔗Open Link
         </a>
      )}
      </div>
  );
}
export default App;

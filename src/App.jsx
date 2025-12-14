import { Html5Qrcode } from "html5-qrcode";
import decodeImg from "./assets/decode.png";
import './App.css';
import { useEffect, useRef,useState } from "react";

const  App=()=> {
  const qrRef=useRef(null);
  const fileInputRef=useRef(null);
  const [result,setResult]=useState("");
  const [isCameraOn,setIsCameraOn]=useState(false);
  const[startButton,setStartButton]=useState(true);
  const[stopButton,setStoptButton]=useState(false);
  const[copy,setCopy]=useState(false);
  const [loading,setLoading]=useState(false);
  const [disable,setDisable]=useState(false);
  const [frontCamera, setFrontCamera] = useState(false);
  const[unknown,setUnknown]=useState("");
  const[visibleUnknown,setVisibleUnknown]=useState(false);

  const handleFileScan = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    setResult("");
    setUnknown("");
    setVisibleUnknown(false);
    setDisable(false);
    setLoading(true);
  
    const html5QrCode = new Html5Qrcode("file-qr-reader");
  
    html5QrCode
      .scanFile(file, true)
      .then((text) => {
        setTimeout(() => {
          setLoading(false);
          setResult(text);
          setDisable(true);
        }, 2000);
      })
      .catch(() => {
        setTimeout(() => {
          setLoading(false);
          setUnknown("Please upload a valid QR code!");
          setVisibleUnknown(true);
  
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
  
          setTimeout(() => {
            setVisibleUnknown(false);
            setUnknown("");
          }, 3000);
        }, 2000);
      });
  };
  
  useEffect(() => {
    if (!isCameraOn) return;
  
    const qr = new Html5Qrcode("qr-reader");
  
    qr
      .start(
        { facingMode:frontCamera? "user":"environment" },
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
        setFrontCamera((prev) => !prev);
        setIsCameraOn(false);
        setTimeout(() => setIsCameraOn(true), 100);

      }}>🔄 Flip Camera</button>}
        {isCameraOn&& <div id="qr-reader" ref={qrRef}></div>}
        <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileScan}
      />
      {loading && <p style={{color:"#059669"}}>📡 Scanning<span className="dots">.</span></p>}
      {visibleUnknown&&<p style={{color:"red"}}>{unknown}</p>}
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

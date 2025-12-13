import { Html5Qrcode } from "html5-qrcode";
import './App.css';
import { useEffect, useRef,useState } from "react";

const  App=()=> {
  const videoRef = useRef(null);
  const qrRef=useRef(null);
  const [result,setResult]=useState("");
  const [isCameraOn,setIsCameraOn]=useState(false);
  const[startButton,setStartButton]=useState(true);
  const[stopButton,setStoptButton]=useState(false);

  const handleFileScan = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const html5QrCode = new Html5Qrcode("file-qr-reader");
  
    html5QrCode.scanFile(file, true)
      .then((text) => {
        setResult(text);
      })
      .catch((err) => {
        console.error("File scan error:", err);
      });
  };
  


  useEffect(() => {
    if (!isCameraOn) return;
  
    const qr = new Html5Qrcode("qr-reader");
  
    qr
      .start(
        { facingMode: "environment" },
        { fps: 15, qrbox: 250 },

        (decodedText) => {
          if (decodedText.startsWith("http://") || decodedText.startsWith("https://")) {
            window.location.href = decodedText;
          } else {
            setResult(decodedText); 
          }
          setIsCameraOn(false);
          qr.stop();
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
      <h2>Camera Preview</h2>
    {startButton&&<button onClick={()=>{
      setIsCameraOn(true);
      setStartButton(false);
      setStoptButton(true);

      }}>
      Start Camera</button>}  

    {stopButton&&<button onClick={()=>{
      setIsCameraOn(false);
      setStartButton(true);
      setStoptButton(false);

      }}>
      

        Stop Camera</button>}
        {isCameraOn&& <div id="qr-reader" ref={qrRef}></div>}
        <input
        type="file"
        accept="image/*"
        onChange={handleFileScan}
      />
      <button onClick={()=>navigator.clipboard.writeText(result)}>Copy</button>
      <div id="file-qr-reader" style={{ display: "none" }}></div>
      {result.startsWith("http") && (
      <a href={result} target="_blank" rel="noopener noreferrer">
        Open Link
      </a>
      )}


        {result && (
          <p><strong>Scanned Result:</strong>{result}</p>
        )}
      {/* { isCameraOn&& <video ref={videoRef} autoPlay playsInline />}     */}
      </div>
  );
}
export default App;

import React, { useState, useCallback } from "react";
import QRCode from "react-qr-code";
import { QrScanner } from "react-qrcode-scanner";
import { Copy, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function ScanPay({ user }) {
  const [mode, setMode] = useState("scan"); // "scan" or "request"
  const [scannedResult, setScannedResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState("");

  const handleScan = useCallback(
    (result) => {
      if (result?.text) {
        setScannedResult(result.text);
        toast.success("QR code scanned!");
      }
    },
    [setScannedResult]
  );

  const handleError = useCallback((err) => {
    console.error(err);
    toast.error("Camera error: " + err.message);
  }, []);

  const copyToClipboard = () => {
    if (scannedResult) {
      navigator.clipboard.writeText(scannedResult);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 1500);
    }
  };

  // If user has UPI ID, generate a UPI deeplink
  const requestQrPayload = user?.upiId
    ? `upi://pay?pa=${user.upiId}&pn=${encodeURIComponent(
        user.name || "User"
      )}&am=${amount || ""}&cu=INR`
    : JSON.stringify({
        receiverId: user?.id,
        amount: amount || null,
      });

  return (
    <div className="p-6 space-y-6">
      {/* Mode toggle */}
      <div className="flex gap-4">
        <button
          onClick={() => setMode("scan")}
          className={`px-4 py-2 rounded-lg ${
            mode === "scan" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Scan to Pay
        </button>
        <button
          onClick={() => setMode("request")}
          className={`px-4 py-2 rounded-lg ${
            mode === "request" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Request / Receive
        </button>
      </div>

      <div className="aspect-video overflow-hidden rounded-lg">
        {mode === "scan" ? (
          <QrScanner
            onDecode={(result) => {
              if (result) {
                handleScan({ text: result });
              }
            }}
            onError={handleError}
            constraints={{ facingMode: "environment" }}
            style={{ width: "100%" }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-white gap-4">
            <QRCode
              value={requestQrPayload}
              size={220}
              style={{ height: "auto", maxWidth: "100%", width: "220px" }}
            />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount (optional)"
              className="border rounded p-2 text-center"
            />
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied!" : "Copy Payload"}
            </button>
          </div>
        )}
      </div>

      {mode === "scan" && scannedResult && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <p className="font-medium">Scanned Result:</p>
          <pre className="text-sm break-all">{scannedResult}</pre>
          <button
            onClick={copyToClipboard}
            className="mt-2 flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );
}

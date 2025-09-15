import React, { useMemo, useState } from 'react';
// import QRCode from 'react-qr-code';
// import { QRCode } from 'qrcode.react';
import { QRCodeCanvas } from 'qrcode.react';
import { QrCode, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppContext } from '../contexts/AppProvider';

export default function RequestPay() {
  const { user } = useAppContext();
  const [amount, setAmount] = useState('');
  const [copied, setCopied] = useState(false);

  const upiId = user?.upiId || '';
  const receiverId = user?._id || '';
  const payerName = user?.name || '';

  // Encode both UPI deeplink and JSON fallback for internal pay flow
  const qrPayload = useMemo(() => {
    const numeric = parseFloat(amount);
    const validAmount = Number.isFinite(numeric) && numeric > 0 ? numeric : '';
    // Prefer UPI deep link if user has UPI ID
    if (upiId) {
      const params = new URLSearchParams();
      params.set('pa', upiId);
      if (payerName) params.set('pn', payerName);
      if (validAmount) params.set('am', String(validAmount));
      params.set('tn', 'FinTract-Lite payment request');
      params.set('cu', 'INR');
      return `upi://pay?${params.toString()}`;
    }
    // Fallback to internal JSON payload
    const payload = { receiverId, amount: validAmount || undefined };
    return JSON.stringify(payload);
  }, [upiId, receiverId, payerName, amount]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(qrPayload);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      toast.success('Payment request copied');
    } catch {
      toast.error('Copy failed');
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <QrCode className="text-blue-600" size={32} />
        <h1 className="text-3xl font-bold text-gray-800">Request / Receive</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 flex flex-col items-center justify-center">
          <div className="bg-white p-4 rounded-lg border">
            <QRCode value={qrPayload} size={220} style={{ height: 'auto', maxWidth: '100%', width: '220px' }} />
          </div>
          <p className="text-sm text-gray-600 mt-3 break-all text-center max-w-full">
            {upiId ? upiId : receiverId}
          </p>
          <button onClick={handleCopy} className="mt-3 px-3 py-2 border rounded-lg flex items-center gap-2">
            {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Copied' : 'Copy Payload'}
          </button>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Payment Request Details</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Your UPI / ID</label>
              <input value={upiId || receiverId} readOnly className="w-full border rounded-lg px-3 py-2 bg-gray-50" />
              {!upiId && (
                <p className="text-xs text-gray-500 mt-1">No UPI ID set on your profile. QR will encode internal FinTract ID.</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Request Amount (optional)</label>
              <div className="flex items-center gap-2">
                <span className="px-3 py-2 bg-gray-100 rounded">₹</span>
                <input type="number" className="w-full border rounded-lg px-3 py-2" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 250" />
              </div>
              <p className="text-xs text-gray-500 mt-1">The payer can change the amount at payment time.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



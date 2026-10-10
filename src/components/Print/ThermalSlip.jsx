import React from 'react';

export default function ThermalSlip({ order }) {
  if (!order) return null;

  const totalQty =
    order.totalQty ||
    (order.items && order.items.length > 0
      ? order.items.reduce((sum, item) => sum + (Number(item.qty) || 1), 0)
      : 1);

  const totalPieces =
    order.totalPieces ||
    order.totalPcs ||
    (order.items && order.items.length > 0
      ? order.items.reduce((sum, item) => sum + (Number(item.pcs) || Number(item.qty) || 1), 0)
      : totalQty);

  const printTimestamp = new Date().toLocaleString('en-PK', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const orderId = order.id || order.orderNo || 'ORD-001';
  const cleanPhone = (order.phone || '0300-0000000').replace(/[^0-9]/g, '');
  const barcodeSuffix = cleanPhone.slice(-4) || '9999';

  return (
    <div
      id="thermal-receipt"
      className="hidden print:block font-mono text-black bg-white"
      style={{
        width: '72mm',
        maxWidth: '72mm',
        color: '#000000',
        backgroundColor: '#ffffff',
        fontFamily: "'Consolas', 'Courier New', monospace",
        fontSize: '11px',
        lineHeight: '1.28'
      }}
    >
      {/* ========================================================= */}
      {/* STORE HEADER                                              */}
      {/* ========================================================= */}
      <div className="text-center pb-2 mb-2 border-b-2 border-dashed border-black">
        <h1 className="text-base font-black uppercase tracking-wider leading-tight text-black">
          QDC DRY CLEANERS
        </h1>
        <p className="text-[11px] font-extrabold uppercase text-black tracking-wide">
          &amp; EXPRESS STEAM LAUNDRY
        </p>
        <p className="text-[10px] font-semibold text-black mt-0.5">
          Shop #04, Main Commercial Market, DHA
        </p>
        <p className="text-[10px] font-semibold text-black">
          Helpline: 0300-1234567 / 042-35890000
        </p>
        <p className="text-[9px] font-bold text-black mt-0.5">
          NTN: 8294710-3 • POS Terminal #01
        </p>
      </div>

      {/* ========================================================= */}
      {/* ORDER TOKEN & TARGET DELIVERY BANNER                      */}
      {/* ========================================================= */}
      <div className="border-2 border-black p-1.5 mb-2 text-center bg-white">
        <div className="text-[10px] uppercase font-bold text-black">
          ORDER / TOKEN NUMBER
        </div>
        <div className="text-xl font-black tracking-widest text-black py-0.5">
          #{orderId}
        </div>
        <div className="text-[10px] font-bold text-black border-t border-black pt-0.5 flex justify-between px-1">
          <span>DUE: {order.deliveryDate || order.dueDate || 'Standard Target'}</span>
          <span>{order.dueTime || '4:00 PM'}</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* CUSTOMER & BOOKING METADATA                               */}
      {/* ========================================================= */}
      <div className="text-[11px] pb-2 mb-2 border-b border-dashed border-black space-y-0.5 text-black">
        <div className="flex justify-between">
          <span className="font-bold">Booked Date:</span>
          <span>{order.bookingDate || order.orderDate || 'Today'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold">Customer:</span>
          <span className="font-black uppercase">{order.customerName || 'Walk-in Client'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold">Mobile:</span>
          <span className="font-bold">{order.phone || '—'}</span>
        </div>
        {order.address && (
          <div className="flex justify-between text-[10px]">
            <span className="font-bold">Address:</span>
            <span className="truncate max-w-[150px] text-right">{order.address}</span>
          </div>
        )}
        <div className="flex justify-between text-[9px] font-semibold pt-0.5">
          <span>Printed On:</span>
          <span>{printTimestamp}</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* GARMENTS TABLE                                            */}
      {/* ========================================================= */}
      <div className="pb-2 mb-2 border-b border-dashed border-black">
        <table className="w-full text-[10px] text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-black font-black text-black">
              <th className="py-1 text-left">ITEM / SERVICE</th>
              <th className="py-1 text-center w-8">QTY</th>
              <th className="py-1 text-center w-8">PCS</th>
              <th className="py-1 text-right w-11">RATE</th>
              <th className="py-1 text-right w-12">TOTAL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dashed divide-black">
            {order.items && order.items.length > 0 ? (
              order.items.map((item, idx) => {
                const itemQty = Number(item.qty) || 1;
                const itemPcs = Number(item.pcs) || itemQty;
                const itemPrice = Number(item.price) || 0;
                const itemTotal = itemQty * itemPrice;

                return (
                  <tr key={idx} className="text-black">
                    <td className="py-1 pr-1">
                      <div className="font-extrabold text-[10.5px] leading-tight">
                        {item.name}
                      </div>
                      <div className="text-[9px] font-bold uppercase tracking-tight">
                        [{item.serviceName || item.serviceCode || 'Dry Clean'}]
                      </div>
                      {(item.description || item.color) && (
                        <div className="text-[8.5px] italic">
                          {[item.color !== 'Standard' && item.color, item.description !== '—' && item.description]
                            .filter(Boolean)
                            .join(' • ')}
                        </div>
                      )}
                    </td>
                    <td className="py-1 text-center font-bold align-top">
                      {itemQty}
                    </td>
                    <td className="py-1 text-center font-black align-top">
                      {itemPcs}
                    </td>
                    <td className="py-1 text-right align-top font-semibold">
                      {itemPrice}
                    </td>
                    <td className="py-1 text-right align-top font-black">
                      {itemTotal}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td className="py-1 pr-1 font-bold">General Garment Service</td>
                <td className="py-1 text-center font-bold">1</td>
                <td className="py-1 text-center font-black">1</td>
                <td className="py-1 text-right">{order.totalAmount || 0}</td>
                <td className="py-1 text-right font-black">{order.totalAmount || 0}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ========================================================= */}
      {/* FINANCIAL SUMMARY & BALANCE BOX                           */}
      {/* ========================================================= */}
      <div className="text-[11px] pb-2 mb-2 border-b-2 border-dashed border-black space-y-1 text-black">
        <div className="flex justify-between font-bold text-xs">
          <span>Total Garments Count:</span>
          <span className="font-black">{totalQty} Qty ({totalPieces} Pcs)</span>
        </div>

        <div className="flex justify-between text-xs font-bold pt-1 border-t border-dashed border-black">
          <span>GROSS TOTAL:</span>
          <span>Rs. {order.totalAmount}</span>
        </div>

        <div className="flex justify-between text-[11px]">
          <span>Advance Received:</span>
          <span className="font-bold">Rs. {order.advancePaid || 0}</span>
        </div>

        {/* Big Balance Box */}
        <div className="border-2 border-black p-1.5 mt-1 bg-white flex items-center justify-between">
          <span className="font-black text-xs uppercase">BALANCE PAYABLE:</span>
          <span className="font-black text-sm">
            Rs. {order.balance !== undefined ? order.balance : order.balanceAmount || 0}
          </span>
        </div>

        <div className="text-center pt-1">
          <span className="text-[10px] font-black uppercase px-2 py-0.5 border-2 border-black inline-block tracking-wider">
            {(order.balance === 0 || order.balanceAmount === 0)
              ? '*** PAID IN FULL ***'
              : '*** PAYMENT PENDING ***'}
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* PICKUP RULES & LEGAL NOTICE                               */}
      {/* ========================================================= */}
      <div className="text-center text-[9px] space-y-1 text-black pb-1">
        <p className="font-black uppercase tracking-wider text-[9.5px]">
          *** IMPORTANT PICKUP RULES ***
        </p>
        <p className="leading-tight font-medium">
          1. Original receipt is mandatory for garment collection.
        </p>
        <p className="leading-tight font-medium">
          2. Store is not responsible for garments uncollected after 30 days.
        </p>
        <p className="leading-tight font-medium">
          3. Check garments &amp; counts carefully before leaving counter.
        </p>

        {/* Authentic High-Contrast Barcode SVG */}
        <div className="pt-2 pb-1 flex flex-col items-center justify-center">
          <svg className="w-56 h-10" viewBox="0 0 200 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Left Guard */}
            <rect x="5" y="0" width="3" height="35" fill="black" />
            <rect x="10" y="0" width="2" height="35" fill="black" />
            <rect x="14" y="0" width="4" height="35" fill="black" />
            {/* Pattern */}
            <rect x="22" y="0" width="2" height="35" fill="black" />
            <rect x="26" y="0" width="5" height="35" fill="black" />
            <rect x="34" y="0" width="2" height="35" fill="black" />
            <rect x="38" y="0" width="4" height="35" fill="black" />
            <rect x="45" y="0" width="2" height="35" fill="black" />
            <rect x="49" y="0" width="6" height="35" fill="black" />
            <rect x="58" y="0" width="3" height="35" fill="black" />
            <rect x="64" y="0" width="2" height="35" fill="black" />
            <rect x="68" y="0" width="5" height="35" fill="black" />
            <rect x="76" y="0" width="2" height="35" fill="black" />
            <rect x="81" y="0" width="4" height="35" fill="black" />
            <rect x="88" y="0" width="3" height="35" fill="black" />
            <rect x="94" y="0" width="2" height="35" fill="black" />
            {/* Center Guard */}
            <rect x="99" y="0" width="2" height="35" fill="black" />
            <rect x="103" y="0" width="2" height="35" fill="black" />
            {/* Right Pattern */}
            <rect x="108" y="0" width="4" height="35" fill="black" />
            <rect x="115" y="0" width="2" height="35" fill="black" />
            <rect x="120" y="0" width="5" height="35" fill="black" />
            <rect x="128" y="0" width="3" height="35" fill="black" />
            <rect x="134" y="0" width="2" height="35" fill="black" />
            <rect x="139" y="0" width="6" height="35" fill="black" />
            <rect x="148" y="0" width="2" height="35" fill="black" />
            <rect x="153" y="0" width="4" height="35" fill="black" />
            <rect x="160" y="0" width="3" height="35" fill="black" />
            <rect x="166" y="0" width="5" height="35" fill="black" />
            <rect x="174" y="0" width="2" height="35" fill="black" />
            <rect x="179" y="0" width="3" height="35" fill="black" />
            {/* Right Guard */}
            <rect x="185" y="0" width="3" height="35" fill="black" />
            <rect x="190" y="0" width="2" height="35" fill="black" />
          </svg>
          <p className="text-[10px] font-black tracking-widest text-black pt-0.5">
            *{orderId}-{barcodeSuffix}*
          </p>
        </div>

        <p className="pt-1 text-[10px] font-black text-black">
          Thank you for trusting QDC Dry Cleaners!
        </p>
        <p className="text-[8px] font-bold text-black uppercase">
          Software by QDC POS Terminal v4.2
        </p>

        {/* Paper Cutter Tear Line & Spacing for Auto-cutter */}
        <div className="pt-3 pb-8 text-[9px] font-mono text-black">
          <p>- - - - - - - - - - - - - - - - - - - - - - -</p>
          <p className="text-[8px] font-bold uppercase tracking-wider">[ CUT HERE ]</p>
        </div>
      </div>
    </div>
  );
}

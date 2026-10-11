import React, { useState } from 'react';
export const OrderManagement = ({ orders, onUpdateOrderStatus }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const filteredOrders = orders.filter(o => {
        const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.customerPhone.includes(searchTerm);
        const matchesStatus = statusFilter === 'All' || o.orderStatus === statusFilter;
        return matchesSearch && matchesStatus;
    });
    return (<div className="ph-card">
      <div className="card-header">
        <div>
          <h2 className="card-title">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#0d9488" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
            Customer Pharmacy Orders
          </h2>
          <span className="card-subtitle">Manage online orders, counter pickups, and delivery fulfillment</span>
        </div>
      </div>

      <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '12px',
            marginBottom: '20px',
            padding: '14px',
            backgroundColor: '#f8fafc',
            borderRadius: '10px',
            border: '1px solid #e2e8f0'
        }}>
        <div>
          <label className="form-label">Search Order ID / Customer / Phone</label>
          <input type="text" className="form-control" placeholder="Type order ID, customer name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
        </div>

        <div>
          <label className="form-label">Order Status</label>
          <select className="form-control" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Ready for Collection">Ready for Collection</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="ph-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Order Date</th>
              <th>Items Count</th>
              <th>Total Amount</th>
              <th>Fulfillment Type</th>
              <th>Order Status</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (<tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                  No customer orders found matching filter criteria.
                </td>
              </tr>) : (filteredOrders.map(ord => (<tr key={ord.id}>
                  <td style={{ fontWeight: 700, color: '#0d9488' }}>{ord.id}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{ord.customerName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{ord.customerPhone}</div>
                  </td>
                  <td style={{ fontSize: '0.8rem' }}>{ord.orderDate}</td>
                  <td><strong>{ord.itemsCount} Items</strong></td>
                  <td style={{ fontWeight: 700 }}>₹{ord.totalAmount.toFixed(2)}</td>
                  <td><span className="badge-ph badge-neutral">{ord.fulfillmentType}</span></td>
                  <td>
                    <span className={`badge-ph ${ord.orderStatus === 'Completed' || ord.orderStatus === 'Ready for Collection' ? 'badge-success' : 'badge-warning'}`}>
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td>
                    <span className={`badge-ph ${ord.paymentStatus === 'Paid' ? 'badge-success' : 'badge-danger'}`}>
                      {ord.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <button className="btn-ph btn-ph-secondary btn-ph-sm" onClick={() => setSelectedOrder(ord)}>
                      Details
                    </button>
                  </td>
                </tr>)))}
          </tbody>
        </table>
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (<div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">Order Details: {selectedOrder.id}</h3>
              <button style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }} onClick={() => setSelectedOrder(null)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', backgroundColor: '#f8fafc', padding: '14px', borderRadius: '8px' }}>
                <div><strong>Customer:</strong> {selectedOrder.customerName}</div>
                <div><strong>Phone:</strong> {selectedOrder.customerPhone}</div>
                <div><strong>Order Date:</strong> {selectedOrder.orderDate}</div>
                <div><strong>Fulfillment:</strong> {selectedOrder.fulfillmentType}</div>
                <div><strong>Payment Status:</strong> {selectedOrder.paymentStatus}</div>
                <div><strong>Current Status:</strong> {selectedOrder.orderStatus}</div>
              </div>

              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '12px' }}>Order Line Items</h4>
              <div className="table-container">
                <table className="ph-table">
                  <thead>
                    <tr>
                      <th>Medicine Name</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, idx) => (<tr key={idx}>
                        <td style={{ fontWeight: 600 }}>{item.medicineName}</td>
                        <td>{item.quantity}</td>
                        <td>₹{item.price.toFixed(2)}</td>
                        <td>₹{(item.quantity * item.price).toFixed(2)}</td>
                      </tr>))}
                  </tbody>
                </table>
              </div>

              <div className="form-group" style={{ marginTop: '12px' }}>
                <label className="form-label">Update Order Status</label>
                <select className="form-control" value={selectedOrder.orderStatus} onChange={(e) => {
                const newStatus = e.target.value;
                onUpdateOrderStatus(selectedOrder.id, newStatus);
                setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
            }}>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Ready for Collection">Ready for Collection</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-ph btn-ph-primary" onClick={() => setSelectedOrder(null)}>Done</button>
            </div>
          </div>
        </div>)}
    </div>);
};

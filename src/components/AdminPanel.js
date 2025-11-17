import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import '../AdminPanel.css';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reservations');

  useEffect(() => {
    fetchReservations();
    fetchTransactions();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/reservations');
      setReservations(response.data);
    } catch (error) {
      console.error('Greška pri dohvatanju rezervacija:', error);
      toast.error('Greška pri učitavanju rezervacija');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/transactions');
      setTransactions(response.data);
    } catch (error) {
      console.error('Greška pri dohvatanju transakcija:', error);
      toast.error('Greška pri učitavanju transakcija');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>Učitavanje...</p>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <p>Upravljanje rezervacijama i transakcijama</p>
        <button className='buttonAdminPanel'
          onClick={() => navigate('/')}
        >
          ← Početna stranica
        </button>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-button ${activeTab === 'reservations' ? 'active' : ''}`}
          onClick={() => setActiveTab('reservations')}
        >
          Rezervacije ({reservations.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          Transakcije ({transactions.length})
        </button>
      </div>

      {activeTab === 'reservations' && (
        <div className="admin-content">
          <h2>Sve Rezervacije</h2>
          {reservations.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#888' }}>Nema rezervacija</p>
          ) : (
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Gost</th>
                    <th>Email</th>
                    <th>Telefon</th>
                    <th>Početak</th>
                    <th>Završetak</th>
                    <th>Odrasli</th>
                    <th>Deca</th>
                    <th>Broj Soba</th>
                    <th>Ukupna Cena</th>
                    <th>Status</th>
                    <th>Plaćeno</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((res) => (
                    <tr key={res.reservation_id}>
                      <td>{res.reservation_id}</td>
                      <td>{res.guest_name}</td>
                      <td>{res.guest_email}</td>
                      <td>{res.guest_phone}</td>
                      <td>{new Date(res.start_date).toLocaleDateString('sr-RS')}</td>
                      <td>{new Date(res.end_date).toLocaleDateString('sr-RS')}</td>
                      <td>{res.adults}</td>
                      <td>{res.children || 0}</td>
                      <td>{res.units_reserved}</td>
                      <td>{res.total_price} €</td>
                      <td>
                        <span className={`status-badge status-${res.status.toLowerCase()}`}>
                          {res.status}
                        </span>
                      </td>
                      <td>
                        <span className={`payment-badge ${res.placeno ? 'paid' : 'unpaid'}`}>
                          {res.placeno ? '✓ Plaćeno' : '✗ Nije plaćeno'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="admin-content">
          <h2>Sve Transakcije (Stripe)</h2>
          {transactions.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#888' }}>Nema transakcija</p>
          ) : (
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Payment Intent ID</th>
                    <th>Iznos</th>
                    <th>Valuta</th>
                    <th>Status</th>
                    <th>Rezervacija</th>
                    <th>Datum</th>
                  </tr>
                </thead>
               <tbody>
  {transactions.map((trans) => (
    <tr key={trans.id}>
      <td>{trans.id}</td>
      <td style={{ fontSize: '12px', wordBreak: 'break-word' }}>{trans.payment_intent_id}</td>
      <td>{(trans.amount / 100).toFixed(2)} {trans.currency.toUpperCase()}</td>
      <td>{trans.currency.toUpperCase()}</td>
      <td>
        <span className={`status-badge status-${trans.status.toLowerCase()}`}>
          {trans.status}
        </span>
      </td>
      <td>{trans.reservation_id ? trans.reservation_id : 'N/A'}</td>
      <td>{new Date(trans.created_at).toLocaleString('sr-RS')}</td>
    </tr>
  ))}
</tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default AdminPanel;

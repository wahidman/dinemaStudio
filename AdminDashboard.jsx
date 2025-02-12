import { useState, useEffect } from "react";
import { Table, Button, Select, Card, CardContent } from "@/components/ui";
import axios from "axios";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("ALL");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5001/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Gagal mengambil data pesanan", error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.post("http://localhost:5001/update-order-status", {
        order_id: orderId,
        status: newStatus,
      });
      fetchOrders();
    } catch (error) {
      console.error("Gagal memperbarui status pesanan", error);
    }
  };

  const filteredOrders =
    filterStatus === "ALL"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Dashboard Admin</h1>
      <div className="mb-4">
        <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="ALL">Semua</option>
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
          <option value="FAILED">Failed</option>
        </Select>
      </div>
      <Card>
        <CardContent>
          <Table>
            <thead>
              <tr>
                <th>Nama</th>
                <th>WhatsApp</th>
                <th>Lokasi</th>
                <th>Tanggal</th>
                <th>Waktu</th>
                <th>Paket</th>
                <th>DP</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.name}</td>
                  <td>{order.whatsapp}</td>
                  <td>{order.location}</td>
                  <td>{order.date}</td>
                  <td>{order.time}</td>
                  <td>{order.package}</td>
                  <td>Rp {order.dpAmount.toLocaleString()}</td>
                  <td>{order.status}</td>
                  <td>
                    <Select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PAID">Paid</option>
                      <option value="FAILED">Failed</option>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

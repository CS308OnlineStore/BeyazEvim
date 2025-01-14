import React, { useState, useEffect } from 'react';
import { Table, Button, Select, notification } from 'antd';
import axios from 'axios';

const { Option } = Select;

const RefundRequestsPage = () => {
  const [refundRequests, setRefundRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('PENDING'); // Varsayılan durum

  const fetchRefundRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/refund-requests`);
      setRefundRequests(response.data);
    } catch (error) {
      notification.error({ message: 'Error', description: 'Failed to fetch refund requests.' });
    } finally {
      setLoading(false);
    }
  };

  const handleRefundApproval = async (requestId, approved) => {
    try {
      await axios.put(`/api/refund-requests/${requestId}/approve?approved=${approved}`);
      notification.success({
        message: approved ? 'Refund Approved' : 'Refund Rejected',
        description: `The refund request has been ${approved ? 'approved' : 'rejected'}.`,
      });
      fetchRefundRequests(); // Listeyi yenile
    } catch (error) {
      notification.error({ message: 'Error', description: 'Failed to process refund request.' });
    }
  };

  useEffect(() => {
    fetchRefundRequests();
  }, [status]);

  return (
    <div>
      <Select
        value={status}
        onChange={(value) => setStatus(value)}
        style={{ width: 200, marginBottom: 16 }}
      >
        <Option value="PENDING">Pending</Option>
        <Option value="APPROVED">Approved</Option>
        <Option value="REJECTED">Rejected</Option>
      </Select>
      <Table
        dataSource={refundRequests}
        loading={loading}
        rowKey="id"
        columns={[
          { title: 'Request ID', dataIndex: 'id', key: 'id' },
          { title: 'Order ID', dataIndex: ['order', 'id'], key: 'order.id' },
          { title: 'Total Price', dataIndex: ['order', 'totalPrice'], key: 'order.totalPrice' },
          { title: 'Order Status', dataIndex: ['order', 'status'], key: 'order.status' },
          { title: 'Order Date', dataIndex: ['order', 'orderDate'], key: 'order.orderDate' },
          { title: 'Customer Name', 
            render: (_, record) => `${record.order.user.firstName} ${record.order.user.lastName}`, 
            key: 'customerName' 
          },
          {
            title: 'Actions',
            render: (_, record) =>
              record.status === 'PENDING' && (
                <>
                  <Button
                    type="primary"
                    style={{ marginRight: 8 }}
                    onClick={() => handleRefundApproval(record.id, true)}
                  >
                    Approve
                  </Button>
                  <Button
                    type="danger"
                    onClick={() => handleRefundApproval(record.id, false)}
                  >
                    Reject
                  </Button>
                </>
              ),
          },
        ]}
      />
    </div>
  );
};

export default RefundRequestsPage;

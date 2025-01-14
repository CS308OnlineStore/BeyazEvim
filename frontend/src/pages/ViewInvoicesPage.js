import React, { useState } from 'react';
import { Table, Button, DatePicker, notification } from 'antd';
import axios from 'axios';

const { RangePicker } = DatePicker;

const ViewInvoicesPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInvoices = async (dates) => {
    setLoading(true);
    try {
      const [startDate, endDate] = dates;
      const response = await axios.get(`/api/invoices/invoices-by-date?startDate=${startDate}&endDate=${endDate}`);
      setData(response.data);
    } catch (error) {
      notification.error({ message: 'Error', description: 'Failed to fetch invoices.' });
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async (orderId) => {
    try {
      const response = await axios.get(`/api/invoices/order/${orderId}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      notification.error({ message: 'Error', description: 'Failed to download PDF.' });
    }
  };

  return (
    <div>
      <RangePicker onChange={(dates) => fetchInvoices(dates.map((date) => date.format('YYYY-MM-DD')))} />
      <Table
        dataSource={data}
        loading={loading}
        columns={[
          { title: 'Order ID', dataIndex: 'orderId', key: 'orderId' },
          { title: 'Total Amount', dataIndex: 'totalPrice', key: 'totalPrice' },
          {
            title: 'Action',
            render: (_, record) => (
              <Button onClick={() => downloadPDF(record.orderId)}>Download PDF</Button>
            ),
          },
        ]}
      />
    </div>
  );
};

export default ViewInvoicesPage;

import React, { useState } from 'react';
import { DatePicker, notification, Spin } from 'antd';
import { Line } from '@ant-design/plots';
import axios from 'axios';

const { RangePicker } = DatePicker;

const RevenueAnalysisPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRevenueData = async (dates) => {
    setLoading(true);
    try {
      const [startDate, endDate] = dates.map((date) => date.format('YYYY-MM-DD'));
      
      // Fetch data for the revenue chart
      const response = await axios.get(
        `/api/orders/revenue-chart?startDate=${startDate}&endDate=${endDate}`
      );

      // Format the data for the Line chart
      setData(
        response.data.map((item) => ({
          date: item.date,
          revenue: item.revenue,
        }))
      );
    } catch (error) {
      notification.error({ 
        message: 'Error', 
        description: 'Failed to fetch revenue data.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const config = {
    data,
    xField: 'date',
    yField: 'revenue',
    smooth: true,
    height: 400,
    xAxis: { title: { text: 'Date' } },
    yAxis: { title: { text: 'Revenue (₺)' } },
    point: {
      size: 5,
      shape: 'circle',
    },
    tooltip: {
      showTitle: true,
      formatter: (datum) => ({
        name: 'Revenue',
        value: `₺${datum.revenue.toFixed(2)}`,
      }),
    },
  };

  return (
    <div>
      <h2>Revenue Analysis</h2>
      <RangePicker
        style={{ marginBottom: 16 }}
        onChange={(dates) => fetchRevenueData(dates)}
      />
      {loading ? (
        <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />
      ) : (
        <Line {...config} />
      )}
    </div>
  );
};

export default RevenueAnalysisPage;

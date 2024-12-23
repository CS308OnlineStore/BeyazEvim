import React, { useState } from 'react';
import { DatePicker, notification } from 'antd';
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
      const response = await axios.get(`/api/revenue?start=${startDate}&end=${endDate}`);
      setData(
        response.data.map((item) => ({
          date: item.date,
          revenue: item.revenue,
        }))
      );
    } catch (error) {
      notification.error({ message: 'Error', description: 'Failed to fetch revenue data.' });
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
    yAxis: { title: { text: 'Revenue' } },
  };

  return (
    <div>
      <RangePicker
        style={{ marginBottom: 16 }}
        onChange={(dates) => fetchRevenueData(dates)}
      />
      <Line {...config} loading={loading} />
    </div>
  );
};

export default RevenueAnalysisPage;

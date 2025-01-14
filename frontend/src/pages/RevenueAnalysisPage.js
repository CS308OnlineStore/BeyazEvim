import React, { useState } from 'react';
import { DatePicker, notification, Spin, Button } from 'antd';
import axios from 'axios';

const { RangePicker } = DatePicker;

const RevenueAnalysisPage = () => {
  const [data, setData] = useState(null); // Use null initially for data (for PNG)
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false); // Track PDF loading
  const [dates, setDates] = useState(null); // Store selected date range

  const fetchRevenueData = async (dates) => {
    setLoading(true);
    try {
      const [startDate, endDate] = dates.map((date) => date.format('YYYY-MM-DD'));

      // Fetch the revenue chart as PNG
      const response = await axios.get(
        `/api/reports/monthly-revenue-png?startDate=${startDate}&endDate=${endDate}&width=600&height=400`,
        { responseType: 'arraybuffer' } // Ensure we get the response as binary data
      );

      // Convert the byte array to a Blob and create an object URL
      const imageBlob = new Blob([response.data], { type: 'image/png' });
      const imageUrl = URL.createObjectURL(imageBlob);
      
      // Set the image URL to state
      setData(imageUrl);
      setDates(dates); // Save the selected date range for later use
    } catch (error) {
      notification.error({ 
        message: 'Error', 
        description: 'Failed to fetch revenue data.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRevenuePdf = async () => {
    setPdfLoading(true);
    try {
      if (!dates) return; // Ensure dates are selected before requesting PDF
      const [startDate, endDate] = dates.map((date) => date.format('YYYY-MM-DD'));

      // Fetch the revenue PDF
      const response = await axios.get(
        `/api/reports/monthly-revenue?startDate=${startDate}&endDate=${endDate}`,
        { responseType: 'arraybuffer' } // Ensure we get the response as binary data
      );

      // Convert the byte array to a Blob and create an object URL for the PDF
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Create a link element to download the PDF
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'MonthlyRevenue.pdf';
      link.click();
    } catch (error) {
      notification.error({ 
        message: 'Error', 
        description: 'Failed to fetch revenue PDF.' 
      });
    } finally {
      setPdfLoading(false);
    }
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
        <div style={{ textAlign: 'center' }}>
          {data ? (
            <img src={data} alt="Revenue Chart" style={{ width: '100%', maxWidth: '600px' }} />
          ) : (
            <p>No chart to display.</p>
          )}
        </div>
      )}
      
      {/* PDF Button */}
      <Button 
        type="primary" 
        loading={pdfLoading}
        onClick={fetchRevenuePdf} // Trigger the PDF download on button click
        disabled={!dates} // Disable button if no date range is selected
      >
        Download PDF
      </Button>
    </div>
  );
};

export default RevenueAnalysisPage;

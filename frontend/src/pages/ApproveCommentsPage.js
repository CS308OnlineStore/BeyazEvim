import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, Button, message, Spin, Alert, Layout, Typography } from 'antd';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

const ApproveCommentsPage = () => {
  const [unapprovedComments, setUnapprovedComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Yorumları çek
  const fetchUnapprovedComments = () => {
    setLoading(true);
    axios
      .get('/api/comments/unapproved')
      .then((response) => {
        setUnapprovedComments(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching unapproved comments:', error);
        //setError('Failed to fetch comments.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUnapprovedComments();
  }, []);

  const handleApproveComment = (commentId) => {
    axios
      .patch(`/api/comments/${commentId}/approve`, null, { params:  { isApproved: true } })
      .then(() => {
        message.success('Comment approved successfully!');
        setUnapprovedComments((prev) =>
          prev.filter((comment) => comment.id !== commentId)
        );
      })
      .catch((error) => {
        console.error('Error approving comment:', error);
        message.error('Failed to approve comment.');
      });
  };

  // Yorum Reddetme
  const handleRejectComment = (commentId) => {
    axios
      .delete(`/api/comments/${commentId}`)
      .then(() => {
        message.success('Comment rejected successfully!');
        setUnapprovedComments((prev) =>
          prev.filter((comment) => comment.id !== commentId)
        );
      })
      .catch((error) => {
        console.error('Error rejecting comment:', error);
        message.error('Failed to reject comment.');
      });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout>
      <Header>
        <Title style={{ color: 'white', margin: '16px 0' }} level={2}>
          Manage Unapproved Comments
        </Title>
      </Header>
      <Content style={{ padding: '20px' }}>
        {unapprovedComments.length === 0 ? (
          <Alert message="No unapproved comments available." type="info" showIcon />
        ) : (
          <List
            itemLayout="vertical"
            dataSource={unapprovedComments}
            renderItem={(comment) => (
              <List.Item
                actions={[
                  <Button
                    type="primary"
                    onClick={() => handleApproveComment(comment.id)}
                  >
                    Approve
                  </Button>,
                  <Button
                    danger
                    onClick={() => handleRejectComment(comment.id)}
                  >
                    Reject
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={`${comment.title} (Rating: ${comment.rating})`}
                  description={
                    <>
                      <Paragraph style={{ margin: 0 }}>{comment.text}</Paragraph>
                      <Paragraph>
                        Created By: {comment.user.firstName} {comment.user.lastName} (
                        {comment.user.email})
                      </Paragraph>
                      <Paragraph>
                        Created At: {new Date(comment.createdDate).toLocaleString()}
                      </Paragraph>
                    </>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Content>
    </Layout>
  );
};

export default ApproveCommentsPage;

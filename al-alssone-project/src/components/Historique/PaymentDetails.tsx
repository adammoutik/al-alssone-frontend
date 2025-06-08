// PaymentDetails.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Descriptions, Button, Typography, Tag, Card, Spin } from 'antd';
import { getPaymentDetails } from '../../services/payments';
import dayjs from 'dayjs';

const { Title } = Typography;

interface Payment {
  _id: string;
  studentId: string;
  familyId: string;
  feeId: string[];
  amountPaid: number;
  discountApplied?: boolean;
  discountAmount?: number;
  period: string;
  status: 'paid' | 'unpaid';
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
}

const PaymentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const data = await getPaymentDetails(id!);
        setPayment(data);
      } catch (error) {
        console.error('Error fetching payment:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPayment();
  }, [id]);

  if (loading) {
    return <Spin size="large" />;
  }

  if (!payment) {
    return <div>Payment not found</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Payment Details</Title>
      <Card>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Payment ID">{payment._id}</Descriptions.Item>
          <Descriptions.Item label="Student ID">{payment.studentId}</Descriptions.Item>
          <Descriptions.Item label="Family ID">{payment.familyId}</Descriptions.Item>
          <Descriptions.Item label="Amount Paid">${payment.amountPaid.toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label="Discount Applied">
            {payment.discountApplied ? `$${payment.discountAmount?.toFixed(2)}` : 'None'}
          </Descriptions.Item>
          <Descriptions.Item label="Period">{payment.period}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={payment.status === 'paid' ? 'green' : 'red'}>
              {payment.status.toUpperCase()}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Payment Method">
            {payment.paymentMethod || 'Not specified'}
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {dayjs(payment.createdAt).format('MMMM D, YYYY h:mm A')}
          </Descriptions.Item>
          <Descriptions.Item label="Last Updated">
            {dayjs(payment.updatedAt).format('MMMM D, YYYY h:mm A')}
          </Descriptions.Item>
        </Descriptions>
        
        <div style={{ marginTop: '20px' }}>
          <Button type="primary" style={{ marginRight: '10px' }}>
            Print Receipt
          </Button>
          <Button>Back to History</Button>
        </div>
      </Card>
    </div>
  );
};

export default PaymentDetails;
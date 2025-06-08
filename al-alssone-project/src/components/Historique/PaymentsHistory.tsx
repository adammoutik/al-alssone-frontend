import React, { useEffect, useState } from 'react';
import api from '../../services/axios';
import {
  Table,
  Space,
  Tag,
  Typography,
  Card,
  DatePicker,
  Select,
  Radio,
  Button,
  Modal,
  message,
  Badge,
  Statistic,
  Popconfirm,
} from 'antd';
import type { DatePickerProps, RadioChangeEvent } from 'antd';
import dayjs from 'dayjs';
import { FileExcelOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { MonthPicker } = DatePicker;

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
  createdAt: string;
  isArchived: boolean;
  archivedAt?: string;
}

interface Student {
  _id: string;
  name: string;
}

interface Fee {
  _id: string;
  name: string;
  amount: number;
  frequency: 'monthly' | 'annually';
}

interface Family {
  _id: string;
  name: string;
}

const PaymentHistory: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [fees, setFees] = useState<Fee[]>([]);
  const [families, setFamilies] = useState<Family[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string | undefined>(undefined);
  const [selectedFamily, setSelectedFamily] = useState<string | undefined>(undefined);
  const [selectedPeriod, setSelectedPeriod] = useState<string | undefined>(undefined);
  const [showArchived, setShowArchived] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [stats, setStats] = useState({
    totalPaid: 0,
    totalUnpaid: 0,
    totalAmount: 0,
  });

  // Fetch all required data on mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Re-fetch payments when filters change
  useEffect(() => {
    fetchPayments();
  }, [selectedStudent, selectedFamily, selectedPeriod, showArchived]);

  // Recalculate stats when payments or status filter changes
  useEffect(() => {
    calculateStats();
  }, [payments, selectedStatus, showArchived]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchStudents(), fetchFees(), fetchFamilies()]);
      // fetchPayments will be triggered by useEffect due to state changes
    } catch (error) {
      message.error('Failed to load initial data');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await api.get('/students');
      setStudents(response.data);
    } catch {
      message.error('Failed to load students');
    }
  };

  const fetchFees = async () => {
    try {
      const response = await api.get('/fees');
      setFees(response.data);
    } catch {
      message.error('Failed to load fees');
    }
  };

  const fetchFamilies = async () => {
    try {
      const response = await api.get('/families');
      setFamilies(response.data);
    } catch {
      message.error('Failed to load families');
    }
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);
      let url = '/api/payments';
      const params = new URLSearchParams();

      if (selectedStudent) params.append('studentId', selectedStudent);
      if (selectedFamily) params.append('familyId', selectedFamily);
      if (selectedPeriod) params.append('period', selectedPeriod);
      if (showArchived) params.append('includeArchived', 'true');

      if (params.toString()) url += `?${params.toString()}`;

      const response = await api.get(url);
      setPayments(response.data);
    } catch {
      message.error('Failed to load payments');
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentChange = (value: string | undefined) => {
    setSelectedStudent(value);
    if (value) setSelectedFamily(undefined);
  };

  const handleFamilyChange = (value: string | undefined) => {
    setSelectedFamily(value);
    if (value) setSelectedStudent(undefined);
  };

  const handlePeriodChange: DatePickerProps['onChange'] = (_, dateString) => {
    setSelectedPeriod(dateString || undefined);
  };

  const handleStatusChange = (e: RadioChangeEvent) => {
    setSelectedStatus(e.target.value);
  };

  const handleArchiveToggle = () => {
    setShowArchived(!showArchived);
  };

  const archivePayment = async (paymentId: string) => {
    try {
      await api.patch(`/api/payments/${paymentId}/archive`);
      message.success('Payment archived successfully');
      fetchPayments();
    } catch {
      message.error('Failed to archive payment');
    }
  };

  const unarchivePayment = async (paymentId: string) => {
    try {
      await api.patch(`/api/payments/${paymentId}/unarchive`);
      message.success('Payment restored successfully');
      fetchPayments();
    } catch {
      message.error('Failed to restore payment');
    }
  };

  const showPaymentDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsModalVisible(true);
  };

  const calculateStats = () => {
    const filtered = getFilteredPayments();
    const paid = filtered.filter(p => p.status === 'paid');
    const unpaid = filtered.filter(p => p.status === 'unpaid');

    setStats({
      totalPaid: paid.length,
      totalUnpaid: unpaid.length,
      totalAmount: paid.reduce((sum, p) => sum + p.amountPaid, 0),
    });
  };

  const getFilteredPayments = () => {
    return payments.filter(payment => {
      if (!showArchived && payment.isArchived) return false;
      if (selectedStatus !== 'all' && payment.status !== selectedStatus) return false;
      return true;
    });
  };

  const exportToExcel = () => {
    message.info('Export feature will be implemented here');
  };

  const columns = [
    {
      title: 'Student',
      dataIndex: 'studentId',
      key: 'student',
      render: (studentId: string) => {
        const student = students.find(s => s._id === studentId);
        return student ? student.name : 'Unknown';
      },
    },
    {
      title: 'Family',
      dataIndex: 'familyId',
      key: 'family',
      render: (familyId: string) => {
        const family = families.find(f => f._id === familyId);
        return family ? family.name : 'Unknown';
      },
    },
    {
      title: 'Amount',
      dataIndex: 'amountPaid',
      key: 'amount',
      render: (amount: number, record: Payment) => (
        <Text strong={record.status === 'paid'} type={record.status === 'paid' ? undefined : 'danger'}>
          ${amount.toFixed(2)}
        </Text>
      ),
    },
    {
      title: 'Fee',
      dataIndex: 'feeId',
      key: 'fee',
      render: (feeIds: string[]) => {
        const feeNames = feeIds.map(id => {
          const fee = fees.find(f => f._id === id);
          return fee ? fee.name : 'Unknown';
        });
        return feeNames.join(', ');
      },
    },
    {
      title: 'Period',
      dataIndex: 'period',
      key: 'period',
      sorter: (a: Payment, b: Payment) => a.period.localeCompare(b.period),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'date',
      render: (date: string) => dayjs(date).format('MMM D, YYYY'),
      sorter: (a: Payment, b: Payment) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: Payment) => (
        <Badge
          status={status === 'paid' ? 'success' : 'error'}
          text={
            <Tag color={status === 'paid' ? 'green' : 'red'} style={{ opacity: record.isArchived ? 0.6 : 1 }}>
              {status.toUpperCase()}
              {record.isArchived && ' (Archived)'}
            </Tag>
          }
        />
      ),
      filters: [
        { text: 'Paid', value: 'paid' },
        { text: 'Unpaid', value: 'unpaid' },
      ],
      onFilter: (value: string | number | boolean, record: Payment) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Payment) => (
        <Space>
          <Button type="link" onClick={() => showPaymentDetails(record)}>
            Details
          </Button>
          {!record.isArchived ? (
            <Popconfirm
              title="Are you sure to archive this payment?"
              onConfirm={() => archivePayment(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger>
                Archive
              </Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Restore this archived payment?"
              onConfirm={() => unarchivePayment(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link">Restore</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card style={{ margin: 20 }}>
      <Title level={3}>Payment History</Title>

      <Space wrap style={{ marginBottom: 16 }}>
        <Select
          allowClear
          placeholder="Filter by Student"
          style={{ width: 200 }}
          onChange={handleStudentChange}
          value={selectedStudent}
          disabled={!!selectedFamily}
          showSearch
          optionFilterProp="children"
        >
          {students.map(student => (
            <Option key={student._id} value={student._id}>
              {student.name}
            </Option>
          ))}
        </Select>

        <Select
          allowClear
          placeholder="Filter by Family"
          style={{ width: 200 }}
          onChange={handleFamilyChange}
          value={selectedFamily}
          disabled={!!selectedStudent}
          showSearch
          optionFilterProp="children"
        >
          {families.map(family => (
            <Option key={family._id} value={family._id}>
              {family.name}
            </Option>
          ))}
        </Select>

        <MonthPicker
          placeholder="Filter by Period"
          onChange={handlePeriodChange}
          value={selectedPeriod ? dayjs(selectedPeriod, 'YYYY-MM') : null}
          format="YYYY-MM"
          allowClear
        />

        <Radio.Group onChange={handleStatusChange} value={selectedStatus}>
          <Radio.Button value="all">All</Radio.Button>
          <Radio.Button value="paid">Paid</Radio.Button>
          <Radio.Button value="unpaid">Unpaid</Radio.Button>
        </Radio.Group>

        <Button onClick={handleArchiveToggle}>
          {showArchived ? 'Hide Archived' : 'Show Archived'}
        </Button>

        <Button icon={<FileExcelOutlined />} onClick={exportToExcel}>
          Export to Excel
        </Button>
      </Space>

      <Space size="large" style={{ marginBottom: 20 }}>
        <Statistic title="Total Paid Payments" value={stats.totalPaid} valueStyle={{ color: '#3f8600' }} />
        <Statistic title="Total Unpaid Payments" value={stats.totalUnpaid} valueStyle={{ color: '#cf1322' }} />
        <Statistic title="Total Amount Paid" prefix="$" value={stats.totalAmount} precision={2} />
      </Space>

      <Table
        columns={columns}
        dataSource={getFilteredPayments()}
        loading={loading}
        rowKey={record => record._id}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 900 }}
      />

      <Modal
        title="Payment Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={700}
      >
        {selectedPayment ? (
          <>
            <p>
              <b>Student:</b>{' '}
              {students.find(s => s._id === selectedPayment.studentId)?.name || 'Unknown'}
            </p>
            <p>
              <b>Family:</b>{' '}
              {families.find(f => f._id === selectedPayment.familyId)?.name || 'Unknown'}
            </p>
            <p>
              <b>Fees:</b>{' '}
              {selectedPayment.feeId
                .map(feeId => fees.find(f => f._id === feeId)?.name || 'Unknown')
                .join(', ')}
            </p>
            <p>
              <b>Amount Paid:</b> ${selectedPayment.amountPaid.toFixed(2)}
            </p>
            <p>
              <b>Discount Applied:</b>{' '}
              {selectedPayment.discountApplied ? 'Yes' : 'No'}
            </p>
            {selectedPayment.discountApplied && (
              <p>
                <b>Discount Amount:</b> ${selectedPayment.discountAmount?.toFixed(2)}
              </p>
            )}
            <p>
              <b>Period:</b> {selectedPayment.period}
            </p>
            <p>
              <b>Status:</b> {selectedPayment.status.toUpperCase()}
            </p>
            <p>
              <b>Created At:</b> {dayjs(selectedPayment.createdAt).format('MMMM D, YYYY')}
            </p>
            {selectedPayment.isArchived && selectedPayment.archivedAt && (
              <p>
                <b>Archived At:</b> {dayjs(selectedPayment.archivedAt).format('MMMM D, YYYY')}
              </p>
            )}
          </>
        ) : (
          <p>No payment selected</p>
        )}
      </Modal>
    </Card>
  );
};

export default PaymentHistory;

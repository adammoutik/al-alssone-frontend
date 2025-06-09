import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Space, Tag } from 'antd';
import api from '../../services/axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const { Search } = Input;

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  // Fetch students and payments
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [studentsRes, paymentsRes] = await Promise.all([
          api.get('/students'),
          api.get('/payments')
        ]);
        
        setStudents(studentsRes.data);
        setPayments(paymentsRes.data);
        setFilteredPayments(paymentsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter payments based on search text
  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredPayments(payments);
      return;
    }

    const filtered = payments.filter(payment => {
      const student = students.find(s => s._id === payment.studentId);
      if (!student) return false;

      // Search in firstName, lastName, and familyName
      const searchLower = searchText.toLowerCase();
      return (
        student.firstName.toLowerCase().includes(searchLower) ||
        student.lastName.toLowerCase().includes(searchLower) ||
        (student.familyName && student.familyName.toLowerCase().includes(searchLower))
      );
    });

    setFilteredPayments(filtered);
  }, [searchText, payments, students]);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.text('Payment History Report', 14, 15);
    
    // Prepare data for the table
    const tableData = filteredPayments.map(payment => {
      const student = students.find(s => s._id === payment.studentId);
      return [
        student ? `${student.firstName} ${student.lastName}` : 'Unknown',
        `${payment.amountPaid} MAD`,
        payment.status.toUpperCase(),
        payment.period,
        payment.isArchived ? 'Archived' : 'Active'
      ];
    });
    
    // Add table
    doc.autoTable({
      head: [['Student', 'Amount', 'Status', 'Period', 'Type']],
      body: tableData,
      startY: 25,
      styles: {
        cellPadding: 2,
        fontSize: 10,
        valign: 'middle'
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 30 },
        2: { cellWidth: 30 },
        3: { cellWidth: 40 },
        4: { cellWidth: 30 }
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });
    
    // Save the PDF
    doc.save(`payment_history_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const columns = [
    {
      title: 'Student Name',
      dataIndex: 'studentId',
      key: 'student',
      render: (studentId) => {
        const student = students.find(s => s._id === studentId);
        return student ? `${student.firstName} ${student.lastName}` : 'Unknown';
      },
      sorter: (a, b) => {
        const studentA = students.find(s => s._id === a.studentId);
        const studentB = students.find(s => s._id === b.studentId);
        const nameA = studentA ? `${studentA.firstName} ${studentA.lastName}` : '';
        const nameB = studentB ? `${studentB.firstName} ${studentB.lastName}` : '';
        return nameA.localeCompare(nameB);
      }
    },
    {
      title: 'Amount',
      dataIndex: 'amountPaid',
      key: 'amount',
      render: (amount) => `${amount} MAD`,
      sorter: (a, b) => a.amountPaid - b.amountPaid
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'paid' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
      sorter: (a, b) => a.status.localeCompare(b.status)
    },
    {
      title: 'Creation Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => a.createdAt.localeCompare(b.createdAt)
    },
    {
      title: 'Type',
      key: 'type',
      render: (_, record) => (
        <Tag color={record.isArchived ? 'orange' : 'green'}>
          {record.isArchived ? 'Archived' : 'Active'}
        </Tag>
      ),
      sorter: (a, b) => (a.isArchived ? 1 : -1) - (b.isArchived ? 1 : -1)
    }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Payment History</h1>

      <Space style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>
        <Search
          placeholder="Search by student name"
          allowClear
          enterButton="Search"
          size="large"
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={(value) => setSearchText(value)}
          style={{ width: '400px' }}
        />
        <Button 
          type="primary" 
          onClick={handleExportPDF}
          style={{ marginLeft: '16px' }}
        >
          Export to PDF
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={filteredPayments}
        loading={loading}
        rowKey="_id"
        bordered
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} payments`,
        }}
      />
    </div>
  );
};

export default PaymentHistory;
import React, { useState, useEffect } from 'react';
import { Table, Select, Button } from 'antd';
import api from '../../services/axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'archived'

  // Fetch students once
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get('/students');
        setStudents(res.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
    fetchStudents();
  }, []);

  // Fetch payments based on filter
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        let data = [];

        if (filter === 'active') {
          const res = await api.get('/payments');
          data = res.data;
        } else if (filter === 'archived') {
          const res = await api.get('/archived-payments');
          data = res.data;
        } else {
          // Fetch both and merge
          const [activeRes, archivedRes] = await Promise.all([
            api.get('/payments'),
            api.get('/archived-payments')
          ]);
          data = [...activeRes.data, ...archivedRes.data];
        }

        setPayments(data);
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [filter]);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.text(`Payment History Report (${filter === 'all' ? 'All Payments' : filter === 'active' ? 'Active Payments' : 'Archived Payments'})`, 14, 15);
    
    // Prepare data for the table
    const tableData = payments.map(payment => {
      const student = students.find(s => s._id === payment.studentId);
      return [
        student ? `${student.firstName} ${student.lastName}` : 'Unknown',
        payment.amountPaid,
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
    doc.save(`payment_history_${filter}_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const columns = [
    {
      title: 'Student',
      dataIndex: 'studentId',
      key: 'student',
      render: (studentId) => {
        const student = students.find(s => s._id === studentId);
        return student ? `${student.firstName} ${student.lastName}` : 'Unknown';
      },
    },
    {
      title: 'Amount',
      dataIndex: 'amountPaid',
      key: 'amount',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span style={{ color: status === 'paid' ? 'green' : 'red' }}>
          {status.toUpperCase()}
        </span>
      ),
    },
    {
      title: 'Period',
      dataIndex: 'period',
      key: 'period',
    },
    {
      title: 'Type',
      key: 'type',
      render: (_, record) => (
        record.isArchived ? 'Archived' : 'Active'
      ),
    },
  ];

  return (
    <div>
      <h1>Payment History</h1>

      <div style={{ marginBottom: 16, display: 'flex', gap: '16px' }}>
        <Select
          defaultValue="all"
          onChange={(value) => setFilter(value)}
          options={[
            { label: 'All Payments', value: 'all' },
            { label: 'Active Payments', value: 'active' },
            { label: 'Archived Payments', value: 'archived' },
          ]}
        />
        <Button type="primary" onClick={handleExportPDF}>
          Export to PDF
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={payments}
        loading={loading}
        rowKey="_id"
      />
    </div>
  );
};

export default PaymentHistory;
import React, { useState, useEffect } from 'react';
import { Table, Input, Tag } from 'antd';
import api from '../../services/axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Download, Search as SearchIcon } from 'lucide-react';

const { Search } = Input;

const HistoriquePaiements = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

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
        console.error('Erreur lors du chargement des données :', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredPayments(payments);
      return;
    }

    const filtered = payments.filter(payment => {
      const student = students.find(s => s._id === payment.studentId);
      if (!student) return false;
      const searchLower = searchText.toLowerCase();
      return (
        student.firstName.toLowerCase().includes(searchLower) ||
        student.lastName.toLowerCase().includes(searchLower) ||
        (student.familyName && student.familyName.toLowerCase().includes(searchLower))
      );
    });

    setFilteredPayments(filtered);
  }, [searchText, payments, students]);

  const exporterPDF = () => {
    const doc = new jsPDF();
    doc.text('Rapport - Historique des paiements', 14, 15);

    const tableData = filteredPayments.map(payment => {
      const student = students.find(s => s._id === payment.studentId);
      return [
        student ? `${student.firstName} ${student.lastName}` : 'Inconnu',
        `${payment.amountPaid} MAD`,
        payment.status.toUpperCase(),
        payment.period,
        payment.isArchived ? 'Archivé' : 'Actif'
      ];
    });

    doc.autoTable({
      head: [['Élève', 'Montant', 'Statut', 'Période', 'Type']],
      body: tableData,
      startY: 25,
      styles: { fontSize: 10, valign: 'middle' },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    doc.save(`historique_paiements_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const colonnes = [
    {
      title: 'Nom de l\'élève',
      dataIndex: 'studentId',
      key: 'eleve',
      render: (id) => {
        const student = students.find(s => s._id === id);
        return student ? `${student.firstName} ${student.lastName}` : 'Inconnu';
      },
      sorter: (a, b) => {
        const sA = students.find(s => s._id === a.studentId);
        const sB = students.find(s => s._id === b.studentId);
        const nA = sA ? `${sA.firstName} ${sA.lastName}` : '';
        const nB = sB ? `${sB.firstName} ${sB.lastName}` : '';
        return nA.localeCompare(nB);
      }
    },
    {
      title: 'Montant',
      dataIndex: 'amountPaid',
      key: 'montant',
      render: (val) => `${val} MAD`,
      sorter: (a, b) => a.amountPaid - b.amountPaid
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'statut',
      render: (status) => (
        <Tag color={status === 'paid' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
      sorter: (a, b) => a.status.localeCompare(b.status)
    },
    {
      title: 'Date de création',
      dataIndex: 'createdAt',
      key: 'date',
      sorter: (a, b) => a.createdAt.localeCompare(b.createdAt)
    },
    {
      title: 'Type',
      key: 'type',
      render: (_, record) => (
        <Tag color={record.isArchived ? 'orange' : 'blue'}>
          {record.isArchived ? 'Archivé' : 'Actif'}
        </Tag>
      ),
      sorter: (a, b) => (a.isArchived ? 1 : -1) - (b.isArchived ? 1 : -1)
    }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Historique des paiements</h2>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <div className="relative w-full md:w-1/2">
          <Search
            placeholder="Rechercher un élève"
            enterButton={<SearchIcon />}
            allowClear
            size="large"
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={(value) => setSearchText(value)}
            style={{ width: '100%' }}
          />
        </div>

        <button
          onClick={exporterPDF}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Download className="w-4 h-4" />
          Exporter en PDF
        </button>
      </div>

      <div className="bg-white rounded shadow">
        <Table
          columns={colonnes}
          dataSource={filteredPayments}
          loading={loading}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total, range) => `${range[0]}-${range[1]} sur ${total} paiements`
          }}
          bordered
        />
      </div>
    </div>
  );
};

export default HistoriquePaiements;

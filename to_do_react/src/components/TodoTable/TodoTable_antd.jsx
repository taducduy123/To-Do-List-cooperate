import { Table, Tag, Button, Modal } from 'antd';
import { CheckOutlined, UndoOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';
import styles from './TodoTable_antd.module.css';

export default function TodoTable({ todos, page, limit, onToggle, onDelete, loading }) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);

  const showDeleteConfirm = (id) => {
    setTodoToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(todoToDelete);
    setDeleteModalOpen(false);
    setTodoToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setTodoToDelete(null);
  };

  const columns = [
    {
      title: '#',
      key: 'index',
      width: 60,
      render: (_, __, index) => (page - 1) * limit + index + 1,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
      sortDirections: ['ascend', 'descend'],
      render: (text, record) => (
        <span className={record.is_completed ? styles.completed : styles.normal}>
          {text}
        </span>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text, record) => (
        <span className={record.is_completed ? styles.completed : styles.normal}>
          {text}
        </span>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 120,
      render: (_, record) => (
        <Tag color={record.is_completed ? 'success' : 'warning'}>
          {record.is_completed ? 'Completed' : 'Pending'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 180,
      render: (_, record) => (
        <div className={styles.actions}>
          <Button
            type={record.is_completed ? 'default' : 'primary'}
            size="small"
            icon={record.is_completed ? <UndoOutlined /> : <CheckOutlined />}
            onClick={() => onToggle(record)}
          >
            {record.is_completed ? 'Undo' : 'Done'}
          </Button>
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className={styles.tableContainer}>
        <Table
          columns={columns}
          dataSource={todos}
          loading={loading}
          pagination={false}
          rowKey="id"
          locale={{ emptyText: 'No todos found' }}
        />
      </div>

      <Modal
        title="Delete this todo?"
        open={deleteModalOpen}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        okText="Yes, delete it"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
        maskClosable={false}
      >
        <p>Are you sure you want to delete this todo item?</p>
      </Modal>
    </>
  );
}
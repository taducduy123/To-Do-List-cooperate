import React from "react";
import {Table, Tag, Button, Popconfirm, Space, Typography} from "antd";

const {Text} = Typography;


export default function TodoTable({
                                      todos,
                                      page,
                                      limit,
                                      total = 0,
                                      loading = false,
                                      onToggle,
                                      onDelete,
                                      onPageChange,
                                  }) {
    const columns = [
        {
            title: "#",
            dataIndex: "index",
            key: "index",
            width: 80,
            align: "center",
            render: (_v, _record, idx) => (page - 1) * limit + idx + 1,
        },
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            ellipsis: true,
            sorter: (a, b) => a.title.localeCompare(b.title),
            render: (text, record) =>
                record.is_completed ? <Text delete>{text}</Text> : <Text>{text}</Text>,
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            ellipsis: true,
            sorter: (a, b) => a.description.localeCompare(b.description),
        },
        {
            title: "Status",
            dataIndex: "is_completed",
            key: "is_completed",
            width: 140,
            filters: [
                { text: "Pending", value: false },
                { text: "Completed", value: true },
            ],
            filterMultiple: false,
            onFilter: (value, record) => record.is_completed === value,
            render: (done) =>
                done ? <Tag color="green">✅ Completed</Tag> : <Tag>⏳ Pending</Tag>,
        },
        {
            title: "Actions",
            key: "actions",
            width: 220,
            render: (_v, record) => (
                <Space wrap>
                    <Button
                        size="small"
                        type={record.is_completed ? "default" : "primary"}
                        onClick={() => onToggle?.(record)}
                    >
                        {record.is_completed ? "Undo" : "Done"}
                    </Button>

                    <Popconfirm
                        title={`Do you want to delete this task?`}
                        okText="Delete"
                        okButtonProps={{danger: true}}
                        onConfirm={() => onDelete?.(record.id)}
                    >
                        <Button size="small" danger>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Table
            rowKey="id"
            columns={columns}
            dataSource={todos}
            loading={loading}
            locale={{emptyText: "No Results Found"}}
            pagination={
                {
                    current: page,
                    pageSize: limit,
                    total,
                    showSizeChanger: false,    // khóa đổi pageSize
                    showTotal: (t, range) => `${range[0]}–${range[1]} / ${t} records`,
                    onChange: (p) => onPageChange?.(p),
                }

            }
        />
    );
}

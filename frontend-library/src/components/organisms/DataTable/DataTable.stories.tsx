import type { Meta, StoryObj } from '@storybook/react';
import { DataTable } from './DataTable';
import { Badge } from '../../atoms/Badge';

const meta: Meta<typeof DataTable> = {
    title: 'Organisms/DataTable',
    component: DataTable,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DataTable>;

const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com', status: 'Active' },
    { id: 2, name: 'Bob', email: 'bob@example.com', status: 'Pending' },
    { id: 3, name: 'Carol', email: 'carol@example.com', status: 'Active' },
];

export const Default: Story = {
    render: () => (
        <DataTable
            data={users}
            getRowKey={(row) => row.id}
            columns={[
                { key: 'name', header: 'Name', sortable: true },
                { key: 'email', header: 'Email', sortable: true },
                {
                    key: 'status',
                    header: 'Status',
                    render: (row) => (
                        <Badge variant={row.status === 'Active' ? 'success' : 'warning'}>
                            {row.status}
                        </Badge>
                    ),
                },
            ]}
        />
    ),
};

export const Empty: Story = {
    render: () => (
        <DataTable<{ id: number; name: string; email: string }>
            data={[]}
            getRowKey={(row) => row.id}
            columns={[
                { key: 'name', header: 'Name' },
                { key: 'email', header: 'Email' },
            ]}
        />
    ),
};

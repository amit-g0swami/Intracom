import * as React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Spinner } from '../../atoms/Spinner';
import { EmptyState } from '../../molecules/EmptyState';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../Table/Table';

export interface DataTableColumn<T> {
    key: string;
    header: string;
    sortable?: boolean;
    className?: string;
    render?: (row: T) => React.ReactNode;
}

export interface DataTableProps<T extends Record<string, unknown>> {
    columns: DataTableColumn<T>[];
    data: T[];
    loading?: boolean;
    emptyTitle?: string;
    emptyDescription?: string;
    getRowKey: (row: T) => string | number;
    className?: string;
}

function DataTable<T extends Record<string, unknown>>({
    columns,
    data,
    loading,
    emptyTitle = 'No data',
    emptyDescription = 'There are no records to display.',
    getRowKey,
    className,
}: DataTableProps<T>) {
    const [sortKey, setSortKey] = React.useState<string | null>(null);
    const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('asc');

    const sortedData = React.useMemo(() => {
        if (!sortKey) return data;

        return [...data].sort((a, b) => {
            const av = a[sortKey];
            const bv = b[sortKey];
            if (av === bv) return 0;
            if (av == null) return 1;
            if (bv == null) return -1;
            const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
            return sortDir === 'asc' ? cmp : -cmp;
        });
    }, [data, sortDir, sortKey]);

    const toggleSort = (key: string) => {
        if (sortKey === key) {
            setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
            return;
        }
        setSortKey(key);
        setSortDir('asc');
    };

    if (loading) {
        return (
            <div className={cn('flex items-center justify-center py-16', className)}>
                <Spinner size="lg" />
            </div>
        );
    }

    if (!data.length) {
        return (
            <EmptyState
                className={className}
                title={emptyTitle}
                description={emptyDescription}
            />
        );
    }

    return (
        <Table className={className}>
            <TableHeader>
                <TableRow>
                    {columns.map((col) => (
                        <TableHead key={col.key} className={col.className}>
                            {col.sortable ? (
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-1 hover:text-foreground"
                                    onClick={() => toggleSort(col.key)}
                                >
                                    {col.header}
                                    {sortKey === col.key ? (
                                        sortDir === 'asc' ? (
                                            <ArrowUp className="h-3.5 w-3.5" />
                                        ) : (
                                            <ArrowDown className="h-3.5 w-3.5" />
                                        )
                                    ) : null}
                                </button>
                            ) : (
                                col.header
                            )}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {sortedData.map((row) => (
                    <TableRow key={getRowKey(row)}>
                        {columns.map((col) => (
                            <TableCell key={col.key} className={col.className}>
                                {col.render ? col.render(row) : String(row[col.key] ?? '')}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export { DataTable };

import React, { forwardRef } from 'react';
import { cn } from '@/utils';

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {}

export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={cn('w-full caption-bottom text-sm', className)}
        {...props}
      />
    </div>
  )
);

Table.displayName = 'Table';

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn('[&_tr]:border-b bg-gray-50', className)} {...props} />
  )
);

TableHeader.displayName = 'TableHeader';

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  )
);

TableBody.displayName = 'TableBody';

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'border-b transition-colors hover:bg-gray-50 data-[state=selected]:bg-gray-50',
        className
      )}
      {...props}
    />
  )
);

TableRow.displayName = 'TableRow';

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {}

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'h-12 px-4 text-left align-middle font-medium text-gray-700 [&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    />
  )
);

TableHead.displayName = 'TableHead';

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
      {...props}
    />
  )
);

TableCell.displayName = 'TableCell';
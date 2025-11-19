"use client";

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from '../ui/card';

interface Column<T> {
  accessor: keyof T | ((row: T) => any);
  header: string;
  cell?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  filterColumn?: keyof T;
  filterPlaceholder?: string;
}

export function DataTable<T extends { [key: string]: any }>({ columns, data, filterColumn, filterPlaceholder }: DataTableProps<T>) {
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = data.filter(item => {
    if (!filterColumn || !filter) return true;
    
    // Handle nested properties in filterColumn, e.g., 'paciente.nombreCompleto'
    const filterValue = String(filterColumn).split('.').reduce((o, i) => (o ? o[i] : undefined), item);
    
    // Also search in other columns
    const searchableRow = columns.map(col => {
      const value = typeof col.accessor === 'function' 
        ? col.accessor(item) 
        : item[col.accessor as keyof T];
      return String(value).toLowerCase();
    }).join(' ');

    return searchableRow.includes(filter.toLowerCase());
  });


  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      {filterColumn && (
        <div className="flex items-center">
          <Input
            placeholder={filterPlaceholder || `Filtrar...`}
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1); // Reset to first page on new filter
            }}
            className="max-w-sm"
          />
        </div>
      )}

      {/* Mobile View: Cards */}
      <div className="grid gap-4 md:hidden">
        {paginatedData.length > 0 ? (
          paginatedData.map((row, rowIndex) => (
            <Card key={rowIndex} className="p-4">
              <CardContent className="space-y-3 p-0">
                {columns.map((col, colIndex) => {
                  const cellContent = col.cell
                    ? col.cell(row)
                    : typeof col.accessor === 'function'
                    ? col.accessor(row)
                    : String(row[col.accessor as keyof T] ?? '');

                  // Don't render an empty row for actions
                  if (col.header.toLowerCase() === 'acciones' && typeof cellContent === 'object') {
                    return (
                       <div key={colIndex} className="flex justify-end pt-2">
                          {cellContent}
                       </div>
                    );
                  }

                  return (
                    <div key={colIndex} className="flex justify-between items-start text-sm">
                      <span className="font-semibold text-muted-foreground mr-2">{col.header}:</span>
                      <span className="text-right">{cellContent}</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-12">
            Sin resultados.
          </div>
        )}
      </div>

      {/* Desktop View: Table */}
      <div className="rounded-md border hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col, i) => (
                <TableHead key={i}>{col.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((col, colIndex) => (
                    <TableCell key={colIndex}>
                      {col.cell
                        ? col.cell(row)
                        : typeof col.accessor === 'function'
                        ? col.accessor(row)
                        : String(row[col.accessor as keyof T] ?? '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Sin resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2">
        <span className="text-sm text-muted-foreground">
          Página {currentPage} de {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}

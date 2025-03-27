import React, { useState, useEffect, useMemo } from 'react';
import { 
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable 
} from "@tanstack/react-table";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search,
  ChevronDown,
  Download 
} from 'lucide-react';

import tmfService from '../../services/tmf.serivce';

const ContentArea = ({ selectedItem }) => {
  const [documents, setDocuments] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');

  // Fetch documents 
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        let fetchedDocuments = [];
        fetchedDocuments = await tmfService.document.getAllDocuments();
        console.log("Fetched documents:", fetchedDocuments);

        
        // if (selectedItem) {
        //   const { type, item } = selectedItem;
          
        //   switch (type) {
        //     case 'zone':
        //       fetchedDocuments = await tmfService.documents.getAllByZone(item._id);
        //       break;
        //     case 'section':
        //       fetchedDocuments = await tmfService.documents.getAllBySection(item._id);
        //       break;
        //     case 'artifact':
        //       fetchedDocuments = await tmfService.documents.getAllByArtifact(item._id);
        //       break;
        //     case 'subArtifact':
        //       fetchedDocuments = await tmfService.documents.getAllBySubArtifact(item._id);
        //       break;
        //   }
        // } else {
        //   fetchedDocuments = await tmfService.document.getAllDocuments();
        //   console.log("Fetched documents:", fetchedDocuments);
        // }
  
        setDocuments(fetchedDocuments || []); 
      } catch (error) {
        console.error('Error fetching documents:', error);
        setDocuments([]);
      }
    };
  
    fetchDocuments();
  }, [selectedItem]);

  // Columns definition with download and additional fields
  const columns = useMemo(() => [
    {
      accessorKey: "documentId",
      header: "ID",
      cell: ({ row }) => <div className="px-2 text-left">{row.getValue("documentId") || 'N/A'}</div>,
    },
    {
      accessorKey: "documentTitle",
      header: "Title",
      cell: ({ row }) => <div className="px-2 text-left">{row.getValue("documentTitle") || 'N/A'}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <div className="px-2 text-center">{row.getValue("status") || 'N/A'}</div>,
    },
    {
      accessorKey: "version",
      header: "Version",
      cell: ({ row }) => <div className="px-2 text-center">{row.getValue("version") || 'N/A'}</div>,
    },
    {
      accessorKey: "study",
      header: "Study",
      cell: ({ row }) => <div className="px-2 text-left">{row.getValue("study") || 'N/A'}</div>,
    },
    {
      accessorKey: "country",
      header: "Country",
      cell: ({ row }) => <div className="px-2 text-left">{row.getValue("country") || 'N/A'}</div>,
    },
    {
      accessorKey: "site",
      header: "Site",
      cell: ({ row }) => <div className="px-2 text-left">{row.getValue("site") || 'N/A'}</div>,
    },
    {
      accessorKey: "createdBy",
      header: "Created By",
      cell: ({ row }) => (
        <div className="px-2 text-left">{row.original.createdBy?.userName || 'N/A'}</div>
      ),
    },
    {
      accessorKey: "zone",
      header: "Zone",
      cell: ({ row }) => <div className="px-2 text-left">{row.original.zone?.zoneName || 'N/A'}</div>,
    },
    {
      accessorKey: "section",
      header: "Section",
      cell: ({ row }) => <div className="px-2 text-left">{row.original.section?.sectionName || 'N/A'}</div>,
    },
    {
      accessorKey: "artifact",
      header: "Artifact",
      cell: ({ row }) => <div className="px-2 text-left">{row.original.artifact?.artifactName || 'N/A'}</div>,
    },
    {
      accessorKey: "subArtifact",
      header: "Sub Artifact",
      cell: ({ row }) => <div className="px-2 text-left">{row.original.subArtifact?.subArtifactName || 'N/A'}</div>,
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        const createdAt = row.getValue("createdAt");
        return <div className="px-2 text-center">{createdAt ? new Date(createdAt).toLocaleDateString() : 'N/A'}</div>;
      },
    },
    {
      accessorKey: "expirationDate",
      header: "Expiration Date",
      cell: ({ row }) => {
        const expirationDate = row.getValue("expirationDate");
        return <div className="px-2 text-center">{expirationDate ? new Date(expirationDate).toLocaleDateString() : 'N/A'}</div>;
      },
    },
    {
      accessorKey: "download",
      header: "Download",
      cell: ({ row }) => (
        <a 
          href={row.original.fileUrl} 
          download={row.original.fileName}
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline flex items-center px-2 text-left"
        >
          <Download className="mr-2 h-4 w-4" /> 
          {row.original.fileName}
        </a>
      ),
    },
  ], []);

  // Create the table instance
  const table = useReactTable({
    data: documents,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
  });

  // Global search filter function
  const handleGlobalFilter = (value) => {
    setGlobalFilter(value);
    table.setGlobalFilter(value);
  };

  return (
    <div className="h-full flex flex-col">
      <Card className="h-full flex flex-col">
        <CardHeader className="flex-none">
          <CardTitle>Documents</CardTitle>
          <CardDescription>
            {selectedItem 
              ? `Documents associated with this ${selectedItem.type}` 
              : 'All Documents'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col min-h-0">
          {/* Global Filter */}
          <div className="flex items-center mb-4 space-x-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={globalFilter}
                onChange={(e) => handleGlobalFilter(e.target.value)}
                className="pl-8 max-w-full"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentArea;
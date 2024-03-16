"use client";

import React, { ChangeEvent, Key, useCallback, useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Selection,
  SortDescriptor,
  Spinner,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { capitalize } from "@/lib/capitalize";
import { FaPlus, FaRegEye } from "react-icons/fa6";
import { RiArrowDownSLine } from "react-icons/ri";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IoRefresh, IoSearchOutline } from "react-icons/io5";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiErrorResponse, ApiSuccessResponse } from "@/lib/http";
import { DepartmentResponse, departmentGetList } from "@/api/departments";
import { AiOutlineFundView } from "react-icons/ai";
import { MdOutlineDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import PreviewRelatedModal from "@/components/preview-related-modal";
import { usePreviewRelatedStore } from "@/stores/preview-related-modal-store";
import { useModalStore } from "@/stores/modal-store";
import AddDepartmentModal from "@/components/Khoa/add-modal";
import LoadingState from "@/components/loading-state";

const columns = [
  { name: "Mã khoa", uid: "id", sortable: true },
  { name: "Tên khoa", uid: "name", sortable: true },
  { name: "Số lượng sinh viên", uid: "teachers", sortable: true },
  { name: "Số lượng giảng viên", uid: "students", sortable: true },
  { name: "Số lượng lớp học", uid: "classes", sortable: true },
  { name: "Số lượng môn học", uid: "subjects", sortable: true },
  { name: "Hành động", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "name",
  "classes",
  "students",
  "teachers",
  "subjects",
  "actions",
];

const previewRelatedSubjectColumns = [
  { name: "Mã", uid: "id" },
  { name: "Tên", uid: "name" },
  { name: "Số tín chỉ", uid: "credits" },
  { name: "% quá trình", uid: "process_percentage" },
  { name: "% giữa kì", uid: "midterm_percentage" },
  { name: "% cuối kì", uid: "final_percentage" },
  { name: "Mã khoa", uid: "department_id" },
];

const previewRelatedClassColumns = [
  { name: "Mã", uid: "id" },
  { name: "Tên", uid: "name" },
  { name: "Tối đa sinh viên", uid: "max_students" },
  { name: "Mã khoa", uid: "department_id" },
  { name: "Mã giảng viên", uid: "host_instructor_id" },
];

const previewRelatedInstructorColumns = [
  { name: "Mã", uid: "id" },
  { name: "Họ", uid: "first_name" },
  { name: "Tên", uid: "last_name" },
  { name: "Email", uid: "email" },
  { name: "Địa chỉ", uid: "address" },
  { name: "Ngày sinh", uid: "birth_day" },
  { name: "Số điện thoại", uid: "phone" },
  { name: "Giới tính", uid: "gender" },
  { name: "Trình độ", uid: "degree" },
];

const previewRelatedStudentColumns = [
  { name: "Mã", uid: "id" },
  { name: "Họ", uid: "first_name" },
  { name: "Tên", uid: "last_name" },
  { name: "Email", uid: "email" },
  { name: "Địa chỉ", uid: "address" },
  { name: "Ngày sinh", uid: "birth_day" },
  { name: "Số điện thoại", uid: "phone" },
  { name: "Giới tính", uid: "gender" },
  { name: "Mã lớp", uid: "class_id" },
];

export default function KhoaPage() {
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });

  const [page, setPage] = useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  //My Logic
  const {
    data: departmentsData,
    isFetching: departmentIsPending,
    refetch: departmentRefetch,
  } = useQuery<ApiSuccessResponse<DepartmentResponse[]>, ApiErrorResponse, DepartmentResponse[]>({
    queryKey: ["departments"],
    queryFn: async () => await departmentGetList(),
    select: (res) => res?.data,
  });

  const { handleOpenPreviewRelatedModal } = usePreviewRelatedStore();

  const { onOpen } = useModalStore();

  //End My Logic

  const filteredItems = useMemo(() => {
    let filteredUsers: DepartmentResponse[] = [...(departmentsData ?? [])];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filteredUsers = filteredUsers.filter((user) => Array.from(statusFilter).includes(user.name));
    }

    return filteredUsers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departmentsData, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a: DepartmentResponse, b: DepartmentResponse) => {
      const first = a[sortDescriptor.column as keyof DepartmentResponse] as number;
      const second = b[sortDescriptor.column as keyof DepartmentResponse] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = useCallback(
    (department: DepartmentResponse, columnKey: Key) => {
      const cellValue = department[columnKey as keyof DepartmentResponse];

      switch (columnKey) {
        case "classes":
          return (
            <div className="relative flex justify-center items-center gap-2">
              <p className="font-medium text-base">{department?.classes?.length ?? 0}</p>
              <AiOutlineFundView
                className="elative flex justify-center items-center cursor-pointer hover:text-gray-400"
                size={24}
                onClick={() =>
                  handleOpenPreviewRelatedModal<ClassResponse>(
                    department?.classes ?? [],
                    previewRelatedClassColumns
                  )
                }
              />
            </div>
          );
        case "teachers":
          return (
            <div className="relative flex justify-center items-center gap-2">
              <p className="font-medium text-base">{department?.instructors?.length ?? 0}</p>
              <AiOutlineFundView
                className="elative flex justify-center items-center cursor-pointer hover:text-gray-400"
                size={24}
                onClick={() =>
                  handleOpenPreviewRelatedModal<ClassResponse>(
                    department?.instructors ?? [],
                    previewRelatedInstructorColumns
                  )
                }
              />
            </div>
          );
        case "students":
          return (
            <div className="relative flex justify-center items-center gap-2">
              <p className="font-medium text-base">{department?.students?.length ?? 0}</p>
              <AiOutlineFundView
                className="elative flex justify-center items-center cursor-pointer hover:text-gray-400"
                size={24}
                onClick={() =>
                  handleOpenPreviewRelatedModal<ClassResponse>(
                    department?.students ?? [],
                    previewRelatedStudentColumns
                  )
                }
              />
            </div>
          );
        case "subjects":
          return (
            <div className="relative flex justify-center items-center gap-2">
              <p className="font-medium text-base">{department?.subjects?.length ?? 0}</p>
              <AiOutlineFundView
                className="elative flex justify-center items-center cursor-pointer hover:text-gray-400"
                size={24}
                onClick={() =>
                  handleOpenPreviewRelatedModal(
                    department?.subjects ?? [],
                    previewRelatedSubjectColumns
                  )
                }
              />
            </div>
          );
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <span className="text-lg text-blue-400 cursor-pointer active:opacity-50 hover:text-gray-400">
                <FaRegEdit />
              </span>
              <span className="text-lg text-danger cursor-pointer active:opacity-50 hover:text-gray-400">
                <MdOutlineDelete />
              </span>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [handleOpenPreviewRelatedModal]
  );

  const onRowsPerPageChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Tìm kiếm theo tên khoa..."
            startContent={<IoSearchOutline />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<RiArrowDownSLine className="text-small" />} variant="flat">
                  Các cột hiển thị
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              onPress={() => onOpen("add_department")}
              color="secondary"
              endContent={<FaPlus />}
            >
              Thêm khoa mới
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Có <span className="font-bold text-black">{departmentsData?.length}</span> khoa
          </span>
          <Select
            label="Số dòng mỗi trang:"
            defaultSelectedKeys={rowsPerPage.toString()}
            size="sm"
            labelPlacement="outside-left"
            className="max-w-40"
            onChange={onRowsPerPageChange}
          >
            <SelectItem key={5} value="5">
              5
            </SelectItem>
            <SelectItem key={25} value="25">
              25
            </SelectItem>
            <SelectItem key={50} value="50">
              50
            </SelectItem>
            <SelectItem key={100} value="100">
              100
            </SelectItem>
          </Select>
        </div>
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    departmentsData?.length,
    hasSearchFilter,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          showControls
          classNames={{
            cursor: "bg-foreground text-background",
          }}
          color="default"
          isDisabled={hasSearchFilter}
          page={page}
          total={pages}
          variant="light"
          onChange={setPage}
        />
        <span className="text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} trên ${items.length} đã chọn`}
        </span>
      </div>
    );
  }, [hasSearchFilter, page, pages, selectedKeys, items.length]);

  return (
    <>
      <Card>
        <CardHeader></CardHeader>
        <CardContent>
          <Table
            aria-label="Example table with custom cells, pagination and sorting"
            isHeaderSticky
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            classNames={{
              wrapper: "max-h-[382px]",
            }}
            selectedKeys={selectedKeys}
            selectionMode="multiple"
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="outside"
            onSelectionChange={setSelectedKeys}
            onSortChange={setSortDescriptor}
          >
            <TableHeader columns={headerColumns}>
              {(column) => (
                <TableColumn
                  key={column.uid}
                  align={column.uid === "actions" ? "center" : "start"}
                  allowsSorting={column.sortable}
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              emptyContent={"Không tìm thấy khoa nào"}
              loadingContent={<Spinner label="Loading..." color="secondary" size="md" />}
              loadingState={departmentIsPending ? "loading" : "idle"}
              items={sortedItems}
            >
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <PreviewRelatedModal />
      <AddDepartmentModal modal_key="add_department" />
    </>
  );
}

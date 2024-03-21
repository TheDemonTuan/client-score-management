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
import { FaPlus } from "react-icons/fa6";
import { RiArrowDownSLine } from "react-icons/ri";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IoSearchOutline } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";
import { ApiErrorResponse, ApiSuccessResponse } from "@/lib/http";
import { AiOutlineFundView } from "react-icons/ai";
import { MdOutlineDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import PreviewRelatedModal, {
  PreviewRelatedClassColumns,
} from "@/components/preview-related-modal";
import { useModalStore } from "@/stores/modal-store";
import { InstructorReponse, instructorGetAll } from "@/api/instructors";
import { DepartmentResponse, departmentGetAll } from "@/api/departments";
import AddInstructorModal from "@/components/Giang-Vien/add-modal";
import EditInstructorModal from "@/components/Giang-Vien/edit-modal";
import DeleteInstructorModal from "@/components/Giang-Vien/delete-modal";

const columns = [
  { name: "Mã giảng viên", uid: "id", sortable: true },
  { name: "Họ giảng viên", uid: "first_name", sortable: true },
  { name: "Tên giảng viên", uid: "last_name", sortable: true },
  { name: "Họ tên giảng viên", uid: "full_name", sortable: true },
  { name: "Email", uid: "email", sortable: true },
  { name: "Địa chỉ", uid: "address", sortable: true },
  { name: "Ngày sinh", uid: "birth_day", sortable: true },
  { name: "Số điện thoại", uid: "phone", sortable: true },
  { name: "Giới tính", uid: "gender", sortable: true },
  { name: "Trình độ", uid: "degree", sortable: true },
  { name: "Thuộc khoa", uid: "department_id", sortable: true },
  { name: "Số lượng lớp quản lý", uid: "classes", sortable: true },
  { name: "Hành động", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "full_name",
  "email",
  "phone",
  "gender",
  "department_id",
  "classes",
  "actions",
];

export default function GiangVienPage() {
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({});

  const [page, setPage] = useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  //My Logic
  const { data: departmentsData, isPending: departmentsIsPending } = useQuery<
    ApiSuccessResponse<DepartmentResponse[]>,
    ApiErrorResponse,
    DepartmentResponse[]
  >({
    queryKey: ["departments"],
    queryFn: async () => await departmentGetAll(),
    select: (res) => res?.data,
  });

  const { data: instructorsData, isPending: instructorsIsPending } = useQuery<
    ApiSuccessResponse<InstructorReponse[]>,
    ApiErrorResponse,
    InstructorReponse[]
  >({
    queryKey: ["instructors"],
    queryFn: async () => await instructorGetAll(),
    select: (res) => res?.data,
    enabled: !departmentsIsPending,
  });

  const { modalOpen, changeModalData } = useModalStore();

  //End My Logic

  const filteredItems = useMemo(() => {
    let filteredInstructors = [...(instructorsData ?? [])];

    if (hasSearchFilter) {
      filteredInstructors = filteredInstructors.filter(
        (instructor) =>
          instructor.first_name.toLowerCase().includes(filterValue.toLowerCase()) ||
          instructor.last_name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredInstructors;
  }, [instructorsData, hasSearchFilter, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a: InstructorReponse, b: InstructorReponse) => {
      const first = a[sortDescriptor.column as keyof InstructorReponse] as string;
      const second = b[sortDescriptor.column as keyof InstructorReponse] as string;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = useCallback(
    (instructor: InstructorReponse, columnKey: Key) => {
      const cellValue = instructor[columnKey as keyof InstructorReponse];

      switch (columnKey) {
        case "full_name":
          return `${instructor.first_name} ${instructor.last_name}`;
        case "gender":
          return `${!instructor.gender ? "Nam" : "Nữ"}`;
        case "department_id":
          return `
              ${
                departmentsData?.find((department) => department.id === instructor.department_id)
                  ?.name
              }`;
        case "classes":
          return (
            <div className="relative flex justify-center items-center gap-2">
              <p className="font-medium text-base">{instructor?.classes?.length ?? 0}</p>
              <AiOutlineFundView
                className="elative flex justify-center items-center cursor-pointer hover:text-gray-400"
                size={24}
                onClick={() => {
                  changeModalData({
                    data: instructor?.classes ?? [],
                    columns: PreviewRelatedClassColumns,
                  });
                  modalOpen("preview_related");
                }}
              />
            </div>
          );
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <FaRegEdit
                onClick={() => {
                  changeModalData(instructor);
                  modalOpen("edit_instructor");
                }}
                className="text-lg text-blue-400 cursor-pointer active:opacity-50 hover:text-gray-400"
              />
              <MdOutlineDelete
                onClick={() => {
                  changeModalData(instructor);
                  modalOpen("delete_instructor");
                }}
                className="text-lg text-danger cursor-pointer active:opacity-50 hover:text-gray-400"
              />
            </div>
          );
        default:
          return cellValue;
      }
    },
    [changeModalData, departmentsData, modalOpen]
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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <Input
            isClearable
            isDisabled={instructorsIsPending}
            className="w-full sm:max-w-[40%]"
            placeholder="Tìm kiếm theo họ hoặc tên giảng viên..."
            variant="bordered"
            startContent={<IoSearchOutline />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="grid grid-flow-col gap-2 justify-between">
            <Dropdown className="col-span-1 text-sm md:text-base">
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<RiArrowDownSLine className="text-small" />} variant="faded">
                  Hiển thị
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
              onPress={() => modalOpen("add_instructor")}
              color="secondary"
              variant="shadow"
              className="text-sm md:text-base col-span-3 sm:col-span-1"
              endContent={<FaPlus />}
              isLoading={instructorsIsPending}
            >
              Thêm giảng viên mới
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Có <span className="font-bold text-black">{instructorsData?.length}</span> giảng viên
          </span>
          <Select
            label="Số dòng:"
            defaultSelectedKeys={rowsPerPage.toString()}
            size="sm"
            labelPlacement="outside-left"
            variant="faded"
            className="max-w-24 sm:max-w-32"
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
  }, [
    filterValue,
    onSearchChange,
    visibleColumns,
    instructorsIsPending,
    instructorsData?.length,
    rowsPerPage,
    onRowsPerPageChange,
    onClear,
    modalOpen,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="flex flex-col sm:flex-row justify-between items-center p-2 gap-4">
        <Pagination
          isCompact
          showControls
          showShadow
          color="secondary"
          // isDisabled={hasSearchFilter}
          page={page}
          total={pages || 1}
          variant="light"
          onChange={setPage}
        />
        {selectedKeys === "all" && (
          <Button startContent={<MdOutlineDelete size={24} />} color="danger" variant="flat">
            <span>
              <span className="font-bold">tất cả</span> các giảng viên
            </span>
          </Button>
        )}
        {selectedKeys !== "all" && selectedKeys.size > 0 && (
          <Button startContent={<MdOutlineDelete size={24} />} color="danger" variant="flat">
            <span>
              <span className="font-bold">{`${selectedKeys.size}/${filteredItems.length}`}</span>{" "}
              giảng viên đã chọn
            </span>
          </Button>
        )}
      </div>
    );
  }, [page, pages, selectedKeys, filteredItems.length]);

  return (
    <>
      <Card>
        <CardContent className="p-2 lg:p-4">
          <Table
            aria-label="Danh sách các khoa"
            isHeaderSticky
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            classNames={{
              wrapper: "max-h-[382px]",
            }}
            selectedKeys={selectedKeys}
            selectionMode="multiple"
            checkboxesProps={{
              color: "secondary",
            }}
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
              emptyContent={"Không tìm thấy giảng viên nào"}
              loadingContent={<Spinner label="Loading..." color="secondary" size="md" />}
              loadingState={instructorsIsPending ? "loading" : "idle"}
              items={sortedItems}
            >
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => <TableCell>{renderCell(item, columnKey) as any}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <PreviewRelatedModal modal_key="preview_related" />
      <AddInstructorModal modal_key="add_instructor" />
      <EditInstructorModal modal_key="edit_instructor" />
      <DeleteInstructorModal modal_key="delete_instructor" />
    </>
  );
}

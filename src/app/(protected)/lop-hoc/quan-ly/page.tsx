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
import { Card, CardContent } from "@/components/ui/card";
import { IoSearchOutline } from "react-icons/io5";
import {  useSuspenseQueries } from "@tanstack/react-query";
import {  ApiSuccessResponse } from "@/lib/http";
import { AiOutlineFundView } from "react-icons/ai";
import { MdOutlineDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import PreviewRelatedModal, {
  PreviewRelatedStudentColumns,
  previewRelatedModalKey,
} from "@/components/preview-related-modal";
import { useModalStore } from "@/stores/modal-store";
import { DepartmentResponse, departmentGetAll } from "@/api/departments";
import { ClassResponse, classGetAll } from "@/api/classes";
import { AddClassModal, DeleteClassModal, EditClassModal, addClassModalKey, deleteClassModalKey, editClassModalKey } from "@/components/Lop-Hoc/modal";
import { InstructorReponse, instructorGetAll } from "@/api/instructors";

const columns = [
  { name: "Mã lớp", uid: "id", sortable: true },
  { name: "Tên lớp", uid: "name", sortable: true },
  { name: "Số lượng tối đa", uid: "max_students", sortable: true },
  { name: "Thuộc khoa", uid: "department_id", sortable: true },
  { name: "Chủ nhiệm bởi", uid: "host_instructor_id", sortable: true },
  { name: "Số lượng sinh viên", uid: "students", sortable: true },
  { name: "Hành động", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "name",
  "max_students",
  "department_id",
  "host_instructor_id",
  "students",
  "actions",
];

export default function LopHocQuanLyPage() {
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

  const [departmentsQuery, instructorsQuery, classesQuery] = useSuspenseQueries({
    queries: [
      {
        queryKey: ["departments", { preload: false, select: ["id", "name"] }],
        queryFn: async () =>
          await departmentGetAll({
            preload: false,
            select: ["id", "name"],
          }),
        select: (res: ApiSuccessResponse<DepartmentResponse[]>) => res?.data,
      },
      {
        queryKey: ["instructors", { preload: false, select: ["id", "first_name", "last_name"] }],
        queryFn: async () =>
          await instructorGetAll({
            preload: false,
            select: ["id", "first_name", "last_name"],
          }),
        select: (res: ApiSuccessResponse<InstructorReponse[]>) => res?.data,
      },
      {
        queryKey: ["classes"],
        queryFn: async () => await classGetAll(),
        select: (res: ApiSuccessResponse<ClassResponse[]>) => res?.data,
      },
    ],
  });

  const { modalOpen, setModalData, modelKey } = useModalStore();

  //End My Logic

  const filteredItems = useMemo(() => {
    let filteredClasses = [...(classesQuery.data ?? [])];

    if (hasSearchFilter) {
      filteredClasses = filteredClasses.filter((classItem) =>
        classItem.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredClasses;
  }, [classesQuery.data, hasSearchFilter, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a: ClassResponse, b: ClassResponse) => {
      const first = a[sortDescriptor.column as keyof ClassResponse] as string;
      const second = b[sortDescriptor.column as keyof ClassResponse] as string;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = useCallback(
    (classData: ClassResponse, columnKey: Key) => {
      const cellValue = classData[columnKey as keyof ClassResponse];

      switch (columnKey) {
        case "host_instructor_id":
          return `${
            instructorsQuery.data?.find((instructor) => instructor.id === classData.host_instructor_id)?.first_name
          } ${instructorsQuery.data?.find((instructor) => instructor.id === classData.host_instructor_id)?.last_name}`;
        case "department_id":
          return `
              ${departmentsQuery.data?.find((department) => department.id === classData.department_id)?.name}`;
        case "students":
          return (
            <div className="relative flex justify-center items-center gap-2">
              <p className="font-medium text-base">{classData?.students?.length ?? 0}</p>
              <AiOutlineFundView
                className="elative flex justify-center items-center cursor-pointer hover:text-gray-400"
                size={24}
                onClick={() => {
                  setModalData({
                    data: classData?.students ?? [],
                    columns: PreviewRelatedStudentColumns,
                  });
                  modalOpen(previewRelatedModalKey);
                }}
              />
            </div>
          );
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <FaRegEdit
                onClick={() => {
                  setModalData(classData);
                  modalOpen(editClassModalKey);
                }}
                className="text-xl lg:text-2xl text-blue-400 cursor-pointer active:opacity-50 hover:text-gray-400"
              />
              <MdOutlineDelete
                onClick={() => {
                  setModalData(classData);
                  modalOpen(deleteClassModalKey);
                }}
                className="text-xl lg:text-2xl text-danger cursor-pointer active:opacity-50 hover:text-gray-400"
              />
            </div>
          );
        default:
          return cellValue;
      }
    },
    [instructorsQuery.data, departmentsQuery.data, setModalData, modalOpen]
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
            isDisabled={classesQuery.isPending}
            className="w-full sm:max-w-[40%]"
            placeholder="Tìm kiếm theo tên lớp..."
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
                onSelectionChange={setVisibleColumns}>
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              onPress={() => modalOpen(addClassModalKey)}
              color="secondary"
              variant="solid"
              className="text-sm md:text-base col-span-3 sm:col-span-1"
              endContent={<FaPlus />}
              isLoading={classesQuery.isPending}>
              Thêm lớp học mới
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Có <span className="font-bold text-black">{classesQuery.data.length}</span> lớp học
          </span>
          <Select
            label="Số dòng:"
            defaultSelectedKeys={rowsPerPage.toString()}
            size="sm"
            labelPlacement="outside-left"
            variant="faded"
            className="max-w-28 sm:max-w-32"
            onChange={onRowsPerPageChange}>
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
    classesQuery.isPending,
    classesQuery.data.length,
    filterValue,
    onSearchChange,
    visibleColumns,
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
              <span className="font-bold">tất cả</span> các lớp học
            </span>
          </Button>
        )}
        {selectedKeys !== "all" && selectedKeys.size > 0 && (
          <Button startContent={<MdOutlineDelete size={24} />} color="danger" variant="flat">
            <span>
              <span className="font-bold">{`${selectedKeys.size}/${filteredItems.length}`}</span> lớp học đã chọn
            </span>
          </Button>
        )}
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pages, selectedKeys, items.length, hasSearchFilter, filteredItems.length]);

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
            onSortChange={setSortDescriptor}>
            <TableHeader columns={headerColumns}>
              {(column) => (
                <TableColumn
                  key={column.uid}
                  align={column.uid === "actions" ? "center" : "start"}
                  allowsSorting={column.sortable}>
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              emptyContent={"Không tìm thấy môn học nào"}
              loadingContent={<Spinner label="Loading..." color="secondary" size="md" />}
              loadingState={
                instructorsQuery.isPending || departmentsQuery.isPending || classesQuery.isPending ? "loading" : "idle"
              }
              items={sortedItems}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => <TableCell>{renderCell(item, columnKey) as any}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {modelKey === previewRelatedModalKey && <PreviewRelatedModal key={previewRelatedModalKey} />}
      {modelKey === addClassModalKey && <AddClassModal key={addClassModalKey} />}
      {modelKey === editClassModalKey && <EditClassModal key={editClassModalKey} />}
      {modelKey === deleteClassModalKey && <DeleteClassModal key={deleteClassModalKey} />}
    </>
  );
}

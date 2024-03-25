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
import { useSuspenseQueries } from "@tanstack/react-query";
import { ApiSuccessResponse } from "@/lib/http";
import { AiOutlineFundView } from "react-icons/ai";
import { MdOutlineDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import PreviewRelatedModal, {
  PreviewRelatedClassColumns,
  previewRelatedModalKey,
} from "@/components/preview-related-modal";
import { useModalStore } from "@/stores/modal-store";
import { SubjectResponse, subjectGetAll } from "@/api/subjects";
import { DepartmentResponse, departmentGetAll } from "@/api/departments";
import {
  AddSubjectModal,
  DeleteSubjectModal,
  EditSubjectModal,
  addSubjectModalKey,
  deleteSubjectModalKey,
  editSubjectModalKey,
} from "@/components/Mon-Hoc/modal";
import { BsThreeDotsVertical } from "react-icons/bs";

const columns = [
  { name: "Mã môn học", uid: "id", sortable: true },
  { name: "Tên môn học", uid: "name", sortable: true },
  { name: "Số tín chỉ", uid: "credits", sortable: true },
  { name: "% quá trình", uid: "process_percentage", sortable: true },
  { name: "% giữa kì", uid: "midterm_percentage", sortable: true },
  { name: "% cuối kì", uid: "final_percentage", sortable: true },
  { name: "Thuộc khoa", uid: "department_id", sortable: true },
  { name: "Số lượng điểm", uid: "grades", sortable: true },
  { name: "Số giảng viên giảng dạy", uid: "instructor_assignments", sortable: true },
  { name: "Số lượng sinh viên đăng ký", uid: "student_registrations", sortable: true },
  { name: "Hành động", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "name",
  "credits",
  "process_percentage",
  "midterm_percentage",
  "final_percentage",
  "department_id",
  "actions",
];

export default function MonHocPage() {
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
  const [departmentsQuery, subjectsQuery] = useSuspenseQueries({
    queries: [
      {
        queryKey: ["departments"],
        queryFn: async () => await departmentGetAll(),
        select: (res: ApiSuccessResponse<DepartmentResponse[]>) => res?.data,
      },
      {
        queryKey: ["subjects"],
        queryFn: async () => await subjectGetAll(),
        select: (res: ApiSuccessResponse<SubjectResponse[]>) => res?.data,
      },
    ],
  });

  const { modalOpen, setModalData, modelKey } = useModalStore();

  //End My Logic

  const filteredItems = useMemo(() => {
    let filteredSubjects = [...(subjectsQuery.data ?? [])];

    if (hasSearchFilter) {
      filteredSubjects = filteredSubjects.filter((subject) =>
        subject.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredSubjects;
  }, [subjectsQuery.data, hasSearchFilter, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a: SubjectResponse, b: SubjectResponse) => {
      const first = a[sortDescriptor.column as keyof SubjectResponse] as string;
      const second = b[sortDescriptor.column as keyof SubjectResponse] as string;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = useCallback(
    (subject: SubjectResponse, columnKey: Key) => {
      const cellValue = subject[columnKey as keyof SubjectResponse];

      switch (columnKey) {
        case "department_id":
          return `
              ${departmentsQuery.data.find((department) => department.id === subject.department_id)?.name}`;
        case "grades":
          return (
            <div className="relative flex justify-center items-center gap-2">
              <p className="font-medium text-base">{subject?.grades?.length ?? 0}</p>
              <AiOutlineFundView
                className="elative flex justify-center items-center cursor-pointer hover:text-gray-400"
                size={24}
                onClick={() => {
                  setModalData({
                    data: subject?.grades ?? [],
                    columns: PreviewRelatedClassColumns,
                  });
                  modalOpen(previewRelatedModalKey);
                }}
              />
            </div>
          );
        case "instructor_assignments":
          return (
            <div className="relative flex justify-center items-center gap-2">
              <p className="font-medium text-base">{subject?.instructor_assignments?.length ?? 0}</p>
              <AiOutlineFundView
                className="elative flex justify-center items-center cursor-pointer hover:text-gray-400"
                size={24}
                onClick={() => {
                  setModalData({
                    data: subject?.instructor_assignments ?? [],
                    columns: PreviewRelatedClassColumns,
                  });
                  modalOpen(previewRelatedModalKey);
                }}
              />
            </div>
          );
        case "student_registrations":
          return (
            <div className="relative flex justify-center items-center gap-2">
              <p className="font-medium text-base">{subject?.student_registrations?.length ?? 0}</p>
              <AiOutlineFundView
                className="elative flex justify-center items-center cursor-pointer hover:text-gray-400"
                size={24}
                onClick={() => {
                  setModalData({
                    data: subject?.student_registrations ?? [],
                    columns: PreviewRelatedClassColumns,
                  });
                  modalOpen(previewRelatedModalKey);
                }}
              />
            </div>
          );
        case "actions":
          return (
            <div className="relative flex items-center justify-center gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <BsThreeDotsVertical size={21} />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="action">
                  <DropdownItem
                    aria-label="Chỉnh sửa"
                    startContent={
                      <FaRegEdit className="text-lg lg:text-xl text-blue-400 cursor-pointer active:opacity-50 hover:text-gray-400" />
                    }
                    onClick={() => {
                      setModalData(subject);
                      modalOpen(editSubjectModalKey);
                    }}>
                    Chỉnh sửa
                  </DropdownItem>
                  <DropdownItem
                    aria-label="Xoá"
                    startContent={
                      <MdOutlineDelete className="text-xl lg:text-2xl text-danger cursor-pointer active:opacity-50 hover:text-gray-400" />
                    }
                    onClick={() => {
                      setModalData(subject);
                      modalOpen(deleteSubjectModalKey);
                    }}>
                    Xoá
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [departmentsQuery.data, modalOpen, setModalData]
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
            isDisabled={subjectsQuery.isPending}
            className="w-full sm:max-w-[40%]"
            placeholder="Tìm kiếm theo tên môn học..."
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
              onPress={() => modalOpen(addSubjectModalKey)}
              color="secondary"
              variant="solid"
              className="text-sm md:text-base col-span-3 sm:col-span-1"
              endContent={<FaPlus />}
              isLoading={subjectsQuery.isPending}>
              Thêm môn học mới
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Có <span className="font-bold text-black">{subjectsQuery.data.length}</span> môn học
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
    subjectsQuery.isPending,
    subjectsQuery.data.length,
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
              <span className="font-bold">tất cả</span> các môn học
            </span>
          </Button>
        )}
        {selectedKeys !== "all" && selectedKeys.size > 0 && (
          <Button startContent={<MdOutlineDelete size={24} />} color="danger" variant="flat">
            <span>
              <span className="font-bold">{`${selectedKeys.size}/${filteredItems.length}`}</span> môn học đã chọn
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
              loadingState={subjectsQuery.isPending ? "loading" : "idle"}
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
      {modelKey === addSubjectModalKey && <AddSubjectModal key={addSubjectModalKey} />}
      {modelKey === editSubjectModalKey && <EditSubjectModal key={editSubjectModalKey} />}
      {modelKey === deleteSubjectModalKey && <DeleteSubjectModal key={deleteSubjectModalKey} />}
    </>
  );
}

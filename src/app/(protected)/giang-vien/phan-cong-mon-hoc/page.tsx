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
  Card,
  CardBody,
} from "@nextui-org/react";
import { capitalize } from "@/lib/capitalize";
import { FaPlus } from "react-icons/fa6";
import { RiArrowDownSLine } from "react-icons/ri";
import { IoSearchOutline } from "react-icons/io5";
import { useSuspenseQueries } from "@tanstack/react-query";
import { ApiSuccessResponse } from "@/lib/http";
import { MdOutlineDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { useModalStore } from "@/stores/modal-store";
import { DepartmentResponse, departmentGetAll } from "@/api/departments";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AssignmentResponse, assignmentGetAll } from "@/api/assignment";
import {
  AddInstructorAssignmentModal,
  DeleteInstructorAssignmentModal,
  EditInstructorAssignmentModal,
  addInstructorAssignmentModalKey,
  deleteInstructorAssignmentModalKey,
  editInstructorAssignmentModalKey,
} from "@/components/Giang-Vien/Phan-Cong-Mon-Hoc/modal";

const columns = [
  { name: "Mã", uid: "id", sortable: true },
  { name: "Họ và tên giáo viên", uid: "full_name", sortable: true },
  { name: "Tên môn học được phân công", uid: "subject_name", sortable: true },
  { name: "Thuộc khoa", uid: "department_id", sortable: true },
  { name: "Hành động", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = ["id", "full_name", "subject_name", "department_id", "created_at", "actions"];

export default function GiangVienPhanCongMonHocPage() {
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
  const [assignmentsQuery, departmentsQuery] = useSuspenseQueries({
    queries: [
      {
        queryKey: ["assignments"],
        queryFn: async () => await assignmentGetAll(),
        select: (res: ApiSuccessResponse<AssignmentResponse[]>) => res?.data,
      },
      {
        queryKey: ["departments"],
        queryFn: async () => await departmentGetAll(),
        select: (res: ApiSuccessResponse<DepartmentResponse[]>) => res?.data,
      },
    ],
  });

  const { modalOpen, setModalData, modelKey } = useModalStore();

  //End My Logic

  const filteredItems = useMemo(() => {
    let filteredAssignments = [...(assignmentsQuery.data ?? [])];

    if (hasSearchFilter) {
      filteredAssignments = filteredAssignments.filter((assignment) =>
        assignment.instructor_id.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredAssignments;
  }, [assignmentsQuery.data, hasSearchFilter, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a: AssignmentResponse, b: AssignmentResponse) => {
      const first = a[sortDescriptor.column as keyof AssignmentResponse] as string;
      const second = b[sortDescriptor.column as keyof AssignmentResponse] as string;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = useCallback(
    (assignment: AssignmentResponse, columnKey: Key) => {
      const cellValue = assignment[columnKey as keyof AssignmentResponse];

      const currDepartment = departmentsQuery.data.find((department) =>
        department.subjects.find((subject) => subject.id === assignment.subject_id)
      );
      const currInstructor = currDepartment?.instructors.find(
        (instructor) => instructor.id === assignment.instructor_id
      );
      const currSubject = currDepartment?.subjects.find((subject) => subject.id === assignment.subject_id);

      switch (columnKey) {
        case "full_name":
          return `${currInstructor?.first_name} ${currInstructor?.last_name}`;
        case "subject_name":
          return currSubject?.name;
        case "department_id":
          return currDepartment?.name;
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
                      setModalData({
                        department: currDepartment,
                        instructor: currInstructor,
                        subject: currSubject,
                        assignment,
                      });
                      modalOpen(editInstructorAssignmentModalKey);
                    }}>
                    Chỉnh sửa
                  </DropdownItem>
                  <DropdownItem
                    aria-label="Xoá"
                    startContent={
                      <MdOutlineDelete className="text-xl lg:text-2xl text-danger cursor-pointer active:opacity-50 hover:text-gray-400" />
                    }
                    onClick={() => {
                      setModalData(assignment);
                      modalOpen(deleteInstructorAssignmentModalKey);
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
    [departmentsQuery.data, setModalData, modalOpen]
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
            isDisabled={assignmentsQuery.isPending}
            className="w-full sm:max-w-[40%]"
            placeholder="Tìm kiếm tên môn học hoặc giảng viên..."
            variant="underlined"
            startContent={<IoSearchOutline size={24} />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="grid grid-flow-col gap-2 justify-between">
            <Dropdown className="col-span-1 text-sm md:text-base">
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<RiArrowDownSLine className="text-small" />} variant="ghost">
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
              onPress={() => modalOpen(addInstructorAssignmentModalKey)}
              color="secondary"
              variant="shadow"
              className="text-sm md:text-base col-span-2 sm:col-span-1"
              endContent={<FaPlus />}
              isLoading={assignmentsQuery.isPending}>
              Thêm phân công mới
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Có <span className="font-bold text-secondary">{assignmentsQuery.data.length}</span> môn học được phân công
          </span>
          <Select
            label="Số dòng:"
            defaultSelectedKeys={rowsPerPage.toString()}
            size="sm"
            labelPlacement="outside-left"
            variant="bordered"
            className="max-w-24 sm:max-w-32"
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
    assignmentsQuery.isPending,
    assignmentsQuery.data.length,
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
              <span className="font-bold">tất cả</span> các giảng viên
            </span>
          </Button>
        )}
        {selectedKeys !== "all" && selectedKeys.size > 0 && (
          <Button startContent={<MdOutlineDelete size={24} />} color="danger" variant="flat">
            <span>
              <span className="font-bold">{`${selectedKeys.size}/${filteredItems.length}`}</span> giảng viên đã chọn
            </span>
          </Button>
        )}
      </div>
    );
  }, [page, pages, selectedKeys, filteredItems.length]);

  return (
    <>
      <Card className="lg:p-2" shadow="lg">
        <CardBody>
          <Table
            aria-label="Danh sách các khoa"
            isHeaderSticky
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            selectedKeys={selectedKeys}
            selectionMode="multiple"
            color="secondary"
            shadow="lg"
            fullWidth
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
              emptyContent={"Không tìm thấy giảng viên nào được phân công"}
              loadingContent={<Spinner label="Loading..." color="secondary" size="md" />}
              isLoading={assignmentsQuery.isPending}
              items={sortedItems}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => <TableCell>{renderCell(item, columnKey) as any}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
      {modelKey === addInstructorAssignmentModalKey && (
        <AddInstructorAssignmentModal key={addInstructorAssignmentModalKey} />
      )}
      {modelKey === editInstructorAssignmentModalKey && (
        <EditInstructorAssignmentModal key={editInstructorAssignmentModalKey} />
      )}
      {modelKey === deleteInstructorAssignmentModalKey && (
        <DeleteInstructorAssignmentModal key={deleteInstructorAssignmentModalKey} />
      )}
    </>
  );
}

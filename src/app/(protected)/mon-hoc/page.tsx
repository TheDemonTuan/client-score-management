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
import { MdOutlineDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import PreviewRelatedModal, {
  PreviewRelatedClassColumns,
  PreviewRelatedInstructorColumns,
  PreviewRelatedStudentColumns,
  PreviewRelatedSubjectColumns,
} from "@/components/preview-related-modal";
import { useModalStore } from "@/stores/modal-store";
import AddDepartmentModal from "@/components/Khoa/add-modal";
import EditDepartmentModal from "@/components/Khoa/edit-modal";
import DeleteDepartmentModal from "@/components/Khoa/delete-modal";
import { SubjectResponse, subjectGetList } from "@/api/subjects";

const columns = [
  { name: "Mã môn học", uid: "id", sortable: true },
  { name: "Tên môn học", uid: "name", sortable: true },
  { name: "Tín chỉ", uid: "credits", sortable: true },
  { name: "% quá trình", uid: "process_percentage", sortable: true },
  { name: "% giữa kì", uid: "midterm_percentage", sortable: true },
  { name: "% cuối kì", uid: "final_percentage", sortable: true },
  { name: "Thuộc khoa", uid: "department_id", sortable: true },
  { name: "Số lượng điểm", uid: "grades", sortable: true },
  { name: "Số lượng giáo viên dạy", uid: "assignments", sortable: true },
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
  "grades",
  "assignments",
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
  const { data: subjectsData, isPending: subjectsIsPending } = useQuery<
    ApiSuccessResponse<SubjectResponse[]>,
    ApiErrorResponse,
    SubjectResponse[]
  >({
    queryKey: ["subjects"],
    queryFn: async () => await subjectGetList(),
    select: (res) => res?.data,
  });

  const { modalOpen, changeModalData } = useModalStore();

  //End My Logic

  const filteredItems = useMemo(() => {
    let filteredSubjects = [...(subjectsData ?? [])];

    if (hasSearchFilter) {
      filteredSubjects = filteredSubjects.filter((subject) =>
        subject.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredSubjects;
  }, [subjectsData, filterValue, hasSearchFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a: SubjectResponse, b: SubjectResponse) => {
      const first = a[sortDescriptor.column as keyof SubjectResponse] as number;
      const second = b[sortDescriptor.column as keyof SubjectResponse] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = useCallback(
    (subject: SubjectResponse, columnKey: Key) => {
      const cellValue = subject[columnKey as keyof SubjectResponse];

      switch (columnKey) {
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <FaRegEdit
                onClick={() => {
                  changeModalData(subject);
                  modalOpen("edit_subject");
                }}
                className="text-lg text-blue-400 cursor-pointer active:opacity-50 hover:text-gray-400"
              />
              <MdOutlineDelete
                onClick={() => {
                  changeModalData(subject);
                  modalOpen("delete_subject");
                }}
                className="text-lg text-danger cursor-pointer active:opacity-50 hover:text-gray-400"
              />
            </div>
          );
        default:
          return cellValue;
      }
    },
    [changeModalData, modalOpen]
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
            placeholder="Tìm kiếm theo tên môn học..."
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
              onPress={() => modalOpen("add_subject")}
              color="secondary"
              endContent={<FaPlus />}
              isLoading={subjectsIsPending}
            >
              Thêm môn học mới
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Có <span className="font-bold text-black">{subjectsData?.length}</span> môn học
          </span>
          <Select
            label="Số dòng:"
            defaultSelectedKeys={rowsPerPage.toString()}
            size="sm"
            labelPlacement="outside-left"
            className="max-w-32"
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
    subjectsIsPending,
    subjectsData?.length,
    rowsPerPage,
    onRowsPerPageChange,
    onClear,
    modalOpen,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
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
              <span className="font-bold">{selectedKeys.size}</span> môn học đã chọn
            </span>
          </Button>
        )}
        <span className="text-small text-default-400">
          {selectedKeys === "all"
            ? "Đã chọn tất cả các môn học"
            : `${selectedKeys.size} trên ${filteredItems.length} môn học đã chọn`}
        </span>
      </div>
    );
  }, [page, pages, selectedKeys, filteredItems.length]);

  return (
    <>
      <Card>
        <CardHeader></CardHeader>
        <CardContent>
          <Table
            aria-label="Danh sách các môn học"
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
              emptyContent={"Không tìm thấy môn học nào"}
              loadingContent={<Spinner label="Loading..." color="secondary" size="md" />}
              loadingState={subjectsIsPending ? "loading" : "idle"}
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
      <PreviewRelatedModal modal_key="preview_related" />
      <AddDepartmentModal modal_key="add_subject" />
      <EditDepartmentModal modal_key="edit_subject" />
      <DeleteDepartmentModal modal_key="delete_subject" />
    </>
  );
}

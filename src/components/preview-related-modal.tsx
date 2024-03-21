"use client";

import React, { useMemo, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  getKeyValue,
} from "@nextui-org/react";
import { useModalStore } from "@/stores/modal-store";
import { useShallow } from "zustand/react/shallow";

export const PreviewRelatedSubjectColumns = [
  { name: "Mã", uid: "id" },
  { name: "Tên", uid: "name" },
  { name: "Số tín chỉ", uid: "credits" },
  { name: "% quá trình", uid: "process_percentage" },
  { name: "% giữa kì", uid: "midterm_percentage" },
  { name: "% cuối kì", uid: "final_percentage" },
  { name: "Mã khoa", uid: "department_id" },
];

export const PreviewRelatedClassColumns = [
  { name: "Mã", uid: "id" },
  { name: "Tên", uid: "name" },
  { name: "Tối đa sinh viên", uid: "max_students" },
  { name: "Mã khoa", uid: "department_id" },
  { name: "Mã giảng viên", uid: "host_instructor_id" },
];

export const PreviewRelatedInstructorColumns = [
  { name: "Mã", uid: "id" },
  { name: "Họ", uid: "first_name" },
  { name: "Tên", uid: "last_name" },
  { name: "Email", uid: "email" },
  { name: "Địa chỉ", uid: "address" },
  { name: "Số điện thoại", uid: "phone" },
  { name: "Giới tính", uid: "gender" },
  { name: "Trình độ", uid: "degree" },
];

export const PreviewRelatedStudentColumns = [
  { name: "Mã", uid: "id" },
  { name: "Họ", uid: "first_name" },
  { name: "Tên", uid: "last_name" },
  { name: "Email", uid: "email" },
  { name: "Địa chỉ", uid: "address" },
  { name: "Số điện thoại", uid: "phone" },
  { name: "Giới tính", uid: "gender" },
  { name: "Mã lớp", uid: "class_id" },
];

export interface PreviewRelatedModalData {
  data: any[];
  columns: { name: string; uid: string }[];
}

const PreviewRelatedModal = ({ modal_key }: { modal_key: string }) => {
  const { isModalOpen, modalClose, modalData } = useModalStore(
    useShallow((state) => ({
      isModalOpen: state.modal_key === modal_key,
      modalClose: state.modalClose,
      modalData: state.modalData as PreviewRelatedModalData,
    }))
  );

  const [page, setPage] = useState(1);
  const rowsPerPage = 4;

  const pages = Math.ceil(modalData?.data?.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return modalData?.data?.slice(start, end);
  }, [modalData?.data, page]);
  return (
    <Modal
      isOpen={isModalOpen}
      onOpenChange={modalClose}
      placement="center"
      size="5xl"
      classNames={{
        backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Danh sách các dữ liệu liên quan
            </ModalHeader>
            <ModalBody>
              <Table
                aria-label="Example table with client side pagination"
                bottomContent={
                  <div className="flex w-full justify-center">
                    <Pagination
                      isCompact
                      showControls
                      showShadow
                      color="secondary"
                      page={page}
                      total={pages}
                      onChange={(page) => setPage(page)}
                    />
                  </div>
                }
                classNames={{
                  wrapper: "min-h-[222px]",
                }}
              >
                <TableHeader>
                  {modalData?.columns.map((column) => (
                    <TableColumn key={column.uid}>{column.name}</TableColumn>
                  ))}
                </TableHeader>
                <TableBody emptyContent={"Không tìm thấy dữ liệu liên quan nào"} items={items}>
                  {(item) => (
                    <TableRow key={item?.name}>
                      {modalData?.columns.map(
                        (column) =>
                          column.uid === "gender" ? (
                            <TableCell key={column.uid}>{item ? "Nữ" : "Nam"}</TableCell>
                          ) : (
                            <TableCell key={column.uid}>{getKeyValue(item, column.uid)}</TableCell>
                          )
                        // <TableCell key={column.uid}>{getKeyValue(item, column.uid)}</TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Đóng
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default PreviewRelatedModal;

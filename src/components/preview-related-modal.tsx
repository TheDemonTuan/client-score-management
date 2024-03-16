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
import { usePreviewRelatedStore } from "@/stores/preview-related-modal-store";

const PreviewRelatedModal = () => {
  const {
    isPreviewRelatedOpen,
    previewRelatedData,
    setIsPreviewRelatedOpen,
    previewRelatedColumns,
  } = usePreviewRelatedStore();
  const [page, setPage] = useState(1);
  const rowsPerPage = 4;

  const pages = Math.ceil(previewRelatedData.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return previewRelatedData.slice(start, end);
  }, [page, previewRelatedData]);
  return (
    <Modal
      isOpen={isPreviewRelatedOpen}
      onOpenChange={() => setIsPreviewRelatedOpen(false)}
      placement="top-center"
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
                  {previewRelatedColumns.map((column) => (
                    <TableColumn key={column.uid}>{column.name}</TableColumn>
                  ))}
                </TableHeader>
                <TableBody emptyContent={"Không tìm thấy dữ liệu liên quan nào"} items={items}>
                  {(item) => (
                    <TableRow key={item.name}>
                      {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
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

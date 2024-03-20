import {
  DepartmentDeleteByIdParams,
  DepartmentResponse,
  departmentDeleteById,
} from "@/api/departments";
import { ApiErrorResponse, ApiSuccessResponse } from "@/lib/http";
import { useModalStore } from "@/stores/modal-store";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { memo } from "react";
import { toast } from "react-toastify";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/cn";

const DeleteDepartmentModal = ({ modal_key }: { modal_key: string }) => {
  const queryClient = useQueryClient();

  const { isModalOpen, modalClose, modalData } = useModalStore(
    useShallow((state) => ({
      isModalOpen: state.modal_key === modal_key,
      modalClose: state.modalClose,
      modalData: state.modalData as DepartmentResponse,
    }))
  );

  const { mutateAsync: deleteMutateAsync, isPending: deleteIsPending } = useMutation<
    ApiSuccessResponse,
    ApiErrorResponse,
    DepartmentDeleteByIdParams
  >({
    mutationFn: async (params) => await departmentDeleteById(params),
    onSuccess: () => {
      toast.success(`Xoá khoa thành công !`);
      queryClient.setQueryData(
        ["departments"],
        (oldData: ApiSuccessResponse<DepartmentResponse[]>) =>
          oldData
            ? { ...oldData, data: oldData.data.filter((item) => item.id !== modalData?.id) }
            : oldData
      );
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Xoá khoa thất bại!");
    },
  });

  const handleSubmit = async () => {
    await deleteMutateAsync({ id: modalData?.id });
    modalClose();
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onOpenChange={modalClose}
      placement="top-center"
      className={cn(deleteIsPending && "pointer-events-none")}
      classNames={{
        backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Xoá khoa</ModalHeader>
            <ModalBody>
              <p>
                Bạn có đồng ý xoá khoa <span className="font-bold">{modalData?.name}</span> ?
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose} isLoading={deleteIsPending}>
                Đóng
              </Button>
              <Button onClick={handleSubmit} color="secondary" isLoading={deleteIsPending}>
                Xoá
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default memo(DeleteDepartmentModal) as typeof DeleteDepartmentModal;

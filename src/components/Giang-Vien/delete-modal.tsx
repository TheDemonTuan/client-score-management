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
import {
  InstructorDeleteByIdParams,
  InstructorReponse,
  instructorDeleteById,
} from "@/api/instructors";
import { DepartmentResponse } from "@/api/departments";

const DeleteInstructorModal = ({ modal_key }: { modal_key: string }) => {
  const queryClient = useQueryClient();

  const { isModalOpen, modalClose, modalData } = useModalStore(
    useShallow((state) => ({
      isModalOpen: state.modal_key === modal_key,
      modalClose: state.modalClose,
      modalData: state.modalData as InstructorReponse,
    }))
  );

  const { mutateAsync: deleteMutateAsync, isPending: deleteIsPending } = useMutation<
    ApiSuccessResponse,
    ApiErrorResponse,
    InstructorDeleteByIdParams
  >({
    mutationFn: async (params) => await instructorDeleteById(params),
    onSuccess: () => {
      toast.success(`Xoá giảng viên thành công !`);
      queryClient.setQueryData(
        ["instructors"],
        (oldData: ApiSuccessResponse<InstructorReponse[]>) =>
          oldData
            ? {
                ...oldData,
                data: oldData.data.filter((instructor) => instructor.id !== modalData?.id),
              }
            : oldData
      );
      queryClient.setQueryData(
        ["departments"],
        (oldData: ApiSuccessResponse<DepartmentResponse[]>) =>
          oldData
            ? {
                ...oldData,
                data: oldData.data.map((department) =>
                  department.id === modalData?.department_id
                    ? {
                        ...department,
                        instructors: department.instructors.filter(
                          (instructor) => instructor.id !== modalData?.id
                        ),
                      }
                    : department
                ),
              }
            : oldData
      );
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Xoá giảng viên thất bại!");
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
            <ModalHeader className="flex flex-col gap-1">Xoá giảng viên</ModalHeader>
            <ModalBody>
              <p>Bạn có đồng ý xoá giảng viên này?</p>
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

export default memo(DeleteInstructorModal) as typeof DeleteInstructorModal;

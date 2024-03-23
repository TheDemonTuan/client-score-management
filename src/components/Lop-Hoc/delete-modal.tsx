import { ApiErrorResponse, ApiSuccessResponse } from "@/lib/http";
import { useModalStore } from "@/stores/modal-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useShallow } from "zustand/react/shallow";
import CrudModal from "../crud-modal";
import { ClassDeleteByIdParams, ClassResponse, classDeleteById } from "@/api/classes";

const DeleteClassModal = () => {
  const queryClient = useQueryClient();

  const { modalClose, modalData } = useModalStore(
    useShallow((state) => ({
      modalClose: state.modalClose,
      modalData: state.modalData as ClassResponse,
    }))
  );

  const { mutate: deleteMutate, isPending: deleteIsPending } = useMutation<
    ApiSuccessResponse,
    ApiErrorResponse,
    ClassDeleteByIdParams
  >({
    mutationFn: async (params) => await classDeleteById(params),
    onSuccess: () => {
      toast.success(`Xoá lớp học thành công!`);
      queryClient.setQueryData(["classes"], (oldData: ApiSuccessResponse<ClassResponse[]>) =>
        oldData ? { ...oldData, data: oldData.data.filter((item) => item.id !== modalData?.id) } : oldData
      );
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Xoá lớp học thất bại!");
    },
    onSettled: () => {
      modalClose();
    },
  });

  const handleSubmit = () => {
    deleteMutate({ id: modalData?.id });
  };

  return (
    <CrudModal title="Xoá lớp học" btnText="Xoá" isPending={deleteIsPending} handleSubmit={handleSubmit}>
      <p>
        Bạn có đồng ý xoá lớp học <span className="font-bold">{modalData?.name}</span> ?
      </p>
    </CrudModal>
  );
};

export default DeleteClassModal;
